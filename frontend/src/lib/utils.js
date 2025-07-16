import { clsx } from 'clsx';

/**
 * Combines class names using clsx utility
 * @param {...any} inputs - Class names to combine
 * @returns {string} Combined class names
 */
export function cn(...inputs) {
  return clsx(inputs);
}

/**
 * Generates a CSS class name with variants
 * @param {string} base - Base class name
 * @param {Object} variants - Variant object with boolean values
 * @returns {string} Combined class names
 */
export function cva(base, variants = {}) {
  const variantClasses = Object.entries(variants)
    .filter(([_, value]) => value)
    .map(([key]) => key);
  
  return cn(base, ...variantClasses);
}

/**
 * Conditionally applies classes based on state
 * @param {Object} conditions - Object with condition-class pairs
 * @returns {string} Combined class names
 */
export function conditionalClasses(conditions) {
  return cn(
    Object.entries(conditions)
      .filter(([_, condition]) => condition)
      .map(([className]) => className)
  );
} 