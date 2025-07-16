import { useMemo } from 'react';

/**
 * Custom hook for password strength validation
 * @param {string} password - The password to validate
 * @returns {Object} Password strength information
 */
export const usePasswordStrength = (password) => {
  return useMemo(() => {
    if (!password) return { strength: 'none', score: 0 };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    if (score <= 2) return { strength: 'weak', score };
    if (score <= 3) return { strength: 'medium', score };
    return { strength: 'strong', score };
  }, [password]);
};