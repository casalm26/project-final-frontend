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

export const reduceMotion = '@media (prefers-reduced-motion: reduce)';

export const noAnimation = `
  ${reduceMotion} {
    animation: none !important;
    transition: none !important;
  }
`;

export default {
  screenReaderOnly,
  focusVisible,
  reduceMotion,
  noAnimation,
};