export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  xxl: '3rem',     // 48px
  xxxl: '4rem',    // 64px
};

export const containerSizes = {
  mobile: '100%',
  tablet: '768px',
  desktop: '1024px',
  wide: '1200px',
  ultraWide: '1400px',
};

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

export const touchTarget = {
  minSize: '44px',
  recommended: '48px',
  comfortable: '56px',
};

export default {
  spacing,
  containerSizes,
  grid,
  touchTarget,
};