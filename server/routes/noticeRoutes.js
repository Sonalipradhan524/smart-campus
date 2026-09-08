import express from 'express';
import { DataStore } from '../config/dataStore.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/notices
// @desc    Get all public campus notices
router.get('/', async (req, res) => {
  try {
    const notices = await DataStore.getAllNotices();
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notices.' });
  }
});

// @route   POST /api/notices
// @desc    Admin publish official notice
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const newNotice = await DataStore.createNotice({
      postedBy: req.user.name,
      ...req.body,
    });
    res.status(201).json(newNotice);
  } catch (error) {
    res.status(500).json({ message: 'Error publishing notice.' });
  }
});

// @route   DELETE /api/notices/:id
// @desc    Admin remove notice
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const deleted = await DataStore.deleteNotice(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Notice not found.' });
    }
    res.json({ message: 'Notice deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notice.' });
  }
});

export default router;
