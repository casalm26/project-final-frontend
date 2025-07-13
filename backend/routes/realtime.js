import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { setupSSE } from '../middleware/realtimeEvents.js';
import { dataLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// All real-time routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /realtime/connection-stats:
 *   get:
 *     summary: Get real-time connection statistics
 *     tags: [Real-time]
 *     responses:
 *       200:
 *         description: Connection statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     connectedUsers:
 *                       type: integer
 *                       description: Number of currently connected users
 *                     activeRooms:
 *                       type: integer
 *                       description: Number of active Socket.IO rooms
 *                     connections:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           userId:
 *                             type: string
 *                           email:
 *                             type: string
 *                           connectedAt:
 *                             type: string
 *                             format: date-time
 *                           rooms:
 *                             type: integer
 */
router.get('/connection-stats', dataLimiter, (req, res) => {
  try {
    if (!global.realtimeController) {
      return res.status(503).json({
        success: false,
        message: 'Real-time service not available'
      });
    }

    const stats = global.realtimeController.getConnectionStats();
    
    // Filter sensitive data for non-admin users
    if (req.user.role !== 'admin') {
      delete stats.connections;
      stats.message = 'Detailed connection info requires admin privileges';
    }

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get connection stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve connection statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @swagger
 * /realtime/broadcast:
 *   post:
 *     summary: Broadcast system notification (admin only)
 *     tags: [Real-time]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - type
 *             properties:
 *               message:
 *                 type: string
 *                 description: Notification message
 *               type:
 *                 type: string
 *                 enum: [info, warning, error, success]
 *                 description: Notification type
 *               audience:
 *                 type: string
 *                 enum: [all, admin]
 *                 default: all
 *                 description: Target audience
 *               title:
 *                 type: string
 *                 description: Optional notification title
 *     responses:
 *       200:
 *         description: Notification broadcast successfully
 *       403:
 *         description: Admin privileges required
 */
router.post('/broadcast', dataLimiter, (req, res) => {
  try {
    // Only admin users can broadcast system notifications
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin privileges required to broadcast notifications'
      });
    }

    if (!global.realtimeController) {
      return res.status(503).json({
        success: false,
        message: 'Real-time service not available'
      });
    }

    const { message, type = 'info', audience = 'all', title } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Notification message is required'
      });
    }

    const notification = {
      type,
      message: message.trim(),
      title,
      level: type,
      sender: {
        userId: req.user._id,
        email: req.user.email,
        name: `${req.user.firstName} ${req.user.lastName}`
      }
    };

    global.realtimeController.broadcastSystemNotification(notification, audience);

    res.json({
      success: true,
      message: 'Notification broadcast successfully',
      data: {
        notification,
        audience,
        broadcastAt: new Date()
      }
    });

  } catch (error) {
    console.error('Broadcast notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to broadcast notification',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @swagger
 * /realtime/events:
 *   get:
 *     summary: Server-Sent Events stream for real-time updates
 *     tags: [Real-time]
 *     description: Establishes an SSE connection for receiving real-time updates
 *     parameters:
 *       - in: query
 *         name: types
 *         schema:
 *           type: string
 *         description: Comma-separated list of event types to subscribe to
 *     responses:
 *       200:
 *         description: SSE stream established
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 *               description: Server-sent event stream
 */
router.get('/events', setupSSE, (req, res) => {
  try {
    const { types } = req.query;
    const eventTypes = types ? types.split(',').map(t => t.trim()) : ['all'];
    
    console.log(`SSE connection established for user ${req.user.email}, event types: ${eventTypes.join(', ')}`);

    // Store connection for targeted events
    if (!global.sseConnections) {
      global.sseConnections = new Map();
    }

    const connectionId = `${req.user._id}_${Date.now()}`;
    global.sseConnections.set(connectionId, {
      userId: req.user._id,
      user: req.user,
      connection: req.sseConnection,
      eventTypes,
      connectedAt: new Date()
    });

    // Send welcome message
    req.sseConnection.write({
      type: 'welcome',
      message: 'SSE connection established',
      subscribedEvents: eventTypes,
      timestamp: new Date()
    });

    // Send initial data
    if (global.realtimeController) {
      const stats = global.realtimeController.getConnectionStats();
      req.sseConnection.write({
        type: 'initial-stats',
        data: {
          connectedUsers: stats.connectedUsers,
          connectedAt: new Date()
        },
        timestamp: new Date()
      });
    }

    // Handle connection cleanup
    req.on('close', () => {
      global.sseConnections?.delete(connectionId);
      console.log(`SSE connection closed for user ${req.user.email}`);
    });

    req.on('error', (error) => {
      console.error('SSE connection error:', error);
      global.sseConnections?.delete(connectionId);
    });

    // Keep connection alive with periodic heartbeat
    const heartbeat = setInterval(() => {
      try {
        req.sseConnection.write({
          type: 'heartbeat',
          timestamp: new Date()
        });
      } catch (error) {
        clearInterval(heartbeat);
        global.sseConnections?.delete(connectionId);
      }
    }, 30000); // 30 seconds

    // Clean up heartbeat on connection close
    req.on('close', () => {
      clearInterval(heartbeat);
    });

  } catch (error) {
    console.error('SSE setup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to establish SSE connection',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @swagger
 * /realtime/test-event:
 *   post:
 *     summary: Send test event to connected clients (admin only)
 *     tags: [Real-time]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventType:
 *                 type: string
 *                 default: test
 *               data:
 *                 type: object
 *               targetRoom:
 *                 type: string
 *                 description: Optional target room
 *     responses:
 *       200:
 *         description: Test event sent successfully
 */
router.post('/test-event', dataLimiter, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin privileges required'
      });
    }

    const { eventType = 'test', data = {}, targetRoom } = req.body;

    const testEvent = {
      type: eventType,
      data: {
        ...data,
        sender: req.user.email,
        message: 'This is a test event from the admin panel'
      },
      timestamp: new Date()
    };

    if (targetRoom && global.io) {
      global.io.to(targetRoom).emit('test:event', testEvent);
    } else if (global.io) {
      global.io.emit('test:event', testEvent);
    }

    // Also send to SSE connections
    if (global.sseConnections) {
      global.sseConnections.forEach(conn => {
        try {
          conn.connection.write({
            type: 'test-event',
            ...testEvent
          });
        } catch (error) {
          console.error('Error sending test event via SSE:', error);
        }
      });
    }

    res.json({
      success: true,
      message: 'Test event sent successfully',
      data: {
        event: testEvent,
        targetRoom: targetRoom || 'all',
        socketClients: global.io ? global.io.engine.clientsCount : 0,
        sseClients: global.sseConnections ? global.sseConnections.size : 0
      }
    });

  } catch (error) {
    console.error('Send test event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test event',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;