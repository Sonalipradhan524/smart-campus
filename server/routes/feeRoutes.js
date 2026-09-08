import express from 'express';
import { DataStore } from '../config/dataStore.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/fees
// @desc    Get user fee breakdown
router.get('/', protect, async (req, res) => {
  try {
    const fee = await DataStore.getFeeDetails(req.user._id);
    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching fee details.' });
  }
});

// @route   POST /api/fees/pay
// @desc    Record fee payment
router.post('/pay', protect, async (req, res) => {
  try {
    const { amount, method } = req.body;
    const fee = await DataStore.recordFeePayment(req.user._id, amount, method);
    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: 'Error recording fee payment.' });
  }
});

export default router;
