import { Tree } from '../models/index.js';
import { buildTreeQuery, buildPaginationOptions } from '../utils/dashboardUtils.js';
import {
  handleValidationErrors,
  verifyForestExists,
  transformTreesForMapping,
  createMeasurementData,
  handleTreeError,
  sendTreeListResponse,
  sendTreeResponse,
  sendTreeMappingResponse,
  sendMeasurementResponse,
  sendMeasurementsHistoryResponse
} from '../utils/treeHelpers.js';

// Get all trees with optional filtering
export const getTrees = async (req, res) => {
  try {
    const {
      forestId,
      forestIds,
      species,
      isAlive,
      startDate,
      endDate,
      page = 1,
      limit = 20,
      sortBy = 'plantedDate',
      sortOrder = 'desc'
    } = req.query;

    if (forestIds) console.log('API call with forestIds:', forestIds);

    // Build query conditions using utility
    const queryConditions = buildTreeQuery({ forestId, forestIds, species, isAlive, startDate, endDate });
    
    // Build pagination options using utility
    const { skip, sort } = buildPaginationOptions({ page, limit, sortBy, sortOrder });

    // Execute query with pagination
    const trees = await Tree.find(queryConditions)
      .populate('forestId', 'name region')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalCount = await Tree.countDocuments(queryConditions);

    sendTreeListResponse(res, trees, totalCount, page, limit);
  } catch (error) {
    handleTreeError(res, error, 'Get trees');
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

    sendTreeResponse(res, tree);
  } catch (error) {
    handleTreeError(res, error, 'Get tree by ID');
  }
};

// Create new tree (admin only)
export const createTree = async (req, res) => {
  try {
    // Check for validation errors
    if (handleValidationErrors(req, res)) return;

    // Verify forest exists
    const forest = await verifyForestExists(req.body.forestId);
    if (!forest) {
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

    sendTreeResponse(res, tree, 'Tree created successfully', 201);
  } catch (error) {
    handleTreeError(res, error, 'Create tree');
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

    sendTreeResponse(res, tree, 'Tree updated successfully');
  } catch (error) {
    handleTreeError(res, error, 'Update tree');
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
    handleTreeError(res, error, 'Delete tree');
  }
};

// Add measurement to tree
export const addMeasurement = async (req, res) => {
  try {
    // Check for validation errors
    if (handleValidationErrors(req, res)) return;

    const { id } = req.params;
    const measurementData = createMeasurementData(req.body, req.user._id);

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

    sendMeasurementResponse(res, tree);
  } catch (error) {
    handleTreeError(res, error, 'Add measurement');
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

    sendMeasurementsHistoryResponse(res, tree.treeId, measurements);
  } catch (error) {
    handleTreeError(res, error, 'Get tree measurements');
  }
};

// Get trees by forest with location data for mapping
export const getTreesByForest = async (req, res) => {
  try {
    const { forestId } = req.params;
    const { isAlive = true } = req.query;

    // Verify forest exists
    const forest = await verifyForestExists(forestId);
    if (!forest) {
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
    const treeMarkers = transformTreesForMapping(trees);

    sendTreeMappingResponse(res, forest, treeMarkers);
  } catch (error) {
    handleTreeError(res, error, 'Get trees by forest');
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

    sendTreeResponse(res, tree, 'Tree marked as dead');
  } catch (error) {
    handleTreeError(res, error, 'Mark tree dead');
  }
};