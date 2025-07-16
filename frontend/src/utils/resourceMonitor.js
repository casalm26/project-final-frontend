// Resource monitoring utility
export class ResourceMonitor {
  constructor() {
    this.resources = [];
    this.observer = null;
    this.isSupported = typeof window !== 'undefined' && 'PerformanceObserver' in window;
    
    if (this.isSupported) {
      this.initializeObserver();
    }
  }

  initializeObserver() {
    try {
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (this.shouldTrackResource(entry)) {
            this.trackResourceLoad(entry);
          }
        });
      });
      
      this.observer.observe({ type: 'resource', buffered: true });
    } catch (error) {
      console.warn('Resource observer not supported:', error);
    }
  }

  shouldTrackResource(entry) {
    const trackedTypes = ['img', 'script', 'css'];
    return trackedTypes.includes(entry.initiatorType);
  }

  trackResourceLoad(entry) {
    const resourceData = {
      name: entry.name,
      type: entry.initiatorType,
      duration: entry.duration,
      size: entry.transferSize,
      timestamp: Date.now()
    };

    this.resources.push(resourceData);
    
    // Keep only last 100 resource entries to prevent memory issues
    if (this.resources.length > 100) {
      this.resources.splice(0, this.resources.length - 100);
    }

    this.onResourceTracked(resourceData);
  }

  onResourceTracked(resourceData) {
    // Override this method to handle resource tracking events
    if (process.env.NODE_ENV === 'development') {
      console.log('[Resource Monitor] Tracked:', resourceData);
    }
  }

  getResources() {
    return [...this.resources];
  }

  getResourceCount() {
    return this.resources.length;
  }

  getResourcesByType(type) {
    return this.resources.filter(resource => resource.type === type);
  }

  getTotalResourceSize() {
    return this.resources.reduce((total, resource) => total + (resource.size || 0), 0);
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

// Navigation timing utility
export const getNavigationTiming = () => {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return null;
  }

  const navTiming = performance.getEntriesByType('navigation')[0];
  if (!navTiming) return null;

  return {
    domContentLoaded: navTiming.domContentLoadedEventEnd - navTiming.domContentLoadedEventStart,
    domComplete: navTiming.domComplete - navTiming.navigationStart,
    loadComplete: navTiming.loadEventEnd - navTiming.navigationStart,
    firstByte: navTiming.responseStart - navTiming.requestStart,
    timestamp: Date.now()
  };
};