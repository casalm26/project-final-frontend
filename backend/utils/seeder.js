import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Forest, Tree } from '../models/index.js';

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/nanwa-forestry";

const sampleUsers = [
  {
    email: 'admin@nanwa.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  },
  {
    email: 'user@nanwa.com',
    password: 'user123',
    firstName: 'Regular',
    lastName: 'User',
    role: 'user'
  },
  {
    email: 'john@example.com',
    password: 'User123!',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user'
  },
  {
    email: 'jane@example.com',
    password: 'User123!',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'user'
  }
];

const sampleForests = [
  {
    name: 'Greenwood Forest',
    region: 'Northern Sweden',
    location: {
      type: 'Point',
      coordinates: [18.0686, 59.3293] // Stockholm coordinates
    },
    area: 150.5,
    areaUnit: 'hectares',
    establishedDate: new Date('2020-03-15'),
    description: 'A sustainable pine forest focused on carbon absorption and biodiversity.',
    metadata: {
      soilType: 'Clay-loam',
      climate: 'Temperate',
      elevation: 120,
      avgRainfall: 580,
      avgTemperature: 8.5
    }
  },
  {
    name: 'Birchwood Reserve',
    region: 'Central Sweden',
    location: {
      type: 'Point',
      coordinates: [15.2134, 58.5877] // Linköping coordinates
    },
    area: 89.2,
    areaUnit: 'hectares',
    establishedDate: new Date('2019-05-20'),
    description: 'Mixed birch and spruce forest for ecological research.',
    metadata: {
      soilType: 'Sandy-loam',
      climate: 'Continental',
      elevation: 95,
      avgRainfall: 640,
      avgTemperature: 7.2
    }
  },
  {
    name: 'Oakwood Valley',
    region: 'Southern Sweden',
    location: {
      type: 'Point',
      coordinates: [13.1913, 55.7047] // Malmö coordinates
    },
    area: 234.7,
    areaUnit: 'hectares',
    establishedDate: new Date('2018-09-10'),
    description: 'Ancient oak forest preservation area with native species.',
    metadata: {
      soilType: 'Loam',
      climate: 'Oceanic',
      elevation: 65,
      avgRainfall: 720,
      avgTemperature: 9.8
    }
  }
];

const generateTreesForForest = (forestId, forestName, count = 50) => {
  const trees = [];
  const species = ['Pine', 'Spruce', 'Birch', 'Oak', 'Fir'];
  
  for (let i = 1; i <= count; i++) {
    const plantedDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 4); // Random date within last 4 years
    const isAlive = Math.random() > 0.05; // 95% survival rate
    
    const tree = {
      treeId: `${forestName.toUpperCase().replace(/\s+/g, '')}-${String(i).padStart(4, '0')}`,
      forestId,
      species: species[Math.floor(Math.random() * species.length)],
      location: {
        type: 'Point',
        coordinates: [
          18.0686 + (Math.random() - 0.5) * 0.01, // Random coordinates near Stockholm
          59.3293 + (Math.random() - 0.5) * 0.01
        ]
      },
      plantedDate,
      isAlive,
      measurements: generateMeasurements(plantedDate, isAlive),
      metadata: {
        soilCondition: ['excellent', 'good', 'moderate'][Math.floor(Math.random() * 3)],
        sunlightExposure: ['full_sun', 'partial_sun', 'partial_shade'][Math.floor(Math.random() * 3)],
        waterAccess: ['excellent', 'good', 'moderate'][Math.floor(Math.random() * 3)]
      }
    };
    
    if (!isAlive) {
      tree.deathDate = new Date(plantedDate.getTime() + Math.random() * (Date.now() - plantedDate.getTime()));
      tree.deathCause = ['disease', 'drought', 'pest', 'storm damage'][Math.floor(Math.random() * 4)];
    }
    
    trees.push(tree);
  }
  
  return trees;
};

const generateMeasurements = (plantedDate, isAlive) => {
  const measurements = [];
  const currentDate = new Date();
  const monthsPlanted = Math.floor((currentDate - plantedDate) / (1000 * 60 * 60 * 24 * 30));
  
  // Generate measurements every 3-6 months
  for (let month = 3; month <= monthsPlanted; month += Math.floor(Math.random() * 4) + 3) {
    const measurementDate = new Date(plantedDate.getTime() + month * 30 * 24 * 60 * 60 * 1000);
    
    if (!isAlive && measurementDate > currentDate) break;
    
    const height = Math.max(0.1, (month / 12) * (1.5 + Math.random() * 2)); // Growth over time
    const diameter = height * (0.1 + Math.random() * 0.05); // Proportional to height
    const co2Absorption = height * (0.5 + Math.random() * 0.3); // Proportional to size
    
    measurements.push({
      height: Math.round(height * 100) / 100,
      diameter: Math.round(diameter * 100) / 100,
      co2Absorption: Math.round(co2Absorption * 100) / 100,
      healthStatus: ['excellent', 'good', 'fair'][Math.floor(Math.random() * 3)],
      notes: Math.random() > 0.7 ? 'Regular growth observed' : undefined,
      measuredAt: measurementDate
    });
  }
  
  return measurements;
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(mongoUrl);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Forest.deleteMany({});
    await Tree.deleteMany({});
    
    // Create users
    console.log('👥 Creating users...');
    const users = await User.create(sampleUsers);
    console.log(`✅ Created ${users.length} users`);
    
    // Create forests
    console.log('🌲 Creating forests...');
    const forests = await Forest.create(sampleForests);
    console.log(`✅ Created ${forests.length} forests`);
    
    // Create trees for each forest
    console.log('🌳 Creating trees...');
    let totalTrees = 0;
    
    for (const forest of forests) {
      const trees = generateTreesForForest(forest._id, forest.name, 30);
      
      // Add measuredBy to measurements (use first user)
      trees.forEach(tree => {
        tree.measurements.forEach(measurement => {
          measurement.measuredBy = users[1]._id; // Use regular user
        });
      });
      
      await Tree.create(trees);
      totalTrees += trees.length;
      console.log(`✅ Created ${trees.length} trees for ${forest.name}`);
    }
    
    console.log(`🎉 Database seeding completed successfully!`);
    console.log(`📊 Summary:`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Forests: ${forests.length}`);
    console.log(`   - Trees: ${totalTrees}`);
    console.log(`\n🔐 Mock Credentials (Frontend Compatible):`);
    console.log(`   Admin: admin@nanwa.com / admin123`);
    console.log(`   User:  user@nanwa.com / user123`);
    console.log(`\n👤 Additional User Credentials:`);
    console.log(`   John:  john@example.com / User123!`);
    console.log(`   Jane:  jane@example.com / User123!`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📴 Database connection closed');
    process.exit(0);
  }
};

// Run seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;