import { createVariants } from '../utils/styles.js';

/**
 * Component Variants Configuration
 * Centralized configuration for all component variants using the createVariants utility
 */

// Button variants
export const buttonVariants = createVariants({
  base: 'btn',
  variants: {
    variant: {
      default: 'btn-primary',
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline',
      ghost: 'btn-ghost',
      link: 'btn-link',
      destructive: 'btn-destructive',
      success: 'btn-success',
    },
    size: {
      xs: 'btn-xs',
      sm: 'btn-sm',
      md: 'btn-md',
      lg: 'btn-lg',
      xl: 'btn-xl',
    },
    loading: {
      true: 'btn-loading',
      false: '',
    },
    disabled: {
      true: 'btn-disabled',
      false: '',
    },
    fullWidth: {
      true: 'w-full',
      false: '',
    },
    icon: {
      true: 'btn-icon',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    loading: false,
    disabled: false,
    fullWidth: false,
    icon: false,
  },
});

// Card variants
export const cardVariants = createVariants({
  base: 'card',
  variants: {
    variant: {
      default: '',
      bordered: 'card-bordered',
      elevated: 'card-elevated',
      interactive: 'card-interactive',
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
    shadow: {
      none: 'shadow-none',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
    shadow: 'sm',
  },
});

// Badge variants
export const badgeVariants = createVariants({
  base: 'badge',
  variants: {
    variant: {
      default: 'badge-gray',
      primary: 'badge-primary',
      secondary: 'badge-secondary',
      success: 'badge-success',
      warning: 'badge-warning',
      error: 'badge-error',
      gray: 'badge-gray',
    },
    size: {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-xs',
      lg: 'px-3 py-1 text-sm',
    },
    rounded: {
      sm: 'rounded-md',
      md: 'rounded-lg',
      full: 'rounded-full',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    rounded: 'full',
  },
});

// Alert variants
export const alertVariants = createVariants({
  base: 'alert',
  variants: {
    variant: {
      info: 'alert-info',
      success: 'alert-success',
      warning: 'alert-warning',
      error: 'alert-error',
    },
    size: {
      sm: 'p-3 text-sm',
      md: 'p-4 text-base',
      lg: 'p-5 text-lg',
    },
  },
  defaultVariants: {
    variant: 'info',
    size: 'md',
  },
});

// Avatar variants
export const avatarVariants = createVariants({
  base: 'avatar',
  variants: {
    size: {
      xs: 'avatar-xs',
      sm: 'avatar-sm',
      md: 'avatar-md',
      lg: 'avatar-lg',
      xl: 'avatar-xl',
    },
    variant: {
      circular: 'rounded-full',
      rounded: 'rounded-lg',
      square: 'rounded-none',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'circular',
  },
});

// Form input variants
export const inputVariants = createVariants({
  base: 'form-input',
  variants: {
    size: {
      sm: 'form-input-sm',
      md: '',
      lg: 'form-input-lg',
    },
    state: {
      default: '',
      error: 'form-input-error',
      success: 'form-input-success',
    },
    fullWidth: {
      true: 'w-full',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    state: 'default',
    fullWidth: true,
  },
});

// Spinner variants
export const spinnerVariants = createVariants({
  base: 'spinner',
  variants: {
    size: {
      sm: 'spinner-sm',
      md: 'spinner-md',
      lg: 'spinner-lg',
    },
    color: {
      primary: 'text-primary-600',
      secondary: 'text-secondary-600',
      success: 'text-success-600',
      warning: 'text-warning-600',
      error: 'text-error-600',
      gray: 'text-gray-600',
      white: 'text-white',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
});

// Typography variants
export const textVariants = createVariants({
  base: '',
  variants: {
    variant: {
      'display-xl': 'display-xl',
      'display-lg': 'display-lg',
      'display-md': 'display-md',
      'display-sm': 'display-sm',
      'heading-1': 'heading-1',
      'heading-2': 'heading-2',
      'heading-3': 'heading-3',
      'heading-4': 'heading-4',
      'heading-5': 'heading-5',
      'heading-6': 'heading-6',
      'body-lg': 'body-lg',
      'body-base': 'body-base',
      'body-sm': 'body-sm',
      'body-xs': 'body-xs',
      caption: 'caption',
      overline: 'overline',
    },
    color: {
      default: 'text-gray-900 dark:text-gray-100',
      muted: 'text-muted',
      subtle: 'text-subtle',
      primary: 'text-primary',
      secondary: 'text-secondary',
      success: 'text-success',
      warning: 'text-warning',
      error: 'text-error',
      strong: 'text-strong',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
    truncate: {
      none: '',
      1: 'truncate-1',
      2: 'truncate-2',
      3: 'truncate-3',
    },
  },
  defaultVariants: {
    variant: 'body-base',
    color: 'default',
    align: 'left',
    truncate: 'none',
  },
});

// Link variants
export const linkVariants = createVariants({
  base: '',
  variants: {
    variant: {
      default: 'link',
      primary: 'link-primary',
      muted: 'link-muted',
      bare: 'link-bare',
    },
    underline: {
      always: 'underline',
      hover: 'no-underline hover:underline',
      never: 'no-underline',
    },
    external: {
      true: 'target-blank',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    underline: 'always',
    external: false,
  },
});

// Focus ring variants
export const focusVariants = createVariants({
  base: '',
  variants: {
    variant: {
      default: 'focus-ring',
      error: 'focus-ring-error',
      success: 'focus-ring-success',
    },
    visible: {
      true: 'focus-visible:outline-none',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    visible: true,
  },
});

// Layout container variants
export const containerVariants = createVariants({
  base: '',
  variants: {
    maxWidth: {
      none: 'max-w-none',
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
      '4xl': 'max-w-4xl',
      '5xl': 'max-w-5xl',
      '6xl': 'max-w-6xl',
      '7xl': 'max-w-7xl',
      '8xl': 'max-w-8xl',
      full: 'max-w-full',
    },
    padding: {
      none: 'px-0',
      sm: 'px-4',
      md: 'px-6',
      lg: 'px-8',
    },
    center: {
      true: 'mx-auto',
      false: '',
    },
  },
  defaultVariants: {
    maxWidth: '7xl',
    padding: 'md',
    center: true,
  },
});

// Grid variants
export const gridVariants = createVariants({
  base: 'grid',
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      12: 'grid-cols-12',
    },
    gap: {
      0: 'gap-0',
      1: 'gap-1',
      2: 'gap-2',
      3: 'gap-3',
      4: 'gap-4',
      5: 'gap-5',
      6: 'gap-6',
      8: 'gap-8',
      10: 'gap-10',
      12: 'gap-12',
    },
    responsive: {
      true: '',
      false: '',
    },
  },
  defaultVariants: {
    cols: 1,
    gap: 4,
    responsive: true,
  },
});

// Flex variants
export const flexVariants = createVariants({
  base: 'flex',
  variants: {
    direction: {
      row: 'flex-row',
      col: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'col-reverse': 'flex-col-reverse',
    },
    wrap: {
      nowrap: 'flex-nowrap',
      wrap: 'flex-wrap',
      'wrap-reverse': 'flex-wrap-reverse',
    },
    justify: {
      start: 'justify-start',
      end: 'justify-end',
      center: 'justify-center',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    align: {
      start: 'items-start',
      end: 'items-end',
      center: 'items-center',
      baseline: 'items-baseline',
      stretch: 'items-stretch',
    },
    gap: {
      0: 'gap-0',
      1: 'gap-1',
      2: 'gap-2',
      3: 'gap-3',
      4: 'gap-4',
      5: 'gap-5',
      6: 'gap-6',
      8: 'gap-8',
    },
  },
  defaultVariants: {
    direction: 'row',
    wrap: 'nowrap',
    justify: 'start',
    align: 'start',
    gap: 0,
  },
});

// Export all variants as a single object
export default {
  button: buttonVariants,
  card: cardVariants,
  badge: badgeVariants,
  alert: alertVariants,
  avatar: avatarVariants,
  input: inputVariants,
  spinner: spinnerVariants,
  text: textVariants,
  link: linkVariants,
  focus: focusVariants,
  container: containerVariants,
  grid: gridVariants,
  flex: flexVariants,
};