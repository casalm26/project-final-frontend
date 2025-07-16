import { Tree, Forest, TreeImage, AuditLog } from '../models/index.js';

/**
 * Format audit log entry for real-time consumption
 * @param {Object} log - Raw audit log entry
 * @returns {Object} Formatted audit log entry
 */
export const formatAuditLogEntry = (log) => ({
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
});

/**
 * Get recent activity from audit logs
 * @param {number} limit - Number of recent activities to fetch
 * @returns {Array} Array of formatted audit log entries
 */
export const getRecentActivity = async (limit = 10) => {
  try {
    const recentLogs = await AuditLog.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('userId', 'firstName lastName email');

    return recentLogs.map(formatAuditLogEntry);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
};

/**
 * Get dashboard statistics and data for real-time updates
 * @param {number} connectedUsersCount - Number of currently connected users
 * @returns {Object|null} Dashboard data or null if error
 */
export const getDashboardData = async (connectedUsersCount) => {
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
        onlineUsers: connectedUsersCount
      },
      recentImages: recentImages.map(img => img.toPublicJSON()),
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return null;
  }
};

/**
 * Get comprehensive forest data for real-time updates
 * @param {string} forestId - Forest ID to fetch data for
 * @returns {Object|null} Forest data with tree count and recent trees, or null if error
 */
export const getForestData = async (forestId) => {
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
};

/**
 * Validate tree exists and return tree data
 * @param {string} treeId - Tree ID to validate and fetch
 * @returns {Object} Tree document
 * @throws {Error} If tree not found
 */
export const validateAndGetTree = async (treeId) => {
  try {
    const tree = await Tree.findById(treeId);
    if (!tree) {
      throw new Error('Tree not found');
    }
    return tree;
  } catch (error) {
    console.error('Error validating tree:', error);
    throw error;
  }
};

/**
 * Validate forest exists and return forest data
 * @param {string} forestId - Forest ID to validate and fetch
 * @returns {Object} Forest document
 * @throws {Error} If forest not found
 */
export const validateAndGetForest = async (forestId) => {
  try {
    const forest = await Forest.findById(forestId);
    if (!forest) {
      throw new Error('Forest not found');
    }
    return forest;
  } catch (error) {
    console.error('Error validating forest:', error);
    throw error;
  }
};

/**
 * Get user tree statistics for real-time updates
 * @param {string|null} userId - User ID to filter by (null for all users)
 * @returns {Object} User tree statistics
 */
export const getUserTreeStats = async (userId = null) => {
  try {
    const filter = userId ? { /* Add user-specific filtering logic if needed */ } : {};
    const userTreeCount = await Tree.countDocuments(filter);
    
    return {
      treeCount: userTreeCount,
      connectedAt: new Date()
    };
  } catch (error) {
    console.error('Error fetching user tree stats:', error);
    return { treeCount: 0, connectedAt: new Date() };
  }
};

// TODO: Consider moving real-time state management to Zustand store for better state synchronization across components