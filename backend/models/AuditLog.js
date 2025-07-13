import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: [true, 'Action is required'],
    enum: [
      'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 
      'REGISTER', 'PASSWORD_CHANGE', 'ROLE_CHANGE',
      'EXPORT', 'BULK_UPDATE', 'BULK_DELETE'
    ]
  },
  resource: {
    type: String,
    required: [true, 'Resource is required'],
    enum: ['User', 'Forest', 'Tree', 'Measurement', 'RefreshToken', 'Export']
  },
  resourceId: {
    type: String, // Can be ObjectId or custom ID like treeId
    required: function() {
      return !['LOGIN', 'LOGOUT', 'REGISTER', 'EXPORT'].includes(this.action);
    }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userRole: {
    type: String,
    enum: ['user', 'admin'],
    required: true
  },
  changes: {
    before: mongoose.Schema.Types.Mixed, // Previous state of the document
    after: mongoose.Schema.Types.Mixed   // New state of the document
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    endpoint: String,
    method: String,
    statusCode: Number,
    errorMessage: String,
    additionalInfo: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  }
});

// Indexes for efficient querying
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ resource: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ resourceId: 1 });

// TTL index to automatically remove old audit logs (1 year retention)
auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

// Static method to create audit log
auditLogSchema.statics.createLog = function(logData) {
  return new this(logData).save();
};

// Static method to get logs for a specific resource
auditLogSchema.statics.getResourceLogs = function(resource, resourceId, limit = 50) {
  return this.find({ resource, resourceId })
    .populate('userId', 'firstName lastName email')
    .sort({ timestamp: -1 })
    .limit(limit);
};

// Static method to get user activity logs
auditLogSchema.statics.getUserActivity = function(userId, limit = 100) {
  return this.find({ userId })
    .sort({ timestamp: -1 })
    .limit(limit);
};

// Static method to get logs within date range
auditLogSchema.statics.getLogsByDateRange = function(startDate, endDate, options = {}) {
  const query = {
    timestamp: {
      $gte: startDate,
      $lte: endDate
    }
  };

  if (options.userId) query.userId = options.userId;
  if (options.resource) query.resource = options.resource;
  if (options.action) query.action = options.action;

  return this.find(query)
    .populate('userId', 'firstName lastName email')
    .sort({ timestamp: -1 })
    .limit(options.limit || 1000);
};

// Static method to get audit statistics
auditLogSchema.statics.getAuditStatistics = async function(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const stats = await this.aggregate([
    { $match: { timestamp: { $gte: startDate } } },
    {
      $group: {
        _id: {
          action: '$action',
          resource: '$resource'
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.resource',
        actions: {
          $push: {
            action: '$_id.action',
            count: '$count'
          }
        },
        totalCount: { $sum: '$count' }
      }
    },
    { $sort: { totalCount: -1 } }
  ]);

  const totalLogs = await this.countDocuments({
    timestamp: { $gte: startDate }
  });

  const uniqueUsers = await this.distinct('userId', {
    timestamp: { $gte: startDate }
  });

  return {
    totalLogs,
    uniqueUsers: uniqueUsers.length,
    resourceStats: stats,
    periodDays: days
  };
};

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;