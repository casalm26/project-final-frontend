import express from 'express';
import {
  getAuditLogs,
  getAuditLogById,
  getResourceAuditLogs,
  getUserActivity,
  getAuditStatistics,
  exportAuditLogs
} from '../controllers/auditController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Statistics (admin only)
router.get('/statistics', requireAdmin, getAuditStatistics);

// Export audit logs (admin only)
router.get('/export', requireAdmin, exportAuditLogs);

// General audit log routes (admin only)
router.get('/', requireAdmin, getAuditLogs);
router.get('/:id', requireAdmin, getAuditLogById);

// Resource-specific audit logs (admin only)
router.get('/resource/:resource/:resourceId', requireAdmin, getResourceAuditLogs);

// User activity logs (admin can see all, users can see their own)
router.get('/user/:userId', getUserActivity);

export default router;