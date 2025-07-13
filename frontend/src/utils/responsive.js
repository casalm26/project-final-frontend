// Responsive breakpoints
export const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
  ultraWide: '1600px',
};

// Media query helpers
export const mediaQueries = {
  mobile: `@media (max-width: ${breakpoints.tablet})`,
  tablet: `@media (min-width: ${breakpoints.tablet}) and (max-width: ${breakpoints.desktop})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  wide: `@media (min-width: ${breakpoints.wide})`,
  ultraWide: `@media (min-width: ${breakpoints.ultraWide})`,
  
  // Specific ranges
  mobileOnly: `@media (max-width: 767px)`,
  tabletUp: `@media (min-width: ${breakpoints.tablet})`,
  desktopUp: `@media (min-width: ${breakpoints.desktop})`,
  wideUp: `@media (min-width: ${breakpoints.wide})`,
  
  // Touch devices
  touch: '@media (hover: none) and (pointer: coarse)',
  hover: '@media (hover: hover) and (pointer: fine)',
  
  // Orientation
  portrait: '@media (orientation: portrait)',
  landscape: '@media (orientation: landscape)',
  
  // High DPI
  retina: '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
};

// Container sizes
export const containerSizes = {
  mobile: '100%',
  tablet: '768px',
  desktop: '1024px',
  wide: '1200px',
  ultraWide: '1400px',
};

// Spacing scale
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  xxl: '3rem',     // 48px
  xxxl: '4rem',    // 64px
};

// Typography scale
export const typography = {
  mobile: {
    h1: '2rem',      // 32px
    h2: '1.5rem',    // 24px
    h3: '1.25rem',   // 20px
    h4: '1.125rem',  // 18px
    body: '1rem',    // 16px
    small: '0.875rem', // 14px
  },
  tablet: {
    h1: '2.5rem',    // 40px
    h2: '2rem',      // 32px
    h3: '1.5rem',    // 24px
    h4: '1.25rem',   // 20px
    body: '1rem',    // 16px
    small: '0.875rem', // 14px
  },
  desktop: {
    h1: '3rem',      // 48px
    h2: '2.5rem',    // 40px
    h3: '2rem',      // 32px
    h4: '1.5rem',    // 24px
    body: '1.125rem', // 18px
    small: '1rem',   // 16px
  },
};

// Grid system
export const grid = {
  columns: 12,
  gutter: {
    mobile: '1rem',
    tablet: '1.5rem',
    desktop: '2rem',
  },
  container: {
    mobile: '100%',
    tablet: '768px',
    desktop: '1024px',
    wide: '1200px',
    maxWidth: '1400px',
  },
};

// Helper functions
export const rem = (pixels) => `${pixels / 16}rem`;

export const em = (pixels, baseFontSize = 16) => `${pixels / baseFontSize}em`;

export const fluidSize = (minSize, maxSize, minWidth = 320, maxWidth = 1440) => {
  const minSizeRem = typeof minSize === 'number' ? rem(minSize) : minSize;
  const maxSizeRem = typeof maxSize === 'number' ? rem(maxSize) : maxSize;
  const minWidthRem = typeof minWidth === 'number' ? rem(minWidth) : minWidth;
  const maxWidthRem = typeof maxWidth === 'number' ? rem(maxWidth) : maxWidth;
  
  return `clamp(${minSizeRem}, ${minSizeRem} + ((${maxSizeRem} - ${minSizeRem}) * ((100vw - ${minWidthRem}) / (${maxWidthRem} - ${minWidthRem}))), ${maxSizeRem})`;
};

export const aspectRatio = (width, height) => ({
  paddingTop: `${(height / width) * 100}%`,
  position: 'relative',
  overflow: 'hidden',
});

// Touch-friendly sizing
export const touchTarget = {
  minSize: '44px',
  recommended: '48px',
  comfortable: '56px',
};

// Common responsive mixins
export const responsiveContainer = `
  width: 100%;
  margin: 0 auto;
  padding: 0 ${spacing.md};
  
  ${mediaQueries.tablet} {
    padding: 0 ${spacing.lg};
    max-width: ${containerSizes.tablet};
  }
  
  ${mediaQueries.desktop} {
    padding: 0 ${spacing.xl};
    max-width: ${containerSizes.desktop};
  }
  
  ${mediaQueries.wide} {
    max-width: ${containerSizes.wide};
  }
  
  ${mediaQueries.ultraWide} {
    max-width: ${containerSizes.ultraWide};
  }
`;

export const responsiveGrid = (columns = 1, gap = spacing.md) => `
  display: grid;
  grid-template-columns: repeat(${columns}, 1fr);
  gap: ${gap};
  
  ${mediaQueries.tablet} {
    grid-template-columns: repeat(${Math.min(columns * 2, 12)}, 1fr);
    gap: ${spacing.lg};
  }
  
  ${mediaQueries.desktop} {
    grid-template-columns: repeat(${Math.min(columns * 3, 12)}, 1fr);
    gap: ${spacing.xl};
  }
`;

export const responsiveFlex = (direction = 'row', wrap = 'wrap') => `
  display: flex;
  flex-direction: ${direction};
  flex-wrap: ${wrap};
  gap: ${spacing.md};
  
  ${mediaQueries.mobile} {
    flex-direction: ${direction === 'row' ? 'column' : 'row'};
    gap: ${spacing.sm};
  }
  
  ${mediaQueries.tablet} {
    gap: ${spacing.lg};
  }
`;

// Accessibility helpers
export const screenReaderOnly = `
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const focusVisible = `
  outline: 2px solid #007bff;
  outline-offset: 2px;
  border-radius: 2px;
`;

// Animation helpers
export const reduceMotion = '@media (prefers-reduced-motion: reduce)';
export const noAnimation = `
  ${reduceMotion} {
    animation: none !important;
    transition: none !important;
  }
`;

// Print styles
export const printStyles = `
  @media print {
    * {
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    
    body {
      font-size: 12pt;
      line-height: 1.4;
    }
    
    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid;
    }
    
    p, li {
      page-break-inside: avoid;
    }
    
    img {
      max-width: 100% !important;
      height: auto !important;
    }
    
    .no-print {
      display: none !important;
    }
  }
`;

export default {
  breakpoints,
  mediaQueries,
  containerSizes,
  spacing,
  typography,
  grid,
  rem,
  em,
  fluidSize,
  aspectRatio,
  touchTarget,
  responsiveContainer,
  responsiveGrid,
  responsiveFlex,
  screenReaderOnly,
  focusVisible,
  noAnimation,
  printStyles,
}; 