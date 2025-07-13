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
  images: [{
    url: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    soilCondition: String,
    sunlightExposure: {
      type: String,
      enum: ['full_sun', 'partial_sun', 'partial_shade', 'full_shade']
    },
    waterAccess: {
      type: String,
      enum: ['excellent', 'good', 'moderate', 'poor']
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

const Tree = mongoose.model('Tree', treeSchema);

export default Tree;