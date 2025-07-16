// Socket event handler utilities
export class SocketEventHandlers {
  constructor(realtimeController) {
    this.controller = realtimeController;
  }

  // Set up all event listeners for a socket
  setupEventListeners(socket) {
    // Subscribe to specific tree updates
    socket.on('subscribe:tree', (treeId) => {
      this.handleSubscribeToTree(socket, treeId);
    });

    // Unsubscribe from tree updates
    socket.on('unsubscribe:tree', (treeId) => {
      this.handleUnsubscribeFromTree(socket, treeId);
    });

    // Subscribe to forest updates
    socket.on('subscribe:forest', (forestId) => {
      this.handleSubscribeToForest(socket, forestId);
    });

    // Request live dashboard data
    socket.on('request:dashboard', () => {
      this.handleDashboardRequest(socket);
    });

    // Request connected users count
    socket.on('request:users-online', () => {
      this.handleOnlineUsersRequest(socket);
    });

    // Handle real-time chat/messaging
    socket.on('message:send', (data) => {
      this.handleMessage(socket, data);
    });
  }

  // Handle tree subscription
  async handleSubscribeToTree(socket, treeId) {
    await this.controller.subscribeToTree(socket, treeId);
  }

  // Handle tree unsubscription
  handleUnsubscribeFromTree(socket, treeId) {
    this.controller.unsubscribeFromTree(socket, treeId);
  }

  // Handle forest subscription
  async handleSubscribeToForest(socket, forestId) {
    await this.controller.subscribeToForest(socket, forestId);
  }

  // Handle dashboard data request
  async handleDashboardRequest(socket) {
    await this.controller.sendDashboardData(socket);
  }

  // Handle online users request
  handleOnlineUsersRequest(socket) {
    this.controller.sendOnlineUsersCount(socket);
  }

  // Handle real-time messaging
  handleMessage(socket, data) {
    this.controller.handleMessage(socket, data);
  }
}