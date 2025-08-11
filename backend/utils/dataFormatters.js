// Data formatting utilities for dashboard responses
import { roundToTwo, calculateSurvivalRate, calculateTreeDensity } from './dashboardUtils.js';

/**
 * Format overview statistics data
 * @param {Object} data - Raw overview data
 * @param {number} data.totalTrees - Total number of trees
 * @param {number} data.aliveTrees - Number of alive trees
 * @param {number} data.totalForests - Total number of forests
 * @param {number} data.totalUsers - Total number of users
 * @param {number} data.recentActivity - Recent activity count
 * @returns {Object} Formatted overview data
 */
export const formatOverviewData = (data) => {
  const { totalTrees, aliveTrees, totalForests, totalUsers, recentActivity } = data;
  const deadTrees = totalTrees - aliveTrees;
  const survivalRate = calculateSurvivalRate(aliveTrees, totalTrees);

  return {
    totalTrees,
    aliveTrees,
    deadTrees,
    survivalRate: roundToTwo(survivalRate),
    totalForests,
    totalUsers,
    recentActivity
  };
};

/**
 * Format height statistics data
 * @param {Array} heightStats - Raw height statistics from aggregation
 * @returns {Object} Formatted height data
 */
export const formatHeightData = (heightStats) => {
  if (!heightStats || heightStats.length === 0) {
    return {
      average: 0,
      minimum: 0,
      maximum: 0,
      treesWithMeasurements: 0
    };
  }

  const stats = heightStats[0];
  return {
    average: roundToTwo(stats.avgHeight || 0),
    minimum: roundToTwo(stats.minHeight || 0),
    maximum: roundToTwo(stats.maxHeight || 0),
    treesWithMeasurements: stats.treesWithMeasurements || 0
  };
};

/**
 * Format CO2 absorption statistics data
 * @param {Array} co2Stats - Raw CO2 statistics from aggregation
 * @returns {Object} Formatted CO2 data
 */
export const formatCO2Data = (co2Stats) => {
  if (!co2Stats || co2Stats.length === 0) {
    return {
      totalAbsorption: 0,
      averagePerTree: 0,
      totalMeasurements: 0
    };
  }

  const stats = co2Stats[0];
  return {
    totalAbsorption: roundToTwo(stats.totalCO2 || 0),
    averagePerTree: roundToTwo(stats.avgCO2PerTree || 0),
    totalMeasurements: stats.measurementCount || 0
  };
};

/**
 * Format forest statistics data
 * @param {Array} forestStats - Raw forest statistics from aggregation
 * @param {number} totalTrees - Total number of trees for density calculation
 * @returns {Object} Formatted forest data
 */
export const formatForestData = (forestStats, totalTrees) => {
  if (!forestStats || forestStats.length === 0) {
    return {
      totalArea: 0,
      averageArea: 0,
      treeDensity: 0
    };
  }

  const stats = forestStats[0];
  const totalArea = stats.totalArea || 0;
  const treeDensity = calculateTreeDensity(totalTrees, totalArea);

  return {
    totalArea: roundToTwo(totalArea),
    averageArea: roundToTwo(stats.avgArea || 0),
    treeDensity: roundToTwo(treeDensity)
  };
};

/**
 * Format complete dashboard response
 * @param {Object} rawData - All raw data from database queries
 * @param {Object} filters - Applied filters
 * @returns {Object} Complete formatted dashboard response
 */
export const formatDashboardResponse = (rawData, filters) => {
  const {
    totalTrees,
    aliveTrees,
    totalForests,
    totalUsers,
    recentActivity,
    speciesDistribution,
    heightStats,
    co2Stats,
    healthDistribution,
    forestStats,
    // New metrics data
    portfolioValue,
    roiStats,
    carbonCredits,
    timberValue,
    maintenanceBudget,
    biodiversityIndex,
    treesAtRisk,
    fireRisk,
    speciesDiversity,
    soilHealth,
    infrastructureCondition
  } = rawData;

  return {
    success: true,
    data: {
      overview: formatOverviewData({
        totalTrees,
        aliveTrees,
        totalForests,
        totalUsers,
        recentActivity
      }),
      height: formatHeightData(heightStats),
      co2: formatCO2Data(co2Stats),
      forest: formatForestData(forestStats, totalTrees),
      distributions: {
        species: speciesDistribution,
        health: healthDistribution
      },
      // Enhanced metrics for investors and managers
      investor: formatInvestorMetrics({
        portfolioValue,
        roiStats,
        carbonCredits,
        timberValue,
        maintenanceBudget
      }),
      manager: formatManagerMetrics({
        biodiversityIndex,
        treesAtRisk,
        fireRisk,
        speciesDiversity,
        soilHealth,
        infrastructureCondition
      }),
      filters,
      lastUpdated: new Date().toISOString()
    }
  };
};

/**
 * Format quick stats response
 * @param {Object} rawData - Raw quick stats data
 * @returns {Object} Formatted quick stats response
 */
export const formatQuickStatsResponse = (rawData) => {
  const {
    totalTrees,
    aliveTrees,
    totalForests,
    avgHeight,
    totalCO2
  } = rawData;

  const survivalRate = calculateSurvivalRate(aliveTrees, totalTrees);

  return {
    success: true,
    data: {
      totalTrees,
      aliveTrees,
      survivalRate: roundToTwo(survivalRate),
      averageHeight: roundToTwo(avgHeight || 0),
      totalCO2Absorption: roundToTwo(totalCO2 || 0),
      totalForests
    }
  };
};

/**
 * Format forest comparison response
 * @param {Array} forestStats - Raw forest comparison data
 * @returns {Object} Formatted forest comparison response
 */
export const formatForestComparisonResponse = (forestStats) => {
  return {
    success: true,
    data: {
      forests: forestStats,
      totalForests: forestStats.length
    }
  };
};

/**
 * ENHANCED FORMATTERS FOR NEW METRICS
 */

/**
 * Format investor metrics data
 * @param {Object} data - Raw investor metrics data
 * @returns {Object} Formatted investor metrics
 */
export const formatInvestorMetrics = (data) => {
  const { portfolioValue, roiStats, carbonCredits, timberValue, maintenanceBudget } = data;
  
  // Safely extract values with proper fallbacks
  const portfolioData = portfolioValue && portfolioValue.length > 0 ? portfolioValue[0] : {};
  const roiData = roiStats && roiStats.length > 0 ? roiStats[0] : {};
  const carbonData = carbonCredits && carbonCredits.length > 0 ? carbonCredits[0] : {};
  const timberData = timberValue && timberValue.length > 0 ? timberValue[0] : {};
  const budgetData = maintenanceBudget && maintenanceBudget.length > 0 ? maintenanceBudget[0] : {};
  
  return {
    portfolio: {
      totalCurrentValue: roundToTwo(portfolioData.totalCurrentValue || 0),
      totalAcquisitionCost: roundToTwo(portfolioData.totalAcquisitionCost || 0),
      forestCount: portfolioData.forestCount || 0,
      averageValue: roundToTwo(portfolioData.avgCurrentValue || 0)
    },
    roi: {
      averageROI: roundToTwo(roiData.avgROI || 0),
      totalValueGain: roundToTwo(roiData.totalValueGain || 0),
      minROI: roundToTwo(roiData.minROI || 0),
      maxROI: roundToTwo(roiData.maxROI || 0)
    },
    carbonCredits: {
      totalAvailable: carbonData.totalAvailable || 0,
      totalSold: carbonData.totalSold || 0,
      averagePrice: roundToTwo(carbonData.avgPricePerCredit || 0),
      totalCarbonStored: roundToTwo(carbonData.totalCarbonStored || 0),
      annualSequestration: roundToTwo(carbonData.totalAnnualSequestration || 0)
    },
    timber: {
      totalValue: roundToTwo(timberData.totalTimberValue || 0),
      carbonCreditValue: roundToTwo(timberData.totalCarbonCreditValue || 0),
      averageValuePerTree: roundToTwo(timberData.avgTimberValuePerTree || 0)
    },
    maintenance: {
      totalBudget: roundToTwo(budgetData.totalAnnualBudget || 0),
      totalSpent: roundToTwo(budgetData.totalSpent || 0),
      utilization: roundToTwo(budgetData.avgUtilization || 0)
    }
  };
};

/**
 * Format manager metrics data
 * @param {Object} data - Raw manager metrics data
 * @returns {Object} Formatted manager metrics
 */
export const formatManagerMetrics = (data) => {
  const { biodiversityIndex, treesAtRisk, fireRisk, speciesDiversity, soilHealth, infrastructureCondition } = data;
  
  // Safely extract values with proper fallbacks
  const biodiversityData = biodiversityIndex && biodiversityIndex.length > 0 ? biodiversityIndex[0] : {};
  const riskData = treesAtRisk && treesAtRisk.length > 0 ? treesAtRisk[0] : {};
  const fireData = fireRisk && fireRisk.length > 0 ? fireRisk[0] : {};
  const speciesData = speciesDiversity && speciesDiversity.length > 0 ? speciesDiversity[0] : {};
  const soilData = soilHealth && soilHealth.length > 0 ? soilHealth[0] : {};
  const infrastructureData = infrastructureCondition && infrastructureCondition.length > 0 ? infrastructureCondition[0] : {};
  
  return {
    biodiversity: {
      averageIndex: roundToTwo(biodiversityData.avgBiodiversityIndex || 0),
      totalSpecies: biodiversityData.totalSpeciesCount || 0,
      forestsWithData: biodiversityData.forestsWithData || 0,
      range: {
        min: roundToTwo(biodiversityData.minBiodiversity || 0),
        max: roundToTwo(biodiversityData.maxBiodiversity || 0)
      }
    },
    treesAtRisk: {
      total: riskData.treesAtRisk || 0,
      critical: riskData.criticalTrees || 0,
      healthy: riskData.healthyTrees || 0,
      riskBySpecies: riskData.riskBySpecies || []
    },
    fireRisk: {
      highRiskForests: fireData.highRiskForests || 0,
      highRiskArea: roundToTwo(fireData.highRiskArea || 0),
      distribution: fireData.riskDistribution || []
    },
    speciesDiversity: {
      uniqueSpecies: speciesData.uniqueSpecies || 0,
      endangeredSpecies: speciesData.endangeredSpecies || 0,
      speciesDetails: speciesData.speciesDetails || []
    },
    soilHealth: {
      averagePH: roundToTwo(soilData.avgPH || 0),
      averageOrganicMatter: roundToTwo(soilData.avgOrganicMatter || 0),
      forestsWithData: soilData.forestsWithSoilData || 0
    },
    infrastructure: {
      totalRoads: infrastructureData.totalRoads || 0,
      totalFacilities: infrastructureData.totalFacilities || 0,
      roadConditions: infrastructureData.roadsCondition || [],
      facilityConditions: infrastructureData.facilitiesCondition || []
    }
  };
};