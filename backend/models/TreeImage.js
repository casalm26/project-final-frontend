import mongoose from 'mongoose';
import path from 'path';

const treeImageSchema = new mongoose.Schema({
  treeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tree',
    required: [true, 'Tree ID is required'],
    index: true
  },
  filename: {
    type: String,
    required: [true, 'Filename is required']
  },
  originalName: {
    type: String,
    required: [true, 'Original filename is required']
  },
  mimeType: {
    type: String,
    required: [true, 'MIME type is required']
  },
  size: {
    type: Number,
    required: [true, 'File size is required']
  },
  path: {
    type: String,
    required: [true, 'File path is required']
  },
  thumbnailPath: {
    type: String
  },
  metadata: {
    width: Number,
    height: Number,
    format: String,
    hasAlpha: Boolean
  },
  imageType: {
    type: String,
    enum: ['tree_photo', 'measurement_photo', 'health_assessment', 'general'],
    default: 'tree_photo'
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  capturedAt: {
    type: Date,
    default: Date.now
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  measurementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tree.measurements',
    sparse: true
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

// Indexes for efficient queries
treeImageSchema.index({ treeId: 1, capturedAt: -1 });
treeImageSchema.index({ uploadedBy: 1, createdAt: -1 });
treeImageSchema.index({ imageType: 1 });
treeImageSchema.index({ location: '2dsphere' });
treeImageSchema.index({ tags: 1 });

// Update the updatedAt field before saving
treeImageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for full URL
treeImageSchema.virtual('url').get(function() {
  if (this.path) {
    return `/uploads/trees/${this.filename}`;
  }
  return null;
});

// Virtual for thumbnail URL
treeImageSchema.virtual('thumbnailUrl').get(function() {
  if (this.thumbnailPath) {
    return `/uploads/thumbnails/${path.basename(this.thumbnailPath)}`;
  }
  return null;
});

// Instance method to get public image data
treeImageSchema.methods.toPublicJSON = function() {
  return {
    _id: this._id,
    filename: this.filename,
    originalName: this.originalName,
    mimeType: this.mimeType,
    size: this.size,
    url: this.url,
    thumbnailUrl: this.thumbnailUrl,
    metadata: this.metadata,
    imageType: this.imageType,
    description: this.description,
    capturedAt: this.capturedAt,
    tags: this.tags,
    location: this.location,
    createdAt: this.createdAt
  };
};

// Static method to find images by tree
treeImageSchema.statics.findByTree = function(treeId, options = {}) {
  const {
    imageType,
    limit = 50,
    skip = 0,
    sortBy = '-capturedAt'
  } = options;

  const query = { 
    treeId, 
    isActive: true 
  };

  if (imageType) {
    query.imageType = imageType;
  }

  return this.find(query)
    .sort(sortBy)
    .limit(limit)
    .skip(skip)
    .populate('uploadedBy', 'firstName lastName email');
};

// Static method to find recent images
treeImageSchema.statics.findRecent = function(limit = 20) {
  return this.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('treeId', 'species plantedDate')
    .populate('uploadedBy', 'firstName lastName');
};

// Static method to get image statistics
treeImageSchema.statics.getImageStats = async function(treeId) {
  const stats = await this.aggregate([
    {
      $match: { 
        treeId: new mongoose.Types.ObjectId(treeId),
        isActive: true 
      }
    },
    {
      $group: {
        _id: '$imageType',
        count: { $sum: 1 },
        totalSize: { $sum: '$size' },
        latestImage: { $max: '$capturedAt' }
      }
    }
  ]);

  const totalStats = await this.aggregate([
    {
      $match: { 
        treeId: new mongoose.Types.ObjectId(treeId),
        isActive: true 
      }
    },
    {
      $group: {
        _id: null,
        totalImages: { $sum: 1 },
        totalSize: { $sum: '$size' },
        firstImage: { $min: '$capturedAt' },
        latestImage: { $max: '$capturedAt' }
      }
    }
  ]);

  return {
    byType: stats,
    total: totalStats[0] || {
      totalImages: 0,
      totalSize: 0,
      firstImage: null,
      latestImage: null
    }
  };
};

const TreeImage = mongoose.model('TreeImage', treeImageSchema);

export default TreeImage;