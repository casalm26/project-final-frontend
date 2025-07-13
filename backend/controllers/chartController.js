import { Tree, Forest } from '../models/index.js';

// Get survival rate data over time for charts
export const getSurvivalRateChart = async (req, res) => {
  try {
    const {
      forestId,
      startDate,
      endDate,
      groupBy = 'month' // day, week, month, year
    } = req.query;

    // Build query conditions
    const matchConditions = {};
    if (forestId) matchConditions.forestId = forestId;
    if (startDate || endDate) {
      matchConditions.plantedDate = {};
      if (startDate) matchConditions.plantedDate.$gte = new Date(startDate);
      if (endDate) matchConditions.plantedDate.$lte = new Date(endDate);
    }

    // Define grouping format based on groupBy parameter
    const dateFormats = {
      day: '%Y-%m-%d',
      week: '%Y-%U',
      month: '%Y-%m',
      year: '%Y'
    };

    const survivalData = await Tree.aggregate([
      { $match: matchConditions },
      {
        $group: {
          _id: {
            period: {
              $dateToString: {
                format: dateFormats[groupBy] || dateFormats.month,
                date: '$plantedDate'
              }
            }
          },
          totalPlanted: { $sum: 1 },
          surviving: {
            $sum: {
              $cond: ['$isAlive', 1, 0]
            }
          }
        }
      },
      {
        $addFields: {
          survivalRate: {
            $multiply: [
              { $divide: ['$surviving', '$totalPlanted'] },
              100
            ]
          }
        }
      },
      {
        $project: {
          period: '$_id.period',
          totalPlanted: 1,
          surviving: 1,
          dead: { $subtract: ['$totalPlanted', '$surviving'] },
          survivalRate: { $round: ['$survivalRate', 2] },
          _id: 0
        }
      },
      { $sort: { period: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        chartData: survivalData,
        groupBy,
        totalDataPoints: survivalData.length,
        dateRange: {
          start: startDate,
          end: endDate
        }
      }
    });
  } catch (error) {
    console.error('Get survival rate chart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch survival rate chart data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get average height growth over time
export const getHeightGrowthChart = async (req, res) => {
  try {
    const {
      forestId,
      startDate,
      endDate,
      groupBy = 'month',
      species
    } = req.query;

    // Build query conditions
    const matchConditions = { isAlive: true };
    if (forestId) matchConditions.forestId = forestId;
    if (species) matchConditions.species = new RegExp(species, 'i');

    // Define grouping format
    const dateFormats = {
      day: '%Y-%m-%d',
      week: '%Y-%U',
      month: '%Y-%m',
      year: '%Y'
    };

    const heightData = await Tree.aggregate([
      { $match: matchConditions },
      { $unwind: '$measurements' },
      {
        $match: {
          ...(startDate && { 'measurements.measuredAt': { $gte: new Date(startDate) } }),
          ...(endDate && { 'measurements.measuredAt': { $lte: new Date(endDate) } })
        }
      },
      {
        $group: {
          _id: {
            period: {
              $dateToString: {
                format: dateFormats[groupBy] || dateFormats.month,
                date: '$measurements.measuredAt'
              }
            },
            species: '$species'
          },
          avgHeight: { $avg: '$measurements.height' },
          minHeight: { $min: '$measurements.height' },
          maxHeight: { $max: '$measurements.height' },
          measurementCount: { $sum: 1 },
          treeCount: { $addToSet: '$_id' }
        }
      },
      {
        $addFields: {
          uniqueTreeCount: { $size: '$treeCount' }
        }
      },
      {
        $project: {
          period: '$_id.period',
          species: '$_id.species',
          avgHeight: { $round: ['$avgHeight', 2] },
          minHeight: { $round: ['$minHeight', 2] },
          maxHeight: { $round: ['$maxHeight', 2] },
          measurementCount: 1,
          uniqueTreeCount: 1,
          _id: 0
        }
      },
      { $sort: { period: 1, species: 1 } }
    ]);

    // Group by period for easier frontend consumption
    const groupedData = heightData.reduce((acc, curr) => {
      const period = curr.period;
      if (!acc[period]) {
        acc[period] = {
          period,
          species: [],
          totalMeasurements: 0,
          totalTrees: 0
        };
      }
      
      acc[period].species.push({
        name: curr.species,
        avgHeight: curr.avgHeight,
        minHeight: curr.minHeight,
        maxHeight: curr.maxHeight,
        measurementCount: curr.measurementCount,
        treeCount: curr.uniqueTreeCount
      });
      
      acc[period].totalMeasurements += curr.measurementCount;
      acc[period].totalTrees += curr.uniqueTreeCount;
      
      return acc;
    }, {});

    const chartData = Object.values(groupedData);

    res.json({
      success: true,
      data: {
        chartData,
        groupBy,
        totalDataPoints: chartData.length,
        filters: {
          forestId,
          species,
          startDate,
          endDate
        }
      }
    });
  } catch (error) {
    console.error('Get height growth chart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch height growth chart data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get CO2 absorption trends over time
export const getCO2AbsorptionChart = async (req, res) => {
  try {
    const {
      forestId,
      startDate,
      endDate,
      groupBy = 'month',
      species
    } = req.query;

    // Build query conditions
    const matchConditions = { isAlive: true };
    if (forestId) matchConditions.forestId = forestId;
    if (species) matchConditions.species = new RegExp(species, 'i');

    // Define grouping format
    const dateFormats = {
      day: '%Y-%m-%d',
      week: '%Y-%U',
      month: '%Y-%m',
      year: '%Y'
    };

    const co2Data = await Tree.aggregate([
      { $match: matchConditions },
      { $unwind: '$measurements' },
      {
        $match: {
          'measurements.co2Absorption': { $exists: true, $ne: null },
          ...(startDate && { 'measurements.measuredAt': { $gte: new Date(startDate) } }),
          ...(endDate && { 'measurements.measuredAt': { $lte: new Date(endDate) } })
        }
      },
      {
        $group: {
          _id: {
            period: {
              $dateToString: {
                format: dateFormats[groupBy] || dateFormats.month,
                date: '$measurements.measuredAt'
              }
            }
          },
          totalCO2: { $sum: '$measurements.co2Absorption' },
          avgCO2: { $avg: '$measurements.co2Absorption' },
          minCO2: { $min: '$measurements.co2Absorption' },
          maxCO2: { $max: '$measurements.co2Absorption' },
          measurementCount: { $sum: 1 },
          uniqueTrees: { $addToSet: '$_id' }
        }
      },
      {
        $addFields: {
          treeCount: { $size: '$uniqueTrees' },
          avgCO2PerTree: { $divide: ['$totalCO2', { $size: '$uniqueTrees' }] }
        }
      },
      {
        $project: {
          period: '$_id.period',
          totalCO2: { $round: ['$totalCO2', 2] },
          avgCO2: { $round: ['$avgCO2', 2] },
          minCO2: { $round: ['$minCO2', 2] },
          maxCO2: { $round: ['$maxCO2', 2] },
          avgCO2PerTree: { $round: ['$avgCO2PerTree', 2] },
          measurementCount: 1,
          treeCount: 1,
          _id: 0
        }
      },
      { $sort: { period: 1 } }
    ]);

    // Calculate cumulative CO2 absorption
    let cumulativeCO2 = 0;
    const chartDataWithCumulative = co2Data.map(item => {
      cumulativeCO2 += item.totalCO2;
      return {
        ...item,
        cumulativeCO2: Math.round(cumulativeCO2 * 100) / 100
      };
    });

    res.json({
      success: true,
      data: {
        chartData: chartDataWithCumulative,
        groupBy,
        totalDataPoints: chartDataWithCumulative.length,
        summary: {
          totalCO2Absorption: cumulativeCO2,
          totalMeasurements: co2Data.reduce((sum, item) => sum + item.measurementCount, 0),
          uniqueTrees: Math.max(...co2Data.map(item => item.treeCount), 0)
        },
        filters: {
          forestId,
          species,
          startDate,
          endDate
        }
      }
    });
  } catch (error) {
    console.error('Get CO2 absorption chart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch CO2 absorption chart data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get health status trends over time
export const getHealthStatusChart = async (req, res) => {
  try {
    const {
      forestId,
      startDate,
      endDate,
      groupBy = 'month'
    } = req.query;

    // Build query conditions
    const matchConditions = { isAlive: true };
    if (forestId) matchConditions.forestId = forestId;

    // Define grouping format
    const dateFormats = {
      day: '%Y-%m-%d',
      week: '%Y-%U',
      month: '%Y-%m',
      year: '%Y'
    };

    const healthData = await Tree.aggregate([
      { $match: matchConditions },
      { $unwind: '$measurements' },
      {
        $match: {
          'measurements.healthStatus': { $exists: true, $ne: null },
          ...(startDate && { 'measurements.measuredAt': { $gte: new Date(startDate) } }),
          ...(endDate && { 'measurements.measuredAt': { $lte: new Date(endDate) } })
        }
      },
      {
        $group: {
          _id: {
            period: {
              $dateToString: {
                format: dateFormats[groupBy] || dateFormats.month,
                date: '$measurements.measuredAt'
              }
            },
            healthStatus: '$measurements.healthStatus'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.period',
          healthDistribution: {
            $push: {
              status: '$_id.healthStatus',
              count: '$count'
            }
          },
          totalMeasurements: { $sum: '$count' }
        }
      },
      {
        $project: {
          period: '$_id',
          healthDistribution: 1,
          totalMeasurements: 1,
          _id: 0
        }
      },
      { $sort: { period: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        chartData: healthData,
        groupBy,
        totalDataPoints: healthData.length,
        filters: {
          forestId,
          startDate,
          endDate
        }
      }
    });
  } catch (error) {
    console.error('Get health status chart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch health status chart data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get combined chart data for dashboard
export const getCombinedChartData = async (req, res) => {
  try {
    const {
      forestId,
      startDate,
      endDate,
      groupBy = 'month'
    } = req.query;

    // Get all chart data in parallel
    const [survivalData, heightData, co2Data, healthData] = await Promise.all([
      // Mock the internal calls to avoid duplicate code
      getSurvivalRateChart({ query: req.query }, { json: (data) => data }),
      getHeightGrowthChart({ query: req.query }, { json: (data) => data }),
      getCO2AbsorptionChart({ query: req.query }, { json: (data) => data }),
      getHealthStatusChart({ query: req.query }, { json: (data) => data })
    ]);

    res.json({
      success: true,
      data: {
        survivalRate: survivalData.data,
        heightGrowth: heightData.data,
        co2Absorption: co2Data.data,
        healthStatus: healthData.data,
        groupBy,
        filters: {
          forestId,
          startDate,
          endDate
        },
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Get combined chart data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch combined chart data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};