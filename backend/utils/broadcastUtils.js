import { Tree } from '../models/index.js';

// Broadcasting utilities for real-time events
export class BroadcastUtils {
  constructor(io) {
    this.io = io;
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
  async broadcastImageUpload(treeId, imageData) {
    const treeRoom = `tree:${treeId}`;
    
    this.io.to(treeRoom).emit('tree:image-uploaded', {
      treeId,
      image: imageData,
      timestamp: new Date()
    });

    // Also broadcast to forest room if applicable
    try {
      const tree = await Tree.findById(treeId);
      if (tree) {
        const forestRoom = `forest:${tree.forestId}`;
        this.io.to(forestRoom).emit('forest:image-uploaded', {
          forestId: tree.forestId,
          treeId,
          image: imageData,
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Error broadcasting image upload to forest room:', error);
    }
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

  // Broadcast message to room or admin users
  broadcastMessage(messageData, targetRoom = null) {
    if (targetRoom) {
      this.io.to(targetRoom).emit('message:received', messageData);
    } else {
      // Broadcast to all admin users
      this.io.to('admin').emit('message:received', messageData);
    }
  }
}