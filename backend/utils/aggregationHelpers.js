// MongoDB aggregation pipeline helpers for dashboard operations

/**
 * Get species distribution aggregation pipeline
 * @param {Object} matchQuery - Base match query for filtering
 * @param {number} limit - Number of top species to return (default: 10)
 * @returns {Array} Aggregation pipeline
 */
export const getSpeciesDistributionPipeline = (matchQuery, limit = 10) => {
  return [
    { $match: { ...matchQuery, isAlive: true } },
    {
      $group: {
        _id: '$species',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: limit }
  ];
};

/**
 * Get height statistics aggregation pipeline
 * @param {Object} matchQuery - Base match query for filtering
 * @returns {Array} Aggregation pipeline
 */
export const getHeightStatsPipeline = (matchQuery) => {
  return [
    { $match: { ...matchQuery, isAlive: true } },
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
  ];
};

/**
 * Get CO2 absorption statistics aggregation pipeline
 * @param {Object} matchQuery - Base match query for filtering
 * @returns {Array} Aggregation pipeline
 */
export const getCO2StatsPipeline = (matchQuery) => {
  return [
    { $match: { ...matchQuery, isAlive: true } },
    { $unwind: '$measurements' },
    {
      $group: {
        _id: null,
        totalCO2: { $sum: '$measurements.co2Absorption' },
        avgCO2PerTree: { $avg: '$measurements.co2Absorption' },
        measurementCount: { $sum: 1 }
      }
    }
  ];
};

/**
 * Get health status distribution aggregation pipeline
 * @param {Object} matchQuery - Base match query for filtering
 * @returns {Array} Aggregation pipeline
 */
export const getHealthDistributionPipeline = (matchQuery) => {
  return [
    { $match: { ...matchQuery, isAlive: true } },
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
  ];
};

/**
 * Get forest statistics aggregation pipeline
 * @param {Object} matchQuery - Base match query for filtering
 * @returns {Array} Aggregation pipeline
 */
export const getForestStatsPipeline = (matchQuery) => {
  return [
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalArea: { $sum: '$area' },
        avgArea: { $avg: '$area' },
        minArea: { $min: '$area' },
        maxArea: { $max: '$area' }
      }
    }
  ];
};

/**
 * Get latest height statistics aggregation pipeline (simplified for quick stats)
 * @param {Object} matchQuery - Base match query for filtering
 * @returns {Array} Aggregation pipeline
 */
export const getLatestHeightPipeline = (matchQuery) => {
  return [
    { $match: { ...matchQuery, isAlive: true } },
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
  ];
};

/**
 * Get total CO2 absorption aggregation pipeline (simplified for quick stats)
 * @param {Object} matchQuery - Base match query for filtering
 * @returns {Array} Aggregation pipeline
 */
export const getTotalCO2Pipeline = (matchQuery) => {
  return [
    { $match: { ...matchQuery, isAlive: true } },
    { $unwind: '$measurements' },
    {
      $group: {
        _id: null,
        totalCO2: { $sum: '$measurements.co2Absorption' }
      }
    }
  ];
};

/**
 * Get forest comparison aggregation pipeline
 * @returns {Array} Aggregation pipeline
 */
export const getForestComparisonPipeline = () => {
  return [
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
  ];
};

/**
 * Get forest analytics survival rate aggregation pipeline
 * @param {Object} forestId - Forest ObjectId
 * @returns {Array} Aggregation pipeline
 */
export const getForestSurvivalRatePipeline = (forestId) => {
  return [
    { $match: { forestId } },
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
  ];
};

/**
 * Get forest analytics height growth aggregation pipeline
 * @param {Object} forestId - Forest ObjectId
 * @param {Object} dateFilter - Date filter object for measurements
 * @returns {Array} Aggregation pipeline
 */
export const getForestHeightGrowthPipeline = (forestId, dateFilter = {}) => {
  const matchConditions = { forestId, isAlive: true, ...dateFilter };
  
  return [
    { $match: matchConditions },
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
  ];
};

/**
 * Get forest analytics CO2 absorption aggregation pipeline
 * @param {Object} forestId - Forest ObjectId
 * @param {Object} dateFilter - Date filter object for measurements
 * @returns {Array} Aggregation pipeline
 */
export const getForestCO2AbsorptionPipeline = (forestId, dateFilter = {}) => {
  const matchConditions = { forestId, isAlive: true, ...dateFilter };
  
  return [
    { $match: matchConditions },
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
  ];
};