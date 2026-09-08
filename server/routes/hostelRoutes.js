import express from 'express';
import { DataStore } from '../config/dataStore.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/hostel
// @desc    Get hostel details
router.get('/', protect, async (req, res) => {
  try {
    const hostel = await DataStore.getHostelDetails();
    res.json(hostel);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hostel details.' });
  }
});

export default router;
