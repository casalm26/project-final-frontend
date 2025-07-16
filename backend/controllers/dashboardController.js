import { Forest, Tree, User } from '../models/index.js';
// TODO: Consider caching frequently accessed dashboard data to reduce database queries
import { 
  buildTreeQuery, 
  buildForestQuery, 
  getRecentDateFilter,
  handleDashboardError 
} from '../utils/dashboardUtils.js';
import {
  getSpeciesDistributionPipeline,
  getHeightStatsPipeline,
  getCO2StatsPipeline,
  getHealthDistributionPipeline,
  getForestStatsPipeline,
  getLatestHeightPipeline,
  getTotalCO2Pipeline,
  getForestComparisonPipeline
} from '../utils/aggregationHelpers.js';
import { 
  formatDashboardResponse, 
  formatQuickStatsResponse,
  formatForestComparisonResponse 
} from '../utils/dataFormatters.js';

// Get comprehensive dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const filters = {
      forestId: req.query.forestId,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      species: req.query.species
    };

    // Build query conditions using utility functions
    const treeQuery = buildTreeQuery(filters);
    const forestQuery = buildForestQuery(filters);

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

    // Get recent activity (trees planted in last 30 days)
    const thirtyDaysAgo = getRecentDateFilter(30);
    const recentActivity = await Tree.countDocuments({
      ...treeQuery,
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Execute aggregation pipelines in parallel
    const [
      speciesDistribution,
      heightStats,
      co2Stats,
      healthDistribution,
      forestStats
    ] = await Promise.all([
      Tree.aggregate(getSpeciesDistributionPipeline(treeQuery)),
      Tree.aggregate(getHeightStatsPipeline(treeQuery)),
      Tree.aggregate(getCO2StatsPipeline(treeQuery)),
      Tree.aggregate(getHealthDistributionPipeline(treeQuery)),
      Forest.aggregate(getForestStatsPipeline(forestQuery))
    ]);

    // Prepare raw data for formatting
    const rawData = {
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
    };

    // Format and send response
    const response = formatDashboardResponse(rawData, filters);
    res.json(response);

  } catch (error) {
    handleDashboardError(res, error, 'Failed to fetch dashboard statistics');
  }
};

// Get quick stats for dashboard cards
export const getQuickStats = async (req, res) => {
  try {
    const filters = { forestId: req.query.forestId };
    const treeQuery = buildTreeQuery(filters);

    // Get basic counts
    const [
      totalTrees,
      aliveTrees,
      totalForests
    ] = await Promise.all([
      Tree.countDocuments(treeQuery),
      Tree.countDocuments({ ...treeQuery, isAlive: true }),
      Forest.countDocuments({ isActive: true })
    ]);

    // Get aggregated data in parallel
    const [heightResult, co2Result] = await Promise.all([
      Tree.aggregate(getLatestHeightPipeline(treeQuery)),
      Tree.aggregate(getTotalCO2Pipeline(treeQuery))
    ]);

    const avgHeight = heightResult.length > 0 ? heightResult[0].avgHeight || 0 : 0;
    const totalCO2 = co2Result.length > 0 ? co2Result[0].totalCO2 || 0 : 0;

    // Format and send response
    const rawData = {
      totalTrees,
      aliveTrees,
      totalForests,
      avgHeight,
      totalCO2
    };

    const response = formatQuickStatsResponse(rawData);
    res.json(response);

  } catch (error) {
    handleDashboardError(res, error, 'Failed to fetch quick statistics');
  }
};

// Get forest comparison statistics
export const getForestComparison = async (req, res) => {
  try {
    // Execute forest comparison aggregation pipeline
    const forestStats = await Forest.aggregate(getForestComparisonPipeline());

    // Format and send response
    const response = formatForestComparisonResponse(forestStats);
    res.json(response);

  } catch (error) {
    handleDashboardError(res, error, 'Failed to fetch forest comparison data');
  }
};