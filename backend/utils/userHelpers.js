/**
 * User service helper functions for business logic separation
 */

import { User, RefreshToken } from '../models/index.js';

/**
 * Fetches paginated users with filtering and sorting
 * @param {Object} queryConditions - MongoDB query conditions
 * @param {Object} sortParams - MongoDB sort parameters
 * @param {number} skip - Number of documents to skip
 * @param {number} limit - Number of documents to return
 * @returns {Promise<Object>} - Users and total count
 */
export const fetchPaginatedUsers = async (queryConditions, sortParams, skip, limit) => {
  const [users, totalCount] = await Promise.all([
    User.find(queryConditions)
      .select('-password')
      .sort(sortParams)
      .skip(skip)
      .limit(limit),
    User.countDocuments(queryConditions)
  ]);

  return { users, totalCount };
};

/**
 * Fetches user by ID with additional statistics
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} - User with statistics or null
 */
export const fetchUserWithStatistics = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    return null;
  }

  const refreshTokenCount = await RefreshToken.countDocuments({
    userId,
    isActive: true
  });

  return {
    user,
    statistics: {
      activeTokens: refreshTokenCount
    }
  };
};

/**
 * Creates a new user after checking for existing email
 * @param {Object} userData - User data object
 * @returns {Promise<Object>} - Result object with user or error
 */
export const createNewUser = async (userData) => {
  const { email, password, firstName, lastName, role = 'user' } = userData;

  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return {
      success: false,
      message: 'User with this email already exists',
      statusCode: 409
    };
  }

  const user = new User({
    email,
    password,
    firstName,
    lastName,
    role
  });

  await user.save();

  return {
    success: true,
    user: user.toJSON()
  };
};

/**
 * Updates user fields and handles deactivation logic
 * @param {string} userId - User ID to update
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Object>} - Result object with user or error
 */
export const updateUserFields = async (userId, updateData) => {
  const { firstName, lastName, role, isActive } = updateData;

  const user = await User.findById(userId);
  if (!user) {
    return {
      success: false,
      message: 'User not found',
      statusCode: 404
    };
  }

  if (firstName !== undefined) user.firstName = firstName;
  if (lastName !== undefined) user.lastName = lastName;
  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;

  await user.save();

  if (isActive === false) {
    await RefreshToken.revokeAllForUser(userId);
  }

  return {
    success: true,
    user: user.toJSON()
  };
};

/**
 * Deletes user and revokes all their tokens
 * @param {string} userId - User ID to delete
 * @returns {Promise<Object>} - Result object
 */
export const deleteUserAndTokens = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    return {
      success: false,
      message: 'User not found',
      statusCode: 404
    };
  }

  await RefreshToken.revokeAllForUser(userId);
  await User.findByIdAndDelete(userId);

  return {
    success: true,
    message: 'User deleted successfully'
  };
};

/**
 * Revokes all refresh tokens for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Result object with revoked count
 */
export const revokeAllUserTokens = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    return {
      success: false,
      message: 'User not found',
      statusCode: 404
    };
  }

  const result = await RefreshToken.revokeAllForUser(userId);

  return {
    success: true,
    revokedCount: result.modifiedCount
  };
};

/**
 * Calculates user statistics for admin dashboard
 * @returns {Promise<Object>} - User statistics object
 */
export const calculateUserStatistics = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalUsers,
    activeUsers,
    adminUsers,
    regularUsers,
    recentUsers,
    activeTokens
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    User.countDocuments({ role: 'admin', isActive: true }),
    User.countDocuments({ role: 'user', isActive: true }),
    User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    RefreshToken.countDocuments({ isActive: true })
  ]);

  return {
    totalUsers,
    activeUsers,
    inactiveUsers: totalUsers - activeUsers,
    adminUsers,
    regularUsers,
    recentUsers,
    activeTokens
  };
};