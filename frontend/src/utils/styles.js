import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import tokens from '../styles/tokens.js';

/**
 * Utility function for composing class names with Tailwind CSS
 * Combines clsx for conditional classes and tailwind-merge for handling conflicts
 * @param {...any} inputs - Class name inputs (strings, objects, arrays)
 * @returns {string} - Merged class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Get a color value from the design tokens
 * @param {string} colorPath - Dot-separated path to color (e.g., 'primary.500', 'gray.100')
 * @param {string} fallback - Fallback color if path not found
 * @returns {string} - Color value or fallback
 */
export function getColorValue(colorPath, fallback = '#000000') {
  const pathParts = colorPath.split('.');
  let color = tokens.colors;
  
  for (const part of pathParts) {
    if (color && typeof color === 'object' && part in color) {
      color = color[part];
    } else {
      return fallback;
    }
  }
  
  return typeof color === 'string' ? color : fallback;
}

/**
 * Get a spacing value from the design tokens
 * @param {string|number} spacing - Spacing key
 * @param {string} fallback - Fallback value
 * @returns {string} - Spacing value or fallback
 */
export function getSpacing(spacing, fallback = '0') {
  return tokens.spacing[spacing] || fallback;
}

/**
 * Get a breakpoint value from the design tokens
 * @param {string} breakpoint - Breakpoint key
 * @returns {string} - Breakpoint value
 */
export function getBreakpoint(breakpoint) {
  return tokens.screens[breakpoint] || '0px';
}

/**
 * Create component variants using a configuration object
 * @param {Object} config - Variants configuration
 * @param {Object} config.base - Base classes applied to all variants
 * @param {Object} config.variants - Variant-specific classes
 * @param {Object} config.defaultVariants - Default variant values
 * @returns {Function} - Function that returns classes based on variant props
 */
export function createVariants(config) {
  const { base = '', variants = {}, defaultVariants = {} } = config;
  
  return function(props = {}) {
    const appliedVariants = { ...defaultVariants, ...props };
    
    let classes = base;
    
    for (const [variantKey, variantValue] of Object.entries(appliedVariants)) {
      if (variants[variantKey] && variants[variantKey][variantValue]) {
        classes = cn(classes, variants[variantKey][variantValue]);
      }
    }
    
    return classes;
  };
}

/**
 * Convert hex color to RGB values
 * @param {string} hex - Hex color code
 * @returns {Object} - RGB values {r, g, b}
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calculate contrast ratio between two colors
 * @param {string} color1 - First color (hex)
 * @param {string} color2 - Second color (hex)
 * @returns {number} - Contrast ratio
 */
export function getContrastRatio(color1, color2) {
  const getLuminance = (hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get accessible text color (black or white) for a given background
 * @param {string} backgroundColor - Background color (hex)
 * @param {Object} options - Options for text colors
 * @param {string} options.light - Light text color (default: white)
 * @param {string} options.dark - Dark text color (default: black)
 * @returns {string} - Accessible text color
 */
export function getAccessibleTextColor(backgroundColor, options = {}) {
  const { light = '#ffffff', dark = '#000000' } = options;
  
  const whiteContrast = getContrastRatio(backgroundColor, light);
  const blackContrast = getContrastRatio(backgroundColor, dark);
  
  return whiteContrast > blackContrast ? light : dark;
}

/**
 * Create responsive class names for different breakpoints
 * @param {Object} values - Object with breakpoint keys and class values
 * @returns {string} - Responsive class names
 */
export function responsive(values) {
  const breakpointOrder = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  
  return Object.entries(values)
    .sort(([a], [b]) => {
      const aIndex = breakpointOrder.indexOf(a);
      const bIndex = breakpointOrder.indexOf(b);
      return aIndex - bIndex;
    })
    .map(([breakpoint, value]) => {
      if (breakpoint === 'xs' || breakpoint === 'base') {
        return value;
      }
      return `${breakpoint}:${value}`;
    })
    .join(' ');
}

/**
 * Generate CSS custom properties from design tokens
 * @param {Object} tokenObject - Token object to convert
 * @param {string} prefix - CSS variable prefix
 * @returns {Object} - CSS custom properties object
 */
export function generateCSSCustomProperties(tokenObject, prefix = '--') {
  const properties = {};
  
  function flatten(obj, currentKey = '') {
    for (const [key, value] of Object.entries(obj)) {
      const newKey = currentKey ? `${currentKey}-${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        flatten(value, newKey);
      } else {
        properties[`${prefix}${newKey}`] = Array.isArray(value) ? value[0] : value;
      }
    }
  }
  
  flatten(tokenObject);
  return properties;
}

/**
 * Format class names for better readability in development
 * @param {string} classes - Class names string
 * @returns {string} - Formatted class names
 */
export function formatClasses(classes) {
  if (process.env.NODE_ENV === 'development') {
    return classes
      .split(' ')
      .filter(Boolean)
      .sort()
      .join(' ');
  }
  return classes;
}

/**
 * Utility for conditional dark mode classes
 * @param {string} lightClass - Classes for light mode
 * @param {string} darkClass - Classes for dark mode
 * @returns {string} - Combined light and dark mode classes
 */
export function darkMode(lightClass, darkClass) {
  return cn(lightClass, `dark:${darkClass}`);
}

export default {
  cn,
  getColorValue,
  getSpacing,
  getBreakpoint,
  createVariants,
  hexToRgb,
  getContrastRatio,
  getAccessibleTextColor,
  responsive,
  generateCSSCustomProperties,
  formatClasses,
  darkMode,
};