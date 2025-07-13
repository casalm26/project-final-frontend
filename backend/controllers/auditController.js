import { validationResult } from 'express-validator';
import { AuditLog } from '../models/index.js';

// Get audit logs with filtering and pagination (admin only)
export const getAuditLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      userId,
      resource,
      action,
      startDate,
      endDate,
      sortBy = 'timestamp',
      sortOrder = 'desc'
    } = req.query;

    // Build query conditions
    const queryConditions = {};

    if (userId) queryConditions.userId = userId;
    if (resource) queryConditions.resource = resource;
    if (action) queryConditions.action = action;

    if (startDate || endDate) {
      queryConditions.timestamp = {};
      if (startDate) queryConditions.timestamp.$gte = new Date(startDate);
      if (endDate) queryConditions.timestamp.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortDirection = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const logs = await AuditLog.find(queryConditions)
      .populate('userId', 'firstName lastName email')
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalCount = await AuditLog.countDocuments(queryConditions);

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNextPage: page * limit < totalCount,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get audit log by ID (admin only)
export const getAuditLogById = async (req, res) => {
  try {
    const { id } = req.params;

    const log = await AuditLog.findById(id)
      .populate('userId', 'firstName lastName email role');

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Audit log not found'
      });
    }

    res.json({
      success: true,
      data: { log }
    });
  } catch (error) {
    console.error('Get audit log by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get audit logs for a specific resource (admin only)
export const getResourceAuditLogs = async (req, res) => {
  try {
    const { resource, resourceId } = req.params;
    const { limit = 50 } = req.query;

    const logs = await AuditLog.getResourceLogs(resource, resourceId, parseInt(limit));

    res.json({
      success: true,
      data: {
        resource,
        resourceId,
        logs,
        totalCount: logs.length
      }
    });
  } catch (error) {
    console.error('Get resource audit logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user activity logs (admin only, or user can see their own)
export const getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 100 } = req.query;

    // Check if user is trying to access their own logs or if they're admin
    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const logs = await AuditLog.getUserActivity(userId, parseInt(limit));

    res.json({
      success: true,
      data: {
        userId,
        logs,
        totalCount: logs.length
      }
    });
  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get audit statistics (admin only)
export const getAuditStatistics = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const statistics = await AuditLog.getAuditStatistics(parseInt(days));

    // Get recent activity breakdown
    const recentActivity = await AuditLog.aggregate([
      {
        $match: {
          timestamp: {
            $gte: new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$timestamp'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: parseInt(days) }
    ]);

    // Get top active users
    const topUsers = await AuditLog.aggregate([
      {
        $match: {
          timestamp: {
            $gte: new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: '$userId',
          count: { $sum: 1 },
          userEmail: { $first: '$userEmail' },
          userRole: { $first: '$userRole' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        ...statistics,
        recentActivity,
        topUsers
      }
    });
  } catch (error) {
    console.error('Get audit statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Export audit logs (admin only)
export const exportAuditLogs = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      userId,
      resource,
      action,
      format = 'csv'
    } = req.query;

    const queryConditions = {};

    if (userId) queryConditions.userId = userId;
    if (resource) queryConditions.resource = resource;
    if (action) queryConditions.action = action;

    if (startDate || endDate) {
      queryConditions.timestamp = {};
      if (startDate) queryConditions.timestamp.$gte = new Date(startDate);
      if (endDate) queryConditions.timestamp.$lte = new Date(endDate);
    }

    const logs = await AuditLog.find(queryConditions)
      .populate('userId', 'firstName lastName email')
      .sort({ timestamp: -1 })
      .limit(10000) // Reasonable limit for exports
      .lean();

    if (logs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No audit logs found matching the criteria'
      });
    }

    // Prepare export data
    const exportData = logs.map(log => ({
      'Timestamp': log.timestamp.toISOString(),
      'Action': log.action,
      'Resource': log.resource,
      'Resource ID': log.resourceId || '',
      'User': log.userId ? `${log.userId.firstName} ${log.userId.lastName}` : 'Unknown',
      'User Email': log.userEmail,
      'User Role': log.userRole,
      'IP Address': log.metadata?.ipAddress || '',
      'Endpoint': log.metadata?.endpoint || '',
      'Method': log.metadata?.method || '',
      'Status Code': log.metadata?.statusCode || '',
      'Error Message': log.metadata?.errorMessage || '',
      'Has Changes': log.changes ? 'Yes' : 'No'
    }));

    if (format === 'csv') {
      // Export as CSV
      const csvHeaders = Object.keys(exportData[0]);
      const csvRows = exportData.map(row => 
        csvHeaders.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      );
      const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

      const filename = `nanwa_audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(csvContent);
    } else {
      // Return JSON for other formats
      res.json({
        success: true,
        data: {
          logs: exportData,
          totalCount: exportData.length,
          exportedAt: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    console.error('Export audit logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};