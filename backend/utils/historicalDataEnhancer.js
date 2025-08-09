import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Tree, User } from '../models/index.js';

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/nanwa-forestry";

// Species-specific growth models based on Swedish forestry data
const speciesGrowthModels = {
  'Scots Pine': {
    heightGrowthRate: 0.45, // meters per year average
    diameterGrowthRate: 1.8, // cm per year average
    maxHeight: 35,
    maxDiameter: 80,
    growthCurve: 'logarithmic', // Fast early growth, then slows
    seasonalVariation: 0.7, // 70% of growth in growing season
    maturityAge: 80,
    co2BaseRate: 0.15 // Base CO2 absorption rate per meter height per cm diameter
  },
  'Norway Spruce': {
    heightGrowthRate: 0.55,
    diameterGrowthRate: 2.0,
    maxHeight: 40,
    maxDiameter: 90,
    growthCurve: 'exponential-decay',
    seasonalVariation: 0.75,
    maturityAge: 70,
    co2BaseRate: 0.18
  },
  'Silver Birch': {
    heightGrowthRate: 0.8,
    diameterGrowthRate: 2.5,
    maxHeight: 25,
    maxDiameter: 60,
    growthCurve: 'fast-early', // Very fast for first 15 years, then plateaus
    seasonalVariation: 0.85, // High seasonal dependence
    maturityAge: 60,
    co2BaseRate: 0.12
  },
  'Downy Birch': {
    heightGrowthRate: 0.7,
    diameterGrowthRate: 2.2,
    maxHeight: 20,
    maxDiameter: 50,
    growthCurve: 'fast-early',
    seasonalVariation: 0.8,
    maturityAge: 60,
    co2BaseRate: 0.11
  },
  'European Aspen': {
    heightGrowthRate: 0.85,
    diameterGrowthRate: 2.8,
    maxHeight: 30,
    maxDiameter: 70,
    growthCurve: 'fast-early',
    seasonalVariation: 0.9, // Very seasonal dependent
    maturityAge: 70,
    co2BaseRate: 0.13
  },
  'Goat Willow': {
    heightGrowthRate: 1.0,
    diameterGrowthRate: 3.0,
    maxHeight: 15,
    maxDiameter: 40,
    growthCurve: 'linear', // Steady growth
    seasonalVariation: 0.95,
    maturityAge: 40,
    co2BaseRate: 0.16
  },
  'Common Alder': {
    heightGrowthRate: 0.9,
    diameterGrowthRate: 2.7,
    maxHeight: 28,
    maxDiameter: 65,
    growthCurve: 'fast-early',
    seasonalVariation: 0.8,
    maturityAge: 60,
    co2BaseRate: 0.14
  },
  'Rowan': {
    heightGrowthRate: 0.4,
    diameterGrowthRate: 1.5,
    maxHeight: 15,
    maxDiameter: 35,
    growthCurve: 'slow-steady',
    seasonalVariation: 0.65,
    maturityAge: 80,
    co2BaseRate: 0.10
  },
  'Common Juniper': {
    heightGrowthRate: 0.15,
    diameterGrowthRate: 0.8,
    maxHeight: 10,
    maxDiameter: 25,
    growthCurve: 'very-slow',
    seasonalVariation: 0.5,
    maturityAge: 100,
    co2BaseRate: 0.08
  }
};

// Default model for unknown species
const defaultGrowthModel = speciesGrowthModels['Scots Pine'];

// Swedish seasonal patterns (growing season: April-September)
const getSeasonalGrowthFactor = (month) => {
  const seasonalFactors = {
    1: 0.05,  // January - dormant
    2: 0.05,  // February - dormant  
    3: 0.15,  // March - early spring
    4: 0.25,  // April - growth starts
    5: 0.35,  // May - peak spring growth
    6: 0.40,  // June - peak growth
    7: 0.35,  // July - high growth
    8: 0.30,  // August - good growth
    9: 0.25,  // September - growth slows
    10: 0.15, // October - autumn
    11: 0.08, // November - dormancy begins
    12: 0.05  // December - dormant
  };
  return seasonalFactors[month] || 0.2;
};

// Calculate age-based growth multiplier using different curves
const getAgeGrowthMultiplier = (age, species, model) => {
  const maturityRatio = age / model.maturityAge;
  
  switch (model.growthCurve) {
    case 'logarithmic':
      // Fast early growth, slows significantly with age
      return Math.max(0.1, 1 - Math.log(age + 1) / Math.log(model.maturityAge));
    
    case 'exponential-decay':
      // Very fast early, exponential decay
      return Math.max(0.15, Math.exp(-maturityRatio * 2));
    
    case 'fast-early':
      // Fast for first 15-20 years, then plateaus
      return age < 15 ? 1 : Math.max(0.2, 0.8 - (age - 15) * 0.04);
    
    case 'linear':
      // Steady growth throughout life
      return Math.max(0.3, 1 - maturityRatio * 0.7);
    
    case 'slow-steady':
      // Slow but consistent
      return Math.max(0.4, 0.8 - maturityRatio * 0.4);
    
    case 'very-slow':
      // Very slow growth
      return Math.max(0.2, 0.6 - maturityRatio * 0.4);
    
    default:
      return Math.max(0.2, 1 - maturityRatio * 0.8);
  }
};

// Generate realistic measurement dates from planting to present/death
const generateMeasurementDates = (plantedDate, deathDate = null, isAlive = true) => {
  const dates = [];
  const plantDate = new Date(plantedDate);
  const endDate = deathDate ? new Date(deathDate) : new Date();
  
  // Start measurements 6 months after planting (establishment period)
  let currentDate = new Date(plantDate);
  currentDate.setMonth(currentDate.getMonth() + 6);
  
  // Age-based measurement frequency
  let monthsBetweenMeasurements = 4; // Start with quarterly measurements
  
  while (currentDate < endDate) {
    const age = (currentDate - plantDate) / (365.25 * 24 * 60 * 60 * 1000);
    
    // Adjust measurement frequency based on tree age
    if (age < 2) {
      monthsBetweenMeasurements = 3; // Quarterly for young trees
    } else if (age < 5) {
      monthsBetweenMeasurements = 4; // Every 4 months
    } else if (age < 10) {
      monthsBetweenMeasurements = 6; // Bi-annually
    } else {
      monthsBetweenMeasurements = 12; // Annually for mature trees
    }
    
    // Add some randomness to measurement intervals (±1 month)
    const randomVariation = (Math.random() - 0.5) * 2; // -1 to +1 months
    const actualInterval = monthsBetweenMeasurements + randomVariation;
    
    dates.push(new Date(currentDate));
    currentDate.setMonth(currentDate.getMonth() + actualInterval);
    
    // Skip some measurements randomly (missed measurements due to weather, etc.)
    if (Math.random() < 0.15) { // 15% chance to skip a measurement
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  }
  
  return dates;
};

// Calculate expected height at a given age for a species
const calculateExpectedHeight = (age, species, initialHeight = 0.5) => {
  const model = speciesGrowthModels[species] || defaultGrowthModel;
  
  // Base growth calculation
  const ageMultiplier = getAgeGrowthMultiplier(age, species, model);
  const expectedAnnualGrowth = model.heightGrowthRate * ageMultiplier;
  const totalGrowth = expectedAnnualGrowth * age;
  
  // Apply maximum height constraint
  const calculatedHeight = initialHeight + totalGrowth;
  return Math.min(calculatedHeight, model.maxHeight);
};

// Calculate expected diameter based on height and age
const calculateExpectedDiameter = (height, age, species) => {
  const model = speciesGrowthModels[species] || defaultGrowthModel;
  
  // Diameter growth is related to both height and age
  const ageMultiplier = getAgeGrowthMultiplier(age, species, model);
  const heightFactor = height / model.maxHeight; // Proportion of maximum height
  
  const baseDiameter = 2 + (age * model.diameterGrowthRate * ageMultiplier);
  const heightAdjustedDiameter = baseDiameter * (0.7 + 0.3 * heightFactor);
  
  return Math.min(heightAdjustedDiameter, model.maxDiameter);
};

// Calculate CO2 absorption based on tree dimensions and season
const calculateCO2Absorption = (height, diameter, species, measurementDate, age) => {
  const model = speciesGrowthModels[species] || defaultGrowthModel;
  const month = measurementDate.getMonth() + 1;
  const seasonalFactor = getSeasonalGrowthFactor(month);
  
  // Base CO2 absorption calculation (more realistic scaling)
  const biomassProxy = height * (diameter / 10) * (diameter / 10); // Volume proxy
  const baseCO2 = biomassProxy * model.co2BaseRate * 10; // Scale up for realistic values
  const ageFactor = Math.min(1.5, age / 8); // Peaks around 8 years, can exceed 1
  const seasonalAbsorption = baseCO2 * seasonalFactor * ageFactor;
  
  // Add realistic seasonal and random variation (±30%)
  const variation = (Math.random() - 0.5) * 0.6;
  const finalAbsorption = seasonalAbsorption * (1 + variation);
  
  // Ensure minimum realistic value and proper scaling
  const result = Math.max(2, finalAbsorption);
  return Math.round(result * 100) / 100;
};

// Determine health status based on age, growth rate, and random factors
const determineHealthStatus = (age, expectedHeight, actualHeight, isAlive, species) => {
  if (!isAlive) return 'poor';
  
  const model = speciesGrowthModels[species] || defaultGrowthModel;
  const heightRatio = actualHeight / expectedHeight;
  
  // Base health factors
  let healthScore = 0.8; // Start with good health
  
  // Age factor (very old trees have declining health)
  if (age > model.maturityAge * 0.8) {
    healthScore -= (age - model.maturityAge * 0.8) / model.maturityAge * 0.3;
  }
  
  // Growth performance factor
  if (heightRatio < 0.7) {
    healthScore -= 0.3; // Poor growth indicates health issues
  } else if (heightRatio > 1.2) {
    healthScore += 0.1; // Exceptional growth
  }
  
  // Add random variation
  healthScore += (Math.random() - 0.5) * 0.4;
  
  // Convert to health categories
  if (healthScore > 0.8) return 'excellent';
  if (healthScore > 0.6) return 'good';
  if (healthScore > 0.4) return 'fair';
  return 'poor';
};

// Generate complete measurement history for a single tree
const generateTreeMeasurementHistory = (tree, users) => {
  const species = tree.species;
  const plantedDate = tree.plantedDate;
  const deathDate = tree.deathDate;
  const isAlive = tree.isAlive;
  
  // Generate measurement dates
  const measurementDates = generateMeasurementDates(plantedDate, deathDate, isAlive);
  const user = users[Math.floor(Math.random() * users.length)];
  const measurements = [];
  
  let previousHeight = 0.3 + Math.random() * 0.4; // Initial seedling height
  let previousDiameter = 1 + Math.random() * 1; // Initial diameter
  
  measurementDates.forEach((measurementDate, index) => {
    const age = (measurementDate - plantedDate) / (365.25 * 24 * 60 * 60 * 1000);
    const month = measurementDate.getMonth() + 1;
    const seasonalFactor = getSeasonalGrowthFactor(month);
    
    // Calculate expected growth
    const expectedHeight = calculateExpectedHeight(age, species, 0.35);
    const timeSinceLastMeasurement = index === 0 ? 0.5 : 
      (measurementDate - measurementDates[index - 1]) / (365.25 * 24 * 60 * 60 * 1000);
    
    // Add incremental growth with seasonal variation
    const model = speciesGrowthModels[species] || defaultGrowthModel;
    const ageMultiplier = getAgeGrowthMultiplier(age, species, model);
    const annualHeightGrowth = model.heightGrowthRate * ageMultiplier;
    const actualHeightIncrease = annualHeightGrowth * timeSinceLastMeasurement * seasonalFactor;
    
    // Add some measurement variation and ensure growth (mostly)
    const growthVariation = (Math.random() - 0.3) * 0.2; // Slight bias toward growth
    const newHeight = Math.max(previousHeight, 
      previousHeight + actualHeightIncrease * (1 + growthVariation));
    
    // Calculate diameter based on height
    const newDiameter = calculateExpectedDiameter(newHeight, age, species);
    const diameterIncrease = (newDiameter - previousDiameter) * timeSinceLastMeasurement * seasonalFactor;
    const actualDiameter = Math.max(previousDiameter, 
      previousDiameter + diameterIncrease * (1 + growthVariation));
    
    // Calculate CO2 absorption
    const co2Absorption = calculateCO2Absorption(newHeight, actualDiameter, species, measurementDate, age);
    
    // Determine health status
    const healthStatus = determineHealthStatus(age, expectedHeight, newHeight, isAlive, species);
    
    // Create measurement record
    const measurement = {
      height: Math.round(newHeight * 100) / 100,
      diameter: Math.round(actualDiameter * 10) / 10,
      co2Absorption: co2Absorption,
      healthStatus: healthStatus,
      notes: index === 0 ? 'Initial baseline measurement' : 
             (Math.random() > 0.9 ? generateMeasurementNote(age, seasonalFactor, healthStatus) : undefined),
      measuredBy: user._id,
      measuredAt: measurementDate
    };
    
    measurements.push(measurement);
    previousHeight = newHeight;
    previousDiameter = actualDiameter;
  });
  
  return measurements;
};

// Generate contextual measurement notes
const generateMeasurementNote = (age, seasonalFactor, healthStatus) => {
  const notes = [
    'Strong seasonal growth observed',
    'Healthy canopy development',
    'Good root establishment visible',
    'Regular pruning maintenance completed',
    'Showing competitive growth advantage',
    'Responding well to forest management',
    'Optimal growing conditions this season',
    'Slight pest pressure observed but controlled',
    'Excellent diameter to height ratio',
    'Above average growth for species'
  ];
  
  if (seasonalFactor > 0.3) {
    notes.push('Peak growing season measurements', 'Rapid height increase noted');
  }
  
  if (age > 5) {
    notes.push('Mature growth pattern established', 'Long-term health assessment positive');
  }
  
  if (healthStatus === 'excellent') {
    notes.push('Exceptional specimen quality', 'Outstanding growth performance');
  }
  
  return notes[Math.floor(Math.random() * notes.length)];
};

// Main function to enhance all trees with historical measurement data
const enhanceTreesWithHistoricalData = async (batchSize = 50) => {
  try {
    console.log('🌳 Starting historical measurement data enhancement...');
    
    await mongoose.connect(mongoUrl);
    console.log('✅ Connected to MongoDB');
    
    // Get all users for measurement attribution
    const users = await User.find({ role: 'user' });
    if (users.length === 0) {
      throw new Error('No users found for measurement attribution');
    }
    
    // Get total tree count
    const totalTrees = await Tree.countDocuments();
    console.log(`📊 Found ${totalTrees.toLocaleString()} trees to enhance`);
    
    let processedTrees = 0;
    let totalMeasurementsGenerated = 0;
    
    // Process trees in batches for memory efficiency
    for (let offset = 0; offset < totalTrees; offset += batchSize) {
      const trees = await Tree.find({})
        .skip(offset)
        .limit(batchSize)
        .select('_id species plantedDate deathDate isAlive measurements');
      
      console.log(`🔄 Processing batch ${Math.floor(offset / batchSize) + 1}: trees ${offset + 1}-${Math.min(offset + batchSize, totalTrees)}`);
      
      const bulkOps = [];
      
      for (const tree of trees) {
        // Generate new measurement history
        const newMeasurements = generateTreeMeasurementHistory(tree, users);
        totalMeasurementsGenerated += newMeasurements.length;
        
        // Prepare bulk update operation
        bulkOps.push({
          updateOne: {
            filter: { _id: tree._id },
            update: { $set: { measurements: newMeasurements } }
          }
        });
        
        processedTrees++;
      }
      
      // Execute bulk update
      if (bulkOps.length > 0) {
        await Tree.bulkWrite(bulkOps);
        console.log(`  ✅ Updated ${bulkOps.length} trees with measurement history`);
      }
      
      // Progress indicator
      const progress = ((offset + batchSize) / totalTrees * 100).toFixed(1);
      console.log(`  📊 Progress: ${progress}% (${processedTrees.toLocaleString()}/${totalTrees.toLocaleString()} trees)`);
    }
    
    console.log('\n🎉 Historical measurement enhancement completed!');
    console.log(`📊 Final Statistics:`);
    console.log(`   🌳 Trees processed: ${processedTrees.toLocaleString()}`);
    console.log(`   📏 Total measurements generated: ${totalMeasurementsGenerated.toLocaleString()}`);
    console.log(`   📈 Average measurements per tree: ${(totalMeasurementsGenerated / processedTrees).toFixed(1)}`);
    
    return {
      treesProcessed: processedTrees,
      measurementsGenerated: totalMeasurementsGenerated,
      success: true
    };
    
  } catch (error) {
    console.error('❌ Error enhancing trees with historical data:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('📴 Database connection closed');
  }
};

// Validation function to check data quality
const validateHistoricalData = async (sampleSize = 10) => {
  try {
    await mongoose.connect(mongoUrl);
    
    const sampleTrees = await Tree.find({ isAlive: true })
      .limit(sampleSize)
      .select('species plantedDate measurements');
    
    console.log('\n🔍 Historical Data Quality Validation:');
    console.log('=====================================');
    
    for (const tree of sampleTrees) {
      const age = (Date.now() - tree.plantedDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      const measurements = tree.measurements.sort((a, b) => a.measuredAt - b.measuredAt);
      
      console.log(`\n🌳 ${tree.species} (${age.toFixed(1)} years old):`);
      console.log(`   📏 ${measurements.length} measurements over ${age.toFixed(1)} years`);
      
      if (measurements.length > 0) {
        const firstMeasurement = measurements[0];
        const lastMeasurement = measurements[measurements.length - 1];
        const heightGrowth = lastMeasurement.height - firstMeasurement.height;
        
        console.log(`   📊 Height: ${firstMeasurement.height}m → ${lastMeasurement.height}m (+${heightGrowth.toFixed(2)}m)`);
        console.log(`   📊 Diameter: ${firstMeasurement.diameter}cm → ${lastMeasurement.diameter}cm`);
        console.log(`   🌿 CO2 Range: ${Math.min(...measurements.map(m => m.co2Absorption))} - ${Math.max(...measurements.map(m => m.co2Absorption))} kg/year`);
        
        // Check for growth consistency
        let growthIssues = 0;
        for (let i = 1; i < measurements.length; i++) {
          if (measurements[i].height < measurements[i - 1].height - 0.1) {
            growthIssues++;
          }
        }
        
        console.log(`   ${growthIssues === 0 ? '✅' : '⚠️'} Growth consistency: ${growthIssues} height decreases found`);
      }
    }
    
  } catch (error) {
    console.error('❌ Validation error:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// Export functions
export {
  enhanceTreesWithHistoricalData,
  validateHistoricalData,
  speciesGrowthModels,
  generateTreeMeasurementHistory
};

// Run enhancement if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  if (command === 'validate') {
    await validateHistoricalData(15);
  } else {
    await enhanceTreesWithHistoricalData(30);
  }
}