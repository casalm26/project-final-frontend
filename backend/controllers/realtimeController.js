import { Tree, Forest, TreeImage, AuditLog } from '../models/index.js';
import { SocketEventHandlers } from '../utils/socketEventHandlers.js';
import { RealtimeDataService } from '../utils/realtimeDataService.js';
import { BroadcastUtils } from '../utils/broadcastUtils.js';
import { RoomManager } from '../utils/roomManager.js';

// Real-time event handlers
export class RealtimeController {
  constructor(io) {
    this.io = io;
    this.roomManager = new RoomManager();
    this.broadcastUtils = new BroadcastUtils(io);
    this.eventHandlers = new SocketEventHandlers(this);
  }

  // Handle new socket connection
  handleConnection(socket) {
    console.log(`New socket connection: ${socket.id} for user: ${socket.user.email}`);
    
    // Store connection info
    this.roomManager.addUserConnection(socket);

    // Set up event listeners
    this.eventHandlers.setupEventListeners(socket);

    // Send initial data
    this.sendInitialData(socket);

    // Notify other users (admins) about new connection
    this.broadcastUtils.notifyUserConnection(socket.user, true);
  }

  // Handle socket disconnection
  handleDisconnection(socket) {
    console.log(`Socket disconnected: ${socket.id} for user: ${socket.user?.email}`);
    
    if (socket.userId) {
      // Remove from connected users
      this.roomManager.removeUserConnection(socket.userId);
      
      // Notify other users about disconnection
      this.broadcastUtils.notifyUserConnection(socket.user, false);
    }
  }

  // Set up event listeners for socket (delegated to eventHandlers)
  setupEventListeners(socket) {
    this.eventHandlers.setupEventListeners(socket);
  }

  // Send initial data when user connects
  async sendInitialData(socket) {
    try {
      // Send connected users count
      this.sendOnlineUsersCount(socket);

      // Send recent activity
      const recentActivity = await RealtimeDataService.getRecentActivity();
      socket.emit('data:recent-activity', recentActivity);

      // Send user's tree count
      const userStats = await RealtimeDataService.getUserTreeStats();
      socket.emit('data:user-stats', userStats);

    } catch (error) {
      console.error('Error sending initial data:', error);
    }
  }

  // Subscribe to specific tree updates
  async subscribeToTree(socket, treeId) {
    try {
      // Validate tree exists
      const tree = await RealtimeDataService.validateAndGetTree(treeId);

      const treeRoom = RoomManager.generateTreeRoom(treeId);
      socket.join(treeRoom);
      
      // Add to user's rooms
      this.roomManager.addUserToRoom(socket.userId, treeRoom);

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
    const treeRoom = RoomManager.generateTreeRoom(treeId);
    socket.leave(treeRoom);
    
    // Remove from user's rooms
    this.roomManager.removeUserFromRoom(socket.userId, treeRoom);

    console.log(`User ${socket.user.email} unsubscribed from tree ${treeId}`);
  }

  // Subscribe to forest updates
  async subscribeToForest(socket, forestId) {
    try {
      await RealtimeDataService.validateAndGetForest(forestId);

      const forestRoom = RoomManager.generateForestRoom(forestId);
      socket.join(forestRoom);

      console.log(`User ${socket.user.email} subscribed to forest ${forestId}`);

      // Send current forest data
      const forestData = await RealtimeDataService.getForestData(forestId);
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
      const dashboardData = await RealtimeDataService.getDashboardData(this.roomManager.connectedUsers.size);
      socket.emit('dashboard:data', dashboardData);
    } catch (error) {
      console.error('Error sending dashboard data:', error);
      socket.emit('error', { message: 'Failed to fetch dashboard data' });
    }
  }

  // Send online users count
  sendOnlineUsersCount(socket) {
    const onlineData = this.roomManager.getOnlineUsersData(socket.userRole === 'admin');
    socket.emit('users:online', onlineData);
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

    // Broadcast message using broadcast utility
    const validTargetRoom = targetRoom && socket.rooms.has(targetRoom) ? targetRoom : null;
    this.broadcastUtils.broadcastMessage(messageData, validTargetRoom);
  }

  // Broadcast tree update to subscribed users (delegated to broadcastUtils)
  broadcastTreeUpdate(treeId, updateData, eventType = 'tree:updated') {
    this.broadcastUtils.broadcastTreeUpdate(treeId, updateData, eventType);
  }

  // Broadcast forest update (delegated to broadcastUtils)
  broadcastForestUpdate(forestId, updateData, eventType = 'forest:updated') {
    this.broadcastUtils.broadcastForestUpdate(forestId, updateData, eventType);
  }

  // Broadcast new image upload (delegated to broadcastUtils)
  broadcastImageUpload(treeId, imageData) {
    this.broadcastUtils.broadcastImageUpload(treeId, imageData);
  }

  // Broadcast system notification (delegated to broadcastUtils)
  broadcastSystemNotification(notification, targetAudience = 'all') {
    this.broadcastUtils.broadcastSystemNotification(notification, targetAudience);
  }

  // Notify about user connection/disconnection (delegated to broadcastUtils)
  notifyUserConnection(user, isConnected) {
    this.broadcastUtils.notifyUserConnection(user, isConnected);
  }

  // TODO: Consider moving these database operations to Zustand store for better state management

  // Get connection statistics (delegated to roomManager)
  getConnectionStats() {
    return this.roomManager.getConnectionStats();
  }
}