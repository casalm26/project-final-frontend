// Room name generation utilities
export class RoomNameGenerator {
  static generateTreeRoom(treeId) {
    return `tree:${treeId}`;
  }

  static generateForestRoom(forestId) {
    return `forest:${forestId}`;
  }

  static generateUserRoom(userId) {
    return `user:${userId}`;
  }

  static generateAdminRoom() {
    return 'admin';
  }

  static generateGlobalRoom() {
    return 'global';
  }
}

// User connection data formatting utilities
export class ConnectionDataFormatter {
  static formatUserConnection(connection) {
    return {
      userId: connection.user._id,
      email: connection.user.email,
      role: connection.user.role,
      connectedAt: connection.connectedAt
    };
  }

  static formatConnectionStats(connection) {
    return {
      userId: connection.user._id,
      email: connection.user.email,
      connectedAt: connection.connectedAt,
      rooms: connection.rooms.length
    };
  }

  static createUserConnectionData(socket) {
    return {
      socketId: socket.id,
      user: socket.user,
      connectedAt: new Date(),
      rooms: []
    };
  }
}

// Core connection management functionality
export class ConnectionManager {
  constructor() {
    this.connectedUsers = new Map();
  }

  addUserConnection(socket) {
    const connectionData = ConnectionDataFormatter.createUserConnectionData(socket);
    this.connectedUsers.set(socket.userId, connectionData);
    console.log(`User connection added: ${socket.user.email} (${socket.id})`);
  }

  removeUserConnection(userId) {
    const removed = this.connectedUsers.delete(userId);
    if (removed) {
      console.log(`User connection removed for userId: ${userId}`);
    }
    return removed;
  }

  getUserConnection(userId) {
    return this.connectedUsers.get(userId);
  }

  getConnectedUsersCount() {
    return this.connectedUsers.size;
  }

  getAllConnections() {
    return Array.from(this.connectedUsers.values());
  }

  clearAllConnections() {
    this.connectedUsers.clear();
    console.log('All user connections cleared');
  }
}

// Room membership management functionality
export class RoomMembershipManager {
  constructor() {
    this.activeRooms = new Set();
  }

  addUserToRoom(userConnection, roomName) {
    if (userConnection && !userConnection.rooms.includes(roomName)) {
      userConnection.rooms.push(roomName);
      this.activeRooms.add(roomName);
    }
  }

  removeUserFromRoom(userConnection, roomName) {
    if (userConnection) {
      userConnection.rooms = userConnection.rooms.filter(room => room !== roomName);
    }
  }

  getActiveRoomsCount() {
    return this.activeRooms.size;
  }

  clearAllRooms() {
    this.activeRooms.clear();
  }
}

// Statistics and reporting functionality
export class ConnectionStatsManager {
  static generateOnlineUsersData(connections, isAdmin = false) {
    const onlineCount = connections.length;
    const onlineUsers = connections.map(ConnectionDataFormatter.formatUserConnection);

    return {
      count: onlineCount,
      users: isAdmin ? onlineUsers : undefined
    };
  }

  static generateConnectionStats(connections, activeRoomsCount) {
    return {
      connectedUsers: connections.length,
      activeRooms: activeRoomsCount,
      connections: connections.map(ConnectionDataFormatter.formatConnectionStats)
    };
  }
}

// Main RoomManager class that orchestrates all functionality
export class RoomManager {
  constructor() {
    this.connectionManager = new ConnectionManager();
    this.roomMembershipManager = new RoomMembershipManager();
  }

  // Connection management delegation
  addUserConnection(socket) {
    this.connectionManager.addUserConnection(socket);
  }

  removeUserConnection(userId) {
    return this.connectionManager.removeUserConnection(userId);
  }

  getUserConnection(userId) {
    return this.connectionManager.getUserConnection(userId);
  }

  // Room management delegation
  addUserToRoom(userId, roomName) {
    const userConnection = this.connectionManager.getUserConnection(userId);
    this.roomMembershipManager.addUserToRoom(userConnection, roomName);
  }

  removeUserFromRoom(userId, roomName) {
    const userConnection = this.connectionManager.getUserConnection(userId);
    this.roomMembershipManager.removeUserFromRoom(userConnection, roomName);
  }

  // Static room name generation methods (kept for backward compatibility)
  static generateTreeRoom(treeId) {
    return RoomNameGenerator.generateTreeRoom(treeId);
  }

  static generateForestRoom(forestId) {
    return RoomNameGenerator.generateForestRoom(forestId);
  }

  static generateUserRoom(userId) {
    return RoomNameGenerator.generateUserRoom(userId);
  }

  // Statistics and data methods
  getOnlineUsersData(isAdmin = false) {
    const connections = this.connectionManager.getAllConnections();
    return ConnectionStatsManager.generateOnlineUsersData(connections, isAdmin);
  }

  getConnectionStats() {
    const connections = this.connectionManager.getAllConnections();
    const activeRoomsCount = this.roomMembershipManager.getActiveRoomsCount();
    return ConnectionStatsManager.generateConnectionStats(connections, activeRoomsCount);
  }

  // Cleanup methods
  clearAllConnections() {
    this.connectionManager.clearAllConnections();
    this.roomMembershipManager.clearAllRooms();
  }

  // Convenience getter for connected users count (used by other parts of the system)
  get connectedUsers() {
    return {
      size: this.connectionManager.getConnectedUsersCount()
    };
  }
}

// TODO: Consider moving real-time connection state to Zustand store for better state synchronization
// TODO: Add connection event emitters for better decoupling from socket.io implementation
// TODO: Consider implementing connection pooling for better performance at scale