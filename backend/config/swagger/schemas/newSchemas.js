// Potential schemas to add to the model in the future.

// 1. FOREST ENHANCEMENTS
const forestSchemaAdditions = {
  isPlantation: {
    type: Boolean,
    required: true,
    default: false // false = farmer forest, true = plantation
  },
  
  // Financial tracking
  financials: {
    acquisitionCost: Number,
    acquisitionDate: Date,
    currentValue: Number,
    lastValuationDate: Date,
    maintenanceBudget: {
      annual: Number,
      allocated: Number,
      spent: Number
    }
  },
  
  // Environmental monitoring
  environmental: {
    waterSources: [{
      type: {
        type: String,
        enum: ['river', 'stream', 'pond', 'lake', 'wetland']
      },
      name: String,
      coordinates: {
        type: 'Point',
        coordinates: [Number]
      },
      quality: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor']
      }
    }],
    fireRisk: {
      current: {
        type: String,
        enum: ['low', 'moderate', 'high', 'extreme']
      },
      lastAssessment: Date
    },
    pestInfestation: [{
      pestType: String,
      severity: {
        type: String,
        enum: ['none', 'minor', 'moderate', 'severe']
      },
      affectedArea: Number, // in hectares
      discoveredDate: Date,
      treatmentApplied: String,
      status: {
        type: String,
        enum: ['active', 'treated', 'resolved']
      }
    }]
  },
  
  // Carbon tracking
  carbonMetrics: {
    totalCarbonStored: Number, // tons
    annualSequestration: Number, // tons/year
    carbonCredits: {
      issued: Number,
      sold: Number,
      available: Number,
      pricePerCredit: Number
    },
    lastCalculation: Date
  },
  
  // Access and infrastructure
  infrastructure: {
    roads: [{
      name: String,
      type: {
        type: String,
        enum: ['paved', 'gravel', 'dirt', 'trail']
      },
      length: Number, // km
      condition: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor']
      },
      lastMaintenance: Date
    }],
    facilities: [{
      type: {
        type: String,
        enum: ['office', 'storage', 'equipment_shed', 'observation_tower', 'rest_area']
      },
      name: String,
      coordinates: {
        type: 'Point',
        coordinates: [Number]
      },
      condition: String,
      builtDate: Date
    }],
    closestPort: {
      name: String,
      distance: Number, // km
      coordinates: {
        type: 'Point',
        coordinates: [Number]
      },
      accessType: {
        type: String,
        enum: ['road', 'rail', 'water', 'mixed']
      }
    }
  },
  
  // Harvesting plans
  harvestPlan: {
    zones: [{
      name: String,
      area: Number,
      plannedHarvestYear: Number,
      sustainabilityRating: String,
      estimatedYield: {
        volume: Number, // cubic meters
        value: Number // estimated monetary value
      }
    }],
    certifications: [{
      type: {
        type: String,
        enum: ['FSC', 'PEFC', 'ISO14001', 'Other']
      },
      certificationNumber: String,
      issuedDate: Date,
      expiryDate: Date,
      status: {
        type: String,
        enum: ['active', 'expired', 'pending_renewal']
      }
    }]
  }
};

// 2. TREE ENHANCEMENTS
const treeSchemaAdditions = {
  // Genetic/source tracking
  genetics: {
    seedSource: String,
    cultivar: String,
    parentTreeId: String,
    geneticDiversity: {
      type: String,
      enum: ['native', 'improved', 'hybrid', 'exotic']
    }
  },
  
  // Growth predictions
  growthModel: {
    expectedHeightAt15Years: Number,
    expectedDiameterAt15Years: Number,
    growthRate: {
      type: String,
      enum: ['slow', 'moderate', 'fast']
    },
    siteIndex: Number // productivity measure
  },
  
  // Maintenance history
  maintenance: {
    fertilization: [{
      date: Date,
      type: String,
      amount: Number,
      appliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }],
    pestControl: [{
      date: Date,
      pestType: String,
      treatment: String,
      effectiveness: {
        type: String,
        enum: ['successful', 'partial', 'unsuccessful']
      }
    }],
    damageReports: [{
      date: Date,
      type: {
        type: String,
        enum: ['wind', 'snow', 'animal', 'disease', 'human', 'fire']
      },
      severity: {
        type: String,
        enum: ['minor', 'moderate', 'severe']
      },
      description: String,
      photoUrls: [String]
    }]
  },
  
  // Economic value
  economicValue: {
    currentTimberValue: Number,
    carbonCreditValue: Number,
    lastValuation: Date
  }
};

// 3. OWNER ENHANCEMENTS
const ownerSchemaAdditions = {
  // Organization details
  organizationType: {
    type: String,
    enum: ['government', 'private_company', 'ngo', 'individual', 'cooperative']
  },
  
  // Certifications and compliance
  certifications: [{
    type: String,
    issuedDate: Date,
    expiryDate: Date,
    issuingBody: String
  }],
  
  // Financial information
  financials: {
    annualRevenue: Number,
    totalForestValue: Number,
    insurancePolicies: [{
      provider: String,
      policyNumber: String,
      coverage: String,
      annualPremium: Number,
      expiryDate: Date
    }]
  },
  
  // Sustainability goals
  sustainabilityGoals: {
    carbonNeutralTarget: Date,
    biodiversityTargets: [{
      metric: String,
      target: Number,
      deadline: Date
    }],
    communityEngagement: {
      localEmployees: Number,
      educationPrograms: Number,
      publicAccessAreas: Number
    }
  }
};

// 4. NEW MODEL: ACTIVITY LOG
const activityLogSchema = new mongoose.Schema({
  forestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Forest',
    required: true
  },
  activityType: {
    type: String,
    enum: ['planting', 'harvesting', 'maintenance', 'inspection', 'treatment', 'incident', 'certification'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  affectedTrees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tree'
  }],
  costs: {
    labor: Number,
    materials: Number,
    equipment: Number,
    total: Number
  },
  results: String,
  photos: [String],
  weatherConditions: {
    temperature: Number,
    precipitation: String,
    windSpeed: Number
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// 5. NEW MODEL: WEATHER STATION
const weatherStationSchema = new mongoose.Schema({
  forestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Forest',
    required: true
  },
  stationId: {
    type: String,
    unique: true,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  readings: [{
    timestamp: Date,
    temperature: Number,
    humidity: Number,
    rainfall: Number,
    windSpeed: Number,
    windDirection: Number,
    soilMoisture: Number,
    solarRadiation: Number
  }],
  alerts: [{
    type: {
      type: String,
      enum: ['fire_risk', 'frost', 'drought', 'storm', 'pest_conditions']
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    message: String,
    timestamp: Date,
    active: Boolean
  }]
}, {
  timestamps: true
});

// 6. NEW MODEL: INVENTORY REPORT
const inventoryReportSchema = new mongoose.Schema({
  forestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Forest',
    required: true
  },
  reportDate: {
    type: Date,
    required: true
  },
  conductedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  summary: {
    totalTrees: Number,
    healthyTrees: Number,
    damagedTrees: Number,
    deadTrees: Number,
    averageHeight: Number,
    averageDiameter: Number,
    estimatedVolume: Number, // cubic meters
    estimatedValue: Number
  },
  speciesBreakdown: [{
    species: String,
    count: Number,
    percentage: Number,
    averageHeight: Number,
    averageDiameter: Number,
    healthDistribution: {
      excellent: Number,
      good: Number,
      fair: Number,
      poor: Number
    }
  }],
  recommendations: [{
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent']
    },
    category: String,
    description: String,
    estimatedCost: Number,
    deadline: Date
  }],
  comparisonWithLastReport: {
    growthRate: Number, // percentage
    mortalityRate: Number,
    healthImprovement: Number,
    valueChange: Number
  }
}, {
  timestamps: true
});