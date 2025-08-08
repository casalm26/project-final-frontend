import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Forest, Tree, Owner } from '../models/index.js';

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/nanwa-forestry";

// Schema-compliant Owner data (5 organizations)
const ownerData = [
  {
    name: 'Swedish Forest Authority',
    organizationType: 'government',
    contactInfo: {
      email: 'info@sfa.se',
      phone: '+46 36-15 56 00',
      address: 'Vallgatan 8, 551 83 Jönköping, Sweden',
      website: 'https://www.skogsstyrelsen.se'
    },
    certifications: [{
      type: 'ISO14001',
      certificationNumber: 'ISO-14001-SFA-2023',
      issuedDate: new Date('2023-01-15'),
      expiryDate: new Date('2026-01-15'),
      issuingBody: 'Swedish Standards Institute',
      status: 'active'
    }],
    financials: {
      annualRevenue: 2500000000, // 2.5 billion SEK
      totalForestValue: 15000000000, // 15 billion SEK
      currency: 'SEK'
    },
    sustainabilityGoals: {
      carbonNeutralTarget: new Date('2030-12-31'),
      reforestationCommitment: {
        treesPerYear: 50000,
        hectaresPerYear: 200,
        startYear: 2023,
        endYear: 2030
      },
      communityEngagement: {
        localEmployees: 450,
        educationPrograms: 25,
        publicAccessAreas: 180
      }
    },
    managementApproach: {
      primaryObjective: 'mixed_use', // Required field, valid enum value
      harvestingMethod: 'selective_harvest'
    },
    establishedDate: new Date('1948-07-01'),
    description: 'Sweden\'s national forest authority responsible for sustainable forest management and conservation.'
  },
  
  {
    name: 'Nordic Timber Corporation',
    organizationType: 'private_company',
    contactInfo: {
      email: 'forests@nordictimber.com',
      phone: '+46 40-123 4567',
      address: 'Hamngatan 2, 211 22 Malmö, Sweden',
      website: 'https://www.nordictimber.se'
    },
    certifications: [{
      type: 'FSC',
      certificationNumber: 'FSC-C123456',
      issuedDate: new Date('2022-03-10'),
      expiryDate: new Date('2027-03-10'),
      issuingBody: 'Forest Stewardship Council',
      status: 'active'
    }],
    financials: {
      annualRevenue: 890000000, // 890 million SEK
      totalForestValue: 3200000000, // 3.2 billion SEK
      currency: 'SEK'
    },
    sustainabilityGoals: {
      reforestationCommitment: {
        treesPerYear: 25000,
        hectaresPerYear: 80,
        startYear: 2023,
        endYear: 2035
      },
      communityEngagement: {
        localEmployees: 180,
        educationPrograms: 8,
        publicAccessAreas: 45
      }
    },
    managementApproach: {
      primaryObjective: 'timber_production',
      harvestingMethod: 'clear_cut'
    },
    establishedDate: new Date('1987-05-15'),
    description: 'Leading Scandinavian timber company focused on sustainable forest management.'
  },
  
  {
    name: 'Green Forest Initiative',
    organizationType: 'ngo',
    contactInfo: {
      email: 'contact@greenforest.org',
      phone: '+46 8-555 1234',
      address: 'Storgatan 15, 111 51 Stockholm, Sweden',
      website: 'https://www.greenforest.org'
    },
    certifications: [{
      type: 'ISO14001',
      certificationNumber: 'ISO-14001-GFI-2023',
      issuedDate: new Date('2023-06-01'),
      expiryDate: new Date('2026-06-01'),
      issuingBody: 'Swedish Standards Institute',
      status: 'active'
    }],
    financials: {
      annualRevenue: 45000000, // 45 million SEK
      totalForestValue: 180000000, // 180 million SEK
      currency: 'SEK'
    },
    sustainabilityGoals: {
      carbonNeutralTarget: new Date('2025-12-31'),
      reforestationCommitment: {
        treesPerYear: 15000,
        hectaresPerYear: 30,
        startYear: 2020,
        endYear: 2030
      },
      communityEngagement: {
        localEmployees: 25,
        educationPrograms: 45,
        publicAccessAreas: 85
      }
    },
    managementApproach: {
      primaryObjective: 'conservation',
      harvestingMethod: 'continuous_cover'
    },
    establishedDate: new Date('1995-03-22'),
    description: 'Environmental NGO dedicated to forest conservation and biodiversity research.'
  },
  
  {
    name: 'Småland Forest Cooperative',
    organizationType: 'cooperative',
    contactInfo: {
      email: 'info@smalandforest.se',
      phone: '+46 470-25 30 00',
      address: 'Växjövägen 45, 351 04 Växjö, Sweden',
      website: 'https://www.smalandforest.se'
    },
    certifications: [{
      type: 'PEFC',
      certificationNumber: 'PEFC-SMF-2023',
      issuedDate: new Date('2023-02-20'),
      expiryDate: new Date('2028-02-20'),
      issuingBody: 'PEFC Sweden',
      status: 'active'
    }],
    financials: {
      annualRevenue: 120000000, // 120 million SEK
      totalForestValue: 580000000, // 580 million SEK
      currency: 'SEK'
    },
    sustainabilityGoals: {
      reforestationCommitment: {
        treesPerYear: 12000,
        hectaresPerYear: 35,
        startYear: 2022,
        endYear: 2032
      },
      communityEngagement: {
        localEmployees: 85,
        educationPrograms: 12,
        publicAccessAreas: 28
      }
    },
    managementApproach: {
      primaryObjective: 'mixed_use',
      harvestingMethod: 'shelterwood'
    },
    establishedDate: new Date('1962-11-08'),
    description: 'Forest cooperative representing 450 small-scale forest owners in Småland region.'
  },
  
  {
    name: 'Norrland Research Forests',
    organizationType: 'individual',
    contactInfo: {
      email: 'research@norrlandforests.se',
      phone: '+46 90-786 9000',
      address: 'Universitetsområdet, 901 87 Umeå, Sweden',
      website: 'https://www.norrlandresearch.se'
    },
    certifications: [{
      type: 'FSC',
      certificationNumber: 'FSC-NRF-2023',
      issuedDate: new Date('2023-08-10'),
      expiryDate: new Date('2028-08-10'),
      issuingBody: 'Forest Stewardship Council',
      status: 'active'
    }],
    financials: {
      annualRevenue: 35000000, // 35 million SEK
      totalForestValue: 220000000, // 220 million SEK
      currency: 'SEK'
    },
    sustainabilityGoals: {
      carbonNeutralTarget: new Date('2028-12-31'),
      reforestationCommitment: {
        treesPerYear: 8000,
        hectaresPerYear: 15,
        startYear: 2023,
        endYear: 2033
      },
      communityEngagement: {
        localEmployees: 35,
        educationPrograms: 20,
        publicAccessAreas: 15
      }
    },
    managementApproach: {
      primaryObjective: 'carbon_sequestration',
      harvestingMethod: 'continuous_cover'
    },
    establishedDate: new Date('2010-01-15'),
    description: 'Research-focused forest management organization studying climate change impacts.'
  }
];

// Schema-compliant User data with owner relationships
const userData = [
  // Admin user - no owner (can access all data)
  {
    email: 'admin@nanwa.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    owner: null
  },
  // Swedish Forest Authority users
  {
    email: 'lars.anderson@sfa.se',
    password: 'User123!',
    firstName: 'Lars',
    lastName: 'Anderson',
    role: 'user'
  },
  {
    email: 'eva.lindqvist@sfa.se',
    password: 'User123!',
    firstName: 'Eva',
    lastName: 'Lindqvist',
    role: 'user'
  },
  // Nordic Timber users
  {
    email: 'erik.johansson@nordictimber.com',
    password: 'User123!',
    firstName: 'Erik',
    lastName: 'Johansson',
    role: 'user'
  },
  {
    email: 'anna.svensson@nordictimber.com',
    password: 'User123!',
    firstName: 'Anna',
    lastName: 'Svensson',
    role: 'user'
  },
  // Green Forest Initiative users
  {
    email: 'maria.berg@greenforest.org',
    password: 'User123!',
    firstName: 'Maria',
    lastName: 'Berg',
    role: 'user'
  },
  {
    email: 'olof.karlsson@greenforest.org',
    password: 'User123!',
    firstName: 'Olof',
    lastName: 'Karlsson',
    role: 'user'
  },
  // Småland Forest Cooperative users
  {
    email: 'per.nilsson@smalandforest.se',
    password: 'User123!',
    firstName: 'Per',
    lastName: 'Nilsson',
    role: 'user'
  },
  // Norrland Research Forests users
  {
    email: 'astrid.holm@norrlandresearch.se',
    password: 'User123!',
    firstName: 'Astrid',
    lastName: 'Holm',
    role: 'user'
  }
];

// Swedish regions with valid coordinates
const swedishRegions = [
  { name: 'Norrbotten', coords: [20.2253, 67.8558], climate: 'boreal' },
  { name: 'Västerbotten', coords: [17.9348, 64.7506], climate: 'boreal' },
  { name: 'Jämtland', coords: [14.6357, 63.1781], climate: 'continental' },
  { name: 'Västernorrland', coords: [17.3063, 62.6315], climate: 'continental' },
  { name: 'Gävleborg', coords: [16.5842, 61.1739], climate: 'continental' },
  { name: 'Dalarna', coords: [14.5511, 60.6749], climate: 'continental' },
  { name: 'Värmland', coords: [13.4615, 59.3875], climate: 'temperate' },
  { name: 'Örebro', coords: [15.2066, 59.2741], climate: 'temperate' },
  { name: 'Uppsala', coords: [17.6389, 59.8586], climate: 'temperate' },
  { name: 'Stockholm', coords: [18.0686, 59.3293], climate: 'temperate' },
  { name: 'Småland', coords: [15.0000, 57.0000], climate: 'temperate' },
  { name: 'Skåne', coords: [13.3809, 55.6761], climate: 'oceanic' }
];

// Generate forest data with valid enum values
const generateForestData = (owner, index) => {
  const region = swedishRegions[index % swedishRegions.length];
  const isPlantation = Math.random() > 0.6;
  
  return {
    name: `${region.name} ${isPlantation ? 'Plantation' : 'Forest'} ${index + 1}`,
    region: region.name,
    owner: owner._id, // Required ObjectId reference
    isPlantation: isPlantation, // Required boolean
    location: {
      type: 'Point', // Required enum value
      coordinates: [
        region.coords[0] + (Math.random() - 0.5) * 0.5,
        region.coords[1] + (Math.random() - 0.5) * 0.5
      ] // Required coordinates array
    },
    area: 50 + Math.random() * 200, // Required positive number
    areaUnit: 'hectares', // Valid enum value
    establishedDate: new Date(2000 + Math.floor(Math.random() * 24), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1), // Required date
    description: `${isPlantation ? 'Managed plantation' : 'Natural forest'} in ${region.name} region with sustainable management practices.`,
    
    // Optional but properly structured fields
    financials: {
      acquisitionCost: (200 + Math.random() * 800) * 1000,
      currentValue: (500 + Math.random() * 1500) * 1000,
      currency: 'SEK',
      maintenanceBudget: {
        annual: 50000 + Math.random() * 150000,
        allocated: 40000 + Math.random() * 120000,
        spent: 30000 + Math.random() * 100000
      }
    },
    
    biodiversity: {
      biodiversityIndex: isPlantation ? 40 + Math.random() * 30 : 60 + Math.random() * 35,
      lastSurveyDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    },
    
    environmental: {
      fireRisk: {
        current: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)], // Valid enum value
        lastAssessment: new Date(2023, Math.floor(Math.random() * 12), 1)
      },
      soilHealth: {
        phLevel: 5.0 + Math.random() * 2.5, // Valid pH range
        organicMatter: 2 + Math.random() * 8,
        compaction: ['low', 'moderate'][Math.floor(Math.random() * 2)], // Valid enum value
        erosionRisk: ['low', 'moderate'][Math.floor(Math.random() * 2)], // Valid enum value
        lastTested: new Date(2023, Math.floor(Math.random() * 12), 1)
      }
    },
    
    carbonMetrics: {
      totalCarbonStored: (100 + Math.random() * 400) * 1000,
      annualSequestration: 50 + Math.random() * 150,
      carbonCredits: {
        issued: Math.floor(Math.random() * 800),
        sold: Math.floor(Math.random() * 400),
        available: Math.floor(Math.random() * 400),
        pricePerCredit: 15 + Math.random() * 20
      },
      lastCalculation: new Date(2023, 11, 1),
      calculationMethod: 'Swedish Forest Agency Standard'
    },
    
    metadata: {
      soilType: ['clay', 'loam', 'sand', 'peat', 'rocky', 'mixed'][Math.floor(Math.random() * 6)], // Valid enum value
      climate: region.climate, // Valid enum value (temperate, continental, oceanic, boreal)
      elevation: 50 + Math.random() * 200,
      avgRainfall: 400 + Math.random() * 300,
      avgTemperature: region.climate === 'boreal' ? -2 + Math.random() * 8 : 
                     region.climate === 'continental' ? 2 + Math.random() * 8 :
                     6 + Math.random() * 6,
      growingSeason: {
        startMonth: region.climate === 'boreal' ? 5 : 4,
        endMonth: region.climate === 'boreal' ? 9 : 10,
        lengthDays: region.climate === 'boreal' ? 120 : 180
      },
      dominantSpecies: isPlantation ? 
        ['Scots Pine', 'Norway Spruce'] :
        ['Scots Pine', 'Norway Spruce', 'Silver Birch'],
      forestAge: isPlantation ? 'young' : ['mature', 'mixed_age'][Math.floor(Math.random() * 2)], // Valid enum value
      managementIntensity: owner.organizationType === 'private_company' ? 'intensive' :
                           owner.organizationType === 'ngo' ? 'minimal' : 'moderate' // Valid enum value
    }
  };
};

// Generate tree data with valid enum values
const generateTreeData = (forest, treeIndex, users) => {
  const swedishSpecies = ['Scots Pine', 'Norway Spruce', 'Silver Birch', 'Downy Birch', 'European Aspen'];
  const species = swedishSpecies[Math.floor(Math.random() * swedishSpecies.length)];
  const plantedDate = new Date(Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000); // 0-5 years ago
  const isAlive = Math.random() > 0.1; // 90% survival rate
  const user = users[Math.floor(Math.random() * users.length)];
  
  const tree = {
    treeId: `${forest.name.toUpperCase().replace(/[\s\-]/g, '')}-${String(treeIndex + 1).padStart(4, '0')}`, // Required unique string
    forestId: forest._id, // Required ObjectId reference
    species: species, // Required string
    location: {
      type: 'Point', // Required enum value
      coordinates: [
        forest.location.coordinates[0] + (Math.random() - 0.5) * 0.002,
        forest.location.coordinates[1] + (Math.random() - 0.5) * 0.002
      ] // Required coordinates array
    },
    plantedDate: plantedDate, // Required date
    isAlive: isAlive,
    
    // Optional but properly structured fields
    genetics: {
      geneticDiversity: ['native', 'improved'][Math.floor(Math.random() * 2)], // Valid enum value
      provenanceRegion: forest.region
    },
    
    growthModel: {
      expectedHeightAt15Years: 12 + Math.random() * 8, // Positive number
      expectedDiameterAt15Years: 25 + Math.random() * 15, // Positive number
      growthRate: ['moderate', 'fast'][Math.floor(Math.random() * 2)], // Valid enum value
      siteIndex: Math.floor(15 + Math.random() * 20) // Valid range 0-50
    },
    
    economicValue: {
      currentTimberValue: Math.floor(500 + Math.random() * 1500), // Positive number
      carbonCreditValue: Math.floor(50 + Math.random() * 200) // Positive number
    },
    
    canopy: {
      diameter: Math.round((2 + Math.random() * 8) * 10) / 10, // Positive number
      area: Math.round((3 + Math.random() * 20) * 10) / 10, // Positive number
      density: ['moderate', 'dense'][Math.floor(Math.random() * 2)], // Valid enum value
      condition: isAlive ? ['excellent', 'good', 'fair'][Math.floor(Math.random() * 3)] : 'dead' // Valid enum value
    },
    
    ecologicalBenefits: {
      stormwaterIntercepted: {
        gallons: Math.round((5 + Math.random() * 20) * 100) / 100, // Positive number
        value: Math.round((0.05 + Math.random() * 0.2) * 100) / 100 // Positive number
      },
      co2Sequestered: {
        pounds: Math.round((10 + Math.random() * 40) * 100) / 100, // Positive number
        value: Math.round((0.2 + Math.random() * 0.8) * 100) / 100 // Positive number
      },
      co2Stored: {
        pounds: Math.round((50 + Math.random() * 200) * 100) / 100, // Positive number
        value: Math.round((1 + Math.random() * 4) * 100) / 100 // Positive number
      },
      airPollutantsRemoved: {
        pounds: Math.round((2 + Math.random() * 8) * 100) / 100, // Positive number
        value: Math.round((9 + Math.random() * 36) * 100) / 100 // Positive number
      }
    },
    
    environmentalFactors: {
      microclimate: {
        windExposure: ['sheltered', 'moderate'][Math.floor(Math.random() * 2)] // Valid enum value
      },
      siteConditions: {
        slope: ['flat', 'gentle', 'moderate'][Math.floor(Math.random() * 3)], // Valid enum value
        aspect: ['north', 'south', 'east', 'west'][Math.floor(Math.random() * 4)], // Valid enum value
        drainage: ['well_drained', 'moderately_drained', 'poorly_drained'][Math.floor(Math.random() * 3)], // Valid enum value
        competitionIndex: Math.floor(Math.random() * 8) + 2 // Valid range 0-10
      },
      forestPosition: ['canopy', 'understory', 'dominant', 'co_dominant'][Math.floor(Math.random() * 4)] // Valid enum value
    },
    
    measurements: [{
      height: Math.round((1 + Math.random() * 4) * 100) / 100,
      diameter: Math.round((2 + Math.random() * 15) * 10) / 10,
      co2Absorption: Math.round((5 + Math.random() * 20) * 100) / 100,
      healthStatus: isAlive ? ['excellent', 'good', 'fair'][Math.floor(Math.random() * 3)] : 'poor',
      measuredBy: user._id,
      measuredAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Within last 30 days
    }],
    
    metadata: {
      soilCondition: ['excellent', 'good', 'moderate'][Math.floor(Math.random() * 3)], // Valid enum value
      sunlightExposure: ['full_sun', 'partial_sun'][Math.floor(Math.random() * 2)], // Valid enum value
      waterAccess: ['excellent', 'good', 'moderate'][Math.floor(Math.random() * 3)], // Valid enum value
      plantingMethod: forest.isPlantation ? 
        ['hand_planted', 'machine_planted'][Math.floor(Math.random() * 2)] :
        'natural_regeneration', // Valid enum value
      managementObjective: ['timber', 'conservation', 'mixed'][Math.floor(Math.random() * 3)] // Valid enum value
    }
  };
  
  if (!isAlive) {
    tree.deathDate = new Date(plantedDate.getTime() + Math.random() * (Date.now() - plantedDate.getTime()));
    tree.deathCause = ['disease', 'storm', 'drought'][Math.floor(Math.random() * 3)];
  }
  
  return tree;
};

// Main seeding function
const seedWorkingDatabase = async () => {
  try {
    console.log('🌱 Starting schema-compliant database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(mongoUrl);
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Owner.deleteMany({});
    await Forest.deleteMany({});
    await Tree.deleteMany({});
    console.log('✅ Database cleared');
    
    // Create owners
    console.log('🏢 Creating 5 owners...');
    const owners = await Owner.create(ownerData);
    console.log(`✅ Created ${owners.length} owners`);
    
    // Create users with owner relationships
    console.log('👥 Creating users...');
    const usersWithOwners = userData.map((user, index) => {
      if (user.email === 'admin@nanwa.com') {
        return user; // Admin has no owner
      }
      // Assign users to owners (2 users per owner)
      const ownerIndex = Math.floor((index - 1) / 2);
      return {
        ...user,
        owner: owners[ownerIndex % owners.length]._id
      };
    });
    
    const users = await User.create(usersWithOwners);
    console.log(`✅ Created ${users.length} users`);
    console.log(`   🔹 Admin users: ${users.filter(u => u.role === 'admin').length}`);
    console.log(`   🔹 Regular users: ${users.filter(u => u.role === 'user').length}`);
    
    // Create forests
    console.log('🌲 Creating forests...');
    const forestsData = [];
    
    // Create 4 forests per owner = 20 total forests
    for (let i = 0; i < owners.length; i++) {
      for (let j = 0; j < 4; j++) {
        const forestData = generateForestData(owners[i], i * 4 + j);
        forestsData.push(forestData);
      }
    }
    
    const forests = await Forest.create(forestsData);
    console.log(`✅ Created ${forests.length} forests`);
    
    // Create trees
    console.log('🌳 Creating trees...');
    let totalTrees = 0;
    
    for (let i = 0; i < forests.length; i++) {
      const forest = forests[i];
      const treeCount = 10 + Math.floor(Math.random() * 10); // 10-20 trees per forest
      
      console.log(`  🌳 Creating ${treeCount} trees for ${forest.name}...`);
      
      const treesData = [];
      for (let j = 0; j < treeCount; j++) {
        const treeData = generateTreeData(forest, j, users);
        treesData.push(treeData);
      }
      
      await Tree.create(treesData);
      totalTrees += treesData.length;
    }
    
    console.log(`✅ Created ${totalTrees.toLocaleString()} trees`);
    
    // Display summary
    console.log('\n📊 Seeding Summary:');
    console.log('=====================================');
    console.log(`🏢 Owners: ${owners.length}`);
    console.log(`👥 Users: ${users.length}`);
    console.log(`🌲 Forests: ${forests.length}`);
    console.log(`🌳 Trees: ${totalTrees.toLocaleString()}`);
    
    console.log('\n🔐 Test Credentials:');
    console.log('=====================================');
    console.log('🔑 Admin (sees ALL data):');
    console.log('   Email: admin@nanwa.com');
    console.log('   Password: admin123');
    
    console.log('\n👥 Owner-specific users (see only their org data):');
    for (let i = 0; i < owners.length; i++) {
      const ownerUsers = users.filter(u => u.owner && u.owner.toString() === owners[i]._id.toString());
      if (ownerUsers.length > 0) {
        console.log(`\n   🏢 ${owners[i].name}:`);
        ownerUsers.forEach(user => {
          console.log(`     📧 ${user.email} / User123!`);
        });
      }
    }
    
    console.log('\n🎉 Schema-compliant seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    if (error.errors) {
      console.log('\n📝 Validation errors:');
      Object.entries(error.errors).forEach(([field, err]) => {
        console.log(`   • ${field}: ${err.message}`);
      });
    }
  } finally {
    await mongoose.connection.close();
    console.log('📴 Database connection closed');
    process.exit(0);
  }
};

// Run seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedWorkingDatabase();
}

export default seedWorkingDatabase;