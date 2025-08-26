// API configuration constants
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000;

// Cold start detection and retry configuration
export const COLD_START_INDICATORS = [
  'failed to fetch',
  'network request failed',
  'timeout',
  'connection refused',
  'service unavailable',
  'internal server error'
];

export const RETRY_CONFIG = {
  maxAttempts: 4,
  baseDelay: 5000, // Start with 5 seconds
  maxDelay: 20000, // Max 20 seconds between retries
  backoffMultiplier: 1.5, // Gentler backoff
  coldStartTimeouts: [30000, 45000, 60000, 90000], // Progressive timeouts for cold starts
  retryDelays: [5000, 10000, 15000, 20000], // Fixed delays: 5s, 10s, 15s, 20s (total: 50s + initial attempt)
};