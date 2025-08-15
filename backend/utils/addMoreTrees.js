import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Tree, Forest, User } from '../models/index.js';

dotenv.config();

// Swedish forest species distribution
const speciesDistribution = [
  { name: 'Pine', weight: 40 },      // 40% Pine (Scots Pine dominant in Sweden)
  { name: 'Spruce', weight: 35 },    // 35% Spruce (Norway Spruce)
  { name: 'Birch', weight: 15 },     // 15% Birch
  { name: 'Oak', weight: 5 },        // 5% Oak
  { name: 'Fir', weight: 5 }         // 5% Fir
];

// Function to select species based on weighted distribution
const selectSpecies = () => {
  const random = Math.random() * 100;
  let cumulative = 0;
  
  for (const species of speciesDistribution) {
    cumulative += species.weight;
    if (random <= cumulative) {
      return species.name;
    }
  }
  return 'Pine'; // Default fallback
};

// Generate a unique tree ID
const generateTreeId = (forestIndex, treeIndex) => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `TREE-${timestamp}-${forestIndex}-${treeIndex}-${random}`;
};

// Generate random coordinates within Sweden's approximate bounds
const generateSwedishCoordinates = (baseCoord) => {
  // Add small random offset to base coordinates
  return [
    baseCoord[0] + (Math.random() - 0.5) * 0.1,
    baseCoord[1] + (Math.random() - 0.5) * 0.1
  ];
};

// Generate tree data
const generateTreeData = (forest, treeIndex, users) => {
  const species = selectSpecies();
  const plantedDate = new Date(Date.now() - Math.random() * 10 * 365 * 24 * 60 * 60 * 1000); // Random date within last 10 years
  const isAlive = Math.random() > 0.08; // 92% survival rate
  const ageInYears = (Date.now() - plantedDate) / (365 * 24 * 60 * 60 * 1000);
  
  // Calculate realistic height based on species and age
  const growthRates = {
    'Pine': 0.3,
    'Spruce': 0.35,
    'Birch': 0.4,
    'Oak': 0.25,
    'Fir': 0.3
  };
  
  const baseHeight = 0.5 + ageInYears * growthRates[species] + Math.random() * 2;
  const height = Math.round(baseHeight * 10) / 10;
  const diameter = Math.round((height * 2.5 + Math.random() * 5) * 10) / 10;
  
  const treeData = {
    treeId: generateTreeId(forest._id.toString().slice(-4), treeIndex),
    forestId: forest._id,
    species,
    location: {
      type: 'Point',
      coordinates: generateSwedishCoordinates(forest.location.coordinates)
    },
    plantedDate,
    isAlive,
    measurements: [{
      height,
      diameter,
      co2Absorption: Math.round(height * diameter * 0.5 * 10) / 10,
      healthStatus: isAlive ? 
        ['excellent', 'good', 'good', 'fair'][Math.floor(Math.random() * 4)] : 
        'poor',
      measuredBy: users[Math.floor(Math.random() * users.length)]?._id,
      measuredAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Within last 30 days
      notes: ''
    }]
  };
  
  // Add death information for dead trees
  if (!isAlive) {
    const deathCauses = ['disease', 'storm damage', 'drought', 'pest infestation', 'unknown'];
    treeData.deathDate = new Date(plantedDate.getTime() + Math.random() * (Date.now() - plantedDate.getTime()));
    treeData.deathCause = deathCauses[Math.floor(Math.random() * deathCauses.length)];
  }
  
  // Add metadata
  treeData.metadata = {
    soilCondition: ['excellent', 'good', 'moderate', 'poor'][Math.floor(Math.random() * 4)],
    sunlightExposure: ['full_sun', 'partial_sun', 'partial_shade', 'full_shade'][Math.floor(Math.random() * 4)],
    waterAccess: ['excellent', 'good', 'moderate', 'poor'][Math.floor(Math.random() * 4)],
    plantingMethod: ['hand_planted', 'machine_planted'][Math.floor(Math.random() * 2)],
    managementObjective: ['timber', 'conservation', 'mixed'][Math.floor(Math.random() * 3)]
  };
  
  // Add some advanced fields for variety
  if (Math.random() > 0.5) {
    treeData.genetics = {
      geneticDiversity: ['native', 'improved'][Math.floor(Math.random() * 2)],
      seedSource: `Swedish Nursery ${Math.floor(Math.random() * 10) + 1}`
    };
  }
  
  if (Math.random() > 0.6) {
    treeData.growthModel = {
      growthRate: ['slow', 'moderate', 'fast'][Math.floor(Math.random() * 3)],
      expectedHeightAt15Years: Math.round((height + 5 + Math.random() * 5) * 10) / 10
    };
  }
  
  return treeData;
};

const addMoreTrees = async () => {
  try {
    console.log('🌳 Starting to add more trees to existing database...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');
    
    // Get database name
    const dbName = mongoose.connection.db.databaseName;
    console.log(`📊 Database: ${dbName}\n`);
    
    // Count existing trees
    const existingTreeCount = await Tree.countDocuments();
    console.log(`📊 Current tree count: ${existingTreeCount}`);
    
    // Fetch all forests
    const forests = await Forest.find().lean();
    console.log(`🌲 Found ${forests.length} forests`);
    
    if (forests.length === 0) {
      console.log('❌ No forests found in database. Please run a seeder first.');
      process.exit(1);
    }
    
    // Fetch users for measurements
    const users = await User.find({ role: 'user' }).lean();
    
    // Calculate trees to add per forest
    const targetTotal = 1500;
    const treesToAdd = targetTotal - existingTreeCount;
    
    if (treesToAdd <= 0) {
      console.log(`✅ Already have ${existingTreeCount} trees, which meets or exceeds target of ${targetTotal}`);
      process.exit(0);
    }
    
    const treesPerForest = Math.ceil(treesToAdd / forests.length);
    
    console.log(`\n📈 Plan: Add ${treesToAdd} trees (${treesPerForest} per forest) to reach ${targetTotal} total\n`);
    
    // Confirmation
    console.log('Press Ctrl+C within 3 seconds to cancel...\n');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Add trees to each forest
    let totalAdded = 0;
    
    for (let i = 0; i < forests.length; i++) {
      const forest = forests[i];
      const treesToAddToForest = Math.min(treesPerForest, treesToAdd - totalAdded);
      
      if (treesToAddToForest <= 0) break;
      
      console.log(`🌳 Adding ${treesToAddToForest} trees to ${forest.name}...`);
      
      // Create trees in batches
      const batchSize = 50;
      let forestTreesAdded = 0;
      
      for (let j = 0; j < treesToAddToForest; j += batchSize) {
        const currentBatchSize = Math.min(batchSize, treesToAddToForest - j);
        const treesData = [];
        
        for (let k = 0; k < currentBatchSize; k++) {
          const treeData = generateTreeData(forest, totalAdded + forestTreesAdded + k, users);
          treesData.push(treeData);
        }
        
        await Tree.insertMany(treesData);
        forestTreesAdded += treesData.length;
        
        // Show progress
        if (forestTreesAdded % 100 === 0 || forestTreesAdded === treesToAddToForest) {
          process.stdout.write(`  ✓ ${forestTreesAdded}/${treesToAddToForest} trees\r`);
        }
      }
      
      console.log(`  ✅ Added ${forestTreesAdded} trees to ${forest.name}`);
      totalAdded += forestTreesAdded;
    }
    
    // Final count
    const finalTreeCount = await Tree.countDocuments();
    const aliveTreeCount = await Tree.countDocuments({ isAlive: true });
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 Successfully added trees to database!');
    console.log('='.repeat(50));
    console.log(`📊 Summary:`);
    console.log(`   Trees before: ${existingTreeCount}`);
    console.log(`   Trees added: ${totalAdded}`);
    console.log(`   Trees total: ${finalTreeCount}`);
    console.log(`   Alive trees: ${aliveTreeCount}`);
    console.log(`   Survival rate: ${Math.round((aliveTreeCount / finalTreeCount) * 100)}%`);
    console.log('='.repeat(50));
    
    console.log('\n✅ Process completed successfully!');
    
  } catch (error) {
    console.error('❌ Error adding trees:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📴 Database connection closed');
  }
};

// Run the script
addMoreTrees();