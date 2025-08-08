import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Forest, Tree, AuditLog, RefreshToken } from '../models/index.js';
import { Owner } from '../models/Owner.js';

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/nanwa-forestry";

/**
 * Safely cleans the database by removing all data from collections
 * while preserving collection structure and indexes
 */
const cleanDatabase = async () => {
  try {
    console.log('🧹 Starting database cleanup...');
    console.log('🔗 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(mongoUrl);
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🏠 Host: ${mongoose.connection.host}`);

    // Get collection statistics before cleanup
    console.log('\n📊 Current database statistics:');
    
    const collections = [
      { name: 'Users', model: User },
      { name: 'Owners', model: Owner },
      { name: 'Forests', model: Forest },
      { name: 'Trees', model: Tree },
      { name: 'AuditLogs', model: AuditLog },
      { name: 'RefreshTokens', model: RefreshToken }
    ];

    const beforeStats = {};
    for (const { name, model } of collections) {
      try {
        const count = await model.countDocuments({});
        beforeStats[name] = count;
        console.log(`  - ${name}: ${count.toLocaleString()} documents`);
      } catch (error) {
        console.log(`  - ${name}: Collection doesn't exist or error: ${error.message}`);
        beforeStats[name] = 0;
      }
    }

    const totalBefore = Object.values(beforeStats).reduce((sum, count) => sum + count, 0);
    console.log(`📈 Total documents before cleanup: ${totalBefore.toLocaleString()}`);

    // Confirm cleanup (in production, you might want to add a confirmation prompt)
    console.log('\n⚠️  WARNING: This will permanently delete ALL data from the database!');
    console.log('🔄 Proceeding with cleanup in 3 seconds...');
    
    // Wait 3 seconds to give time to cancel if needed
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Clean collections in dependency order (children first, then parents)
    console.log('\n🗑️  Cleaning collections...');

    // 1. Clean RefreshTokens (depends on Users)
    console.log('  🔑 Cleaning RefreshTokens...');
    const refreshTokensDeleted = await RefreshToken.deleteMany({});
    console.log(`    ✅ Deleted ${refreshTokensDeleted.deletedCount} refresh tokens`);

    // 2. Clean AuditLogs (depends on Users and other entities)
    console.log('  📋 Cleaning AuditLogs...');
    const auditLogsDeleted = await AuditLog.deleteMany({});
    console.log(`    ✅ Deleted ${auditLogsDeleted.deletedCount} audit logs`);

    // 3. Clean Trees (depends on Forests and Users)
    console.log('  🌳 Cleaning Trees...');
    const treesDeleted = await Tree.deleteMany({});
    console.log(`    ✅ Deleted ${treesDeleted.deletedCount} trees`);

    // 4. Clean Forests (depends on Owners)
    console.log('  🌲 Cleaning Forests...');
    const forestsDeleted = await Forest.deleteMany({});
    console.log(`    ✅ Deleted ${forestsDeleted.deletedCount} forests`);

    // 5. Clean Users (referenced by Owners)
    console.log('  👥 Cleaning Users...');
    const usersDeleted = await User.deleteMany({});
    console.log(`    ✅ Deleted ${usersDeleted.deletedCount} users`);

    // 6. Clean Owners (top-level entities)
    console.log('  🏢 Cleaning Owners...');
    const ownersDeleted = await Owner.deleteMany({});
    console.log(`    ✅ Deleted ${ownersDeleted.deletedCount} owners`);

    // Verify cleanup
    console.log('\n🔍 Verifying cleanup...');
    const afterStats = {};
    for (const { name, model } of collections) {
      try {
        const count = await model.countDocuments({});
        afterStats[name] = count;
        console.log(`  - ${name}: ${count} documents remaining`);
      } catch (error) {
        console.log(`  - ${name}: Error checking: ${error.message}`);
        afterStats[name] = 0;
      }
    }

    const totalAfter = Object.values(afterStats).reduce((sum, count) => sum + count, 0);
    const totalDeleted = totalBefore - totalAfter;

    console.log('\n📊 Cleanup Summary:');
    console.log(`  📉 Documents before: ${totalBefore.toLocaleString()}`);
    console.log(`  📊 Documents after: ${totalAfter.toLocaleString()}`);
    console.log(`  🗑️  Total deleted: ${totalDeleted.toLocaleString()}`);

    if (totalAfter === 0) {
      console.log('\n✅ Database cleanup completed successfully!');
      console.log('🎯 All collections are now empty and ready for seeding.');
    } else {
      console.log('\n⚠️  Warning: Some documents may remain in the database.');
      console.log('📝 This might be due to protected data or constraints.');
    }

    // Verify indexes are preserved
    console.log('\n🔍 Checking index preservation...');
    const db = mongoose.connection.db;
    const collectionNames = await db.listCollections().toArray();
    
    for (const collection of collectionNames) {
      if (['users', 'owners', 'forests', 'trees'].includes(collection.name)) {
        const indexes = await db.collection(collection.name).indexes();
        console.log(`  📇 ${collection.name}: ${indexes.length} indexes preserved`);
      }
    }

    console.log('\n🎉 Database is clean and ready for fresh data!');
    console.log('💡 You can now run the enhanced seeder to populate with new data.');

  } catch (error) {
    console.error('❌ Error during database cleanup:', error);
    console.error('📝 Details:', error.message);
    if (error.stack) {
      console.error('🔍 Stack trace:', error.stack);
    }
    throw error;
  } finally {
    // Always close the connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('📴 Database connection closed');
    }
  }
};

/**
 * Clean specific collections only
 * @param {Array} collectionNames - Array of collection names to clean
 */
export const cleanSpecificCollections = async (collectionNames = []) => {
  try {
    console.log(`🧹 Cleaning specific collections: ${collectionNames.join(', ')}`);
    
    await mongoose.connect(mongoUrl);
    console.log('✅ Connected to MongoDB');

    const collectionsMap = {
      'users': User,
      'owners': Owner,
      'forests': Forest,
      'trees': Tree,
      'auditlogs': AuditLog,
      'refreshtokens': RefreshToken
    };

    for (const collectionName of collectionNames) {
      const model = collectionsMap[collectionName.toLowerCase()];
      if (model) {
        console.log(`🗑️  Cleaning ${collectionName}...`);
        const result = await model.deleteMany({});
        console.log(`✅ Deleted ${result.deletedCount} documents from ${collectionName}`);
      } else {
        console.log(`⚠️  Unknown collection: ${collectionName}`);
      }
    }

    console.log('✅ Specific collection cleanup completed!');

  } catch (error) {
    console.error('❌ Error during specific collection cleanup:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('📴 Database connection closed');
  }
};

/**
 * Reset database to a specific state (e.g., keep users but remove forests/trees)
 * @param {Object} options - Cleanup options
 */
export const resetToState = async (options = {}) => {
  const {
    keepUsers = false,
    keepOwners = false,
    keepForests = false,
    keepTrees = false,
    keepAuditLogs = false
  } = options;

  try {
    console.log('🔄 Resetting database to specific state...');
    
    await mongoose.connect(mongoUrl);
    console.log('✅ Connected to MongoDB');

    // Clean in dependency order
    if (!keepTrees) {
      const treesDeleted = await Tree.deleteMany({});
      console.log(`🌳 Deleted ${treesDeleted.deletedCount} trees`);
    }

    if (!keepForests) {
      const forestsDeleted = await Forest.deleteMany({});
      console.log(`🌲 Deleted ${forestsDeleted.deletedCount} forests`);
    }

    if (!keepAuditLogs) {
      const auditLogsDeleted = await AuditLog.deleteMany({});
      console.log(`📋 Deleted ${auditLogsDeleted.deletedCount} audit logs`);
    }

    if (!keepUsers) {
      const refreshTokensDeleted = await RefreshToken.deleteMany({});
      const usersDeleted = await User.deleteMany({});
      console.log(`👥 Deleted ${usersDeleted.deletedCount} users and ${refreshTokensDeleted.deletedCount} tokens`);
    }

    if (!keepOwners) {
      const ownersDeleted = await Owner.deleteMany({});
      console.log(`🏢 Deleted ${ownersDeleted.deletedCount} owners`);
    }

    console.log('✅ Database reset completed!');

  } catch (error) {
    console.error('❌ Error during database reset:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('📴 Database connection closed');
  }
};

// Run cleanup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Running database cleanup...');
  
  // Check for command line arguments
  const args = process.argv.slice(2);
  
  if (args.includes('--specific') && args.length > 1) {
    // Clean specific collections
    const collections = args.filter(arg => arg !== '--specific');
    cleanSpecificCollections(collections)
      .then(() => process.exit(0))
      .catch((error) => {
        console.error('Failed to clean specific collections:', error);
        process.exit(1);
      });
  } else if (args.includes('--keep-users')) {
    // Reset but keep users
    resetToState({ keepUsers: true, keepOwners: true })
      .then(() => process.exit(0))
      .catch((error) => {
        console.error('Failed to reset database:', error);
        process.exit(1);
      });
  } else {
    // Full cleanup
    cleanDatabase()
      .then(() => process.exit(0))
      .catch((error) => {
        console.error('Failed to clean database:', error);
        process.exit(1);
      });
  }
}

export default cleanDatabase;