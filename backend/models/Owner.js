import mongoose from 'mongoose';

const ownerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Owner name is required'],
    trim: true,
    maxlength: [200, 'Owner name cannot exceed 200 characters']
  },
  
  organizationType: {
    type: String,
    enum: ['government', 'private_company', 'ngo', 'individual', 'cooperative'],
    required: [true, 'Organization type is required']
  },
  
  contactInfo: {
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true,
      maxlength: [500, 'Address cannot exceed 500 characters']
    },
    website: {
      type: String,
      trim: true
    }
  },
  
  // Certifications and compliance
  certifications: [{
    type: {
      type: String,
      enum: ['FSC', 'PEFC', 'ISO14001', 'ISO9001', 'SVEASKOG', 'Other']
    },
    certificationNumber: String,
    issuedDate: Date,
    expiryDate: Date,
    issuingBody: String,
    status: {
      type: String,
      enum: ['active', 'expired', 'pending_renewal'],
      default: 'active'
    }
  }],
  
  // Financial information
  financials: {
    annualRevenue: {
      type: Number,
      min: [0, 'Annual revenue must be positive']
    },
    totalForestValue: {
      type: Number,
      min: [0, 'Total forest value must be positive']
    },
    currency: {
      type: String,
      default: 'SEK',
      enum: ['SEK', 'EUR', 'USD']
    },
    insurancePolicies: [{
      provider: String,
      policyNumber: String,
      coverage: String,
      coverageAmount: Number,
      annualPremium: Number,
      expiryDate: Date,
      isActive: {
        type: Boolean,
        default: true
      }
    }]
  },
  
  // Sustainability goals and commitments
  sustainabilityGoals: {
    carbonNeutralTarget: Date,
    biodiversityTargets: [{
      metric: {
        type: String,
        enum: ['species_diversity', 'habitat_area', 'old_growth_percentage', 'deadwood_volume']
      },
      currentValue: Number,
      targetValue: Number,
      unit: String,
      deadline: Date,
      description: String
    }],
    reforestationCommitment: {
      treesPerYear: Number,
      hectaresPerYear: Number,
      startYear: Number,
      endYear: Number
    },
    communityEngagement: {
      localEmployees: {
        type: Number,
        min: [0, 'Local employees count must be positive']
      },
      educationPrograms: {
        type: Number,
        min: [0, 'Education programs count must be positive']
      },
      publicAccessAreas: {
        type: Number,
        min: [0, 'Public access areas count must be positive']
      },
      communityInvestment: {
        amount: Number,
        currency: {
          type: String,
          default: 'SEK'
        },
        description: String
      }
    }
  },
  
  // Forest management philosophy
  managementApproach: {
    primaryObjective: {
      type: String,
      enum: ['timber_production', 'conservation', 'recreation', 'carbon_sequestration', 'mixed_use'],
      required: [true, 'Primary objective is required']
    },
    harvestingMethod: {
      type: String,
      enum: ['clear_cut', 'selective_harvest', 'shelterwood', 'continuous_cover', 'mixed_methods']
    },
    sustainabilityPrinciples: [{
      principle: String,
      description: String,
      implementationStatus: {
        type: String,
        enum: ['implemented', 'in_progress', 'planned'],
        default: 'planned'
      }
    }]
  },
  
  // Relationships
  forests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Forest'
  }],
  
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Status and metadata
  isActive: {
    type: Boolean,
    default: true
  },
  
  establishedDate: {
    type: Date
  },
  
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for forest count
ownerSchema.virtual('forestCount').get(function() {
  return this.forests ? this.forests.length : 0;
});

// Virtual for user count
ownerSchema.virtual('userCount').get(function() {
  return this.users ? this.users.length : 0;
});

// Instance method to calculate total forest area
ownerSchema.methods.calculateTotalArea = async function() {
  const Forest = mongoose.model('Forest');
  const forests = await Forest.find({ owner: this._id });
  return forests.reduce((total, forest) => total + (forest.area || 0), 0);
};

// Instance method to calculate total tree count
ownerSchema.methods.calculateTotalTrees = async function() {
  const Tree = mongoose.model('Tree');
  const Forest = mongoose.model('Forest');
  
  const forests = await Forest.find({ owner: this._id }).select('_id');
  const forestIds = forests.map(f => f._id);
  
  return await Tree.countDocuments({ forestId: { $in: forestIds } });
};

// Instance method to calculate aggregated ecological benefits
ownerSchema.methods.calculateEcologicalBenefits = async function() {
  const Forest = mongoose.model('Forest');
  const forests = await Forest.find({ owner: this._id });
  
  let totalBenefits = {
    stormwaterIntercepted: { gallons: 0, value: 0 },
    co2Sequestered: { pounds: 0, value: 0 },
    co2Stored: { pounds: 0, value: 0 },
    airPollutantsRemoved: { pounds: 0, value: 0 },
    totalAnnualValue: 0
  };
  
  for (const forest of forests) {
    if (typeof forest.calculateEcologicalBenefits === 'function') {
      const forestBenefits = await forest.calculateEcologicalBenefits();
      
      totalBenefits.stormwaterIntercepted.gallons += forestBenefits.stormwaterIntercepted.gallons || 0;
      totalBenefits.stormwaterIntercepted.value += forestBenefits.stormwaterIntercepted.value || 0;
      totalBenefits.co2Sequestered.pounds += forestBenefits.co2Sequestered.pounds || 0;
      totalBenefits.co2Sequestered.value += forestBenefits.co2Sequestered.value || 0;
      totalBenefits.co2Stored.pounds += forestBenefits.co2Stored.pounds || 0;
      totalBenefits.co2Stored.value += forestBenefits.co2Stored.value || 0;
      totalBenefits.airPollutantsRemoved.pounds += forestBenefits.airPollutantsRemoved.pounds || 0;
      totalBenefits.airPollutantsRemoved.value += forestBenefits.airPollutantsRemoved.value || 0;
      totalBenefits.totalAnnualValue += forestBenefits.totalAnnualValue || 0;
    }
  }
  
  return totalBenefits;
};

// Static method to find owners with expiring certifications
ownerSchema.statics.findExpiringCertifications = function(daysFromNow = 90) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysFromNow);
  
  return this.find({
    'certifications.expiryDate': { $lte: futureDate },
    'certifications.status': 'active'
  });
};

// Indexes for better query performance
ownerSchema.index({ name: 1 });
ownerSchema.index({ organizationType: 1 });
ownerSchema.index({ 'contactInfo.email': 1 });
ownerSchema.index({ isActive: 1 });
ownerSchema.index({ 'managementApproach.primaryObjective': 1 });

export const Owner = mongoose.model('Owner', ownerSchema);