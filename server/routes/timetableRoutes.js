import express from 'express';
import { Timetable } from '../models/Timetable.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/timetable
// @desc    Get timetable schedule
router.get('/', async (req, res) => {
  try {
    const timetable = await Timetable.find().sort({ createdAt: 1 });
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching timetable.' });
  }
});

// @route   POST /api/timetable
// @desc    Add a timetable class slot (Admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const slot = await Timetable.create(req.body);
    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error adding lecture slot.' });
  }
});

// @route   PUT /api/timetable/:id
// @desc    Update a timetable slot (Admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const slot = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating slot.' });
  }
});

// @route   DELETE /api/timetable/:id
// @desc    Delete a timetable slot (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id);
    res.json({ message: 'Slot deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error deleting slot.' });
  }
});

export default router;
