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

/**
 * INVESTOR-FOCUSED METRICS
 */

/**
 * Get portfolio value aggregation pipeline
 * @param {Object} matchQuery - Base match query for filtering forests
 * @returns {Array} Aggregation pipeline
 */
export const getPortfolioValuePipeline = (matchQuery) => {
  return [
    { $match: { ...matchQuery, isActive: true } },
    {
      $group: {
        _id: null,
        totalCurrentValue: { $sum: '$financials.currentValue' },
        totalAcquisitionCost: { $sum: '$financials.acquisitionCost' },
        forestCount: { $sum: 1 },
        avgCurrentValue: { $avg: '$financials.currentValue' },
        avgAcquisitionCost: { $avg: '$financials.acquisitionCost' }
      }
    }
  ];
};

/**
 * Get ROI statistics aggregation pipeline
 * @param {Object} matchQuery - Base match query for filtering forests
 * @returns {Array} Aggregation pipeline
 */
export const getROIStatsPipeline = (matchQuery) => {
  return [
    { $match: { ...matchQuery, isActive: true } },
    {
      $addFields: {
        roiPercentage: {
          $cond: {
            if: { $and: [
              { $gt: ['$financials.acquisitionCost', 0] },
              { $ne: ['$financials.currentValue', null] }
            ]},
            then: {
              $multiply: [
                { $divide: [
                  { $subtract: ['$financials.currentValue', '$financials.acquisitionCost'] },
                  '$financials.acquisitionCost'
                ]},
                100
              ]
            },
            else: 0
          }
        }
      }
    },
    {
      $group: {
        _id: null,
        avgROI: { $avg: '$roiPercentage' },
        minROI: { $min: '$roiPercentage' },
        maxROI: { $max: '$roiPercentage' },
        totalValueGain: { $sum: { $subtract: ['$financials.currentValue', '$financials.acquisitionCost'] } }
      }
    }
  ];
};

/**
 * Get carbon credits aggregation pipeline
 * @param {Object} matchQuery - Base match query for filtering forests
 * @returns {Array} Aggregation pipeline
 */
export const getCarbonCreditsPipeline = (matchQuery) => {
  return [
    { $match: { ...matchQuery, isActive: true } },
    {
      $group: {
        _id: null,
        totalIssued: { $sum: '$carbonMetrics.carbonCredits.issued' },
        totalSold: { $sum: '$carbonMetrics.carbonCredits.sold' },
        totalAvailable: { $sum: '$carbonMetrics.carbonCredits.available' },
        avgPricePerCredit: { $avg: '$carbonMetrics.carbonCredits.pricePerCredit' },
        totalCarbonStored: { $sum: '$carbonMetrics.totalCarbonStored' },
        totalAnnualSequestration: { $sum: '$carbonMetrics.annualSequestration' }
      }
    }
  ];
};

/**
 * Get timber value aggregation pipeline
 * @param {Object} matchQuery - Base match query for filtering trees
 * @returns {Array} Aggregation pipeline
 */
export const getTimberValuePipeline = (matchQuery) => {
  return [
    { $match: { ...matchQuery, isAlive: true } },
    {
      $group: {
        _id: null,
        totalTimberValue: { $sum: '$economicValue.currentTimberValue' },
        totalCarbonCreditValue: { $sum: '$economicValue.carbonCreditValue' },
        avgTimberValuePerTree: { $avg: '$economicValue.currentTimberValue' },
        treeCount: { $sum: 1 }
      }
    }
  ];
};

/**
 * Get maintenance budget utilization pipeline
 * @param {Object} matchQuery - Base match query for filtering forests
 * @returns {Array} Aggregation pipeline
 */
export const getMaintenanceBudgetPipeline = (matchQuery) => {
  return [
    { $match: { ...matchQuery, isActive: true } },
    {
      $addFields: {
        budgetUtilization: {
          $cond: {
            if: { $gt: ['$financials.maintenanceBudget.allocated', 0] },
            then: {
              $multiply: [
                { $divide: ['$financials.maintenanceBudget.spent', '$financials.maintenanceBudget.allocated'] },
                100
              ]
            },
            else: 0
          }
        }
      }
    },
    {
      $group: {
        _id: null,
        totalAnnualBudget: { $sum: '$financials.maintenanceBudget.annual' },
        totalAllocated: { $sum: '$financials.maintenanceBudget.allocated' },
        totalSpent: { $sum: '$financials.maintenanceBudget.spent' },
        avgUtilization: { $avg: '$budgetUtilization' }
      }
    }
  ];
};

/**
 * MANAGER-FOCUSED METRICS
 */

/**
 * Get biodiversity index aggregation pipeline
 * @param {Object} matchQuery - Base match query for filtering forests
 * @returns {Array} Aggregation pipeline
 */
export const getBiodiversityIndexPipeline = (matchQuery) => {
  return [
    { $match: { ...matchQuery, isActive: true } },
    {
      $addFields: {
        speciesCount: { $size: { $ifNull: ['$biodiversity.species', []] } },
        biodiversityScore: { $ifNull: ['$biodiversity.biodiversityIndex', 0] }
      }
    },
    {
      $group: {
        _id: null,
        avgBiodiversityIndex: { $avg: '$biodiversityScore' },
        totalSpeciesCount: { $sum: '$speciesCount' },
        forestsWithData: {
          $sum: {
            $cond: [{ $gt: ['$biodiversityScore', 0] }, 1, 0]
          }
        },
        minBiodiversity: { $min: '$biodiversityScore' },
        maxBiodiversity: { $max: '$biodiversityScore' }
      }
    }
  ];
};

/**
 * Get trees at risk aggregation pipeline
 * @param {Object} matchQuery - Base match query for filtering trees
 * @returns {Array} Aggregation pipeline
 */
export const getTreesAtRiskPipeline = (matchQuery) => {
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
        latestHealthStatus: { $first: '$measurements.healthStatus' },
        treeId: { $first: '$treeId' },
        species: { $first: '$species' },
        forestId: { $first: '$forestId' }
      }
    },
    {
      $facet: {
        atRiskTrees: [
          { $match: { latestHealthStatus: { $in: ['poor', 'critical'] } } },
          { $count: "count" }
        ],
        criticalTrees: [
          { $match: { latestHealthStatus: 'critical' } },
          { $count: "count" }
        ],
        totalHealthyTrees: [
          { $match: { latestHealthStatus: { $in: ['excellent', 'good'] } } },
          { $count: "count" }
        ],
        riskBySpecies: [
          { $match: { latestHealthStatus: { $in: ['poor', 'critical'] } } },
          {
            $group: {
              _id: '$species',
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } }
        ]
      }
    },
    {
      $project: {
        treesAtRisk: { $arrayElemAt: ['$atRiskTrees.count', 0] },
        criticalTrees: { $arrayElemAt: ['$criticalTrees.count', 0] },
        healthyTrees: { $arrayElemAt: ['$totalHealthyTrees.count', 0] },
        riskBySpecies: 1
      }
    }
  ];
};

/**
 * Get fire risk aggregation pipeline
 * @param {Object} matchQuery - Base match query for filtering forests
 * @returns {Array} Aggregation pipeline
 */
export const getFireRiskPipeline = (matchQuery) => {
  return [
    { $match: { ...matchQuery, isActive: true } },
    {
      $group: {
        _id: '$environmental.fireRisk.current',
        forestCount: { $sum: 1 },
        totalArea: { $sum: '$area' }
      }
    },
    {
      $group: {
        _id: null,
        riskDistribution: {
          $push: {
            riskLevel: '$_id',
            forestCount: '$forestCount',
            totalArea: '$totalArea'
          }
        },
        highRiskForests: {
          $sum: {
            $cond: [
              { $in: ['$_id', ['high', 'extreme']] },
              '$forestCount',
              0
            ]
          }
        },
        highRiskArea: {
          $sum: {
            $cond: [
              { $in: ['$_id', ['high', 'extreme']] },
              '$totalArea',
              0
            ]
          }
        }
      }
    }
  ];
};

/**
 * Get species diversity aggregation pipeline
 * @param {Object} matchQuery - Base match query for filtering forests
 * @returns {Array} Aggregation pipeline
 */
export const getSpeciesDiversityPipeline = (matchQuery) => {
  return [
    { $match: { ...matchQuery, isActive: true } },
    { $unwind: '$biodiversity.species' },
    {
      $group: {
        _id: '$biodiversity.species.name',
        forestsFound: { $sum: 1 },
        totalCount: { $sum: '$biodiversity.species.count' },
        conservationStatuses: { $addToSet: '$biodiversity.species.conservationStatus' },
        categories: { $addToSet: '$biodiversity.species.category' }
      }
    },
    {
      $group: {
        _id: null,
        uniqueSpecies: { $sum: 1 },
        speciesDetails: {
          $push: {
            name: '$_id',
            forestsFound: '$forestsFound',
            totalCount: '$totalCount',
            conservationStatuses: '$conservationStatuses',
            categories: '$categories'
          }
        },
        endangeredSpecies: {
          $sum: {
            $cond: [
              { $in: ['endangered', '$conservationStatuses'] },
              1,
              0
            ]
          }
        }
      }
    }
  ];
};

/**
 * Get soil health aggregation pipeline
 * @param {Object} matchQuery - Base match query for filtering forests
 * @returns {Array} Aggregation pipeline
 */
export const getSoilHealthPipeline = (matchQuery) => {
  return [
    { $match: { ...matchQuery, isActive: true } },
    {
      $group: {
        _id: null,
        avgPH: { $avg: '$environmental.soilHealth.phLevel' },
        avgOrganicMatter: { $avg: '$environmental.soilHealth.organicMatter' },
        compactionDistribution: {
          $push: '$environmental.soilHealth.compaction'
        },
        erosionRiskDistribution: {
          $push: '$environmental.soilHealth.erosionRisk'
        },
        forestsWithSoilData: {
          $sum: {
            $cond: [
              { $ne: ['$environmental.soilHealth.phLevel', null] },
              1,
              0
            ]
          }
        }
      }
    }
  ];
};

/**
 * Get infrastructure condition aggregation pipeline
 * @param {Object} matchQuery - Base match query for filtering forests
 * @returns {Array} Aggregation pipeline
 */
export const getInfrastructureConditionPipeline = (matchQuery) => {
  return [
    { $match: { ...matchQuery, isActive: true } },
    {
      $project: {
        roadsCondition: '$infrastructure.roads.condition',
        facilitiesCondition: '$infrastructure.facilities.condition',
        fencingCondition: '$infrastructure.fencing.condition',
        totalRoads: { $size: { $ifNull: ['$infrastructure.roads', []] } },
        totalFacilities: { $size: { $ifNull: ['$infrastructure.facilities', []] } }
      }
    },
    {
      $group: {
        _id: null,
        totalRoads: { $sum: '$totalRoads' },
        totalFacilities: { $sum: '$totalFacilities' },
        roadsCondition: { $push: '$roadsCondition' },
        facilitiesCondition: { $push: '$facilitiesCondition' },
        fencingCondition: { $push: '$fencingCondition' }
      }
    }
  ];
};