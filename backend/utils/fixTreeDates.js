import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Tree } from '../models/index.js';
import fs from 'fs';
import path from 'path';

dotenv.config();

// Age distribution for realistic forest (more young trees)
const ageDistribution = [
  { minYears: 0, maxYears: 2, percentage: 30 },   // 30% are 0-2 years old
  { minYears: 2, maxYears: 4, percentage: 25 },   // 25% are 2-4 years old
  { minYears: 4, maxYears: 6, percentage: 20 },   // 20% are 4-6 years old
  { minYears: 6, maxYears: 8, percentage: 15 },   // 15% are 6-8 years old
  { minYears: 8, maxYears: 10, percentage: 10 }   // 10% are 8-10 years old
];

// Growth rates per species (meters per year)
const speciesGrowthRates = {
  'Pine': { min: 0.3, max: 0.5 },
  'Scots Pine': { min: 0.3, max: 0.5 },
  'Spruce': { min: 0.35, max: 0.6 },
  'Norway Spruce': { min: 0.35, max: 0.6 },
  'Birch': { min: 0.4, max: 0.7 },
  'Silver Birch': { min: 0.4, max: 0.7 },
  'Downy Birch': { min: 0.35, max: 0.6 },
  'Oak': { min: 0.25, max: 0.4 },
  'Fir': { min: 0.3, max: 0.5 },
  'European Aspen': { min: 0.45, max: 0.8 }
};

// Get growth rate for species
const getGrowthRate = (species) => {
  const rates = speciesGrowthRates[species] || speciesGrowthRates['Pine'];
  return rates.min + Math.random() * (rates.max - rates.min);
};

// Calculate height based on age and species
const calculateHeight = (ageInYears, species) => {
  const growthRate = getGrowthRate(species);
  const baseHeight = 0.3; // Starting height when planted (30cm sapling)
  
  // Add some natural variation
  const variationFactor = 0.8 + Math.random() * 0.4; // 80% to 120% of expected
  const height = baseHeight + (ageInYears * growthRate * variationFactor);
  
  // Round to 1 decimal place
  return Math.round(height * 10) / 10;
};

// Calculate diameter based on height (DBH - Diameter at Breast Height)
const calculateDiameter = (height) => {
  // Typical height to diameter ratio is between 8:1 to 12:1
  const ratio = 8 + Math.random() * 4;
  const diameter = (height * 100) / ratio; // Convert to cm
  return Math.round(diameter * 10) / 10;
};

// Calculate CO2 absorption based on tree size
const calculateCO2Absorption = (height, diameter) => {
  // Simplified calculation: larger trees absorb more CO2
  // Using approximate formula based on biomass
  const biomass = height * diameter * 0.5;
  const co2 = biomass * 0.47; // Approximate CO2 sequestration factor
  return Math.round(co2 * 10) / 10;
};

// Determine if tree should be dead based on age (older = higher mortality)
const shouldTreeBeDead = (ageInYears, currentIsAlive) => {
  if (!currentIsAlive) return true; // Keep dead trees dead
  
  // Mortality rate increases with age
  const mortalityRates = {
    2: 0.02,   // 2% for trees 0-2 years
    4: 0.04,   // 4% for trees 2-4 years
    6: 0.06,   // 6% for trees 4-6 years
    8: 0.08,   // 8% for trees 6-8 years
    10: 0.12   // 12% for trees 8-10 years
  };
  
  let mortalityRate = 0.02;
  for (const [age, rate] of Object.entries(mortalityRates)) {
    if (ageInYears <= parseFloat(age)) {
      mortalityRate = rate;
      break;
    }
  }
  
  return Math.random() < mortalityRate;
};

// Backup current trees to JSON file
const backupTrees = async (trees) => {
  const backup = {
    timestamp: new Date().toISOString(),
    treeCount: trees.length,
    trees: trees.map(t => ({
      treeId: t.treeId,
      plantedDate: t.plantedDate,
      height: t.measurements?.[0]?.height,
      isAlive: t.isAlive
    }))
  };
  
  const backupPath = path.join(process.cwd(), `trees_backup_${Date.now()}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
  console.log(`📁 Backup saved to: ${backupPath}`);
  return backupPath;
};

const fixTreeDates = async () => {
  try {
    console.log('🌳 Starting to fix tree planting dates and correlate data...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');
    
    // Get all trees
    const trees = await Tree.find({}).lean();
    console.log(`📊 Found ${trees.length} trees to update\n`);
    
    if (trees.length === 0) {
      console.log('❌ No trees found in database');
      process.exit(1);
    }
    
    // Backup current state
    console.log('💾 Creating backup...');
    const backupPath = await backupTrees(trees);
    
    // Calculate distribution buckets
    const treesPerBucket = [];
    let totalAssigned = 0;
    
    for (const bucket of ageDistribution) {
      const count = Math.floor(trees.length * bucket.percentage / 100);
      treesPerBucket.push({
        ...bucket,
        count,
        trees: []
      });
      totalAssigned += count;
    }
    
    // Add remaining trees to first bucket
    if (totalAssigned < trees.length) {
      treesPerBucket[0].count += trees.length - totalAssigned;
    }
    
    // Shuffle trees for random distribution
    const shuffledTrees = [...trees].sort(() => Math.random() - 0.5);
    
    // Assign trees to buckets
    let treeIndex = 0;
    for (const bucket of treesPerBucket) {
      for (let i = 0; i < bucket.count && treeIndex < shuffledTrees.length; i++) {
        bucket.trees.push(shuffledTrees[treeIndex]);
        treeIndex++;
      }
    }
    
    console.log('\n📊 Distribution plan:');
    treesPerBucket.forEach(bucket => {
      console.log(`   ${bucket.minYears}-${bucket.maxYears} years: ${bucket.trees.length} trees (${bucket.percentage}%)`);
    });
    
    console.log('\n🔧 Updating trees...');
    let updatedCount = 0;
    let deadCount = 0;
    const updatePromises = [];
    
    for (const bucket of treesPerBucket) {
      for (const tree of bucket.trees) {
        // Calculate random age within bucket
        const ageInYears = bucket.minYears + Math.random() * (bucket.maxYears - bucket.minYears);
        const ageInMilliseconds = ageInYears * 365.25 * 24 * 60 * 60 * 1000;
        const plantedDate = new Date(Date.now() - ageInMilliseconds);
        
        // Calculate new measurements based on age
        const height = calculateHeight(ageInYears, tree.species);
        const diameter = calculateDiameter(height);
        const co2Absorption = calculateCO2Absorption(height, diameter);
        
        // Determine if tree should be dead
        const isAlive = !shouldTreeBeDead(ageInYears, tree.isAlive);
        if (!isAlive) deadCount++;
        
        // Prepare update
        const updateData = {
          plantedDate,
          isAlive
        };
        
        // Update death information if dead
        if (!isAlive && tree.isAlive) {
          // Tree is being marked as dead
          const deathCauses = ['disease', 'storm damage', 'drought', 'pest infestation', 'lightning', 'competition'];
          const daysAlive = Math.random() * ageInMilliseconds;
          updateData.deathDate = new Date(plantedDate.getTime() + daysAlive);
          updateData.deathCause = deathCauses[Math.floor(Math.random() * deathCauses.length)];
        }
        
        // Update measurements
        if (tree.measurements && tree.measurements.length > 0) {
          // Update the first measurement with new values
          updateData['measurements.0.height'] = height;
          updateData['measurements.0.diameter'] = diameter;
          updateData['measurements.0.co2Absorption'] = co2Absorption;
          updateData['measurements.0.measuredAt'] = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
          
          if (!isAlive) {
            updateData['measurements.0.healthStatus'] = 'poor';
          } else {
            // Health status based on age (younger trees generally healthier)
            const healthOptions = ageInYears < 3 ? 
              ['excellent', 'excellent', 'good', 'good', 'fair'] :
              ageInYears < 6 ?
              ['excellent', 'good', 'good', 'fair', 'fair'] :
              ['good', 'good', 'fair', 'fair', 'poor'];
            updateData['measurements.0.healthStatus'] = healthOptions[Math.floor(Math.random() * healthOptions.length)];
          }
        } else {
          // Create new measurement if none exists
          updateData.measurements = [{
            height,
            diameter,
            co2Absorption,
            healthStatus: isAlive ? 'good' : 'poor',
            measuredAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          }];
        }
        
        // Add to update queue
        updatePromises.push(
          Tree.findByIdAndUpdate(tree._id, updateData)
            .then(() => {
              updatedCount++;
              if (updatedCount % 100 === 0) {
                process.stdout.write(`  ✓ Updated ${updatedCount}/${trees.length} trees\r`);
              }
            })
        );
      }
    }
    
    // Execute all updates
    await Promise.all(updatePromises);
    console.log(`  ✅ Updated ${updatedCount}/${trees.length} trees`);
    
    // Get updated statistics
    console.log('\n📊 Verifying changes...');
    const updatedTrees = await Tree.find({}).lean();
    
    // Calculate age distribution
    const ageStats = {};
    let totalHeight = 0;
    let aliveCount = 0;
    
    for (const tree of updatedTrees) {
      const ageInYears = Math.floor((Date.now() - new Date(tree.plantedDate)) / (365.25 * 24 * 60 * 60 * 1000));
      const ageBucket = `${Math.floor(ageInYears / 2) * 2}-${Math.floor(ageInYears / 2) * 2 + 2} years`;
      ageStats[ageBucket] = (ageStats[ageBucket] || 0) + 1;
      
      if (tree.isAlive) {
        aliveCount++;
        if (tree.measurements?.[0]?.height) {
          totalHeight += tree.measurements[0].height;
        }
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Successfully updated all tree dates and correlated data!');
    console.log('='.repeat(60));
    console.log('\n📊 Final Statistics:');
    console.log(`   Total trees: ${updatedTrees.length}`);
    console.log(`   Alive trees: ${aliveCount} (${Math.round(aliveCount / updatedTrees.length * 100)}%)`);
    console.log(`   Dead trees: ${updatedTrees.length - aliveCount}`);
    console.log(`   Average height (alive): ${(totalHeight / aliveCount).toFixed(1)}m`);
    
    console.log('\n📊 Age Distribution:');
    Object.keys(ageStats).sort().forEach(age => {
      const percentage = Math.round(ageStats[age] / updatedTrees.length * 100);
      console.log(`   ${age}: ${ageStats[age]} trees (${percentage}%)`);
    });
    
    console.log('\n💾 Backup location: ' + backupPath);
    console.log('   (You can restore from backup if needed)');
    console.log('\n✅ Process completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing tree dates:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n📴 Database connection closed');
  }
};

// Run the script
fixTreeDates();