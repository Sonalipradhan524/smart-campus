import express from 'express';
import { Subject } from '../models/Subject.js';
import { DataStore, getIsMongoConnected } from '../config/dataStore.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route GET /api/subjects
router.get('/', async (req, res) => {
  try {
    if (getIsMongoConnected()) {
      const subjects = await Subject.find().sort({ createdAt: -1 });
      return res.json(subjects);
    }
    const subjects = await DataStore.getSubjects();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error fetching subjects.' });
  }
});

// @route POST /api/subjects
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, code, department, course, semester, credits, subjectType, status } = req.body;
    if (!name || !code || !department) {
      return res.status(400).json({ message: 'Name, code, and department are required.' });
    }

    if (getIsMongoConnected()) {
      const sub = await Subject.create({ name, code, department, course, semester, credits, subjectType, status });
      return res.status(201).json(sub);
    }

    const sub = await DataStore.createSubject({ name, code, department, course, semester, credits, subjectType, status });
    res.status(201).json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error creating subject.' });
  }
});

// @route PUT /api/subjects/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (getIsMongoConnected()) {
      const sub = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!sub) return res.status(404).json({ message: 'Subject not found.' });
      return res.json(sub);
    }

    const sub = await DataStore.updateSubject(req.params.id, req.body);
    if (!sub) return res.status(404).json({ message: 'Subject not found.' });
    res.json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error updating subject.' });
  }
});

// @route DELETE /api/subjects/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (getIsMongoConnected()) {
      await Subject.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Subject deleted successfully.' });
    }

    await DataStore.deleteSubject(req.params.id);
    res.json({ message: 'Subject deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error deleting subject.' });
  }
});

export default router;
