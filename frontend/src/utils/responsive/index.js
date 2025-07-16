// Re-export all responsive utilities from their individual modules
export { breakpoints, mediaQueries } from './breakpoints.js';
export { spacing, containerSizes, grid, touchTarget } from './spacing.js';
export { typography } from './typography.js';
export { rem, em, fluidSize, aspectRatio } from './helpers.js';
export { responsiveContainer, responsiveGrid, responsiveFlex } from './mixins.js';
export { screenReaderOnly, focusVisible, reduceMotion, noAnimation } from './accessibility.js';
export { printStyles } from './print.js';

// Import all for default export to maintain backward compatibility
import { breakpoints, mediaQueries } from './breakpoints.js';
import { spacing, containerSizes, grid, touchTarget } from './spacing.js';
import { typography } from './typography.js';
import { rem, em, fluidSize, aspectRatio } from './helpers.js';
import { responsiveContainer, responsiveGrid, responsiveFlex } from './mixins.js';
import { screenReaderOnly, focusVisible, noAnimation } from './accessibility.js';
import { printStyles } from './print.js';

// Default export maintains backward compatibility with original responsive.js
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