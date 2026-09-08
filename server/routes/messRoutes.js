import express from 'express';
import { DataStore } from '../config/dataStore.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/mess
// @desc    Get mess details
router.get('/', protect, async (req, res) => {
  try {
    const mess = await DataStore.getMessDetails();
    res.json(mess);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mess details.' });
  }
});

// @route   POST /api/mess/feedback
// @desc    Submit student dining feedback
router.post('/feedback', protect, async (req, res) => {
  try {
    const { meal, rating, comment } = req.body;
    const feedbackData = {
      studentName: req.user.name,
      meal: meal || 'Lunch',
      rating: rating || 5,
      comment: comment || 'Food quality was great today.',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    const updatedMess = await DataStore.submitMessFeedback(feedbackData);
    res.status(201).json(updatedMess);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting mess feedback.' });
  }
});

export default router;
