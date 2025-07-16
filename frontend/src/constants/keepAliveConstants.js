// Keep-alive service configuration
export const KEEP_ALIVE_CONFIG = {
  intervalMs: 10 * 60 * 1000, // 10 minutes
  endpoint: '/auth/profile', // Simple endpoint to keep server warm
  enabledInProduction: true,
  enabledInDevelopment: false,
};