import { validationResult } from 'express-validator';
import { Forest, Tree } from '../models/index.js';

// Get all forests with optional filtering
export const getForests = async (req, res) => {
  try {
    const {
      region,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    // Build query conditions
    const queryConditions = { isActive: true };

    if (region) {
      queryConditions.region = new RegExp(region, 'i');
    }

    if (startDate || endDate) {
      queryConditions.establishedDate = {};
      if (startDate) queryConditions.establishedDate.$gte = new Date(startDate);
      if (endDate) queryConditions.establishedDate.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortDirection = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const forests = await Forest.find(queryConditions)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('treeCount');

    // Get total count for pagination
    const totalCount = await Forest.countDocuments(queryConditions);

    res.json({
      success: true,
      data: {
        forests,
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
    console.error('Get forests error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single forest by ID
export const getForestById = async (req, res) => {
  try {
    const { id } = req.params;

    const forest = await Forest.findById(id).populate('treeCount');
    if (!forest || !forest.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Forest not found'
      });
    }

    // Get forest statistics
    const totalTrees = await Tree.countDocuments({ forestId: id });
    const aliveTrees = await Tree.countDocuments({ forestId: id, isAlive: true });
    const survivalRate = totalTrees > 0 ? (aliveTrees / totalTrees) * 100 : 0;

    // Get average height from latest measurements
    const avgHeightResult = await Tree.aggregate([
      { $match: { forestId: forest._id, isAlive: true } },
      { $unwind: '$measurements' },
      { $sort: { 'measurements.measuredAt': -1 } },
      { $group: { 
        _id: '$_id', 
        latestHeight: { $first: '$measurements.height' } 
      }},
      { $group: { 
        _id: null, 
        avgHeight: { $avg: '$latestHeight' } 
      }}
    ]);

    const avgHeight = avgHeightResult.length > 0 ? avgHeightResult[0].avgHeight : 0;

    // Get total CO2 absorption
    const co2Result = await Tree.aggregate([
      { $match: { forestId: forest._id, isAlive: true } },
      { $unwind: '$measurements' },
      { $group: { 
        _id: null, 
        totalCO2: { $sum: '$measurements.co2Absorption' } 
      }}
    ]);

    const totalCO2 = co2Result.length > 0 ? co2Result[0].totalCO2 : 0;

    res.json({
      success: true,
      data: {
        forest,
        statistics: {
          totalTrees,
          aliveTrees,
          survivalRate: Math.round(survivalRate * 100) / 100,
          averageHeight: Math.round(avgHeight * 100) / 100,
          totalCO2Absorption: Math.round(totalCO2 * 100) / 100
        }
      }
    });
  } catch (error) {
    console.error('Get forest by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create new forest (admin only)
export const createForest = async (req, res) => {
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

    const forest = new Forest(req.body);
    await forest.save();

    res.status(201).json({
      success: true,
      message: 'Forest created successfully',
      data: { forest }
    });
  } catch (error) {
    console.error('Create forest error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update forest (admin only)
export const updateForest = async (req, res) => {
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
    const forest = await Forest.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!forest) {
      return res.status(404).json({
        success: false,
        message: 'Forest not found'
      });
    }

    res.json({
      success: true,
      message: 'Forest updated successfully',
      data: { forest }
    });
  } catch (error) {
    console.error('Update forest error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete forest (admin only)
export const deleteForest = async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete by setting isActive to false
    const forest = await Forest.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!forest) {
      return res.status(404).json({
        success: false,
        message: 'Forest not found'
      });
    }

    res.json({
      success: true,
      message: 'Forest deleted successfully'
    });
  } catch (error) {
    console.error('Delete forest error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get forest analytics
export const getForestAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    // Validate forest exists
    const forest = await Forest.findById(id);
    if (!forest || !forest.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Forest not found'
      });
    }

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter['measurements.measuredAt'] = {};
      if (startDate) dateFilter['measurements.measuredAt'].$gte = new Date(startDate);
      if (endDate) dateFilter['measurements.measuredAt'].$lte = new Date(endDate);
    }

    // Get survival rate over time
    const survivalRateData = await Tree.aggregate([
      { $match: { forestId: forest._id } },
      {
        $group: {
          _id: {
            year: { $year: '$plantedDate' },
            month: { $month: '$plantedDate' }
          },
          totalPlanted: { $sum: 1 },
          surviving: { $sum: { $cond: ['$isAlive', 1, 0] } }
        }
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: 1
            }
          },
          totalPlanted: 1,
          surviving: 1,
          survivalRate: {
            $multiply: [{ $divide: ['$surviving', '$totalPlanted'] }, 100]
          }
        }
      },
      { $sort: { date: 1 } }
    ]);

    // Get average height over time
    const heightData = await Tree.aggregate([
      { $match: { forestId: forest._id, isAlive: true, ...dateFilter } },
      { $unwind: '$measurements' },
      {
        $group: {
          _id: {
            year: { $year: '$measurements.measuredAt' },
            month: { $month: '$measurements.measuredAt' }
          },
          avgHeight: { $avg: '$measurements.height' }
        }
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: 1
            }
          },
          avgHeight: { $round: ['$avgHeight', 2] }
        }
      },
      { $sort: { date: 1 } }
    ]);

    // Get CO2 absorption over time
    const co2Data = await Tree.aggregate([
      { $match: { forestId: forest._id, isAlive: true, ...dateFilter } },
      { $unwind: '$measurements' },
      {
        $group: {
          _id: {
            year: { $year: '$measurements.measuredAt' },
            month: { $month: '$measurements.measuredAt' }
          },
          totalCO2: { $sum: '$measurements.co2Absorption' }
        }
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: 1
            }
          },
          totalCO2: { $round: ['$totalCO2', 2] }
        }
      },
      { $sort: { date: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        forest,
        analytics: {
          survivalRate: survivalRateData,
          averageHeight: heightData,
          co2Absorption: co2Data
        }
      }
    });
  } catch (error) {
    console.error('Get forest analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};