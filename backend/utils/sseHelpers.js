/**
 * Server-Sent Events (SSE) helper utilities
 * Provides SSE connection management, error handling, and configuration
 */

/**
 * SSE configuration constants
 */
const SSE_CONFIG = {
  HEADERS: {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Credentials': 'true'
  },
  DEFAULT_ORIGIN: 'http://localhost:3000',
  MESSAGE_TYPES: {
    CONNECTED: 'connected',
    ERROR: 'error',
    DATA: 'data'
  }
};

/**
 * Error handling utilities for SSE operations
 */
export class SSEErrorHandler {
  /**
   * Handles SSE write errors
   * @param {Error} error - The error that occurred
   * @param {SSEConnection} connection - The SSE connection instance
   */
  static handleWriteError(error, connection) {
    console.error('SSE write error:', error);
    connection.deactivate();
  }

  /**
   * Handles SSE connection end errors
   * @param {Error} error - The error that occurred
   */
  static handleEndError(error) {
    console.error('SSE end error:', error);
  }

  /**
   * Handles SSE connection errors
   * @param {Error} error - The error that occurred
   * @param {SSEConnection} connection - The SSE connection instance
   */
  static handleConnectionError(error, connection) {
    console.error('SSE connection error:', error);
    connection.deactivate();
  }
}

/**
 * Message formatter for SSE data
 */
export class SSEMessageFormatter {
  /**
   * Formats data for SSE transmission
   * @param {Object} data - Data to format
   * @returns {string} - Formatted SSE message
   */
  static formatMessage(data) {
    return `data: ${JSON.stringify(data)}\n\n`;
  }

  /**
   * Creates initial connection message
   * @returns {Object} - Initial connection message
   */
  static createInitialMessage() {
    return {
      type: SSE_CONFIG.MESSAGE_TYPES.CONNECTED,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * SSE connection class for managing individual client connections
 */
export class SSEConnection {
  constructor(res) {
    this.res = res;
    this.isActive = true;
  }

  /**
   * Writes data to the SSE connection
   * @param {Object} data - Data to send to client
   */
  write(data) {
    if (!this.isActive) return;
    
    try {
      const formattedMessage = SSEMessageFormatter.formatMessage(data);
      this.res.write(formattedMessage);
    } catch (error) {
      SSEErrorHandler.handleWriteError(error, this);
    }
  }

  /**
   * Ends the SSE connection
   */
  end() {
    if (!this.isActive) return;
    
    try {
      this.res.end();
      this.deactivate();
    } catch (error) {
      SSEErrorHandler.handleEndError(error);
    }
  }

  /**
   * Deactivates the connection
   */
  deactivate() {
    this.isActive = false;
  }

  /**
   * Sends initial connection confirmation
   */
  sendInitialMessage() {
    const initialMessage = SSEMessageFormatter.createInitialMessage();
    this.write(initialMessage);
  }

  /**
   * Checks if connection is active
   * @returns {boolean} - Connection status
   */
  isConnectionActive() {
    return this.isActive;
  }
}

/**
 * SSE configuration manager
 */
export class SSEConfigManager {
  /**
   * Gets the origin URL for CORS
   * @param {string} frontendUrl - Optional frontend URL override
   * @returns {string} - Origin URL
   */
  static getOrigin(frontendUrl = null) {
    return frontendUrl || process.env.FRONTEND_URL || SSE_CONFIG.DEFAULT_ORIGIN;
  }

  /**
   * Creates SSE headers object
   * @param {string} origin - Origin URL for CORS
   * @returns {Object} - Headers object
   */
  static createHeaders(origin) {
    return {
      ...SSE_CONFIG.HEADERS,
      'Access-Control-Allow-Origin': origin
    };
  }
}

/**
 * Sets up SSE headers and connection
 * @param {Object} res - Express response object
 * @param {string} frontendUrl - Frontend URL for CORS
 */
export const setupSSEHeaders = (res, frontendUrl = null) => {
  const origin = SSEConfigManager.getOrigin(frontendUrl);
  const headers = SSEConfigManager.createHeaders(origin);
  
  res.writeHead(200, headers);
};

/**
 * SSE connection lifecycle manager
 */
export class SSEConnectionManager {
  /**
   * Sets up connection event listeners
   * @param {Object} req - Express request object
   * @param {SSEConnection} connection - SSE connection instance
   */
  static setupConnectionEvents(req, connection) {
    // Handle client disconnect
    req.on('close', () => {
      console.log('SSE client disconnected');
      connection.deactivate();
    });

    // Handle connection errors
    req.on('error', (error) => {
      SSEErrorHandler.handleConnectionError(error, connection);
    });
  }

  /**
   * Initializes SSE connection
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {SSEConnection} - Initialized SSE connection
   */
  static initializeConnection(req, res) {
    // Set headers for SSE
    setupSSEHeaders(res);

    // Create SSE connection instance
    const sseConnection = new SSEConnection(res);
    
    // Send initial connection event
    sseConnection.sendInitialMessage();

    // Store connection on request object
    req.sseConnection = sseConnection;

    // Set up event listeners
    this.setupConnectionEvents(req, sseConnection);

    return sseConnection;
  }
}

/**
 * Middleware for setting up Server-Sent Events (SSE) endpoints
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const setupSSE = (req, res, next) => {
  // Initialize SSE connection with proper lifecycle management
  SSEConnectionManager.initializeConnection(req, res);

  next();
};