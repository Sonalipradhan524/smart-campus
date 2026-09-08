import express from 'express';
import { DataStore } from '../config/dataStore.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get user notifications
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await DataStore.getNotificationsByUser(req.user._id);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications.' });
  }
});

// @route   PATCH /api/notifications/:id/read
// @desc    Mark notification as read
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const updated = await DataStore.markNotificationRead(req.params.id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification status.' });
  }
});

export default router;
