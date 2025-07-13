import { Tree, Forest, TreeImage, AuditLog } from '../models/index.js';

// Real-time event handlers
export class RealtimeController {
  constructor(io) {
    this.io = io;
    this.connectedUsers = new Map(); // Track connected users
    this.activeRooms = new Set(); // Track active rooms
  }

  // Handle new socket connection
  handleConnection(socket) {
    console.log(`New socket connection: ${socket.id} for user: ${socket.user.email}`);
    
    // Store connection info
    this.connectedUsers.set(socket.userId, {
      socketId: socket.id,
      user: socket.user,
      connectedAt: new Date(),
      rooms: []
    });

    // Set up event listeners
    this.setupEventListeners(socket);

    // Send initial data
    this.sendInitialData(socket);

    // Notify other users (admins) about new connection
    this.notifyUserConnection(socket.user, true);
  }

  // Handle socket disconnection
  handleDisconnection(socket) {
    console.log(`Socket disconnected: ${socket.id} for user: ${socket.user?.email}`);
    
    if (socket.userId) {
      // Remove from connected users
      this.connectedUsers.delete(socket.userId);
      
      // Notify other users about disconnection
      this.notifyUserConnection(socket.user, false);
    }
  }

  // Set up event listeners for socket
  setupEventListeners(socket) {
    // Subscribe to specific tree updates
    socket.on('subscribe:tree', (treeId) => {
      this.subscribeToTree(socket, treeId);
    });

    // Unsubscribe from tree updates
    socket.on('unsubscribe:tree', (treeId) => {
      this.unsubscribeFromTree(socket, treeId);
    });

    // Subscribe to forest updates
    socket.on('subscribe:forest', (forestId) => {
      this.subscribeToForest(socket, forestId);
    });

    // Request live dashboard data
    socket.on('request:dashboard', () => {
      this.sendDashboardData(socket);
    });

    // Request connected users count
    socket.on('request:users-online', () => {
      this.sendOnlineUsersCount(socket);
    });

    // Handle real-time chat/messaging (if needed)
    socket.on('message:send', (data) => {
      this.handleMessage(socket, data);
    });
  }

  // Send initial data when user connects
  async sendInitialData(socket) {
    try {
      // Send connected users count
      this.sendOnlineUsersCount(socket);

      // Send recent activity
      const recentActivity = await this.getRecentActivity();
      socket.emit('data:recent-activity', recentActivity);

      // Send user's tree count
      const userTreeCount = await Tree.countDocuments({ 
        // Add user filtering logic here if trees are user-specific
      });
      
      socket.emit('data:user-stats', {
        treeCount: userTreeCount,
        connectedAt: new Date()
      });

    } catch (error) {
      console.error('Error sending initial data:', error);
    }
  }

  // Subscribe to specific tree updates
  async subscribeToTree(socket, treeId) {
    try {
      // Validate tree exists
      const tree = await Tree.findById(treeId);
      if (!tree) {
        socket.emit('error', { message: 'Tree not found' });
        return;
      }

      const treeRoom = `tree:${treeId}`;
      socket.join(treeRoom);
      
      // Add to user's rooms
      const userConnection = this.connectedUsers.get(socket.userId);
      if (userConnection) {
        userConnection.rooms.push(treeRoom);
      }

      console.log(`User ${socket.user.email} subscribed to tree ${treeId}`);
      
      // Send current tree data
      socket.emit('tree:data', {
        treeId,
        tree: tree.toObject(),
        subscribedAt: new Date()
      });

    } catch (error) {
      console.error('Error subscribing to tree:', error);
      socket.emit('error', { message: 'Failed to subscribe to tree updates' });
    }
  }

  // Unsubscribe from tree updates
  unsubscribeFromTree(socket, treeId) {
    const treeRoom = `tree:${treeId}`;
    socket.leave(treeRoom);
    
    // Remove from user's rooms
    const userConnection = this.connectedUsers.get(socket.userId);
    if (userConnection) {
      userConnection.rooms = userConnection.rooms.filter(room => room !== treeRoom);
    }

    console.log(`User ${socket.user.email} unsubscribed from tree ${treeId}`);
  }

  // Subscribe to forest updates
  async subscribeToForest(socket, forestId) {
    try {
      const forest = await Forest.findById(forestId);
      if (!forest) {
        socket.emit('error', { message: 'Forest not found' });
        return;
      }

      const forestRoom = `forest:${forestId}`;
      socket.join(forestRoom);

      console.log(`User ${socket.user.email} subscribed to forest ${forestId}`);

      // Send current forest data
      const forestData = await this.getForestData(forestId);
      socket.emit('forest:data', {
        forestId,
        forest: forestData,
        subscribedAt: new Date()
      });

    } catch (error) {
      console.error('Error subscribing to forest:', error);
      socket.emit('error', { message: 'Failed to subscribe to forest updates' });
    }
  }

  // Send dashboard data
  async sendDashboardData(socket) {
    try {
      const dashboardData = await this.getDashboardData();
      socket.emit('dashboard:data', dashboardData);
    } catch (error) {
      console.error('Error sending dashboard data:', error);
      socket.emit('error', { message: 'Failed to fetch dashboard data' });
    }
  }

  // Send online users count
  sendOnlineUsersCount(socket) {
    const onlineCount = this.connectedUsers.size;
    const onlineUsers = Array.from(this.connectedUsers.values()).map(conn => ({
      userId: conn.user._id,
      email: conn.user.email,
      role: conn.user.role,
      connectedAt: conn.connectedAt
    }));

    socket.emit('users:online', {
      count: onlineCount,
      users: socket.userRole === 'admin' ? onlineUsers : undefined
    });
  }

  // Handle real-time messaging
  handleMessage(socket, data) {
    const { type, message, targetRoom } = data;
    
    // Validate message
    if (!message || message.trim().length === 0) {
      socket.emit('error', { message: 'Message cannot be empty' });
      return;
    }

    // Create message object
    const messageData = {
      id: Date.now().toString(),
      userId: socket.userId,
      user: {
        email: socket.user.email,
        firstName: socket.user.firstName,
        lastName: socket.user.lastName
      },
      message: message.trim(),
      type: type || 'chat',
      timestamp: new Date()
    };

    // Broadcast message to appropriate room
    if (targetRoom && socket.rooms.has(targetRoom)) {
      this.io.to(targetRoom).emit('message:received', messageData);
    } else {
      // Broadcast to all admin users
      this.io.to('admin').emit('message:received', messageData);
    }
  }

  // Broadcast tree update to subscribed users
  broadcastTreeUpdate(treeId, updateData, eventType = 'tree:updated') {
    const treeRoom = `tree:${treeId}`;
    
    this.io.to(treeRoom).emit(eventType, {
      treeId,
      data: updateData,
      timestamp: new Date()
    });

    console.log(`Broadcasted ${eventType} for tree ${treeId} to room ${treeRoom}`);
  }

  // Broadcast forest update
  broadcastForestUpdate(forestId, updateData, eventType = 'forest:updated') {
    const forestRoom = `forest:${forestId}`;
    
    this.io.to(forestRoom).emit(eventType, {
      forestId,
      data: updateData,
      timestamp: new Date()
    });

    console.log(`Broadcasted ${eventType} for forest ${forestId} to room ${forestRoom}`);
  }

  // Broadcast new image upload
  broadcastImageUpload(treeId, imageData) {
    const treeRoom = `tree:${treeId}`;
    
    this.io.to(treeRoom).emit('tree:image-uploaded', {
      treeId,
      image: imageData,
      timestamp: new Date()
    });

    // Also broadcast to forest room if applicable
    Tree.findById(treeId).then(tree => {
      if (tree) {
        const forestRoom = `forest:${tree.forestId}`;
        this.io.to(forestRoom).emit('forest:image-uploaded', {
          forestId: tree.forestId,
          treeId,
          image: imageData,
          timestamp: new Date()
        });
      }
    });
  }

  // Broadcast system notification
  broadcastSystemNotification(notification, targetAudience = 'all') {
    const notificationData = {
      id: Date.now().toString(),
      ...notification,
      timestamp: new Date()
    };

    switch (targetAudience) {
      case 'admin':
        this.io.to('admin').emit('notification:system', notificationData);
        break;
      case 'all':
      default:
        this.io.emit('notification:system', notificationData);
        break;
    }
  }

  // Notify about user connection/disconnection
  notifyUserConnection(user, isConnected) {
    const eventData = {
      userId: user._id,
      email: user.email,
      isConnected,
      timestamp: new Date()
    };

    // Notify admin users
    this.io.to('admin').emit('user:connection-status', eventData);
  }

  // Helper: Get recent activity
  async getRecentActivity(limit = 10) {
    try {
      const recentLogs = await AuditLog.find()
        .sort({ timestamp: -1 })
        .limit(limit)
        .populate('userId', 'firstName lastName email');

      return recentLogs.map(log => ({
        id: log._id,
        action: log.action,
        resource: log.resource,
        userId: log.userId?._id,
        user: log.userId ? {
          email: log.userId.email,
          firstName: log.userId.firstName,
          lastName: log.userId.lastName
        } : null,
        timestamp: log.timestamp,
        changes: log.changes
      }));
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }

  // Helper: Get dashboard data
  async getDashboardData() {
    try {
      const [totalTrees, totalForests, recentImages] = await Promise.all([
        Tree.countDocuments(),
        Forest.countDocuments({ isActive: true }),
        TreeImage.find({ isActive: true })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('treeId', 'species')
      ]);

      return {
        stats: {
          totalTrees,
          totalForests,
          onlineUsers: this.connectedUsers.size
        },
        recentImages: recentImages.map(img => img.toPublicJSON()),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return null;
    }
  }

  // Helper: Get forest data
  async getForestData(forestId) {
    try {
      const [forest, treeCount, recentTrees] = await Promise.all([
        Forest.findById(forestId),
        Tree.countDocuments({ forestId }),
        Tree.find({ forestId })
          .sort({ createdAt: -1 })
          .limit(10)
          .select('species plantedDate isAlive measurements')
      ]);

      return {
        ...forest.toObject(),
        treeCount,
        recentTrees
      };
    } catch (error) {
      console.error('Error fetching forest data:', error);
      return null;
    }
  }

  // Get connection statistics
  getConnectionStats() {
    return {
      connectedUsers: this.connectedUsers.size,
      activeRooms: this.activeRooms.size,
      connections: Array.from(this.connectedUsers.values()).map(conn => ({
        userId: conn.user._id,
        email: conn.user.email,
        connectedAt: conn.connectedAt,
        rooms: conn.rooms.length
      }))
    };
  }
}