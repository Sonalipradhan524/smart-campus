import express from 'express';
import { DataStore } from '../config/dataStore.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/audit-logs
// @desc    Get system audit logs (Admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const logs = await DataStore.getAuditLogs();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching audit logs.' });
  }
});

// @route   POST /api/audit-logs
// @desc    Record an audit log
router.post('/', protect, async (req, res) => {
  try {
    const log = await DataStore.createAuditLog({
      userId: req.user._id || req.user.id || req.user.studentId || req.user.employeeId,
      userName: req.user.name,
      userRole: req.user.role,
      action: req.body.action,
      entity: req.body.entity,
      entityId: req.body.entityId || '',
      details: req.body.details || '',
      ipAddress: req.ip || ''
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error logging audit entry.' });
  }
});

export default router;
