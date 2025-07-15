import { validationResult } from 'express-validator';
import { User, RefreshToken } from '../models/index.js';
import { generateToken } from '../utils/jwt.js';

// Register new user
export const register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Generate refresh token
    const refreshToken = RefreshToken.generateToken(
      user._id,
      req.headers['user-agent'],
      req.ip || req.connection.remoteAddress
    );
    await refreshToken.save();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        refreshToken: refreshToken.token,
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Generate refresh token
    const refreshToken = RefreshToken.generateToken(
      user._id,
      req.headers['user-agent'],
      req.ip || req.connection.remoteAddress
    );
    await refreshToken.save();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        refreshToken: refreshToken.token,
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user.toJSON()
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { firstName, lastName } = req.body;
    const user = req.user;

    // Update allowed fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Refresh JWT token using refresh token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: tokenValue } = req.body;

    if (!tokenValue) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Find and validate refresh token
    const storedToken = await RefreshToken.findValidToken(tokenValue);
    if (!storedToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    // Check if user is still active
    if (!storedToken.userId.isActive) {
      await storedToken.revoke();
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Generate new JWT token
    const newAccessToken = generateToken(storedToken.userId._id);

    // Generate new refresh token and revoke the old one
    const newRefreshToken = RefreshToken.generateToken(
      storedToken.userId._id,
      req.headers['user-agent'],
      req.ip || req.connection.remoteAddress
    );
    
    await Promise.all([
      newRefreshToken.save(),
      storedToken.revoke()
    ]);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newAccessToken,
        refreshToken: newRefreshToken.token
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Logout with refresh token revocation
export const logout = async (req, res) => {
  try {
    const { refreshToken: tokenValue } = req.body;

    if (tokenValue) {
      // Find and revoke the refresh token
      const storedToken = await RefreshToken.findValidToken(tokenValue);
      if (storedToken) {
        await storedToken.revoke();
      }
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Logout from all devices
export const logoutAll = async (req, res) => {
  try {
    const userId = req.user._id;

    // Revoke all refresh tokens for the user
    await RefreshToken.revokeAllForUser(userId);

    res.json({
      success: true,
      message: 'Logged out from all devices successfully'
    });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};