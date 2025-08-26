import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

// Import routes
import authRoutes from "./routes/auth.js";
import forestRoutes from "./routes/forests.js";
import treeRoutes from "./routes/trees.js";
import userRoutes from "./routes/users.js";
import exportRoutes from "./routes/exports.js";
import auditRoutes from "./routes/audit.js";
import dashboardRoutes from "./routes/dashboard.js";
import chartRoutes from "./routes/charts.js";
import docsRoutes from "./routes/docs.js";
import uploadRoutes from "./routes/uploads.js";
import realtimeRoutes from "./routes/realtime.js";
import bulkRoutes from "./routes/bulk.js";

// Import middleware
// import { generalLimiter } from "./middleware/rateLimiter.js"; // TEMPORARILY DISABLED FOR DEVELOPMENT

// Import real-time components
import { RealtimeController } from "./controllers/realtimeController.js";
import { 
  authenticateSocket, 
  joinUserRoom, 
  joinForestRooms, 
  joinAdminRooms 
} from "./utils/socketAuth.js";

// Load environment variables
dotenv.config();

// Debug environment variables
console.log('🔧 Environment check:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- MONGO_URL:', process.env.MONGO_URL ? 'Set' : 'Missing');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Missing');

// MongoDB connection
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/nanwa-forestry";
console.log('🔗 Connecting to MongoDB:', mongoUrl.includes('mongodb+srv') ? 'Atlas connection' : 'Local connection');

// Don't crash the app if MongoDB fails initially - let it retry
mongoose.connect(mongoUrl)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('⚠️  Server will continue running but database operations will fail');
    // Don't exit - let the app start and show the error in health check
  });

mongoose.Promise = Promise;

// MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📴 Disconnected from MongoDB');
});

const port = process.env.PORT || 8080;
const app = express();

// Configure trust proxy for production deployment (Render, Heroku, etc.)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

const server = createServer(app);

// Define allowed origins for CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173", // Vite dev server
  "https://entitree.netlify.app",
  process.env.FRONTEND_URL
].filter(Boolean);

console.log('🔗 Allowed CORS origins:', allowedOrigins);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: true, // Allow all origins temporarily
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Initialize real-time controller
const realtimeController = new RealtimeController(io);

// Socket authentication middleware
io.use(authenticateSocket);

// Handle socket connections
io.on('connection', (socket) => {
  // Join user to appropriate rooms
  joinUserRoom(socket);
  joinForestRooms(socket);
  joinAdminRooms(socket);

  // Handle connection
  realtimeController.handleConnection(socket);

  // Handle disconnection
  socket.on('disconnect', () => {
    realtimeController.handleDisconnection(socket);
  });
});

// Make io available globally for other controllers
global.io = io;
global.realtimeController = realtimeController;

// CORS configuration - simplified for debugging
app.use(cors({
  origin: true, // Allow all origins temporarily
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting middleware - TEMPORARILY DISABLED FOR DEVELOPMENT
// app.use('/api/', generalLimiter); // TODO: RE-ENABLE IN PRODUCTION FOR SECURITY

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Nanwa Forestry API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Health check endpoints
app.get('/', (req, res) => {
  res.json({ 
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

app.get('/api', (req, res) => {
  res.json({ 
    status: 'API is running',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      MONGO_URL: process.env.MONGO_URL ? 'Set' : 'Missing',
      JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Missing',
      PORT: process.env.PORT
    }
  });
});

// API Documentation
app.use("/docs", docsRoutes);

// Serve static uploads
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/forests", forestRoutes);
app.use("/api/trees", treeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/exports", exportRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/charts", chartRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/realtime", realtimeRoutes);
app.use("/api/bulk", bulkRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    path: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('📴 MongoDB connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('📴 MongoDB connection closed');
    process.exit(0);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API Documentation available at http://localhost:${port}/docs`);
  console.log(`⚡ WebSocket server ready for real-time connections`);
});
