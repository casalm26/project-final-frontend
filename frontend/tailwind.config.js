import tokens from './src/styles/tokens.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ...tokens.colors,
        // Semantic color aliases for compatibility
        success: tokens.colors.success[500],
        warning: tokens.colors.warning[500],
        error: tokens.colors.error[500],
      },
      fontFamily: tokens.typography.fontFamily,
      fontSize: tokens.typography.fontSize,
      fontWeight: tokens.typography.fontWeight,
      spacing: tokens.spacing,
      screens: tokens.screens,
      borderRadius: tokens.borderRadius,
      boxShadow: tokens.boxShadow,
      transitionTimingFunction: tokens.transitionTimingFunction,
      transitionDuration: tokens.transitionDuration,
      zIndex: tokens.zIndex,
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

