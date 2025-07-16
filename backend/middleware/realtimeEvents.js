/**
 * Real-time event middleware for emitting events after successful operations
 * Refactored to use modular utilities for better maintainability
 */

import { createRealtimeEventMiddleware } from '../utils/responseInterceptor.js';
import { 
  emitTreeEvent, 
  emitForestEvent, 
  emitImageUploadEvent, 
  emitUserActivityEvent,
  emitSystemNotification
} from '../utils/realtimeEventEmitters.js';
import { setupSSE } from '../utils/sseHelpers.js';

// Middleware functions using the modular approach
export const emitTreeUpdate = createRealtimeEventMiddleware(emitTreeEvent);
export const emitForestUpdate = createRealtimeEventMiddleware(emitForestEvent);
export const emitImageUpload = createRealtimeEventMiddleware(emitImageUploadEvent);
export const emitUserActivity = createRealtimeEventMiddleware(emitUserActivityEvent);

// Re-export system notification utility
export { emitSystemNotification };

// Re-export SSE setup middleware
export { setupSSE };