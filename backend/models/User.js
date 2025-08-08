import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  
  // Owner relationship - null for admin users (they can access all data)
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
    default: null // Admin users have no owner, regular users belong to an owner
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to check if user is admin
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

// Instance method to check if user can access owner data
userSchema.methods.canAccessOwner = function(ownerId) {
  // Admin users can access all owners
  if (this.isAdmin()) return true;
  
  // Regular users can only access their own owner's data
  return this.owner && this.owner.toString() === ownerId.toString();
};

// Instance method to check if user can access forest data
userSchema.methods.canAccessForest = async function(forestId) {
  // Admin users can access all forests
  if (this.isAdmin()) return true;
  
  // Regular users can only access forests owned by their owner
  const Forest = mongoose.model('Forest');
  const forest = await Forest.findById(forestId);
  
  if (!forest || !this.owner) return false;
  
  return forest.owner.toString() === this.owner.toString();
};

// Instance method to get user info without password
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find users by owner
userSchema.statics.findByOwner = function(ownerId) {
  return this.find({ owner: ownerId, isActive: true });
};

// Add index for owner-based queries
userSchema.index({ owner: 1, isActive: 1 });

const User = mongoose.model('User', userSchema);

export default User;