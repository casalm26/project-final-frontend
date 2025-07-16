// Performance reporting and analysis utilities
import { performanceRatings, PERFORMANCE_THRESHOLDS } from './performanceRatings.js';

export const measureMemoryUsage = () => {
  if (typeof window === 'undefined' || !('performance' in window) || !('memory' in performance)) {
    return null;
  }

  return {
    used: performance.memory.usedJSHeapSize,
    total: performance.memory.totalJSHeapSize,
    limit: performance.memory.jsHeapSizeLimit,
    timestamp: Date.now()
  };
};

export const analyzeBundleSize = () => {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return null;
  }

  const resources = performance.getEntriesByType('resource');
  const bundleStats = {
    totalSize: 0,
    javascript: 0,
    css: 0,
    images: 0,
    fonts: 0,
    other: 0
  };

  resources.forEach(resource => {
    const size = resource.transferSize || 0;
    bundleStats.totalSize += size;

    if (resource.initiatorType === 'script') {
      bundleStats.javascript += size;
    } else if (resource.initiatorType === 'css') {
      bundleStats.css += size;
    } else if (resource.initiatorType === 'img') {
      bundleStats.images += size;
    } else if (resource.name.includes('font')) {
      bundleStats.fonts += size;
    } else {
      bundleStats.other += size;
    }
  });

  return bundleStats;
};

export const generatePerformanceReport = (coreWebVitals, navigation, resources) => {
  const memory = measureMemoryUsage();
  const bundle = analyzeBundleSize();

  return {
    coreWebVitals: {
      lcp: coreWebVitals.lcp,
      fid: coreWebVitals.fid,
      cls: coreWebVitals.cls
    },
    navigation,
    memory,
    bundle,
    resources: resources?.length || 0,
    timestamp: Date.now()
  };
};

export const generateRecommendations = (metrics) => {
  const recommendations = [];

  if (metrics.lcp?.rating === 'poor') {
    recommendations.push({
      type: 'LCP',
      message: 'Largest Contentful Paint is slow. Consider optimizing images and server response times.',
      severity: 'high'
    });
  }

  if (metrics.fid?.rating === 'poor') {
    recommendations.push({
      type: 'FID',
      message: 'First Input Delay is high. Consider reducing JavaScript execution time.',
      severity: 'high'
    });
  }

  if (metrics.cls?.rating === 'poor') {
    recommendations.push({
      type: 'CLS',
      message: 'Cumulative Layout Shift is high. Avoid inserting content without reserved space.',
      severity: 'medium'
    });
  }

  if (metrics.bundle?.javascript > PERFORMANCE_THRESHOLDS.BUNDLE_SIZE.JAVASCRIPT) {
    recommendations.push({
      type: 'Bundle Size',
      message: 'JavaScript bundle is large. Consider code splitting and tree shaking.',
      severity: 'medium'
    });
  }

  if (metrics.memory?.used > PERFORMANCE_THRESHOLDS.MEMORY.HIGH_USAGE) {
    recommendations.push({
      type: 'Memory Usage',
      message: 'High memory usage detected. Check for memory leaks.',
      severity: 'low'
    });
  }

  return recommendations;
};

export const reportMetric = (type, data) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${type}:`, data);
  }

  // In production, you might want to send to analytics service
  // analytics.track('performance_metric', { type, ...data });
};