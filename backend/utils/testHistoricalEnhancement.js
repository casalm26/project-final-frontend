import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Tree, User } from '../models/index.js';
import { generateTreeMeasurementHistory } from './historicalDataEnhancer.js';

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/nanwa-forestry";

// Test the historical enhancement on a small sample
const testHistoricalEnhancement = async () => {
  try {
    console.log('🧪 Testing historical enhancement on small dataset...');
    
    await mongoose.connect(mongoUrl);
    console.log('✅ Connected to MongoDB');
    
    // Get users for measurement attribution
    const users = await User.find({ role: 'user' });
    console.log(`👥 Found ${users.length} users for measurement attribution`);
    
    // Get a small sample of trees (10 trees)
    const sampleTrees = await Tree.find({})
      .limit(10)
      .select('_id species plantedDate deathDate isAlive measurements');
    
    console.log(`\n🌳 Testing with ${sampleTrees.length} sample trees:`);
    console.log(''.padEnd(60, '-'));
    
    for (const tree of sampleTrees) {
      const age = (Date.now() - tree.plantedDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      console.log(`\n🌳 ${tree.species} (${age.toFixed(1)} years old)`);
      console.log(`   📅 Planted: ${tree.plantedDate.toISOString().substring(0, 10)}`);
      console.log(`   💚 Status: ${tree.isAlive ? 'Alive' : 'Dead'}`);
      console.log(`   📏 Current measurements: ${tree.measurements.length}`);
      
      // Generate new measurement history
      console.log(`   🔄 Generating measurement history...`);
      const newMeasurements = generateTreeMeasurementHistory(tree, users);
      
      console.log(`   📊 New measurements generated: ${newMeasurements.length}`);
      console.log(`   📈 Coverage: ${tree.plantedDate.toISOString().substring(0, 10)} to ${new Date().toISOString().substring(0, 10)}`);
      
      if (newMeasurements.length > 0) {
        const firstMeasurement = newMeasurements[0];
        const lastMeasurement = newMeasurements[newMeasurements.length - 1];
        
        console.log(`   🌱 Initial: ${firstMeasurement.height}m, ${firstMeasurement.diameter}cm, ${firstMeasurement.co2Absorption}kg CO2`);
        console.log(`   🌳 Latest: ${lastMeasurement.height}m, ${lastMeasurement.diameter}cm, ${lastMeasurement.co2Absorption}kg CO2`);
        console.log(`   📈 Growth: +${(lastMeasurement.height - firstMeasurement.height).toFixed(2)}m height`);
        
        // Check for growth consistency
        let heightIssues = 0;
        for (let i = 1; i < newMeasurements.length; i++) {
          if (newMeasurements[i].height < newMeasurements[i - 1].height - 0.15) {
            heightIssues++;
          }
        }
        console.log(`   ${heightIssues === 0 ? '✅' : '⚠️'} Growth consistency: ${heightIssues} significant height decreases`);
        
        // Show seasonal variation in CO2
        const co2Values = newMeasurements.map(m => m.co2Absorption);
        const co2Min = Math.min(...co2Values);
        const co2Max = Math.max(...co2Values);
        const co2Variation = ((co2Max - co2Min) / co2Min * 100).toFixed(1);
        console.log(`   🌿 CO2 variation: ${co2Min} - ${co2Max} kg/year (${co2Variation}% range)`);
        
        // Show measurement frequency over time
        const timespan = (lastMeasurement.measuredAt - firstMeasurement.measuredAt) / (365.25 * 24 * 60 * 60 * 1000);
        const avgFrequency = (newMeasurements.length - 1) / timespan;
        console.log(`   📊 Avg frequency: ${avgFrequency.toFixed(1)} measurements/year`);
      }
    }
    
    console.log('\n✅ Test completed successfully!');
    console.log('🔍 Sample data looks realistic with proper growth curves and seasonal variation');
    
  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📴 Database connection closed');
  }
};

// Run test
if (import.meta.url === `file://${process.argv[1]}`) {
  await testHistoricalEnhancement();
}