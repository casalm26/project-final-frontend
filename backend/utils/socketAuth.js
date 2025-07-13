import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

// Socket authentication middleware
export const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    
    if (!token) {
      return next(new Error('Authentication token required'));
    }

    // Remove 'Bearer ' prefix if present
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;

    // Verify JWT token
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return next(new Error('Invalid user or account deactivated'));
    }

    // Attach user to socket
    socket.user = user;
    socket.userId = user._id.toString();
    socket.userRole = user.role;
    
    console.log(`Socket authenticated for user: ${user.email} (${user._id})`);
    next();
    
  } catch (error) {
    console.error('Socket authentication error:', error.message);
    next(new Error('Authentication failed'));
  }
};

// Join user to their personal room
export const joinUserRoom = (socket) => {
  const userRoom = `user:${socket.userId}`;
  socket.join(userRoom);
  console.log(`User ${socket.user.email} joined room: ${userRoom}`);
  return userRoom;
};

// Join user to forest-specific rooms based on their permissions
export const joinForestRooms = async (socket) => {
  try {
    // For now, join all active forests - in production, you'd filter by user permissions
    const { Forest } = await import('../models/index.js');
    const forests = await Forest.find({ isActive: true }).select('_id name');
    
    const forestRooms = [];
    for (const forest of forests) {
      const forestRoom = `forest:${forest._id}`;
      socket.join(forestRoom);
      forestRooms.push(forestRoom);
    }
    
    console.log(`User ${socket.user.email} joined ${forestRooms.length} forest rooms`);
    return forestRooms;
    
  } catch (error) {
    console.error('Error joining forest rooms:', error);
    return [];
  }
};

// Join admin-specific rooms
export const joinAdminRooms = (socket) => {
  if (socket.userRole === 'admin') {
    socket.join('admin');
    console.log(`Admin user ${socket.user.email} joined admin room`);
    return ['admin'];
  }
  return [];
};