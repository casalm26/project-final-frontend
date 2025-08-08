import mongoose from 'mongoose';

const measurementSchema = new mongoose.Schema({
  height: {
    type: Number,
    required: [true, 'Height measurement is required'],
    min: [0, 'Height must be positive']
  },
  diameter: {
    type: Number,
    min: [0, 'Diameter must be positive']
  },
  co2Absorption: {
    type: Number,
    min: [0, 'CO₂ absorption must be positive']
  },
  healthStatus: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor', 'critical'],
    default: 'good'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  measuredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  measuredAt: {
    type: Date,
    default: Date.now
  }
});

const treeSchema = new mongoose.Schema({
  treeId: {
    type: String,
    required: [true, 'Tree ID is required'],
    unique: true,
    trim: true
  },
  forestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Forest',
    required: [true, 'Forest ID is required']
  },
  species: {
    type: String,
    required: [true, 'Tree species is required'],
    trim: true,
    maxlength: [100, 'Species name cannot exceed 100 characters']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(v) {
          return v.length === 2;
        },
        message: 'Coordinates must be an array of [longitude, latitude]'
      }
    }
  },
  plantedDate: {
    type: Date,
    required: [true, 'Planted date is required']
  },
  isAlive: {
    type: Boolean,
    default: true
  },
  deathDate: {
    type: Date
  },
  deathCause: {
    type: String,
    maxlength: [200, 'Death cause cannot exceed 200 characters']
  },
  measurements: [measurementSchema],
  
  // Genetic and source tracking
  genetics: {
    seedSource: {
      type: String,
      trim: true
    },
    cultivar: {
      type: String,
      trim: true
    },
    parentTreeId: {
      type: String,
      trim: true
    },
    geneticDiversity: {
      type: String,
      enum: ['native', 'improved', 'hybrid', 'exotic']
    },
    provenanceRegion: String
  },
  
  // Growth predictions and modeling
  growthModel: {
    expectedHeightAt15Years: {
      type: Number,
      min: [0, 'Expected height must be positive']
    },
    expectedDiameterAt15Years: {
      type: Number,
      min: [0, 'Expected diameter must be positive']
    },
    growthRate: {
      type: String,
      enum: ['slow', 'moderate', 'fast']
    },
    siteIndex: {
      type: Number,
      min: [0, 'Site index must be positive'],
      max: [50, 'Site index cannot exceed 50']
    },
    maturityAge: Number, // years
    maxHeight: Number, // meters
    maxDiameter: Number // cm
  },
  
  // Maintenance and treatment history
  maintenance: {
    fertilization: [{
      date: Date,
      type: {
        type: String,
        enum: ['organic', 'mineral', 'slow_release', 'liquid']
      },
      npkRatio: String, // e.g., "10-10-10"
      amount: Number, // kg or grams
      appliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      notes: String
    }],
    pestControl: [{
      date: Date,
      pestType: String,
      treatment: String,
      method: {
        type: String,
        enum: ['biological', 'chemical', 'mechanical', 'integrated']
      },
      effectiveness: {
        type: String,
        enum: ['successful', 'partial', 'unsuccessful']
      },
      followUpRequired: Boolean,
      appliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }],
    damageReports: [{
      date: Date,
      type: {
        type: String,
        enum: ['wind', 'snow', 'ice', 'animal', 'disease', 'human', 'fire', 'drought', 'flood']
      },
      severity: {
        type: String,
        enum: ['minor', 'moderate', 'severe']
      },
      description: String,
      photoUrls: [String],
      treatmentRequired: Boolean,
      recoveryExpected: Boolean
    }],
    pruning: {
      lastPruned: Date,
      nextScheduled: Date,
      history: [{
        date: Date,
        type: {
          type: String,
          enum: ['structural', 'health', 'clearance', 'aesthetic', 'safety']
        },
        prunedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        notes: String,
        photoUrls: [String]
      }]
    }
  },
  
  // Economic value tracking
  economicValue: {
    currentTimberValue: {
      type: Number,
      min: [0, 'Timber value must be positive']
    },
    carbonCreditValue: {
      type: Number,
      min: [0, 'Carbon credit value must be positive']
    },
    lastValuation: Date,
    valuationMethod: String,
    marketPricePerCubicMeter: Number
  },
  
  // Tree canopy characteristics (for forest benefit calculations)
  canopy: {
    diameter: {
      type: Number,
      min: [0, 'Canopy diameter must be positive']
    },
    area: {
      type: Number,
      min: [0, 'Canopy area must be positive']
    },
    density: {
      type: String,
      enum: ['sparse', 'moderate', 'dense']
    },
    condition: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor', 'dead']
    },
    leafArea: Number, // leaf area index
    seasonalChanges: {
      springBudBreak: Date,
      fallColorChange: Date,
      leafDrop: Date
    }
  },
  
  // Forest ecosystem benefits (calculated annually)
  ecologicalBenefits: {
    // Stormwater management
    stormwaterIntercepted: {
      gallons: {
        type: Number,
        min: [0, 'Stormwater gallons must be positive']
      },
      value: {
        type: Number,
        min: [0, 'Stormwater value must be positive']
      },
      lastCalculated: Date
    },
    // Carbon sequestration and storage
    co2Sequestered: {
      pounds: {
        type: Number,
        min: [0, 'CO2 sequestered must be positive']
      },
      value: {
        type: Number,
        min: [0, 'CO2 value must be positive']
      },
      lastCalculated: Date
    },
    co2Stored: {
      pounds: {
        type: Number,
        min: [0, 'CO2 stored must be positive']
      },
      value: {
        type: Number,
        min: [0, 'CO2 stored value must be positive']
      },
      lastCalculated: Date
    },
    // Air quality improvement
    airPollutantsRemoved: {
      pounds: {
        type: Number,
        min: [0, 'Air pollutants removed must be positive']
      },
      value: {
        type: Number,
        min: [0, 'Air pollutants value must be positive']
      },
      pollutantBreakdown: {
        ozone: Number,
        no2: Number,
        so2: Number,
        pm10: Number,
        pm25: Number
      },
      lastCalculated: Date
    },
    // Soil and water benefits
    soilStabilization: {
      rootArea: Number, // square meters
      erosionPrevention: Number, // tons of soil per year
      value: Number,
      lastCalculated: Date
    },
    // Wildlife habitat provision
    wildlifeHabitat: {
      nestingSites: Number,
      foodProduction: Number, // kg of seeds/fruit per year
      shelterValue: Number,
      biodiversitySupport: {
        type: String,
        enum: ['low', 'moderate', 'high']
      },
      lastCalculated: Date
    }
  },
  
  // Environmental factors affecting tree growth and benefits
  environmentalFactors: {
    microclimate: {
      avgTemperature: Number,
      humidity: Number,
      windExposure: {
        type: String,
        enum: ['sheltered', 'moderate', 'exposed']
      }
    },
    siteConditions: {
      slope: {
        type: String,
        enum: ['flat', 'gentle', 'moderate', 'steep']
      },
      aspect: {
        type: String,
        enum: ['north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest']
      },
      drainage: {
        type: String,
        enum: ['well_drained', 'moderately_drained', 'poorly_drained', 'waterlogged']
      },
      competitionIndex: {
        type: Number,
        min: [0, 'Competition index must be positive'],
        max: [10, 'Competition index cannot exceed 10']
      }
    },
    forestPosition: {
      type: String,
      enum: ['canopy', 'understory', 'suppressed', 'dominant', 'co_dominant']
    }
  },

  images: [{
    url: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  metadata: {
    soilCondition: {
      type: String,
      enum: ['excellent', 'good', 'moderate', 'poor']
    },
    sunlightExposure: {
      type: String,
      enum: ['full_sun', 'partial_sun', 'partial_shade', 'full_shade']
    },
    waterAccess: {
      type: String,
      enum: ['excellent', 'good', 'moderate', 'poor']
    },
    seedlingSource: String,
    plantingMethod: {
      type: String,
      enum: ['hand_planted', 'machine_planted', 'direct_seeded', 'natural_regeneration']
    },
    initialSpacing: Number, // meters between trees
    managementObjective: {
      type: String,
      enum: ['timber', 'conservation', 'recreation', 'carbon', 'wildlife', 'mixed']
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create geospatial index for location-based queries
treeSchema.index({ location: '2dsphere' });

// Index for common query patterns
treeSchema.index({ forestId: 1, isAlive: 1 });
treeSchema.index({ species: 1 });
treeSchema.index({ plantedDate: 1 });
treeSchema.index({ treeId: 1 });
treeSchema.index({ 'measurements.measuredAt': -1 });
treeSchema.index({ 'genetics.geneticDiversity': 1 });
treeSchema.index({ 'growthModel.growthRate': 1 });
treeSchema.index({ 'canopy.condition': 1 });
treeSchema.index({ 'environmentalFactors.forestPosition': 1 });
treeSchema.index({ 'economicValue.currentTimberValue': 1 });

// Update the updatedAt field before saving
treeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for current height (latest measurement)
treeSchema.virtual('currentHeight').get(function() {
  if (this.measurements && this.measurements.length > 0) {
    const latestMeasurement = this.measurements
      .sort((a, b) => b.measuredAt - a.measuredAt)[0];
    return latestMeasurement.height;
  }
  return null;
});

// Virtual for current health status
treeSchema.virtual('currentHealthStatus').get(function() {
  if (this.measurements && this.measurements.length > 0) {
    const latestMeasurement = this.measurements
      .sort((a, b) => b.measuredAt - a.measuredAt)[0];
    return latestMeasurement.healthStatus;
  }
  return 'unknown';
});

// Virtual for age in days
treeSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const planted = new Date(this.plantedDate);
  return Math.floor((now - planted) / (1000 * 60 * 60 * 24));
});

// Virtual for total CO₂ absorption
treeSchema.virtual('totalCO2Absorption').get(function() {
  if (this.measurements && this.measurements.length > 0) {
    return this.measurements.reduce((total, measurement) => {
      return total + (measurement.co2Absorption || 0);
    }, 0);
  }
  return 0;
});

// Method to add a new measurement
treeSchema.methods.addMeasurement = function(measurementData) {
  this.measurements.push(measurementData);
  return this.save();
};

// Method to get latest measurements (default: 10)
treeSchema.methods.getLatestMeasurements = function(limit = 10) {
  return this.measurements
    .sort((a, b) => b.measuredAt - a.measuredAt)
    .slice(0, limit);
};

// Method to calculate tree age in years
treeSchema.methods.getAgeInYears = function() {
  const now = new Date();
  const planted = new Date(this.plantedDate);
  return Math.floor((now - planted) / (1000 * 60 * 60 * 24 * 365.25));
};

// Method to calculate current ecological benefits
treeSchema.methods.calculateEcologicalBenefits = function() {
  if (!this.canopy || !this.canopy.area) return null;
  
  const canopyArea = this.canopy.area;
  const treeAge = this.getAgeInYears();
  const species = this.species.toLowerCase();
  
  // Species-specific factors for Swedish forests
  const speciesFactors = {
    'pine': { stormwaterRate: 0.8, co2Rate: 25, pollutantRate: 0.15, soilRate: 0.6 },
    'spruce': { stormwaterRate: 1.0, co2Rate: 30, pollutantRate: 0.18, soilRate: 0.7 },
    'birch': { stormwaterRate: 0.6, co2Rate: 15, pollutantRate: 0.12, soilRate: 0.4 },
    'oak': { stormwaterRate: 1.2, co2Rate: 35, pollutantRate: 0.22, soilRate: 0.8 },
    'fir': { stormwaterRate: 0.9, co2Rate: 28, pollutantRate: 0.16, soilRate: 0.65 }
  };
  
  const factors = speciesFactors[species] || speciesFactors['pine']; // Default to pine
  
  // Calculate annual benefits
  const benefits = {
    stormwater: {
      gallons: canopyArea * factors.stormwaterRate * 200, // 200 gallons per m² base rate
      value: 0
    },
    co2: {
      sequestered: canopyArea * factors.co2Rate * Math.min(treeAge, 10) / 10, // Peak at 10 years
      stored: canopyArea * factors.co2Rate * treeAge,
      value: 0
    },
    airPollutants: {
      pounds: canopyArea * factors.pollutantRate * 6.6, // 6.6 lbs per m² base rate
      value: 0
    },
    soilStabilization: {
      erosionPrevention: canopyArea * factors.soilRate * 0.5, // tons per year
      value: 0
    }
  };
  
  // Calculate monetary values (Swedish pricing)
  benefits.stormwater.value = benefits.stormwater.gallons * 0.008; // ~0.08 SEK per gallon
  benefits.co2.value = (benefits.co2.sequestered + benefits.co2.stored * 0.1) * 0.15; // ~1.5 SEK per kg CO2
  benefits.airPollutants.value = benefits.airPollutants.pounds * 35; // ~350 SEK per pound
  benefits.soilStabilization.value = benefits.soilStabilization.erosionPrevention * 120; // ~1200 SEK per ton
  
  return benefits;
};

// Method to calculate timber value
treeSchema.methods.calculateTimberValue = function() {
  const latestMeasurement = this.getLatestMeasurements(1)[0];
  if (!latestMeasurement || !this.isAlive) return 0;
  
  const height = latestMeasurement.height;
  const diameter = latestMeasurement.diameter || height * 0.1; // Estimate diameter if not available
  
  // Volume calculation (simplified cone formula)
  const volume = Math.PI * Math.pow(diameter / 200, 2) * height * 0.5; // cubic meters
  
  // Species-specific timber prices (SEK per cubic meter)
  const timberPrices = {
    'pine': 600,
    'spruce': 650,
    'birch': 400,
    'oak': 1200,
    'fir': 580
  };
  
  const species = this.species.toLowerCase();
  const pricePerCubicMeter = timberPrices[species] || timberPrices['pine'];
  
  return volume * pricePerCubicMeter;
};

// Method to assess tree health based on multiple factors
treeSchema.methods.assessOverallHealth = function() {
  if (!this.isAlive) return 'dead';
  
  const latestMeasurement = this.getLatestMeasurements(1)[0];
  let healthScore = 100;
  
  // Factor in latest health status
  if (latestMeasurement) {
    const healthPoints = {
      'excellent': 100,
      'good': 80,
      'fair': 60,
      'poor': 40,
      'critical': 20
    };
    healthScore = healthPoints[latestMeasurement.healthStatus] || 50;
  }
  
  // Factor in canopy condition
  if (this.canopy && this.canopy.condition) {
    const canopyPoints = {
      'excellent': 0,
      'good': -5,
      'fair': -15,
      'poor': -25,
      'dead': -50
    };
    healthScore += canopyPoints[this.canopy.condition] || 0;
  }
  
  // Factor in recent damage reports
  if (this.maintenance && this.maintenance.damageReports) {
    const recentDamage = this.maintenance.damageReports.filter(report => 
      new Date(report.date) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
    );
    
    recentDamage.forEach(damage => {
      const severityPenalty = {
        'minor': -5,
        'moderate': -15,
        'severe': -30
      };
      healthScore += severityPenalty[damage.severity] || 0;
    });
  }
  
  // Convert score to category
  if (healthScore >= 90) return 'excellent';
  if (healthScore >= 75) return 'good';
  if (healthScore >= 55) return 'fair';
  if (healthScore >= 30) return 'poor';
  return 'critical';
};

// Static method to find trees by forest
treeSchema.statics.findByForest = function(forestId) {
  return this.find({ forestId, isAlive: true });
};

// Static method to find trees by species
treeSchema.statics.findBySpecies = function(species) {
  return this.find({ 
    species: new RegExp(species, 'i'), 
    isAlive: true 
  });
};

// Static method to find trees by health status
treeSchema.statics.findByHealthStatus = function(healthStatus) {
  return this.find({
    'measurements.healthStatus': healthStatus,
    isAlive: true
  });
};

// Static method to calculate survival rate for a forest
treeSchema.statics.calculateSurvivalRate = async function(forestId, dateRange = null) {
  const matchCondition = { forestId };
  
  if (dateRange) {
    matchCondition.plantedDate = {
      $gte: dateRange.start,
      $lte: dateRange.end
    };
  }

  const totalTrees = await this.countDocuments(matchCondition);
  const aliveTrees = await this.countDocuments({ ...matchCondition, isAlive: true });
  
  return totalTrees > 0 ? (aliveTrees / totalTrees) * 100 : 0;
};

// Static method to get forest statistics
treeSchema.statics.getForestStatistics = async function(forestId) {
  const trees = await this.find({ forestId });
  const aliveTrees = trees.filter(tree => tree.isAlive);
  
  if (trees.length === 0) {
    return {
      totalTrees: 0,
      aliveTrees: 0,
      survivalRate: 0,
      averageAge: 0,
      averageHeight: 0,
      speciesDistribution: {},
      totalTimberValue: 0,
      totalEcologicalValue: 0
    };
  }
  
  // Calculate species distribution
  const speciesCount = {};
  trees.forEach(tree => {
    speciesCount[tree.species] = (speciesCount[tree.species] || 0) + 1;
  });
  
  // Calculate averages for alive trees
  const totalAge = aliveTrees.reduce((sum, tree) => sum + tree.getAgeInYears(), 0);
  const avgAge = aliveTrees.length > 0 ? totalAge / aliveTrees.length : 0;
  
  const heights = aliveTrees.map(tree => {
    const latest = tree.getLatestMeasurements(1)[0];
    return latest ? latest.height : 0;
  });
  const avgHeight = heights.length > 0 ? heights.reduce((a, b) => a + b, 0) / heights.length : 0;
  
  // Calculate economic values
  const timberValues = aliveTrees.map(tree => tree.calculateTimberValue());
  const totalTimberValue = timberValues.reduce((a, b) => a + b, 0);
  
  return {
    totalTrees: trees.length,
    aliveTrees: aliveTrees.length,
    survivalRate: (aliveTrees.length / trees.length) * 100,
    averageAge: Math.round(avgAge * 10) / 10,
    averageHeight: Math.round(avgHeight * 10) / 10,
    speciesDistribution: speciesCount,
    totalTimberValue: Math.round(totalTimberValue),
    totalEcologicalValue: 0 // Will be calculated by forest-level aggregation
  };
};

const Tree = mongoose.model('Tree', treeSchema);

export default Tree;