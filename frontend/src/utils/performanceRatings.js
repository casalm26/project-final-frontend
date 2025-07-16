// Performance rating and threshold utilities
export const PERFORMANCE_THRESHOLDS = {
  LCP: {
    GOOD: 2500,
    NEEDS_IMPROVEMENT: 4000
  },
  FID: {
    GOOD: 100,
    NEEDS_IMPROVEMENT: 300
  },
  CLS: {
    GOOD: 0.1,
    NEEDS_IMPROVEMENT: 0.25
  },
  BUNDLE_SIZE: {
    JAVASCRIPT: 1000000, // 1MB
  },
  MEMORY: {
    HIGH_USAGE: 50000000 // 50MB
  }
};

export const RATING_TYPES = {
  GOOD: 'good',
  NEEDS_IMPROVEMENT: 'needs-improvement',
  POOR: 'poor'
};

export const performanceRatings = {
  rateLCP(value) {
    if (value <= PERFORMANCE_THRESHOLDS.LCP.GOOD) return RATING_TYPES.GOOD;
    if (value <= PERFORMANCE_THRESHOLDS.LCP.NEEDS_IMPROVEMENT) return RATING_TYPES.NEEDS_IMPROVEMENT;
    return RATING_TYPES.POOR;
  },

  rateFID(value) {
    if (value <= PERFORMANCE_THRESHOLDS.FID.GOOD) return RATING_TYPES.GOOD;
    if (value <= PERFORMANCE_THRESHOLDS.FID.NEEDS_IMPROVEMENT) return RATING_TYPES.NEEDS_IMPROVEMENT;
    return RATING_TYPES.POOR;
  },

  rateCLS(value) {
    if (value <= PERFORMANCE_THRESHOLDS.CLS.GOOD) return RATING_TYPES.GOOD;
    if (value <= PERFORMANCE_THRESHOLDS.CLS.NEEDS_IMPROVEMENT) return RATING_TYPES.NEEDS_IMPROVEMENT;
    return RATING_TYPES.POOR;
  },

  getBundleSizeRating(javascriptSize) {
    return javascriptSize > PERFORMANCE_THRESHOLDS.BUNDLE_SIZE.JAVASCRIPT 
      ? RATING_TYPES.NEEDS_IMPROVEMENT 
      : RATING_TYPES.GOOD;
  },

  getMemoryUsageRating(memoryUsed) {
    return memoryUsed > PERFORMANCE_THRESHOLDS.MEMORY.HIGH_USAGE 
      ? RATING_TYPES.NEEDS_IMPROVEMENT 
      : RATING_TYPES.GOOD;
  }
};