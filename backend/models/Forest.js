import mongoose from 'mongoose';

const forestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Forest name is required'],
    trim: true,
    maxlength: [100, 'Forest name cannot exceed 100 characters']
  },
  region: {
    type: String,
    required: [true, 'Region is required'],
    trim: true,
    maxlength: [100, 'Region name cannot exceed 100 characters']
  },
  
  // Owner relationship
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
    required: [true, 'Forest owner is required']
  },
  
  // Forest type classification
  isPlantation: {
    type: Boolean,
    required: true,
    default: false // false = natural forest, true = plantation
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
  area: {
    type: Number,
    required: [true, 'Forest area is required'],
    min: [0, 'Area must be positive']
  },
  areaUnit: {
    type: String,
    enum: ['hectares', 'acres', 'sq_km', 'sq_miles'],
    default: 'hectares'
  },
  establishedDate: {
    type: Date,
    required: [true, 'Established date is required']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // Financial tracking
  financials: {
    acquisitionCost: {
      type: Number,
      min: [0, 'Acquisition cost must be positive']
    },
    acquisitionDate: Date,
    currentValue: {
      type: Number,
      min: [0, 'Current value must be positive']
    },
    lastValuationDate: Date,
    currency: {
      type: String,
      default: 'SEK',
      enum: ['SEK', 'EUR', 'USD']
    },
    maintenanceBudget: {
      annual: {
        type: Number,
        min: [0, 'Annual budget must be positive']
      },
      allocated: {
        type: Number,
        min: [0, 'Allocated budget must be positive']
      },
      spent: {
        type: Number,
        min: [0, 'Spent amount must be positive']
      }
    }
  },
  
  // Biodiversity tracking
  biodiversity: {
    species: [{
      name: String,
      scientificName: String,
      category: {
        type: String,
        enum: ['flora', 'fauna', 'fungi']
      },
      count: {
        type: Number,
        min: [0, 'Species count must be positive']
      },
      lastObserved: Date,
      conservationStatus: {
        type: String,
        enum: ['common', 'uncommon', 'rare', 'endangered', 'critically_endangered']
      },
      notes: String
    }],
    biodiversityIndex: {
      type: Number,
      min: [0, 'Biodiversity index must be positive'],
      max: [100, 'Biodiversity index cannot exceed 100']
    },
    lastSurveyDate: Date,
    habitatTypes: [{
      type: String,
      area: Number, // in hectares
      condition: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor']
      }
    }]
  },
  
  // Environmental monitoring
  environmental: {
    waterSources: [{
      type: {
        type: String,
        enum: ['river', 'stream', 'pond', 'lake', 'wetland', 'spring']
      },
      name: String,
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: [Number]
      },
      quality: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor']
      },
      flowRate: Number, // liters per second
      seasonal: Boolean
    }],
    fireRisk: {
      current: {
        type: String,
        enum: ['low', 'moderate', 'high', 'extreme']
      },
      lastAssessment: Date,
      mitigationMeasures: [String]
    },
    pestInfestation: [{
      pestType: String,
      species: String,
      severity: {
        type: String,
        enum: ['none', 'minor', 'moderate', 'severe']
      },
      affectedArea: {
        type: Number,
        min: [0, 'Affected area must be positive']
      },
      discoveredDate: Date,
      treatmentApplied: String,
      treatmentDate: Date,
      status: {
        type: String,
        enum: ['active', 'treated', 'resolved']
      }
    }],
    soilHealth: {
      phLevel: {
        type: Number,
        min: [0, 'pH must be positive'],
        max: [14, 'pH cannot exceed 14']
      },
      organicMatter: Number, // percentage
      compaction: {
        type: String,
        enum: ['low', 'moderate', 'high']
      },
      erosionRisk: {
        type: String,
        enum: ['low', 'moderate', 'high']
      },
      lastTested: Date
    }
  },
  
  // Carbon tracking and climate benefits
  carbonMetrics: {
    totalCarbonStored: {
      type: Number,
      min: [0, 'Carbon stored must be positive']
    },
    annualSequestration: {
      type: Number,
      min: [0, 'Annual sequestration must be positive']
    },
    carbonCredits: {
      issued: {
        type: Number,
        min: [0, 'Issued credits must be positive']
      },
      sold: {
        type: Number,
        min: [0, 'Sold credits must be positive']
      },
      available: {
        type: Number,
        min: [0, 'Available credits must be positive']
      },
      pricePerCredit: {
        type: Number,
        min: [0, 'Price per credit must be positive']
      }
    },
    lastCalculation: Date,
    calculationMethod: String
  },
  
  // Infrastructure and access
  infrastructure: {
    roads: [{
      name: String,
      type: {
        type: String,
        enum: ['paved', 'gravel', 'dirt', 'trail', 'logging_road']
      },
      length: {
        type: Number,
        min: [0, 'Road length must be positive']
      },
      width: Number, // meters
      condition: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor']
      },
      lastMaintenance: Date,
      accessLevel: {
        type: String,
        enum: ['public', 'restricted', 'private']
      }
    }],
    facilities: [{
      type: {
        type: String,
        enum: ['office', 'storage', 'equipment_shed', 'observation_tower', 'rest_area', 'research_station']
      },
      name: String,
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: [Number]
      },
      condition: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor']
      },
      builtDate: Date,
      lastMaintenance: Date,
      capacity: Number
    }],
    fencing: {
      totalLength: Number, // kilometers
      type: String,
      condition: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor']
      },
      lastInspection: Date
    }
  },
  
  // Sustainable harvesting plans
  harvestPlan: {
    zones: [{
      name: String,
      area: {
        type: Number,
        min: [0, 'Zone area must be positive']
      },
      plannedHarvestYear: Number,
      harvestMethod: {
        type: String,
        enum: ['clear_cut', 'selective', 'shelterwood', 'continuous_cover']
      },
      sustainabilityRating: {
        type: String,
        enum: ['low', 'medium', 'high', 'certified']
      },
      estimatedYield: {
        volume: {
          type: Number,
          min: [0, 'Volume must be positive']
        },
        value: {
          type: Number,
          min: [0, 'Value must be positive']
        }
      },
      lastHarvest: Date,
      rotationPeriod: Number // years
    }],
    certifications: [{
      type: {
        type: String,
        enum: ['FSC', 'PEFC', 'ISO14001', 'SVEASKOG', 'Other']
      },
      certificationNumber: String,
      issuedDate: Date,
      expiryDate: Date,
      issuingBody: String,
      status: {
        type: String,
        enum: ['active', 'expired', 'pending_renewal']
      }
    }],
    nextPlannedHarvest: Date,
    harvestRotation: Number // years
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Enhanced metadata with forest-specific information
  metadata: {
    soilType: {
      type: String,
      enum: ['clay', 'loam', 'sand', 'peat', 'rocky', 'mixed']
    },
    climate: {
      type: String,
      enum: ['temperate', 'continental', 'oceanic', 'boreal']
    },
    elevation: {
      type: Number,
      min: [0, 'Elevation must be positive']
    },
    avgRainfall: {
      type: Number,
      min: [0, 'Average rainfall must be positive']
    },
    avgTemperature: Number,
    growingSeason: {
      startMonth: {
        type: Number,
        min: [1, 'Month must be between 1 and 12'],
        max: [12, 'Month must be between 1 and 12']
      },
      endMonth: {
        type: Number,
        min: [1, 'Month must be between 1 and 12'],
        max: [12, 'Month must be between 1 and 12']
      },
      lengthDays: Number
    },
    dominantSpecies: [String],
    forestAge: {
      type: String,
      enum: ['young', 'mature', 'old_growth', 'mixed_age']
    },
    managementIntensity: {
      type: String,
      enum: ['intensive', 'moderate', 'extensive', 'minimal']
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create geospatial index for location-based queries
forestSchema.index({ location: '2dsphere' });

// Index for common query patterns
forestSchema.index({ region: 1, isActive: 1 });
forestSchema.index({ establishedDate: 1 });
forestSchema.index({ owner: 1, isActive: 1 });
forestSchema.index({ isPlantation: 1 });
forestSchema.index({ 'metadata.forestAge': 1 });
forestSchema.index({ 'carbonMetrics.totalCarbonStored': 1 });

// Virtual for tree count
forestSchema.virtual('treeCount', {
  ref: 'Tree',
  localField: '_id',
  foreignField: 'forestId',
  count: true
});

// Virtual for forest health percentage
forestSchema.virtual('healthPercentage').get(function() {
  if (this.biodiversity && this.biodiversity.biodiversityIndex) {
    return this.biodiversity.biodiversityIndex;
  }
  return null;
});

// Instance method to calculate forest health
forestSchema.methods.calculateHealth = async function() {
  const Tree = mongoose.model('Tree');
  const trees = await Tree.find({ forestId: this._id });
  
  if (trees.length === 0) return 'unknown';
  
  const aliveTrees = trees.filter(tree => tree.isAlive);
  const healthyTrees = aliveTrees.filter(tree => {
    const latestMeasurement = tree.measurements && tree.measurements.length > 0 
      ? tree.measurements[tree.measurements.length - 1] 
      : null;
    return latestMeasurement && ['excellent', 'good'].includes(latestMeasurement.healthStatus);
  });
  
  const healthPercentage = aliveTrees.length > 0 ? (healthyTrees.length / aliveTrees.length) * 100 : 0;
  
  if (healthPercentage >= 80) return 'excellent';
  if (healthPercentage >= 60) return 'good';
  if (healthPercentage >= 40) return 'fair';
  return 'poor';
};

// Instance method to calculate ecological benefits
forestSchema.methods.calculateEcologicalBenefits = async function() {
  const Tree = mongoose.model('Tree');
  const trees = await Tree.find({ forestId: this._id, isAlive: true });
  
  let totalBenefits = {
    stormwaterIntercepted: { gallons: 0, value: 0 },
    co2Sequestered: { pounds: 0, value: 0 },
    co2Stored: { pounds: 0, value: 0 },
    airPollutantsRemoved: { pounds: 0, value: 0 },
    soilErosionPrevented: { tons: 0, value: 0 },
    wildlifeHabitatValue: { score: 0, value: 0 },
    totalAnnualValue: 0
  };
  
  for (const tree of trees) {
    if (tree.ecologicalBenefits) {
      const benefits = tree.ecologicalBenefits;
      
      if (benefits.stormwaterIntercepted) {
        totalBenefits.stormwaterIntercepted.gallons += benefits.stormwaterIntercepted.gallons || 0;
        totalBenefits.stormwaterIntercepted.value += benefits.stormwaterIntercepted.value || 0;
      }
      
      if (benefits.co2Sequestered) {
        totalBenefits.co2Sequestered.pounds += benefits.co2Sequestered.pounds || 0;
        totalBenefits.co2Sequestered.value += benefits.co2Sequestered.value || 0;
      }
      
      if (benefits.co2Stored) {
        totalBenefits.co2Stored.pounds += benefits.co2Stored.pounds || 0;
        totalBenefits.co2Stored.value += benefits.co2Stored.value || 0;
      }
      
      if (benefits.airPollutantsRemoved) {
        totalBenefits.airPollutantsRemoved.pounds += benefits.airPollutantsRemoved.pounds || 0;
        totalBenefits.airPollutantsRemoved.value += benefits.airPollutantsRemoved.value || 0;
      }
    }
  }
  
  // Calculate forest-level benefits
  const canopyCover = trees.reduce((total, tree) => {
    return total + (tree.canopy && tree.canopy.area ? tree.canopy.area : 0);
  }, 0);
  
  // Soil erosion prevention (based on canopy cover and slope)
  const erosionPreventionRate = 0.5; // tons per square meter of canopy per year
  totalBenefits.soilErosionPrevented.tons = canopyCover * erosionPreventionRate;
  totalBenefits.soilErosionPrevented.value = totalBenefits.soilErosionPrevented.tons * 15; // $15 per ton
  
  // Wildlife habitat value (based on biodiversity and area)
  const habitatScore = this.biodiversity && this.biodiversity.biodiversityIndex ? this.biodiversity.biodiversityIndex : 50;
  totalBenefits.wildlifeHabitatValue.score = habitatScore * this.area;
  totalBenefits.wildlifeHabitatValue.value = totalBenefits.wildlifeHabitatValue.score * 0.5; // $0.50 per score point
  
  // Calculate total annual value
  totalBenefits.totalAnnualValue = 
    totalBenefits.stormwaterIntercepted.value +
    totalBenefits.co2Sequestered.value +
    totalBenefits.airPollutantsRemoved.value +
    totalBenefits.soilErosionPrevented.value +
    totalBenefits.wildlifeHabitatValue.value;
  
  return totalBenefits;
};

// Instance method to calculate forest value
forestSchema.methods.calculateForestValue = async function() {
  const Tree = mongoose.model('Tree');
  const trees = await Tree.find({ forestId: this._id, isAlive: true });
  
  let totalTimberValue = 0;
  let totalCarbonValue = 0;
  
  for (const tree of trees) {
    if (tree.economicValue) {
      totalTimberValue += tree.economicValue.currentTimberValue || 0;
      totalCarbonValue += tree.economicValue.carbonCreditValue || 0;
    }
  }
  
  const ecologicalBenefits = await this.calculateEcologicalBenefits();
  
  return {
    timberValue: totalTimberValue,
    carbonValue: totalCarbonValue,
    ecologicalValue: ecologicalBenefits.totalAnnualValue * 10, // 10-year present value
    totalValue: totalTimberValue + totalCarbonValue + (ecologicalBenefits.totalAnnualValue * 10)
  };
};

// Static method to find forests by owner
forestSchema.statics.findByOwner = function(ownerId) {
  return this.find({ 
    owner: ownerId,
    isActive: true 
  }).populate('owner');
};

// Static method to find forests by region
forestSchema.statics.findByRegion = function(region) {
  return this.find({ 
    region: new RegExp(region, 'i'), 
    isActive: true 
  });
};

// Static method to find forests within a date range
forestSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    establishedDate: {
      $gte: startDate,
      $lte: endDate
    },
    isActive: true
  });
};

// Static method to find forests by type
forestSchema.statics.findByType = function(isPlantation) {
  return this.find({
    isPlantation: isPlantation,
    isActive: true
  });
};

// Static method for aggregated forest statistics
forestSchema.statics.getAggregatedStats = function(ownerFilter = {}) {
  const matchStage = { isActive: true, ...ownerFilter };
  
  return this.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: 'trees',
        localField: '_id',
        foreignField: 'forestId',
        as: 'trees'
      }
    },
    {
      $project: {
        name: 1,
        region: 1,
        area: 1,
        isPlantation: 1,
        owner: 1,
        totalTrees: { $size: '$trees' },
        aliveTrees: {
          $size: {
            $filter: {
              input: '$trees',
              cond: { $eq: ['$$this.isAlive', true] }
            }
          }
        },
        averageHeight: {
          $avg: {
            $map: {
              input: {
                $filter: {
                  input: '$trees',
                  cond: { $eq: ['$$this.isAlive', true] }
                }
              },
              as: 'tree',
              in: {
                $let: {
                  vars: {
                    lastMeasurement: { $arrayElemAt: ['$$tree.measurements', -1] }
                  },
                  in: '$$lastMeasurement.height'
                }
              }
            }
          }
        }
      }
    }
  ]);
};

const Forest = mongoose.model('Forest', forestSchema);

export default Forest;