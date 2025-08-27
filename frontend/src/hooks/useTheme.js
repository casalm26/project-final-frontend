import { useMemo } from 'react';
import tokens from '../styles/tokens.js';
import variants from '../styles/variants.js';
import { 
  getColorValue, 
  getSpacing, 
  getBreakpoint,
  getAccessibleTextColor,
  getContrastRatio,
  hexToRgb,
  generateCSSCustomProperties,
} from '../utils/styles.js';

/**
 * Custom hook for accessing design tokens and theme utilities
 * Provides programmatic access to the design system
 */
export function useTheme() {
  // Memoize theme utilities to prevent unnecessary recalculations
  const themeUtils = useMemo(() => ({
    // Direct access to tokens
    tokens,
    variants,

    // Color utilities
    getColor: (colorPath, fallback) => getColorValue(colorPath, fallback),
    getSpacing: (spacing, fallback) => getSpacing(spacing, fallback),
    getBreakpoint: (breakpoint) => getBreakpoint(breakpoint),
    
    // Accessibility utilities
    getAccessibleTextColor: (bgColor, options) => getAccessibleTextColor(bgColor, options),
    getContrastRatio: (color1, color2) => getContrastRatio(color1, color2),
    hexToRgb: (hex) => hexToRgb(hex),
    
    // CSS custom properties
    getCSSCustomProperties: (tokenObject, prefix) => generateCSSCustomProperties(tokenObject, prefix),

    // Theme queries
    getColorScale: (colorName) => tokens.colors[colorName] || {},
    getAllColors: () => tokens.colors,
    getTypographyScale: () => tokens.typography,
    getSpacingScale: () => tokens.spacing,
    getBreakpoints: () => tokens.screens,
    getShadows: () => tokens.boxShadow,

    // Component utilities
    getComponentTokens: (componentName) => tokens.components[componentName] || {},
    getVariantClasses: (componentName, props) => {
      const variantFn = variants[componentName];
      return variantFn ? variantFn(props) : '';
    },

    // Responsive utilities
    isBreakpoint: (breakpoint, windowWidth) => {
      const breakpointValue = parseInt(getBreakpoint(breakpoint));
      return windowWidth >= breakpointValue;
    },

    // Dark mode utilities
    isDarkMode: () => {
      if (typeof window !== 'undefined') {
        return document.documentElement.classList.contains('dark');
      }
      return false;
    },

    // Color manipulation utilities
    adjustColorOpacity: (colorPath, opacity) => {
      const color = getColorValue(colorPath);
      const rgb = hexToRgb(color);
      if (!rgb) return color;
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
    },

    // Generate Tailwind classes dynamically
    generateClasses: {
      spacing: (property, value) => `${property}-${value}`,
      color: (property, colorPath) => {
        const [colorName, shade] = colorPath.split('.');
        return shade ? `${property}-${colorName}-${shade}` : `${property}-${colorName}`;
      },
      responsive: (breakpoint, classes) => {
        return breakpoint === 'base' ? classes : `${breakpoint}:${classes}`;
      },
    },

    // Theme validation
    validateColorPath: (colorPath) => {
      try {
        return !!getColorValue(colorPath);
      } catch {
        return false;
      }
    },

    validateSpacing: (spacing) => {
      return spacing in tokens.spacing;
    },

    validateBreakpoint: (breakpoint) => {
      return breakpoint in tokens.screens;
    },
  }), []);

  return themeUtils;
}

/**
 * Hook for accessing color values with dark mode support
 * @param {string} lightColor - Color path for light mode
 * @param {string} darkColor - Color path for dark mode (optional)
 * @returns {Object} - Object with light and dark color values and utilities
 */
export function useThemeColor(lightColor, darkColor = null) {
  const { getColor, isDarkMode, adjustColorOpacity } = useTheme();

  return useMemo(() => {
    const light = getColor(lightColor);
    const dark = darkColor ? getColor(darkColor) : light;
    const current = isDarkMode() ? dark : light;

    return {
      light,
      dark,
      current,
      // Utility methods
      withOpacity: (opacity) => adjustColorOpacity(isDarkMode() ? darkColor || lightColor : lightColor, opacity),
      rgb: hexToRgb(current),
      contrastWith: (otherColor) => getContrastRatio(current, otherColor),
    };
  }, [lightColor, darkColor, getColor, isDarkMode, adjustColorOpacity]);
}

/**
 * Hook for responsive design utilities
 * @returns {Object} - Responsive utilities and current breakpoint info
 */
export function useResponsive() {
  const { getBreakpoints, isBreakpoint } = useTheme();

  return useMemo(() => {
    const breakpoints = getBreakpoints();
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;

    // Determine current breakpoint
    const currentBreakpoint = Object.entries(breakpoints)
      .reverse()
      .find(([, width]) => windowWidth >= parseInt(width))?.[0] || 'xs';

    return {
      breakpoints,
      currentBreakpoint,
      windowWidth,
      // Utility methods
      isXs: () => isBreakpoint('xs', windowWidth),
      isSm: () => isBreakpoint('sm', windowWidth),
      isMd: () => isBreakpoint('md', windowWidth),
      isLg: () => isBreakpoint('lg', windowWidth),
      isXl: () => isBreakpoint('xl', windowWidth),
      is2Xl: () => isBreakpoint('2xl', windowWidth),
      isAtLeast: (breakpoint) => isBreakpoint(breakpoint, windowWidth),
      // Responsive class generators
      responsive: (classMap) => {
        return Object.entries(classMap)
          .map(([bp, classes]) => bp === 'base' ? classes : `${bp}:${classes}`)
          .join(' ');
      },
    };
  }, [getBreakpoints, isBreakpoint]);
}

/**
 * Hook for accessing component variant functions
 * @param {string} componentName - Name of the component
 * @returns {Function} - Variant function for the component
 */
export function useVariants(componentName) {
  const { getVariantClasses } = useTheme();

  return useMemo(() => {
    return (props = {}) => getVariantClasses(componentName, props);
  }, [componentName, getVariantClasses]);
}

/**
 * Hook for dark mode detection and utilities
 * @returns {Object} - Dark mode state and utilities
 */
export function useDarkMode() {
  const { isDarkMode } = useTheme();

  return useMemo(() => {
    const darkMode = isDarkMode();

    return {
      isDark: darkMode,
      isLight: !darkMode,
      // Utility methods
      toggle: () => {
        if (typeof window !== 'undefined') {
          document.documentElement.classList.toggle('dark');
        }
      },
      enable: () => {
        if (typeof window !== 'undefined') {
          document.documentElement.classList.add('dark');
        }
      },
      disable: () => {
        if (typeof window !== 'undefined') {
          document.documentElement.classList.remove('dark');
        }
      },
      // Conditional class helper
      conditional: (lightClasses, darkClasses) => {
        return darkMode ? darkClasses : lightClasses;
      },
    };
  }, [isDarkMode]);
}

/**
 * Hook for accessing typography utilities
 * @returns {Object} - Typography scale and utilities
 */
export function useTypography() {
  const { getTypographyScale, getVariantClasses } = useTheme();

  return useMemo(() => {
    const scale = getTypographyScale();

    return {
      scale,
      // Utility methods
      getFontSize: (size) => scale.fontSize[size],
      getFontWeight: (weight) => scale.fontWeight[weight],
      getFontFamily: (family) => scale.fontFamily[family],
      // Text variant classes
      getTextClasses: (props) => getVariantClasses('text', props),
      // Responsive text utilities
      responsiveText: (sizeMap) => {
        return Object.entries(sizeMap)
          .map(([bp, size]) => bp === 'base' ? `text-${size}` : `${bp}:text-${size}`)
          .join(' ');
      },
    };
  }, [getTypographyScale, getVariantClasses]);
}

export default useTheme;