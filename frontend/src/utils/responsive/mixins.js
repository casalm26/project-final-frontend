import { mediaQueries } from './breakpoints.js';
import { spacing, containerSizes } from './spacing.js';

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

export default {
  responsiveContainer,
  responsiveGrid,
  responsiveFlex,
};