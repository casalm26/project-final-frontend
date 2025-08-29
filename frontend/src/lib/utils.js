import { clsx } from 'clsx';

/**
 * Combines class names using clsx utility
 * @param {...any} inputs - Class names to combine
 * @returns {string} Combined class names
 */
export function cn(...inputs) {
  return clsx(inputs);
} 