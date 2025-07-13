import { validationResult } from 'express-validator';
import { Tree, Forest } from '../models/index.js';

// Get all trees with optional filtering
export const getTrees = async (req, res) => {
  try {
    const {
      forestId,
      species,
      isAlive,
      startDate,
      endDate,
      page = 1,
      limit = 20,
      sortBy = 'plantedDate',
      sortOrder = 'desc'
    } = req.query;

    // Build query conditions
    const queryConditions = {};

    if (forestId) queryConditions.forestId = forestId;
    if (species) queryConditions.species = new RegExp(species, 'i');
    if (isAlive !== undefined) queryConditions.isAlive = isAlive === 'true';

    if (startDate || endDate) {
      queryConditions.plantedDate = {};
      if (startDate) queryConditions.plantedDate.$gte = new Date(startDate);
      if (endDate) queryConditions.plantedDate.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortDirection = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const trees = await Tree.find(queryConditions)
      .populate('forestId', 'name region')
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalCount = await Tree.countDocuments(queryConditions);

    res.json({
      success: true,
      data: {
        trees,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNextPage: page * limit < totalCount,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get trees error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single tree by ID
export const getTreeById = async (req, res) => {
  try {
    const { id } = req.params;

    const tree = await Tree.findById(id)
      .populate('forestId', 'name region')
      .populate('measurements.measuredBy', 'firstName lastName');

    if (!tree) {
      return res.status(404).json({
        success: false,
        message: 'Tree not found'
      });
    }

    res.json({
      success: true,
      data: { tree }
    });
  } catch (error) {
    console.error('Get tree by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create new tree (admin only)
export const createTree = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Verify forest exists
    const forest = await Forest.findById(req.body.forestId);
    if (!forest || !forest.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Forest not found'
      });
    }

    // Check if tree ID already exists
    const existingTree = await Tree.findOne({ treeId: req.body.treeId });
    if (existingTree) {
      return res.status(409).json({
        success: false,
        message: 'Tree with this ID already exists'
      });
    }

    const tree = new Tree(req.body);
    await tree.save();

    // Populate forest information
    await tree.populate('forestId', 'name region');

    res.status(201).json({
      success: true,
      message: 'Tree created successfully',
      data: { tree }
    });
  } catch (error) {
    console.error('Create tree error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update tree (admin only)
export const updateTree = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tree = await Tree.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('forestId', 'name region');

    if (!tree) {
      return res.status(404).json({
        success: false,
        message: 'Tree not found'
      });
    }

    res.json({
      success: true,
      message: 'Tree updated successfully',
      data: { tree }
    });
  } catch (error) {
    console.error('Update tree error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete tree (admin only)
export const deleteTree = async (req, res) => {
  try {
    const { id } = req.params;

    const tree = await Tree.findByIdAndDelete(id);
    if (!tree) {
      return res.status(404).json({
        success: false,
        message: 'Tree not found'
      });
    }

    res.json({
      success: true,
      message: 'Tree deleted successfully'
    });
  } catch (error) {
    console.error('Delete tree error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add measurement to tree
export const addMeasurement = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const measurementData = {
      ...req.body,
      measuredBy: req.user._id,
      measuredAt: new Date()
    };

    const tree = await Tree.findById(id);
    if (!tree) {
      return res.status(404).json({
        success: false,
        message: 'Tree not found'
      });
    }

    tree.measurements.push(measurementData);
    await tree.save();

    // Populate the new measurement
    await tree.populate('measurements.measuredBy', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Measurement added successfully',
      data: { 
        tree,
        latestMeasurement: tree.measurements[tree.measurements.length - 1]
      }
    });
  } catch (error) {
    console.error('Add measurement error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get tree measurements history
export const getTreeMeasurements = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 10 } = req.query;

    const tree = await Tree.findById(id)
      .populate('measurements.measuredBy', 'firstName lastName');

    if (!tree) {
      return res.status(404).json({
        success: false,
        message: 'Tree not found'
      });
    }

    // Get latest measurements
    const measurements = tree.getLatestMeasurements(parseInt(limit));

    res.json({
      success: true,
      data: {
        treeId: tree.treeId,
        measurements
      }
    });
  } catch (error) {
    console.error('Get tree measurements error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get trees by forest with location data for mapping
export const getTreesByForest = async (req, res) => {
  try {
    const { forestId } = req.params;
    const { isAlive = true } = req.query;

    // Verify forest exists
    const forest = await Forest.findById(forestId);
    if (!forest || !forest.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Forest not found'
      });
    }

    const trees = await Tree.find({ 
      forestId, 
      isAlive: isAlive === 'true' 
    }).select('treeId location species measurements');

    // Transform data for mapping
    const treeMarkers = trees.map(tree => ({
      id: tree._id,
      treeId: tree.treeId,
      coordinates: tree.location.coordinates,
      species: tree.species,
      currentHeight: tree.currentHeight,
      currentHealthStatus: tree.currentHealthStatus,
      measurementCount: tree.measurements.length
    }));

    res.json({
      success: true,
      data: {
        forest: {
          id: forest._id,
          name: forest.name,
          region: forest.region
        },
        trees: treeMarkers,
        totalCount: trees.length
      }
    });
  } catch (error) {
    console.error('Get trees by forest error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Mark tree as dead
export const markTreeDead = async (req, res) => {
  try {
    const { id } = req.params;
    const { deathCause, deathDate } = req.body;

    const tree = await Tree.findByIdAndUpdate(
      id,
      {
        isAlive: false,
        deathDate: deathDate || new Date(),
        deathCause,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('forestId', 'name region');

    if (!tree) {
      return res.status(404).json({
        success: false,
        message: 'Tree not found'
      });
    }

    res.json({
      success: true,
      message: 'Tree marked as dead',
      data: { tree }
    });
  } catch (error) {
    console.error('Mark tree dead error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};