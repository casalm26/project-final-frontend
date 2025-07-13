import mongoose from 'mongoose';
import crypto from 'crypto';

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  userAgent: {
    type: String,
    maxlength: 500
  },
  ipAddress: {
    type: String,
    maxlength: 45 // IPv6 addresses can be up to 45 characters
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

// Create TTL index for automatic document deletion
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for efficient token lookups
refreshTokenSchema.index({ token: 1, isActive: 1 });
refreshTokenSchema.index({ userId: 1, isActive: 1 });

// Static method to generate a new refresh token
refreshTokenSchema.statics.generateToken = function(userId, userAgent = null, ipAddress = null) {
  const token = crypto.randomBytes(64).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now
  
  return new this({
    token,
    userId,
    userAgent,
    ipAddress,
    expiresAt
  });
};

// Static method to find valid token
refreshTokenSchema.statics.findValidToken = function(token) {
  return this.findOne({
    token,
    isActive: true,
    expiresAt: { $gt: new Date() }
  }).populate('userId');
};

// Instance method to revoke token
refreshTokenSchema.methods.revoke = function() {
  this.isActive = false;
  return this.save();
};

// Static method to revoke all tokens for a user
refreshTokenSchema.statics.revokeAllForUser = function(userId) {
  return this.updateMany(
    { userId, isActive: true },
    { isActive: false }
  );
};

// Static method to cleanup expired tokens (optional, since TTL index handles this)
refreshTokenSchema.statics.cleanupExpired = function() {
  return this.deleteMany({
    expiresAt: { $lte: new Date() }
  });
};

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;