import express from 'express';
import { ClassSection } from '../models/ClassSection.js';
import { DataStore, getIsMongoConnected } from '../config/dataStore.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route GET /api/classes
router.get('/', async (req, res) => {
  try {
    if (getIsMongoConnected()) {
      const classes = await ClassSection.find().sort({ createdAt: -1 });
      return res.json(classes);
    }
    const classes = await DataStore.getClassSections();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error fetching classes/sections.' });
  }
});

// @route POST /api/classes
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { course, semester, section, department, teacher, subject, room, academicYear, status } = req.body;
    if (!course || !semester || !section || !department) {
      return res.status(400).json({ message: 'Course, semester, section, and department are required.' });
    }

    if (getIsMongoConnected()) {
      const cls = await ClassSection.create({ course, semester, section, department, teacher, subject, room, academicYear, status });
      return res.status(201).json(cls);
    }

    const cls = await DataStore.createClassSection({ course, semester, section, department, teacher, subject, room, academicYear, status });
    res.status(201).json(cls);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error creating class/section.' });
  }
});

// @route PUT /api/classes/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (getIsMongoConnected()) {
      const cls = await ClassSection.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!cls) return res.status(404).json({ message: 'Class/section not found.' });
      return res.json(cls);
    }

    const cls = await DataStore.updateClassSection(req.params.id, req.body);
    if (!cls) return res.status(404).json({ message: 'Class/section not found.' });
    res.json(cls);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error updating class/section.' });
  }
});

// @route DELETE /api/classes/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (getIsMongoConnected()) {
      await ClassSection.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Class/section deleted successfully.' });
    }

    await DataStore.deleteClassSection(req.params.id);
    res.json({ message: 'Class/section deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error deleting class/section.' });
  }
});

export default router;
