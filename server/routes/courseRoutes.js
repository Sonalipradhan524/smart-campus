import express from 'express';
import { Course } from '../models/Course.js';
import { DataStore, getIsMongoConnected } from '../config/dataStore.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route GET /api/courses
router.get('/', async (req, res) => {
  try {
    if (getIsMongoConnected()) {
      const courses = await Course.find().sort({ createdAt: -1 });
      return res.json(courses);
    }
    const courses = await DataStore.getCourses();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error fetching courses.' });
  }
});

// @route POST /api/courses
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, code, department, duration, description, status } = req.body;
    if (!name || !code || !department) {
      return res.status(400).json({ message: 'Name, code, and department are required.' });
    }

    if (getIsMongoConnected()) {
      const crs = await Course.create({ name, code, department, duration, description, status });
      return res.status(201).json(crs);
    }

    const crs = await DataStore.createCourse({ name, code, department, duration, description, status });
    res.status(201).json(crs);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error creating course.' });
  }
});

// @route PUT /api/courses/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (getIsMongoConnected()) {
      const crs = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!crs) return res.status(404).json({ message: 'Course not found.' });
      return res.json(crs);
    }

    const crs = await DataStore.updateCourse(req.params.id, req.body);
    if (!crs) return res.status(404).json({ message: 'Course not found.' });
    res.json(crs);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error updating course.' });
  }
});

// @route DELETE /api/courses/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (getIsMongoConnected()) {
      await Course.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Course deleted successfully.' });
    }

    await DataStore.deleteCourse(req.params.id);
    res.json({ message: 'Course deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error deleting course.' });
  }
});

export default router;
