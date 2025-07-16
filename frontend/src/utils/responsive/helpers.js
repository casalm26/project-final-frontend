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

export default {
  rem,
  em,
  fluidSize,
  aspectRatio,
};