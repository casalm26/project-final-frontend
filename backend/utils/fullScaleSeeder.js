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
      annualRevenue: 2500000000,
      totalForestValue: 15000000000,
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
      primaryObjective: 'mixed_use',
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
      annualRevenue: 890000000,
      totalForestValue: 3200000000,
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
      annualRevenue: 45000000,
      totalForestValue: 180000000,
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
      annualRevenue: 120000000,
      totalForestValue: 580000000,
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
      email: 'research@norrlandresearch.se',
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
      annualRevenue: 35000000,
      totalForestValue: 220000000,
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

// Enhanced User data for full scale
const userData = [
  // Admin user - no owner
  {
    email: 'admin@nanwa.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    owner: null
  },
  // Swedish Forest Authority users (3 users)
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
  {
    email: 'nils.berg@sfa.se',
    password: 'User123!',
    firstName: 'Nils',
    lastName: 'Berg',
    role: 'user'
  },
  // Nordic Timber users (2 users)
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
  // Green Forest Initiative users (2 users)
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
  // Småland Forest Cooperative users (2 users)
  {
    email: 'per.nilsson@smalandforest.se',
    password: 'User123!',
    firstName: 'Per',
    lastName: 'Nilsson',
    role: 'user'
  },
  {
    email: 'ingrid.holm@smalandforest.se',
    password: 'User123!',
    firstName: 'Ingrid',
    lastName: 'Holm',
    role: 'user'
  },
  // Norrland Research Forests users (2 users)
  {
    email: 'astrid.holm@norrlandresearch.se',
    password: 'User123!',
    firstName: 'Astrid',
    lastName: 'Holm',
    role: 'user'
  },
  {
    email: 'gunnar.sjoberg@norrlandresearch.se',
    password: 'User123!',
    firstName: 'Gunnar',
    lastName: 'Sjöberg',
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
  { name: 'Västmanland', coords: [16.5448, 59.6099], climate: 'temperate' },
  { name: 'Uppsala', coords: [17.6389, 59.8586], climate: 'temperate' },
  { name: 'Stockholm', coords: [18.0686, 59.3293], climate: 'temperate' },
  { name: 'Södermanland', coords: [16.9915, 58.9188], climate: 'temperate' },
  { name: 'Östergötland', coords: [15.6266, 58.4108], climate: 'temperate' },
  { name: 'Småland', coords: [15.0000, 57.0000], climate: 'temperate' },
  { name: 'Gotland', coords: [18.2648, 57.4682], climate: 'oceanic' },
  { name: 'Halland', coords: [12.8372, 56.6745], climate: 'oceanic' },
  { name: 'Skåne', coords: [13.3809, 55.6761], climate: 'oceanic' }
];

// Forest names for variety
const forestNames = [
  'Ancient Grove', 'Pine Ridge', 'Silver Creek', 'Woodland Reserve', 'Green Valley',
  'Oak Hill', 'Birch Hollow', 'Spruce Mountain', 'Cedar Point', 'Willow Marsh',
  'Fir Heights', 'Aspen Dell', 'Beech Woods', 'Maple Glen', 'Elm Park',
  'Alder Stream', 'Juniper Flats', 'Poplar Fields', 'Hemlock Slopes', 'Linden Grove'
];

// Generate forest data with variety
const generateForestData = (owner, ownerIndex, forestIndex) => {
  const region = swedishRegions[forestIndex % swedishRegions.length];
  const isPlantation = Math.random() > (owner.organizationType === 'ngo' ? 0.8 : 0.5);
  const baseName = forestNames[forestIndex % forestNames.length];
  
  return {
    name: `${region.name} ${baseName}`,
    region: region.name,
    owner: owner._id,
    isPlantation: isPlantation,
    location: {
      type: 'Point',
      coordinates: [
        region.coords[0] + (Math.random() - 0.5) * 1.0,
        region.coords[1] + (Math.random() - 0.5) * 0.5
      ]
    },
    area: 80 + Math.random() * 320, // 80-400 hectares
    areaUnit: 'hectares',
    establishedDate: new Date(1990 + Math.floor(Math.random() * 34), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    description: `${isPlantation ? 'Managed plantation' : 'Natural forest'} in ${region.name} region with sustainable management practices focused on ${owner.managementApproach.primaryObjective.replace('_', ' ')}.`,
    
    financials: {
      acquisitionCost: (300 + Math.random() * 1200) * 1000,
      currentValue: (600 + Math.random() * 2400) * 1000,
      currency: 'SEK',
      maintenanceBudget: {
        annual: 60000 + Math.random() * 240000,
        allocated: 50000 + Math.random() * 200000,
        spent: 40000 + Math.random() * 160000
      }
    },
    
    biodiversity: {
      biodiversityIndex: isPlantation ? 35 + Math.random() * 40 : 55 + Math.random() * 40,
      lastSurveyDate: new Date(2022 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    },
    
    environmental: {
      fireRisk: {
        current: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)],
        lastAssessment: new Date(2023, Math.floor(Math.random() * 12), 1),
        mitigationMeasures: ['Fire breaks', 'Water access points', 'Emergency response plan']
      },
      soilHealth: {
        phLevel: 5.0 + Math.random() * 3.0,
        organicMatter: 2 + Math.random() * 10,
        compaction: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)],
        erosionRisk: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)],
        lastTested: new Date(2023, Math.floor(Math.random() * 12), 1)
      }
    },
    
    carbonMetrics: {
      totalCarbonStored: (150 + Math.random() * 600) * 1000,
      annualSequestration: 60 + Math.random() * 240,
      carbonCredits: {
        issued: Math.floor(Math.random() * 1200),
        sold: Math.floor(Math.random() * 600),
        available: Math.floor(Math.random() * 600),
        pricePerCredit: 12 + Math.random() * 28
      },
      lastCalculation: new Date(2023, 10 + Math.floor(Math.random() * 2), 1),
      calculationMethod: 'Swedish Forest Agency Standard'
    },
    
    metadata: {
      soilType: ['clay', 'loam', 'sand', 'peat', 'rocky', 'mixed'][Math.floor(Math.random() * 6)],
      climate: region.climate,
      elevation: 40 + Math.random() * 260,
      avgRainfall: 350 + Math.random() * 450,
      avgTemperature: region.climate === 'boreal' ? -3 + Math.random() * 10 : 
                     region.climate === 'continental' ? 1 + Math.random() * 10 :
                     region.climate === 'oceanic' ? 5 + Math.random() * 8 : 4 + Math.random() * 8,
      growingSeason: {
        startMonth: region.climate === 'boreal' ? 5 : region.climate === 'continental' ? 4 : 3,
        endMonth: region.climate === 'boreal' ? 9 : region.climate === 'continental' ? 10 : 11,
        lengthDays: region.climate === 'boreal' ? 120 : region.climate === 'continental' ? 180 : 210
      },
      dominantSpecies: isPlantation ? 
        ['Scots Pine', 'Norway Spruce'] :
        ['Scots Pine', 'Norway Spruce', 'Silver Birch', 'Downy Birch'],
      forestAge: isPlantation ? 
        ['young', 'mature'][Math.floor(Math.random() * 2)] : 
        ['mature', 'old_growth', 'mixed_age'][Math.floor(Math.random() * 3)],
      managementIntensity: owner.organizationType === 'private_company' ? 'intensive' :
                           owner.organizationType === 'ngo' ? 'minimal' :
                           owner.organizationType === 'government' ? 'moderate' : 'extensive'
    }
  };
};

// Generate tree data for full scale
const generateTreeData = (forest, treeIndex, users) => {
  const swedishSpecies = [
    'Scots Pine', 'Norway Spruce', 'Silver Birch', 'Downy Birch', 'European Aspen',
    'Goat Willow', 'Common Alder', 'Rowan', 'Common Juniper'
  ];
  
  // Weighted species selection for realism
  const getRandomSpecies = () => {
    const rand = Math.random();
    if (rand < 0.40) return 'Scots Pine';
    if (rand < 0.75) return 'Norway Spruce';
    if (rand < 0.85) return 'Silver Birch';
    if (rand < 0.92) return 'Downy Birch';
    if (rand < 0.97) return 'European Aspen';
    return swedishSpecies[Math.floor(Math.random() * swedishSpecies.length)];
  };
  
  const species = getRandomSpecies();
  const plantedDate = new Date(Date.now() - Math.random() * 8 * 365 * 24 * 60 * 60 * 1000);
  const isAlive = Math.random() > 0.08; // 92% survival rate
  const user = users[Math.floor(Math.random() * users.length)];
  const age = (Date.now() - plantedDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  
  // Calculate measurements based on species and age
  const getGrowthRate = (speciesName) => {
    const rates = {
      'Scots Pine': 0.6, 'Norway Spruce': 0.7, 'Silver Birch': 0.9,
      'Downy Birch': 0.8, 'European Aspen': 0.85, 'Goat Willow': 1.0,
      'Common Alder': 0.9, 'Rowan': 0.5, 'Common Juniper': 0.3
    };
    return rates[speciesName] || 0.6;
  };
  
  const growthRate = getGrowthRate(species);
  const height = Math.max(0.5, age * growthRate * (0.8 + Math.random() * 0.4));
  const diameter = Math.max(2, age * growthRate * 8 * (0.8 + Math.random() * 0.4));
  
  const tree = {
    treeId: `${forest._id.toString().substring(18, 24).toUpperCase()}-${String(treeIndex + 1).padStart(4, '0')}`,
    forestId: forest._id,
    species: species,
    location: {
      type: 'Point',
      coordinates: [
        forest.location.coordinates[0] + (Math.random() - 0.5) * 0.003,
        forest.location.coordinates[1] + (Math.random() - 0.5) * 0.003
      ]
    },
    plantedDate: plantedDate,
    isAlive: isAlive,
    
    genetics: {
      geneticDiversity: ['native', 'improved', 'hybrid'][Math.floor(Math.random() * 3)],
      provenanceRegion: forest.region
    },
    
    growthModel: {
      expectedHeightAt15Years: 8 + Math.random() * 16,
      expectedDiameterAt15Years: 20 + Math.random() * 20,
      growthRate: growthRate > 0.7 ? 'fast' : growthRate > 0.5 ? 'moderate' : 'slow',
      siteIndex: Math.floor(12 + Math.random() * 25)
    },
    
    economicValue: {
      currentTimberValue: Math.floor(400 + Math.random() * 1600 * (age / 5)),
      carbonCreditValue: Math.floor(30 + Math.random() * 120 * age)
    },
    
    canopy: {
      diameter: Math.round((1.5 + age * 0.8 + Math.random() * 4) * 10) / 10,
      area: Math.round((2 + age * 2 + Math.random() * 10) * 10) / 10,
      density: ['sparse', 'moderate', 'dense'][Math.floor(Math.random() * 3)],
      condition: isAlive ? ['excellent', 'good', 'fair'][Math.floor(Math.random() * 3)] : 'dead'
    },
    
    ecologicalBenefits: {
      stormwaterIntercepted: {
        gallons: Math.round((8 + Math.random() * 32) * 100) / 100,
        value: Math.round((0.08 + Math.random() * 0.32) * 100) / 100
      },
      co2Sequestered: {
        pounds: Math.round((15 + Math.random() * 60 * age) * 100) / 100,
        value: Math.round((0.3 + Math.random() * 1.2 * age) * 100) / 100
      },
      co2Stored: {
        pounds: Math.round((75 + Math.random() * 300 * age) * 100) / 100,
        value: Math.round((1.5 + Math.random() * 6 * age) * 100) / 100
      },
      airPollutantsRemoved: {
        pounds: Math.round((3 + Math.random() * 12) * 100) / 100,
        value: Math.round((13.5 + Math.random() * 54) * 100) / 100
      }
    },
    
    environmentalFactors: {
      microclimate: {
        windExposure: ['sheltered', 'moderate', 'exposed'][Math.floor(Math.random() * 3)]
      },
      siteConditions: {
        slope: ['flat', 'gentle', 'moderate', 'steep'][Math.floor(Math.random() * 4)],
        aspect: ['north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest'][Math.floor(Math.random() * 8)],
        drainage: ['well_drained', 'moderately_drained', 'poorly_drained'][Math.floor(Math.random() * 3)],
        competitionIndex: Math.floor(Math.random() * 9) + 1
      },
      forestPosition: ['canopy', 'understory', 'suppressed', 'dominant', 'co_dominant'][Math.floor(Math.random() * 5)]
    },
    
    measurements: [{
      height: Math.round(height * 100) / 100,
      diameter: Math.round(diameter * 10) / 10,
      co2Absorption: Math.round((height * diameter * 0.05 + Math.random() * 20) * 100) / 100,
      healthStatus: isAlive ? ['excellent', 'good', 'fair'][Math.floor(Math.random() * 3)] : 'poor',
      notes: treeIndex === 0 ? 'Initial baseline measurement' : Math.random() > 0.8 ? 'Strong seasonal growth observed' : undefined,
      measuredBy: user._id,
      measuredAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)
    }],
    
    metadata: {
      soilCondition: ['excellent', 'good', 'moderate', 'poor'][Math.floor(Math.random() * 4)],
      sunlightExposure: ['full_sun', 'partial_sun', 'partial_shade'][Math.floor(Math.random() * 3)],
      waterAccess: ['excellent', 'good', 'moderate', 'poor'][Math.floor(Math.random() * 4)],
      plantingMethod: forest.isPlantation ? 
        ['hand_planted', 'machine_planted', 'direct_seeded'][Math.floor(Math.random() * 3)] :
        'natural_regeneration',
      managementObjective: ['timber', 'conservation', 'recreation', 'carbon', 'wildlife', 'mixed'][Math.floor(Math.random() * 6)]
    }
  };
  
  if (!isAlive) {
    tree.deathDate = new Date(plantedDate.getTime() + Math.random() * (Date.now() - plantedDate.getTime()));
    tree.deathCause = ['disease', 'storm', 'drought', 'pest', 'competition', 'lightning'][Math.floor(Math.random() * 6)];
  }
  
  return tree;
};

// Main seeding function for full scale
const seedFullScaleDatabase = async () => {
  try {
    console.log('🌱 Starting FULL SCALE database seeding (51 forests, 1500+ trees)...');
    
    // Connect to MongoDB
    await mongoose.connect(mongoUrl);
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    
    // Clear existing data using cleanDatabase utility
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Owner.deleteMany({});
    await Forest.deleteMany({});
    await Tree.deleteMany({});
    console.log('✅ Database cleared');
    
    // Create owners
    console.log('🏢 Creating 5 diverse owners...');
    const owners = await Owner.create(ownerData);
    console.log(`✅ Created ${owners.length} owners`);
    
    // Create users with owner relationships
    console.log('👥 Creating enhanced user base...');
    const usersWithOwners = userData.map((user, index) => {
      if (user.email === 'admin@nanwa.com') {
        return user; // Admin has no owner
      }
      // Distribute users across owners
      let ownerIndex;
      if (index <= 3) ownerIndex = 0; // Swedish Forest Authority gets 3 users
      else if (index <= 5) ownerIndex = 1; // Nordic Timber gets 2 users  
      else if (index <= 7) ownerIndex = 2; // Green Forest gets 2 users
      else if (index <= 9) ownerIndex = 3; // Småland Cooperative gets 2 users
      else ownerIndex = 4; // Norrland Research gets 2 users
      
      return {
        ...user,
        owner: owners[ownerIndex]._id
      };
    });
    
    const users = await User.create(usersWithOwners);
    console.log(`✅ Created ${users.length} users`);
    console.log(`   🔹 Admin users: ${users.filter(u => u.role === 'admin').length}`);
    console.log(`   🔹 Regular users: ${users.filter(u => u.role === 'user').length}`);
    
    // Create 51 forests with distribution: 15, 12, 10, 8, 6
    console.log('🌲 Creating 51 forests across Swedish regions...');
    const forestDistribution = [15, 12, 10, 8, 6]; // Distribution per owner
    const forestsData = [];
    let totalForestIndex = 0;
    
    for (let ownerIndex = 0; ownerIndex < owners.length; ownerIndex++) {
      const owner = owners[ownerIndex];
      const forestCount = forestDistribution[ownerIndex];
      
      console.log(`  🌲 Creating ${forestCount} forests for ${owner.name}...`);
      
      for (let j = 0; j < forestCount; j++) {
        const forestData = generateForestData(owner, ownerIndex, totalForestIndex);
        forestsData.push(forestData);
        totalForestIndex++;
      }
    }
    
    // Create forests in batches for better performance
    const batchSize = 10;
    const forests = [];
    for (let i = 0; i < forestsData.length; i += batchSize) {
      const batch = forestsData.slice(i, i + batchSize);
      const createdForests = await Forest.create(batch);
      forests.push(...createdForests);
      console.log(`    ✅ Created forests ${i + 1}-${Math.min(i + batchSize, forestsData.length)}`);
    }
    
    console.log(`✅ Created ${forests.length} forests total`);
    
    // Create 1500+ trees with realistic distribution
    console.log('🌳 Creating 1500+ trees with realistic Swedish species distribution...');
    let totalTrees = 0;
    const targetTotalTrees = 1530; // Target slightly above 1500
    
    for (let i = 0; i < forests.length; i++) {
      const forest = forests[i];
      
      // Calculate trees per forest to reach target (30 avg per forest)
      const remainingForests = forests.length - i;
      const remainingTreesNeeded = targetTotalTrees - totalTrees;
      const baseTreesPerForest = Math.floor(remainingTreesNeeded / remainingForests);
      const treeCount = baseTreesPerForest + Math.floor(Math.random() * 10); // 25-40 trees per forest
      
      console.log(`  🌳 Creating ${treeCount} trees for ${forest.name}... (${i + 1}/${forests.length})`);
      
      // Create trees in smaller batches for memory efficiency
      const treeBatchSize = 20;
      let forestTrees = 0;
      
      for (let j = 0; j < treeCount; j += treeBatchSize) {
        const currentBatchSize = Math.min(treeBatchSize, treeCount - j);
        const treesData = [];
        
        for (let k = 0; k < currentBatchSize; k++) {
          const treeData = generateTreeData(forest, forestTrees + k, users);
          treesData.push(treeData);
        }
        
        await Tree.create(treesData);
        forestTrees += treesData.length;
      }
      
      totalTrees += forestTrees;
      
      // Progress indicator every 10 forests
      if ((i + 1) % 10 === 0) {
        console.log(`    📊 Progress: ${i + 1}/${forests.length} forests, ${totalTrees.toLocaleString()} trees created`);
      }
    }
    
    console.log(`✅ Created ${totalTrees.toLocaleString()} trees total`);
    
    // Generate comprehensive statistics
    console.log('\n📊 FULL SCALE DATABASE STATISTICS:');
    console.log('='.repeat(60));
    console.log(`🏢 Owners: ${owners.length}`);
    console.log(`👥 Users: ${users.length} (${users.filter(u => u.role === 'admin').length} admin, ${users.filter(u => u.role === 'user').length} regular)`);
    console.log(`🌲 Forests: ${forests.length}`);
    console.log(`🌳 Trees: ${totalTrees.toLocaleString()}`);
    
    // Owner distribution
    console.log('\n🏢 Distribution by Owner:');
    for (let i = 0; i < owners.length; i++) {
      const ownerForests = forests.filter(f => f.owner.toString() === owners[i]._id.toString());
      const ownerTrees = await Tree.countDocuments({ 
        forestId: { $in: ownerForests.map(f => f._id) } 
      });
      console.log(`  📊 ${owners[i].name}: ${ownerForests.length} forests, ${ownerTrees.toLocaleString()} trees`);
    }
    
    // Species distribution
    console.log('\n🌿 Species Distribution:');
    const speciesStats = await Tree.aggregate([
      { $group: { _id: '$species', count: { $sum: 1 }, aliveCount: { $sum: { $cond: ['$isAlive', 1, 0] } } } },
      { $sort: { count: -1 } }
    ]);
    
    speciesStats.forEach(stat => {
      const percentage = ((stat.count / totalTrees) * 100).toFixed(1);
      const alivePercentage = ((stat.aliveCount / stat.count) * 100).toFixed(1);
      console.log(`  🌳 ${stat._id}: ${stat.count.toLocaleString()} (${percentage}%) - ${stat.aliveCount.toLocaleString()} alive (${alivePercentage}%)`);
    });
    
    console.log('\n🔐 ACCESS CREDENTIALS:');
    console.log('='.repeat(60));
    console.log('🔑 Admin Access (sees ALL data):');
    console.log('   Email: admin@nanwa.com');
    console.log('   Password: admin123');
    
    console.log('\n👥 Owner-specific Users (see only their organization):');
    for (let i = 0; i < owners.length; i++) {
      const ownerUsers = users.filter(u => u.owner && u.owner.toString() === owners[i]._id.toString());
      if (ownerUsers.length > 0) {
        console.log(`\n   🏢 ${owners[i].name}:`);
        ownerUsers.forEach(user => {
          console.log(`     📧 ${user.email} / User123!`);
        });
      }
    }
    
    console.log('\n🎉 FULL SCALE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('🌍 Database contains realistic Swedish forestry data at scale');
    console.log('📈 Admin can see aggregated statistics from all organizations');
    console.log('🔒 Regular users can only access their organization\'s data');
    console.log('✅ All data is schema-compliant and ready for production use');
    
  } catch (error) {
    console.error('❌ Error during full scale seeding:', error);
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
  seedFullScaleDatabase();
}

export default seedFullScaleDatabase;