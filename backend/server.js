import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Import routes
import authRoutes from "./routes/auth.js";
import forestRoutes from "./routes/forests.js";
import treeRoutes from "./routes/trees.js";
import userRoutes from "./routes/users.js";
import exportRoutes from "./routes/exports.js";
import auditRoutes from "./routes/audit.js";

// Import middleware
import { generalLimiter } from "./middleware/rateLimiter.js";

// Load environment variables
dotenv.config();

// MongoDB connection
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/nanwa-forestry";
mongoose.connect(mongoUrl);
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

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting middleware
app.use('/api/', generalLimiter);

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

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/forests", forestRoutes);
app.use("/api/trees", treeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/exports", exportRoutes);
app.use("/api/audit", auditRoutes);

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
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API Documentation available at http://localhost:${port}/`);
});
