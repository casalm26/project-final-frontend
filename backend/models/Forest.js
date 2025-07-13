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
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    soilType: String,
    climate: String,
    elevation: Number,
    avgRainfall: Number,
    avgTemperature: Number
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
forestSchema.index({ location: '2dsphere' });

// Index for common query patterns
forestSchema.index({ region: 1, isActive: 1 });
forestSchema.index({ establishedDate: 1 });

// Update the updatedAt field before saving
forestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for tree count
forestSchema.virtual('treeCount', {
  ref: 'Tree',
  localField: '_id',
  foreignField: 'forestId',
  count: true
});

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

const Forest = mongoose.model('Forest', forestSchema);

export default Forest;