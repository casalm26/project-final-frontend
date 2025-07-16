export const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
  ultraWide: '1600px',
};

export const mediaQueries = {
  mobile: `@media (max-width: ${breakpoints.tablet})`,
  tablet: `@media (min-width: ${breakpoints.tablet}) and (max-width: ${breakpoints.desktop})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  wide: `@media (min-width: ${breakpoints.wide})`,
  ultraWide: `@media (min-width: ${breakpoints.ultraWide})`,
  
  mobileOnly: `@media (max-width: 767px)`,
  tabletUp: `@media (min-width: ${breakpoints.tablet})`,
  desktopUp: `@media (min-width: ${breakpoints.desktop})`,
  wideUp: `@media (min-width: ${breakpoints.wide})`,
  
  touch: '@media (hover: none) and (pointer: coarse)',
  hover: '@media (hover: hover) and (pointer: fine)',
  
  portrait: '@media (orientation: portrait)',
  landscape: '@media (orientation: landscape)',
  
  retina: '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
};

export default {
  breakpoints,
  mediaQueries,
};