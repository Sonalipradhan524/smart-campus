import express from 'express';
import { DataStore } from '../config/dataStore.js';
import { protect, adminOnly } from '../middleware/auth.js';

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
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    const updatedMess = await DataStore.submitMessFeedback(feedbackData);
    res.status(201).json(updatedMess);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting mess feedback.' });
  }
});

// @route   GET /api/mess/food-waste
// @desc    Get all canteen/mess food waste and consumption logs
router.get('/food-waste', protect, async (req, res) => {
  try {
    const logs = await DataStore.getFoodWasteLogs();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching food waste records.' });
  }
});

// @route   POST /api/mess/food-waste
// @desc    Admin log real meal preparation and food waste data
router.post('/food-waste', protect, adminOnly, async (req, res) => {
  try {
    const {
      date,
      mealType,
      expectedStudents,
      actualStudentsServed,
      foodPreparedKg,
      foodWastedKg,
      notes,
    } = req.body;

    if (!expectedStudents || !actualStudentsServed || foodPreparedKg === undefined || foodWastedKg === undefined) {
      return res.status(400).json({ message: 'Please provide all required food metrics.' });
    }

    const newLog = await DataStore.createFoodWasteLog({
      date: date || new Date().toISOString().split('T')[0],
      mealType: mealType || 'Lunch',
      expectedStudents: Number(expectedStudents),
      actualStudentsServed: Number(actualStudentsServed),
      foodPreparedKg: Number(foodPreparedKg),
      foodWastedKg: Number(foodWastedKg),
      notes: notes || '',
      loggedBy: req.user.name || 'Campus Administrator',
    });

    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json({ message: 'Error saving food waste record.' });
  }
});

// @route   DELETE /api/mess/food-waste/:id
// @desc    Admin delete a food waste record
router.delete('/food-waste/:id', protect, adminOnly, async (req, res) => {
  try {
    const deleted = await DataStore.deleteFoodWasteLog(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Food waste record not found.' });
    }
    res.json({ message: 'Record deleted successfully.', deleted });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting record.' });
  }
});

export default router;
