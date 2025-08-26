/**
 * Mathematical Simulation Engine for Dashboard Metrics
 * 
 * This utility generates realistic financial and ecological metrics based on actual tree data.
 * All calculations are deterministic but include realistic variations based on:
 * - Tree species characteristics
 * - Age and growth patterns
 * - Seasonal variations
 * - Market conditions
 * - Environmental factors
 */

import mongoose from 'mongoose';
import { Tree, Forest } from '../models/index.js';

/**
 * Species-specific multipliers for various metrics
 * Based on Swedish forestry data and market conditions
 */
const SPECIES_FACTORS = {
  'pine': {
    timberValue: 1.0,
    co2Absorption: 1.2,
    maintenanceCost: 0.8,
    growthRate: 1.0,
    marketMultiplier: 1.0,
    maturityAge: 80,
    peakGrowthAge: 15
  },
  'spruce': {
    timberValue: 1.1,
    co2Absorption: 1.4,
    maintenanceCost: 0.9,
    growthRate: 1.2,
    marketMultiplier: 1.05,
    maturityAge: 70,
    peakGrowthAge: 12
  },
  'birch': {
    timberValue: 0.7,
    co2Absorption: 0.8,
    maintenanceCost: 0.6,
    growthRate: 1.5,
    marketMultiplier: 0.8,
    maturityAge: 60,
    peakGrowthAge: 10
  },
  'oak': {
    timberValue: 2.0,
    co2Absorption: 1.8,
    maintenanceCost: 1.2,
    growthRate: 0.6,
    marketMultiplier: 1.8,
    maturityAge: 120,
    peakGrowthAge: 25
  },
  'fir': {
    timberValue: 0.95,
    co2Absorption: 1.3,
    maintenanceCost: 0.85,
    growthRate: 1.1,
    marketMultiplier: 0.95,
    maturityAge: 75,
    peakGrowthAge: 14
  }
};

/**
 * Market price data for Sweden (SEK)
 */
const MARKET_PRICES = {
  timber: {
    basePricePerCubicMeter: 650, // Average Swedish timber price
    volatilityFactor: 0.15, // 15% price variation
    seasonalAdjustment: {
      1: 0.95, 2: 0.92, 3: 0.98, 4: 1.05, // Winter low, spring pickup
      5: 1.08, 6: 1.12, 7: 1.10, 8: 1.06, // Summer peak construction season
      9: 1.03, 10: 1.00, 11: 0.97, 12: 0.93 // Autumn decline
    }
  },
  carbonCredits: {
    basePricePerTon: 85, // EUR per ton CO2, converted to SEK ~900
    volatilityFactor: 0.25, // Higher volatility in carbon markets
    trendMultiplier: 1.08 // 8% annual growth trend
  },
  maintenanceRates: {
    baseRatePerHectare: 1200, // SEK per hectare annually
    complexityMultiplier: {
      low: 0.8,
      medium: 1.0,
      high: 1.3,
      extreme: 1.8
    }
  }
};

/**
 * Calculate deterministic pseudo-random value based on seed
 * @param {string|number} seed - Seed value for consistency
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Deterministic random value
 */
const seededRandom = (seed, min = 0, max = 1) => {
  const seedNum = typeof seed === 'string' ? 
    seed.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0) : 
    seed;
  const x = Math.sin(seedNum) * 10000;
  const random = x - Math.floor(x);
  return min + random * (max - min);
};

/**
 * Get species factor with fallback to pine
 * @param {string} species - Tree species
 * @returns {Object} Species factors
 */
const getSpeciesFactors = (species) => {
  const normalizedSpecies = species.toLowerCase().trim();
  return SPECIES_FACTORS[normalizedSpecies] || SPECIES_FACTORS['pine'];
};

/**
 * Calculate tree age in years
 * @param {Date} plantedDate - When the tree was planted
 * @returns {number} Age in years
 */
const calculateAge = (plantedDate) => {
  const now = new Date();
  const planted = new Date(plantedDate);
  return Math.max(0, (now - planted) / (1000 * 60 * 60 * 24 * 365.25));
};

/**
 * Simulate timber value for a single tree
 * @param {Object} tree - Tree document
 * @param {Date} currentDate - Current date for market conditions
 * @returns {number} Estimated timber value in SEK
 */
const simulateTreeTimberValue = (tree, currentDate = new Date()) => {
  const age = calculateAge(tree.plantedDate);
  const species = getSpeciesFactors(tree.species);
  
  // Get latest measurement or estimate
  const latestMeasurement = tree.measurements && tree.measurements.length > 0 ? 
    tree.measurements[tree.measurements.length - 1] : null;
  
  // Estimate height and diameter if no measurements
  const height = latestMeasurement?.height || Math.max(0.5, age * 0.8 * species.growthRate);
  const diameter = latestMeasurement?.diameter || height * 0.08; // Rough diameter estimate
  
  // Volume calculation (simplified cone formula)
  const volume = Math.PI * Math.pow(diameter / 200, 2) * height * 0.4; // cubic meters
  
  // Market price with seasonal adjustment
  const month = currentDate.getMonth() + 1;
  const seasonalPrice = MARKET_PRICES.timber.basePricePerCubicMeter * 
    MARKET_PRICES.timber.seasonalAdjustment[month];
  
  // Add species-specific multiplier and market volatility
  const treeId = tree._id.toString();
  const volatility = seededRandom(treeId + currentDate.getFullYear(), 
    1 - MARKET_PRICES.timber.volatilityFactor, 
    1 + MARKET_PRICES.timber.volatilityFactor);
  
  const finalPrice = seasonalPrice * species.timberValue * species.marketMultiplier * volatility;
  
  return Math.round(volume * finalPrice);
};

/**
 * Simulate CO2 absorption and carbon credit value for a tree
 * @param {Object} tree - Tree document
 * @param {Date} currentDate - Current date for market conditions
 * @returns {Object} CO2 data with absorption and credit value
 */
const simulateTreeCO2Value = (tree, currentDate = new Date()) => {
  const age = calculateAge(tree.plantedDate);
  const species = getSpeciesFactors(tree.species);
  
  // CO2 absorption increases with age up to maturity, then stabilizes
  const maturityFactor = Math.min(1, age / (species.maturityAge * 0.6));
  const peakGrowthFactor = age <= species.peakGrowthAge ? 
    (age / species.peakGrowthAge) : 
    Math.max(0.7, 1 - (age - species.peakGrowthAge) / species.maturityAge);
  
  // Base CO2 absorption (kg per year)
  const baseCO2 = 25 * species.co2Absorption * maturityFactor * peakGrowthFactor;
  
  // Add some variation based on tree health
  const healthMultiplier = tree.isAlive ? 1.0 : 0;
  const treeVariation = seededRandom(tree._id.toString(), 0.8, 1.2);
  
  const annualCO2Absorption = baseCO2 * healthMultiplier * treeVariation;
  const lifetimeCO2Storage = annualCO2Absorption * Math.min(age, species.maturityAge * 0.8);
  
  // Calculate carbon credit value
  const currentYear = currentDate.getFullYear();
  const yearsFromBase = currentYear - 2020;
  const trendAdjustedPrice = MARKET_PRICES.carbonCredits.basePricePerTon * 
    Math.pow(MARKET_PRICES.carbonCredits.trendMultiplier, yearsFromBase);
  
  const priceVolatility = seededRandom(tree._id.toString() + currentYear, 
    1 - MARKET_PRICES.carbonCredits.volatilityFactor,
    1 + MARKET_PRICES.carbonCredits.volatilityFactor);
  
  const creditValue = (lifetimeCO2Storage / 1000) * trendAdjustedPrice * priceVolatility * 10.5; // EUR to SEK
  
  return {
    annualAbsorption: Math.round(annualCO2Absorption * 100) / 100,
    lifetimeStorage: Math.round(lifetimeCO2Storage * 100) / 100,
    creditValue: Math.round(creditValue),
    marketPrice: Math.round(trendAdjustedPrice * 10.5) // Per ton in SEK
  };
};

/**
 * Simulate maintenance costs for a forest
 * @param {Object} forest - Forest document
 * @param {number} treeCount - Number of trees in forest
 * @param {Date} currentDate - Current date for calculations
 * @returns {Object} Maintenance cost breakdown
 */
const simulateMaintenanceCosts = (forest, treeCount, currentDate = new Date()) => {
  const area = forest.area || (treeCount * 0.01); // Estimate 100 trees per hectare
  
  // Determine complexity based on forest characteristics
  const complexityFactors = [];
  if (forest.terrain === 'mountainous') complexityFactors.push('high');
  if (forest.region && forest.region.includes('north')) complexityFactors.push('medium');
  if (treeCount > 10000) complexityFactors.push('high');
  if (area > 100) complexityFactors.push('medium');
  
  const complexityLevel = complexityFactors.includes('high') ? 'high' :
                         complexityFactors.includes('medium') ? 'medium' : 'low';
  
  const baseRate = MARKET_PRICES.maintenanceRates.baseRatePerHectare;
  const complexityMultiplier = MARKET_PRICES.maintenanceRates.complexityMultiplier[complexityLevel];
  
  // Add seasonal variation (more maintenance in spring/summer)
  const month = currentDate.getMonth() + 1;
  const seasonalMultiplier = month >= 4 && month <= 9 ? 1.2 : 0.8;
  
  const annualCost = area * baseRate * complexityMultiplier * seasonalMultiplier;
  const forestVariation = seededRandom(forest._id.toString(), 0.9, 1.1);
  
  return {
    annualBudget: Math.round(annualCost * forestVariation),
    monthlyBudget: Math.round(annualCost * forestVariation / 12),
    complexityLevel,
    area: Math.round(area * 100) / 100,
    ratePerHectare: Math.round(baseRate * complexityMultiplier)
  };
};

/**
 * Simulate portfolio-wide investment metrics
 * @param {Array} trees - Array of tree documents
 * @param {Array} forests - Array of forest documents
 * @param {Object} filters - Date and forest filters
 * @returns {Object} Investment metrics
 */
export const simulateInvestorMetrics = async (trees, forests, filters = {}) => {
  const currentDate = new Date();
  
  // Calculate timber values
  const timberValues = trees.map(tree => simulateTreeTimberValue(tree, currentDate));
  const totalTimberValue = timberValues.reduce((sum, value) => sum + value, 0);
  const avgTimberValue = trees.length > 0 ? totalTimberValue / trees.length : 0;
  
  // Calculate CO2 values
  const co2Data = trees.map(tree => simulateTreeCO2Value(tree, currentDate));
  const totalCO2Credits = co2Data.reduce((sum, data) => sum + data.creditValue, 0);
  const totalCO2Absorption = co2Data.reduce((sum, data) => sum + data.annualAbsorption, 0);
  
  // Calculate maintenance costs
  const maintenanceCosts = forests.map(forest => {
    const forestTrees = trees.filter(tree => tree.forestId.toString() === forest._id.toString());
    return simulateMaintenanceCosts(forest, forestTrees.length, currentDate);
  });
  const totalMaintenanceBudget = maintenanceCosts.reduce((sum, cost) => sum + cost.annualBudget, 0);
  
  // Estimate initial investment (planting costs)
  const avgPlantingCostPerTree = 45; // SEK per tree (planting + sapling)
  const estimatedInitialInvestment = trees.length * avgPlantingCostPerTree;
  
  // Calculate portfolio value and ROI
  const currentPortfolioValue = totalTimberValue + totalCO2Credits;
  const roi = estimatedInitialInvestment > 0 ? 
    ((currentPortfolioValue - estimatedInitialInvestment) / estimatedInitialInvestment) * 100 : 0;
  
  return {
    portfolio: {
      totalCurrentValue: Math.round(currentPortfolioValue),
      forestCount: forests.length,
      treeCount: trees.length,
      averageValue: Math.round(currentPortfolioValue / Math.max(1, forests.length))
    },
    timber: {
      totalValue: Math.round(totalTimberValue),
      averageValuePerTree: Math.round(avgTimberValue)
    },
    carbonCredits: {
      totalAvailable: Math.round(totalCO2Absorption),
      totalSold: Math.round(totalCO2Absorption * 0.3), // Assume 30% sold
      averagePrice: Math.round(co2Data.length > 0 ? co2Data[0].marketPrice : 0),
      totalRevenue: Math.round(totalCO2Credits * 0.3)
    },
    roi: {
      averageROI: Math.round(roi * 100) / 100,
      minROI: Math.round((roi - 5) * 100) / 100, // Estimated range
      maxROI: Math.round((roi + 8) * 100) / 100
    },
    maintenance: {
      totalBudget: Math.round(totalMaintenanceBudget),
      totalSpent: Math.round(totalMaintenanceBudget * seededRandom(currentDate.getTime(), 0.6, 0.9)),
      utilization: Math.round(seededRandom(currentDate.getTime(), 60, 90) * 100) / 100
    }
  };
};

/**
 * Simulate ecological and environmental metrics
 * @param {Array} trees - Array of tree documents
 * @param {Array} forests - Array of forest documents
 * @param {Object} filters - Date and forest filters
 * @returns {Object} Ecological metrics
 */
export const simulateEcologicalMetrics = async (trees, forests, filters = {}) => {
  const currentDate = new Date();
  const aliveTrees = trees.filter(tree => tree.isAlive);
  
  // Biodiversity index calculation
  const speciesDistribution = trees.reduce((acc, tree) => {
    acc[tree.species] = (acc[tree.species] || 0) + 1;
    return acc;
  }, {});
  
  const speciesCount = Object.keys(speciesDistribution).length;
  const shannonIndex = Object.values(speciesDistribution)
    .map(count => {
      const p = count / trees.length;
      return p > 0 ? -p * Math.log(p) : 0;
    })
    .reduce((sum, value) => sum + value, 0);
  
  // Environmental benefits calculation
  const totalForestArea = forests.reduce((sum, forest) => sum + (forest.area || 0), 0);
  const co2Data = aliveTrees.map(tree => simulateTreeCO2Value(tree, currentDate));
  
  const environmentalBenefits = {
    carbonSequestration: {
      annualTons: Math.round(co2Data.reduce((sum, data) => sum + data.annualAbsorption, 0) / 1000),
      lifetimeStorage: Math.round(co2Data.reduce((sum, data) => sum + data.lifetimeStorage, 0) / 1000)
    },
    oxygenProduction: {
      annualTons: Math.round(co2Data.reduce((sum, data) => sum + data.annualAbsorption, 0) * 0.73 / 1000) // O2/CO2 ratio
    },
    soilProtection: {
      erosionPrevention: Math.round(totalForestArea * 2.5), // tons per hectare
      waterFiltration: Math.round(totalForestArea * 15000) // liters per hectare per year
    }
  };
  
  // Risk assessment
  const treesAtRisk = aliveTrees.filter(tree => {
    const age = calculateAge(tree.plantedDate);
    const species = getSpeciesFactors(tree.species);
    return age > species.maturityAge * 0.9 || 
           (tree.measurements && tree.measurements.length > 0 && 
            tree.measurements[tree.measurements.length - 1].healthStatus === 'poor');
  });
  
  return {
    biodiversity: {
      speciesCount,
      shannonIndex: Math.round(shannonIndex * 1000) / 1000,
      dominantSpecies: Object.entries(speciesDistribution)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([species, count]) => ({ species, count, percentage: Math.round((count / trees.length) * 10000) / 100 }))
    },
    environmental: environmentalBenefits,
    riskAssessment: {
      treesAtRisk: treesAtRisk.length,
      riskPercentage: Math.round((treesAtRisk.length / aliveTrees.length) * 10000) / 100,
      mainRiskFactors: ['aging', 'disease', 'climate_change']
    },
    forestHealth: {
      overallScore: Math.round((aliveTrees.length / trees.length) * 100),
      aliveTrees: aliveTrees.length,
      totalTrees: trees.length
    }
  };
};

/**
 * Main simulation function that combines all metrics
 * @param {Object} filters - Filter parameters (forestIds, dateRange, etc.)
 * @returns {Object} Complete simulation data
 */
export const generateDashboardSimulation = async (filters = {}) => {
  try {
    // Build query from filters
    const treeQuery = {};
    const forestQuery = { isActive: true };
    
    // Handle forest filtering
    if (filters.forestIds) {
      const forestIdArray = filters.forestIds.split(',')
        .map(id => id.trim())
        .filter(id => id.length === 24); // Valid ObjectId length
      
      if (forestIdArray.length > 0) {
        const objectIds = forestIdArray.map(id => new mongoose.Types.ObjectId(id));
        treeQuery.forestId = { $in: objectIds };
        forestQuery._id = { $in: objectIds };
      }
    } else if (filters.forestId) {
      const objectId = new mongoose.Types.ObjectId(filters.forestId);
      treeQuery.forestId = objectId;
      forestQuery._id = objectId;
    }
    
    // Handle date filtering
    if (filters.startDate || filters.endDate) {
      treeQuery.plantedDate = {};
      if (filters.startDate) treeQuery.plantedDate.$gte = new Date(filters.startDate);
      if (filters.endDate) treeQuery.plantedDate.$lte = new Date(filters.endDate);
    }
    
    // Handle other filters
    if (filters.species) {
      treeQuery.species = new RegExp(filters.species, 'i');
    }
    
    if (filters.isAlive !== undefined) {
      treeQuery.isAlive = filters.isAlive === 'true';
    }
    
    // Fetch data
    const [trees, forests] = await Promise.all([
      Tree.find(treeQuery).lean(),
      Forest.find(forestQuery).lean()
    ]);
    
    // Generate simulations
    const [investorMetrics, ecologicalMetrics] = await Promise.all([
      simulateInvestorMetrics(trees, forests, filters),
      simulateEcologicalMetrics(trees, forests, filters)
    ]);
    
    return {
      investor: investorMetrics,
      ecological: ecologicalMetrics,
      summary: {
        totalTrees: trees.length,
        totalForests: forests.length,
        aliveTrees: trees.filter(t => t.isAlive).length,
        filters,
        lastUpdated: new Date().toISOString()
      }
    };
    
  } catch (error) {
    console.error('Simulation generation error:', error);
    throw new Error('Failed to generate dashboard simulation');
  }
};