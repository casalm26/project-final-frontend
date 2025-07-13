import { Forest, Tree, User } from '../models/index.js';

// Get comprehensive dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const {
      forestId,
      startDate,
      endDate,
      species
    } = req.query;

    // Build base query conditions
    const treeQuery = {};
    const forestQuery = { isActive: true };

    if (forestId) {
      treeQuery.forestId = forestId;
      forestQuery._id = forestId;
    }
    if (species) treeQuery.species = new RegExp(species, 'i');
    if (startDate || endDate) {
      treeQuery.plantedDate = {};
      if (startDate) treeQuery.plantedDate.$gte = new Date(startDate);
      if (endDate) treeQuery.plantedDate.$lte = new Date(endDate);
    }

    // Get basic counts
    const [
      totalTrees,
      aliveTrees,
      totalForests,
      totalUsers
    ] = await Promise.all([
      Tree.countDocuments(treeQuery),
      Tree.countDocuments({ ...treeQuery, isAlive: true }),
      Forest.countDocuments(forestQuery),
      User.countDocuments({ isActive: true })
    ]);

    const deadTrees = totalTrees - aliveTrees;
    const survivalRate = totalTrees > 0 ? (aliveTrees / totalTrees) * 100 : 0;

    // Get species distribution
    const speciesDistribution = await Tree.aggregate([
      { $match: { ...treeQuery, isAlive: true } },
      {
        $group: {
          _id: '$species',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get average height from latest measurements
    const heightStats = await Tree.aggregate([
      { $match: { ...treeQuery, isAlive: true } },
      { $unwind: '$measurements' },
      {
        $sort: { 
          'treeId': 1, 
          'measurements.measuredAt': -1 
        }
      },
      {
        $group: {
          _id: '$_id',
          latestHeight: { $first: '$measurements.height' },
          latestMeasurement: { $first: '$measurements.measuredAt' }
        }
      },
      {
        $group: {
          _id: null,
          avgHeight: { $avg: '$latestHeight' },
          minHeight: { $min: '$latestHeight' },
          maxHeight: { $max: '$latestHeight' },
          treesWithMeasurements: { $sum: 1 }
        }
      }
    ]);

    const avgHeight = heightStats.length > 0 ? heightStats[0].avgHeight || 0 : 0;
    const minHeight = heightStats.length > 0 ? heightStats[0].minHeight || 0 : 0;
    const maxHeight = heightStats.length > 0 ? heightStats[0].maxHeight || 0 : 0;
    const treesWithMeasurements = heightStats.length > 0 ? heightStats[0].treesWithMeasurements || 0 : 0;

    // Get total CO2 absorption
    const co2Stats = await Tree.aggregate([
      { $match: { ...treeQuery, isAlive: true } },
      { $unwind: '$measurements' },
      {
        $group: {
          _id: null,
          totalCO2: { $sum: '$measurements.co2Absorption' },
          avgCO2PerTree: { $avg: '$measurements.co2Absorption' },
          measurementCount: { $sum: 1 }
        }
      }
    ]);

    const totalCO2 = co2Stats.length > 0 ? co2Stats[0].totalCO2 || 0 : 0;
    const avgCO2PerTree = co2Stats.length > 0 ? co2Stats[0].avgCO2PerTree || 0 : 0;
    const measurementCount = co2Stats.length > 0 ? co2Stats[0].measurementCount || 0 : 0;

    // Get health status distribution
    const healthDistribution = await Tree.aggregate([
      { $match: { ...treeQuery, isAlive: true } },
      { $unwind: '$measurements' },
      {
        $sort: {
          'treeId': 1,
          'measurements.measuredAt': -1
        }
      },
      {
        $group: {
          _id: '$_id',
          latestHealthStatus: { $first: '$measurements.healthStatus' }
        }
      },
      {
        $group: {
          _id: '$latestHealthStatus',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get forest coverage statistics
    const forestStats = await Forest.aggregate([
      { $match: forestQuery },
      {
        $group: {
          _id: null,
          totalArea: { $sum: '$area' },
          avgArea: { $avg: '$area' },
          minArea: { $min: '$area' },
          maxArea: { $max: '$area' }
        }
      }
    ]);

    const totalArea = forestStats.length > 0 ? forestStats[0].totalArea || 0 : 0;
    const avgForestArea = forestStats.length > 0 ? forestStats[0].avgArea || 0 : 0;

    // Get recent activity (trees planted in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivity = await Tree.countDocuments({
      ...treeQuery,
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Calculate tree density (trees per hectare)
    const treeDensity = totalArea > 0 ? totalTrees / totalArea : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalTrees,
          aliveTrees,
          deadTrees,
          survivalRate: Math.round(survivalRate * 100) / 100,
          totalForests,
          totalUsers,
          recentActivity
        },
        height: {
          average: Math.round(avgHeight * 100) / 100,
          minimum: Math.round(minHeight * 100) / 100,
          maximum: Math.round(maxHeight * 100) / 100,
          treesWithMeasurements
        },
        co2: {
          totalAbsorption: Math.round(totalCO2 * 100) / 100,
          averagePerTree: Math.round(avgCO2PerTree * 100) / 100,
          totalMeasurements: measurementCount
        },
        forest: {
          totalArea: Math.round(totalArea * 100) / 100,
          averageArea: Math.round(avgForestArea * 100) / 100,
          treeDensity: Math.round(treeDensity * 100) / 100
        },
        distributions: {
          species: speciesDistribution,
          health: healthDistribution
        },
        filters: {
          forestId,
          startDate,
          endDate,
          species
        },
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get quick stats for dashboard cards
export const getQuickStats = async (req, res) => {
  try {
    const { forestId } = req.query;
    
    const treeQuery = forestId ? { forestId } : {};

    const [
      totalTrees,
      aliveTrees,
      totalForests
    ] = await Promise.all([
      Tree.countDocuments(treeQuery),
      Tree.countDocuments({ ...treeQuery, isAlive: true }),
      Forest.countDocuments({ isActive: true })
    ]);

    const survivalRate = totalTrees > 0 ? (aliveTrees / totalTrees) * 100 : 0;

    // Get latest average height
    const heightResult = await Tree.aggregate([
      { $match: { ...treeQuery, isAlive: true } },
      { $unwind: '$measurements' },
      { $sort: { 'measurements.measuredAt': -1 } },
      {
        $group: {
          _id: '$_id',
          latestHeight: { $first: '$measurements.height' }
        }
      },
      {
        $group: {
          _id: null,
          avgHeight: { $avg: '$latestHeight' }
        }
      }
    ]);

    const avgHeight = heightResult.length > 0 ? heightResult[0].avgHeight || 0 : 0;

    // Get total CO2 absorption
    const co2Result = await Tree.aggregate([
      { $match: { ...treeQuery, isAlive: true } },
      { $unwind: '$measurements' },
      {
        $group: {
          _id: null,
          totalCO2: { $sum: '$measurements.co2Absorption' }
        }
      }
    ]);

    const totalCO2 = co2Result.length > 0 ? co2Result[0].totalCO2 || 0 : 0;

    res.json({
      success: true,
      data: {
        totalTrees,
        aliveTrees,
        survivalRate: Math.round(survivalRate * 100) / 100,
        averageHeight: Math.round(avgHeight * 100) / 100,
        totalCO2Absorption: Math.round(totalCO2 * 100) / 100,
        totalForests
      }
    });
  } catch (error) {
    console.error('Get quick stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quick statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get forest comparison statistics
export const getForestComparison = async (req, res) => {
  try {
    const forestStats = await Forest.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'trees',
          localField: '_id',
          foreignField: 'forestId',
          as: 'trees'
        }
      },
      {
        $addFields: {
          totalTrees: { $size: '$trees' },
          aliveTrees: {
            $size: {
              $filter: {
                input: '$trees',
                cond: { $eq: ['$$this.isAlive', true] }
              }
            }
          }
        }
      },
      {
        $addFields: {
          survivalRate: {
            $cond: {
              if: { $gt: ['$totalTrees', 0] },
              then: { $multiply: [{ $divide: ['$aliveTrees', '$totalTrees'] }, 100] },
              else: 0
            }
          },
          treeDensity: {
            $cond: {
              if: { $gt: ['$area', 0] },
              then: { $divide: ['$totalTrees', '$area'] },
              else: 0
            }
          }
        }
      },
      {
        $project: {
          name: 1,
          region: 1,
          area: 1,
          establishedDate: 1,
          totalTrees: 1,
          aliveTrees: 1,
          survivalRate: { $round: ['$survivalRate', 2] },
          treeDensity: { $round: ['$treeDensity', 2] }
        }
      },
      { $sort: { totalTrees: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        forests: forestStats,
        totalForests: forestStats.length
      }
    });
  } catch (error) {
    console.error('Get forest comparison error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch forest comparison data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};