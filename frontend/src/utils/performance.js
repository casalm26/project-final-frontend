// Performance monitoring utility
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = new Map();
    this.isSupported = typeof window !== 'undefined' && 'performance' in window;
    
    if (this.isSupported) {
      this.initializeObservers();
    }
  }

  initializeObservers() {
    // Performance Observer for various entry types
    if ('PerformanceObserver' in window) {
      this.observeNavigationTiming();
      this.observeLargestContentfulPaint();
      this.observeFirstInputDelay();
      this.observeCumulativeLayoutShift();
      this.observeResourceTiming();
    }
  }

  // Core Web Vitals
  observeLargestContentfulPaint() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        this.metrics.lcp = {
          value: lastEntry.startTime,
          timestamp: Date.now(),
          rating: this.rateLCP(lastEntry.startTime)
        };
        
        this.reportMetric('LCP', this.metrics.lcp);
      });
      
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.set('lcp', observer);
    } catch (error) {
      console.warn('LCP observer not supported:', error);
    }
  }

  observeFirstInputDelay() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.fid = {
            value: entry.processingStart - entry.startTime,
            timestamp: Date.now(),
            rating: this.rateFID(entry.processingStart - entry.startTime)
          };
          
          this.reportMetric('FID', this.metrics.fid);
        });
      });
      
      observer.observe({ type: 'first-input', buffered: true });
      this.observers.set('fid', observer);
    } catch (error) {
      console.warn('FID observer not supported:', error);
    }
  }

  observeCumulativeLayoutShift() {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        this.metrics.cls = {
          value: clsValue,
          timestamp: Date.now(),
          rating: this.rateCLS(clsValue)
        };
        
        this.reportMetric('CLS', this.metrics.cls);
      });
      
      observer.observe({ type: 'layout-shift', buffered: true });
      this.observers.set('cls', observer);
    } catch (error) {
      console.warn('CLS observer not supported:', error);
    }
  }

  observeNavigationTiming() {
    if (!this.isSupported) return;
    
    window.addEventListener('load', () => {
      const navTiming = performance.getEntriesByType('navigation')[0];
      if (navTiming) {
        this.metrics.navigation = {
          domContentLoaded: navTiming.domContentLoadedEventEnd - navTiming.domContentLoadedEventStart,
          domComplete: navTiming.domComplete - navTiming.navigationStart,
          loadComplete: navTiming.loadEventEnd - navTiming.navigationStart,
          firstByte: navTiming.responseStart - navTiming.requestStart,
          timestamp: Date.now()
        };
        
        this.reportMetric('Navigation', this.metrics.navigation);
      }
    });
  }

  observeResourceTiming() {
    if (!this.isSupported) return;
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.initiatorType === 'img' || entry.initiatorType === 'script' || entry.initiatorType === 'css') {
          this.trackResourceLoad(entry);
        }
      });
    });
    
    observer.observe({ type: 'resource', buffered: true });
    this.observers.set('resource', observer);
  }

  trackResourceLoad(entry) {
    const resourceMetrics = this.metrics.resources || [];
    resourceMetrics.push({
      name: entry.name,
      type: entry.initiatorType,
      duration: entry.duration,
      size: entry.transferSize,
      timestamp: Date.now()
    });
    
    this.metrics.resources = resourceMetrics;
    
    // Keep only last 100 resource entries
    if (resourceMetrics.length > 100) {
      resourceMetrics.splice(0, resourceMetrics.length - 100);
    }
  }

  // Rating functions based on Core Web Vitals thresholds
  rateLCP(value) {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  }

  rateFID(value) {
    if (value <= 100) return 'good';
    if (value <= 300) return 'needs-improvement';
    return 'poor';
  }

  rateCLS(value) {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  }

  // Memory usage monitoring
  measureMemoryUsage() {
    if ('memory' in performance) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
        timestamp: Date.now()
      };
    }
    return null;
  }

  // Bundle size analysis
  analyzeBundleSize() {
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
  }

  // Track custom metrics
  mark(name) {
    if (this.isSupported) {
      performance.mark(name);
    }
  }

  measure(name, startMark, endMark) {
    if (this.isSupported) {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name, 'measure')[0];
      return measure ? measure.duration : null;
    }
    return null;
  }

  // Report metrics (can be extended to send to analytics service)
  reportMetric(type, data) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${type}:`, data);
    }

    // In production, you might want to send to analytics service
    // analytics.track('performance_metric', { type, ...data });
  }

  // Get all metrics
  getMetrics() {
    return {
      ...this.metrics,
      memory: this.measureMemoryUsage(),
      bundle: this.analyzeBundleSize(),
      timestamp: Date.now()
    };
  }

  // Generate performance report
  generateReport() {
    const metrics = this.getMetrics();
    const report = {
      coreWebVitals: {
        lcp: metrics.lcp,
        fid: metrics.fid,
        cls: metrics.cls
      },
      navigation: metrics.navigation,
      memory: metrics.memory,
      bundle: metrics.bundle,
      resources: metrics.resources?.length || 0,
      timestamp: Date.now()
    };

    return report;
  }

  // Performance recommendations
  getRecommendations() {
    const metrics = this.getMetrics();
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

    if (metrics.bundle?.javascript > 1000000) { // 1MB
      recommendations.push({
        type: 'Bundle Size',
        message: 'JavaScript bundle is large. Consider code splitting and tree shaking.',
        severity: 'medium'
      });
    }

    if (metrics.memory?.used > 50000000) { // 50MB
      recommendations.push({
        type: 'Memory Usage',
        message: 'High memory usage detected. Check for memory leaks.',
        severity: 'low'
      });
    }

    return recommendations;
  }

  // Clean up observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Export utilities
export const trackPerformance = {
  mark: (name) => performanceMonitor.mark(name),
  measure: (name, startMark, endMark) => performanceMonitor.measure(name, startMark, endMark),
  getMetrics: () => performanceMonitor.getMetrics(),
  generateReport: () => performanceMonitor.generateReport(),
  getRecommendations: () => performanceMonitor.getRecommendations(),
  disconnect: () => performanceMonitor.disconnect()
};

// React hook for performance monitoring
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = React.useState({});
  const [isSupported] = React.useState(performanceMonitor.isSupported);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(performanceMonitor.getMetrics());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return { metrics, isSupported, trackPerformance };
};

export default performanceMonitor; 