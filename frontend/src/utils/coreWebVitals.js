// Core Web Vitals monitoring utility
export class CoreWebVitalsMonitor {
  constructor() {
    this.metrics = {};
    this.observers = new Map();
    this.isSupported = typeof window !== 'undefined' && 'PerformanceObserver' in window;
    
    if (this.isSupported) {
      this.initializeObservers();
    }
  }

  initializeObservers() {
    this.observeLargestContentfulPaint();
    this.observeFirstInputDelay();
    this.observeCumulativeLayoutShift();
  }

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
        
        this.onMetricUpdate('LCP', this.metrics.lcp);
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
          
          this.onMetricUpdate('FID', this.metrics.fid);
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
        
        this.onMetricUpdate('CLS', this.metrics.cls);
      });
      
      observer.observe({ type: 'layout-shift', buffered: true });
      this.observers.set('cls', observer);
    } catch (error) {
      console.warn('CLS observer not supported:', error);
    }
  }

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

  onMetricUpdate(type, data) {
    // Override this method to handle metric updates
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Core Web Vitals] ${type}:`, data);
    }
  }

  getMetrics() {
    return { ...this.metrics };
  }

  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}