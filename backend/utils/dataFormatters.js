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
    forestStats
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