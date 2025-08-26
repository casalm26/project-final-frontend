import mongoose from 'mongoose';
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
  getForestComparisonPipeline,
  // Investor-focused metrics
  getPortfolioValuePipeline,
  getROIStatsPipeline,
  getCarbonCreditsPipeline,
  getTimberValuePipeline,
  getMaintenanceBudgetPipeline,
  // Manager-focused metrics
  getBiodiversityIndexPipeline,
  getTreesAtRiskPipeline,
  getFireRiskPipeline,
  getSpeciesDiversityPipeline,
  getSoilHealthPipeline,
  getInfrastructureConditionPipeline
} from '../utils/aggregationHelpers.js';
import { 
  formatDashboardResponse, 
  formatQuickStatsResponse,
  formatForestComparisonResponse 
} from '../utils/dataFormatters.js';
import { generateDashboardSimulation } from '../utils/simulationEngine.js';

// Get comprehensive dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const filters = {
      forestId: req.query.forestId,
      forestIds: req.query.forestIds, // Support multi-forest filtering
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      species: req.query.species,
      isAlive: req.query.isAlive
    };

    console.log('🔍 Dashboard stats request with filters:', filters);

    // Build query conditions using utility functions
    const treeQuery = buildTreeQuery(filters);
    const forestQuery = buildForestQuery(filters);
    
    console.log('🔍 Built tree query:', treeQuery);
    console.log('🔍 Built forest query:', forestQuery);

    // Check total documents in collection (for debugging)
    const totalTreesInDB = await Tree.countDocuments({});
    const totalForestsInDB = await Forest.countDocuments({});
    console.log('🔍 Total documents in DB - Trees:', totalTreesInDB, 'Forests:', totalForestsInDB);
    console.log('🔍 Database connection info:', {
      readyState: mongoose.connection.readyState,
      name: mongoose.connection.name,
      host: mongoose.connection.host,
      collection: Tree.collection.collectionName
    });

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

    console.log('📊 Basic counts:', {
      totalTrees,
      aliveTrees,
      totalForests,
      totalUsers
    });

    // Get recent activity (trees planted in last 30 days)
    const thirtyDaysAgo = getRecentDateFilter(30);
    const recentActivity = await Tree.countDocuments({
      ...treeQuery,
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Execute aggregation pipelines in parallel alongside simulation data
    const [
      speciesDistribution,
      heightStats,
      co2Stats,
      healthDistribution,
      forestStats,
      simulationData
    ] = await Promise.all([
      Tree.aggregate(getSpeciesDistributionPipeline(treeQuery)),
      Tree.aggregate(getHeightStatsPipeline(treeQuery)),
      Tree.aggregate(getCO2StatsPipeline(treeQuery)),
      Tree.aggregate(getHealthDistributionPipeline(treeQuery)),
      Forest.aggregate(getForestStatsPipeline(forestQuery)),
      // Generate simulation data using mathematical models
      generateDashboardSimulation(filters)
    ]);

    // Prepare raw data for formatting (combines real data with simulations)
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
      forestStats,
      // Enhanced metrics from simulation engine
      investor: simulationData.investor,
      ecological: simulationData.ecological,
      simulationSummary: simulationData.summary
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
    const filters = {
      forestId: req.query.forestId,
      forestIds: req.query.forestIds, // Support multi-forest filtering
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      species: req.query.species,
      isAlive: req.query.isAlive
    };
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

// Get enhanced dashboard statistics with simulated financial/ecological data
export const getEnhancedDashboardStats = async (req, res) => {
  try {
    const filters = {
      forestId: req.query.forestId,
      forestIds: req.query.forestIds,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      species: req.query.species,
      isAlive: req.query.isAlive
    };

    console.log('🔍 Enhanced dashboard stats request with filters:', filters);

    // Generate simulation data with error handling
    let simulationData;
    try {
      simulationData = await generateDashboardSimulation(filters);
      console.log('✅ Simulation data generated successfully');
    } catch (simulationError) {
      console.error('❌ Simulation generation failed:', simulationError);
      // Fallback to empty simulation structure
      simulationData = {
        investor: {
          portfolio: { totalCurrentValue: 0, forestCount: 0, treeCount: 0, averageValue: 0 },
          timber: { totalValue: 0, averageValuePerTree: 0 },
          carbonCredits: { totalAvailable: 0, totalSold: 0, averagePrice: 0, totalRevenue: 0 },
          roi: { averageROI: 0, minROI: 0, maxROI: 0 },
          maintenance: { totalBudget: 0, totalSpent: 0, utilization: 0 }
        },
        ecological: {
          biodiversity: { speciesCount: 0, shannonIndex: 0, dominantSpecies: [] },
          environmental: { carbonSequestration: { annualTons: 0, lifetimeStorage: 0 } },
          riskAssessment: { treesAtRisk: 0, riskPercentage: 0, mainRiskFactors: [] },
          forestHealth: { overallScore: 0, aliveTrees: 0, totalTrees: 0 }
        },
        summary: { totalTrees: 0, totalForests: 0, aliveTrees: 0, filters, lastUpdated: new Date().toISOString() }
      };
    }

    // Get basic counts for verification
    const treeQuery = buildTreeQuery(filters);
    const [totalTrees, aliveTrees] = await Promise.all([
      Tree.countDocuments(treeQuery),
      Tree.countDocuments({ ...treeQuery, isAlive: true })
    ]);

    // Calculate survival rate
    const survivalRate = totalTrees > 0 ? (aliveTrees / totalTrees) * 100 : 0;

    // Combine real counts with simulation data
    const response = {
      success: true,
      data: {
        // Basic real data
        basic: {
          totalTrees,
          aliveTrees,
          survivalRate: Math.round(survivalRate * 100) / 100,
          totalForests: simulationData.summary.totalForests
        },
        // Simulated financial metrics
        investor: simulationData.investor,
        // Simulated ecological metrics
        ecological: simulationData.ecological,
        // Metadata
        filters,
        lastUpdated: simulationData.summary.lastUpdated
      }
    };

    res.json(response);

  } catch (error) {
    handleDashboardError(res, error, 'Failed to fetch enhanced dashboard statistics');
  }
};