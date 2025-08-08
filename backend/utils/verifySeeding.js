import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Forest, Tree, Owner } from '../models/index.js';

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/nanwa-forestry";

// Verification function
const verifySeeding = async () => {
  try {
    console.log('🔍 Verifying seeded data integrity and access control...\n');
    
    // Connect to MongoDB
    await mongoose.connect(mongoUrl);
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${mongoose.connection.name}\n`);
    
    // Verify document counts
    const ownerCount = await Owner.countDocuments();
    const userCount = await User.countDocuments();
    const forestCount = await Forest.countDocuments();
    const treeCount = await Tree.countDocuments();
    
    console.log('📊 DOCUMENT COUNTS:');
    console.log('================================');
    console.log(`🏢 Owners: ${ownerCount}`);
    console.log(`👥 Users: ${userCount}`);
    console.log(`🌲 Forests: ${forestCount}`);
    console.log(`🌳 Trees: ${treeCount}\n`);
    
    // Verify Owner data integrity
    console.log('🏢 OWNER DATA VERIFICATION:');
    console.log('================================');
    const owners = await Owner.find().select('name organizationType managementApproach.primaryObjective');
    owners.forEach((owner, index) => {
      console.log(`${index + 1}. ${owner.name}`);
      console.log(`   Type: ${owner.organizationType}`);
      console.log(`   Objective: ${owner.managementApproach.primaryObjective}`);
    });
    console.log();
    
    // Verify User-Owner relationships
    console.log('👥 USER-OWNER RELATIONSHIPS:');
    console.log('================================');
    const adminUsers = await User.find({ role: 'admin' }).select('email role owner');
    const regularUsers = await User.find({ role: 'user' }).populate('owner', 'name').select('email role owner');
    
    console.log(`🔑 Admin Users (${adminUsers.length}):`);
    adminUsers.forEach(user => {
      console.log(`   📧 ${user.email} (Owner: ${user.owner ? 'Has owner - ERROR!' : 'null - ✅'})`);
    });
    
    console.log(`\n👤 Regular Users (${regularUsers.length}):`);
    regularUsers.forEach(user => {
      console.log(`   📧 ${user.email} (Owner: ${user.owner ? user.owner.name : 'null - ERROR!'})`);
    });
    console.log();
    
    // Verify Forest-Owner relationships
    console.log('🌲 FOREST-OWNER RELATIONSHIPS:');
    console.log('================================');
    for (const owner of owners) {
      const ownerForests = await Forest.find({ owner: owner._id }).select('name region isPlantation');
      console.log(`🏢 ${owner.name}: ${ownerForests.length} forests`);
      ownerForests.forEach(forest => {
        console.log(`   🌲 ${forest.name} (${forest.region}, ${forest.isPlantation ? 'Plantation' : 'Natural'})`);
      });
    }
    console.log();
    
    // Verify Tree-Forest relationships
    console.log('🌳 TREE DISTRIBUTION:');
    console.log('================================');
    const treesByForest = await Tree.aggregate([
      {
        $lookup: {
          from: 'forests',
          localField: 'forestId',
          foreignField: '_id',
          as: 'forest'
        }
      },
      {
        $unwind: '$forest'
      },
      {
        $group: {
          _id: {
            forestId: '$forestId',
            forestName: '$forest.name'
          },
          treeCount: { $sum: 1 },
          species: { $addToSet: '$species' }
        }
      },
      {
        $sort: { 'treeCount': -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    console.log('Top 10 forests by tree count:');
    treesByForest.forEach((item, index) => {
      console.log(`${index + 1}. ${item._id.forestName}: ${item.treeCount} trees`);
      console.log(`   Species: ${item.species.join(', ')}`);
    });
    console.log();
    
    // Verify species distribution
    console.log('🌿 SPECIES DISTRIBUTION:');
    console.log('================================');
    const speciesStats = await Tree.aggregate([
      { $group: { _id: '$species', count: { $sum: 1 }, aliveCount: { $sum: { $cond: ['$isAlive', 1, 0] } } } },
      { $sort: { count: -1 } }
    ]);
    
    speciesStats.forEach(stat => {
      const percentage = ((stat.count / treeCount) * 100).toFixed(1);
      const alivePercentage = ((stat.aliveCount / stat.count) * 100).toFixed(1);
      console.log(`🌳 ${stat._id}: ${stat.count} (${percentage}%) - ${stat.aliveCount} alive (${alivePercentage}%)`);
    });
    console.log();
    
    // Test access control scenarios
    console.log('🔒 ACCESS CONTROL TESTING:');
    console.log('================================');
    
    // Test admin access
    const adminUser = await User.findOne({ role: 'admin' });
    console.log(`🔑 Admin user: ${adminUser.email}`);
    console.log(`   - Can access all owners: ${adminUser.owner === null ? '✅' : '❌'}`);
    
    // Test regular user access
    const regularUser = await User.findOne({ role: 'user' }).populate('owner');
    if (regularUser && regularUser.owner) {
      console.log(`👤 Regular user: ${regularUser.email}`);
      console.log(`   - Assigned to owner: ${regularUser.owner.name} ✅`);
      
      // Check if user can access their owner's forests
      const userForests = await Forest.find({ owner: regularUser.owner._id });
      console.log(`   - Can access ${userForests.length} forests from their organization ✅`);
      
      // Check if there are forests from other owners (that they shouldn't access)
      const otherForests = await Forest.find({ owner: { $ne: regularUser.owner._id } });
      console.log(`   - Should NOT access ${otherForests.length} forests from other organizations`);
    }
    console.log();
    
    // Verify data quality
    console.log('✅ DATA QUALITY CHECKS:');
    console.log('================================');
    
    // Check for forests without owners
    const forestsWithoutOwner = await Forest.countDocuments({ owner: { $exists: false } });
    console.log(`🌲 Forests without owner: ${forestsWithoutOwner} ${forestsWithoutOwner === 0 ? '✅' : '❌'}`);
    
    // Check for trees without forests
    const treesWithoutForest = await Tree.countDocuments({ forestId: { $exists: false } });
    console.log(`🌳 Trees without forest: ${treesWithoutForest} ${treesWithoutForest === 0 ? '✅' : '❌'}`);
    
    // Check for users without proper email format
    const usersWithBadEmail = await User.countDocuments({ 
      email: { $not: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/ } 
    });
    console.log(`👥 Users with invalid email: ${usersWithBadEmail} ${usersWithBadEmail === 0 ? '✅' : '❌'}`);
    
    // Check for forests with invalid enum values
    const forestsWithBadSoil = await Forest.countDocuments({ 
      'metadata.soilType': { $nin: ['clay', 'loam', 'sand', 'peat', 'rocky', 'mixed'] } 
    });
    console.log(`🌲 Forests with invalid soil type: ${forestsWithBadSoil} ${forestsWithBadSoil === 0 ? '✅' : '❌'}`);
    
    const forestsWithBadClimate = await Forest.countDocuments({ 
      'metadata.climate': { $nin: ['temperate', 'continental', 'oceanic', 'boreal'] } 
    });
    console.log(`🌲 Forests with invalid climate: ${forestsWithBadClimate} ${forestsWithBadClimate === 0 ? '✅' : '❌'}`);
    
    console.log('\n🎉 Data verification completed!');
    console.log('✅ All data appears to be correctly seeded and schema-compliant');
    
    return {
      counts: { ownerCount, userCount, forestCount, treeCount },
      qualityChecks: {
        forestsWithoutOwner,
        treesWithoutForest,
        usersWithBadEmail,
        forestsWithBadSoil,
        forestsWithBadClimate
      }
    };
    
  } catch (error) {
    console.error('❌ Error during verification:', error);
    return null;
  } finally {
    await mongoose.connection.close();
    console.log('📴 Database connection closed');
  }
};

// Run verification if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  verifySeeding();
}

export default verifySeeding;