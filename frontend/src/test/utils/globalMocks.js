/**
 * Global mocks for testing environment
 * Provides mock implementations for browser APIs that aren't available in jsdom
 */

/**
 * Mock IntersectionObserver API
 * Used for components that implement lazy loading or visibility detection
 */
export const mockIntersectionObserver = () => {
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  };
};

/**
 * Mock ResizeObserver API
 * Used for components that need to respond to element size changes
 */
export const mockResizeObserver = () => {
  global.ResizeObserver = class ResizeObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  };
};

/**
 * Mock matchMedia API
 * Used for responsive design and media query handling
 */
export const mockMatchMedia = () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

/**
 * Setup all global mocks
 * Call this function in test setup to initialize all necessary mocks
 */
export const setupGlobalMocks = () => {
  mockIntersectionObserver();
  mockResizeObserver();
  mockMatchMedia();
};