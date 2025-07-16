// Performance monitoring utility - main orchestrator
import { CoreWebVitalsMonitor } from './coreWebVitals.js';
import { ResourceMonitor, getNavigationTiming } from './resourceMonitor.js';
import { performanceRatings } from './performanceRatings.js';
import { 
  measureMemoryUsage, 
  analyzeBundleSize, 
  generatePerformanceReport, 
  generateRecommendations,
  reportMetric 
} from './performanceReporting.js';

class PerformanceMonitor {
  constructor() {
    this.isSupported = typeof window !== 'undefined' && 'performance' in window;
    this.coreWebVitals = null;
    this.resourceMonitor = null;
    this.navigationMetrics = null;
    
    if (this.isSupported) {
      this.initializeMonitors();
    }
  }

  initializeMonitors() {
    // Initialize Core Web Vitals monitor
    this.coreWebVitals = new CoreWebVitalsMonitor();
    this.coreWebVitals.onMetricUpdate = (type, data) => reportMetric(type, data);
    
    // Initialize resource monitor
    this.resourceMonitor = new ResourceMonitor();
    this.resourceMonitor.onResourceTracked = (data) => reportMetric('Resource', data);
    
    // Initialize navigation timing
    this.initializeNavigationTiming();
  }

  initializeNavigationTiming() {
    if (!this.isSupported) return;
    
    window.addEventListener('load', () => {
      this.navigationMetrics = getNavigationTiming();
      if (this.navigationMetrics) {
        reportMetric('Navigation', this.navigationMetrics);
      }
    });
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

  // Get all metrics
  getMetrics() {
    const coreWebVitalsMetrics = this.coreWebVitals?.getMetrics() || {};
    const resources = this.resourceMonitor?.getResources() || [];
    
    return {
      ...coreWebVitalsMetrics,
      navigation: this.navigationMetrics,
      memory: measureMemoryUsage(),
      bundle: analyzeBundleSize(),
      resources,
      timestamp: Date.now()
    };
  }

  // Generate performance report
  generateReport() {
    const coreWebVitalsMetrics = this.coreWebVitals?.getMetrics() || {};
    const resources = this.resourceMonitor?.getResources() || [];
    
    return generatePerformanceReport(
      coreWebVitalsMetrics,
      this.navigationMetrics,
      resources
    );
  }

  // Performance recommendations
  getRecommendations() {
    const metrics = this.getMetrics();
    return generateRecommendations(metrics);
  }

  // Clean up observers
  disconnect() {
    this.coreWebVitals?.disconnect();
    this.resourceMonitor?.disconnect();
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

// TODO: Consider moving performance state to Zustand store for better state management across components
// The current singleton pattern works but could benefit from centralized state management

// Legacy hook export for backward compatibility
export { usePerformanceMetrics as usePerformanceMonitor } from '../hooks/usePerformanceMetrics.js';

export default performanceMonitor; 