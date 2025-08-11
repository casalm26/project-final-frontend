import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Forest, Tree } from '../models/index.js';

dotenv.config();

const populateEnhancedMetrics = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Update all forests with sample financial and environmental data
    const forests = await Forest.find({});
    console.log(`Found ${forests.length} forests to update`);

    for (const forest of forests) {
      // Add financial data if missing
      if (!forest.financials || !forest.financials.currentValue) {
        forest.financials = {
          acquisitionCost: Math.floor(Math.random() * 5000000) + 1000000, // 1M - 6M SEK
          acquisitionDate: new Date(2020, 0, 1),
          currentValue: Math.floor(Math.random() * 7000000) + 1500000, // 1.5M - 8.5M SEK
          lastValuationDate: new Date(),
          currency: 'SEK',
          maintenanceBudget: {
            annual: Math.floor(Math.random() * 500000) + 100000,
            allocated: Math.floor(Math.random() * 400000) + 80000,
            spent: Math.floor(Math.random() * 300000) + 50000
          }
        };
      }

      // Add carbon metrics if missing
      if (!forest.carbonMetrics || !forest.carbonMetrics.totalCarbonStored) {
        forest.carbonMetrics = {
          totalCarbonStored: Math.floor(Math.random() * 10000) + 1000, // tons
          annualSequestration: Math.floor(Math.random() * 500) + 50,
          carbonCredits: {
            issued: Math.floor(Math.random() * 1000) + 100,
            sold: Math.floor(Math.random() * 500),
            available: Math.floor(Math.random() * 500) + 100,
            pricePerCredit: Math.floor(Math.random() * 500) + 100 // 100-600 SEK
          },
          lastCalculation: new Date(),
          calculationMethod: 'IPCC Standard'
        };
      }

      // Add biodiversity data if missing
      if (!forest.biodiversity || !forest.biodiversity.biodiversityIndex) {
        forest.biodiversity = {
          biodiversityIndex: Math.floor(Math.random() * 60) + 40, // 40-100
          species: [
            {
              name: 'Pine',
              scientificName: 'Pinus sylvestris',
              category: 'flora',
              count: Math.floor(Math.random() * 1000) + 100,
              conservationStatus: 'common'
            },
            {
              name: 'Spruce',
              scientificName: 'Picea abies',
              category: 'flora',
              count: Math.floor(Math.random() * 800) + 100,
              conservationStatus: 'common'
            },
            {
              name: 'Brown Bear',
              scientificName: 'Ursus arctos',
              category: 'fauna',
              count: Math.floor(Math.random() * 5) + 1,
              conservationStatus: 'rare'
            }
          ],
          lastSurveyDate: new Date()
        };
      }

      // Add environmental data if missing
      if (!forest.environmental || !forest.environmental.fireRisk) {
        const riskLevels = ['low', 'moderate', 'high', 'extreme'];
        forest.environmental = {
          fireRisk: {
            current: riskLevels[Math.floor(Math.random() * riskLevels.length)],
            lastAssessment: new Date(),
            mitigationMeasures: ['Firebreaks maintained', 'Regular monitoring', 'Water sources mapped']
          },
          soilHealth: {
            phLevel: Math.random() * 2 + 5.5, // 5.5 - 7.5
            organicMatter: Math.random() * 5 + 2, // 2-7%
            compaction: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)],
            erosionRisk: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)],
            lastTested: new Date()
          }
        };
      }

      await forest.save();
      console.log(`Updated forest: ${forest.name}`);
    }

    // Update trees with economic value data
    const trees = await Tree.find({}).limit(1000); // Update first 1000 trees
    console.log(`Found ${trees.length} trees to update`);

    for (const tree of trees) {
      // Add economic value if missing
      if (!tree.economicValue || !tree.economicValue.currentTimberValue) {
        tree.economicValue = {
          currentTimberValue: Math.floor(Math.random() * 5000) + 500, // 500-5500 SEK per tree
          carbonCreditValue: Math.floor(Math.random() * 200) + 50, // 50-250 SEK
          lastValuation: new Date(),
          valuationMethod: 'Market-based',
          marketPricePerCubicMeter: Math.floor(Math.random() * 200) + 400 // 400-600 SEK/m³
        };
      }

      // Ensure latest measurement has health status
      if (tree.measurements && tree.measurements.length > 0) {
        const latestMeasurement = tree.measurements[tree.measurements.length - 1];
        if (!latestMeasurement.healthStatus) {
          const healthStatuses = ['excellent', 'good', 'fair', 'poor', 'critical'];
          // Weighted towards good health
          const weights = [0.2, 0.4, 0.25, 0.1, 0.05];
          const random = Math.random();
          let sum = 0;
          for (let i = 0; i < weights.length; i++) {
            sum += weights[i];
            if (random < sum) {
              latestMeasurement.healthStatus = healthStatuses[i];
              break;
            }
          }
        }
      }

      await tree.save();
    }

    console.log('✅ Successfully populated enhanced metrics');
    console.log(`Updated ${forests.length} forests and ${trees.length} trees`);

  } catch (error) {
    console.error('Error populating enhanced metrics:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
populateEnhancedMetrics();