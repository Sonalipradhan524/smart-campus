import express from 'express';
import { Department } from '../models/Department.js';
import { DataStore, getIsMongoConnected } from '../config/dataStore.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route GET /api/departments
router.get('/', async (req, res) => {
  try {
    if (getIsMongoConnected()) {
      const deps = await Department.find().sort({ createdAt: -1 });
      return res.json(deps);
    }
    const deps = await DataStore.getDepartments();
    res.json(deps);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error fetching departments.' });
  }
});

// @route POST /api/departments
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, code, description, hod, status } = req.body;
    if (!name || !code) {
      return res.status(400).json({ message: 'Department name and code are required.' });
    }

    if (getIsMongoConnected()) {
      const dep = await Department.create({ name, code, description, hod, status });
      return res.status(201).json(dep);
    }

    const dep = await DataStore.createDepartment({ name, code, description, hod, status });
    res.status(201).json(dep);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error creating department.' });
  }
});

// @route PUT /api/departments/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (getIsMongoConnected()) {
      const dep = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!dep) return res.status(404).json({ message: 'Department not found.' });
      return res.json(dep);
    }

    const dep = await DataStore.updateDepartment(req.params.id, req.body);
    if (!dep) return res.status(404).json({ message: 'Department not found.' });
    res.json(dep);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error updating department.' });
  }
});

// @route DELETE /api/departments/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (getIsMongoConnected()) {
      await Department.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Department deleted successfully.' });
    }

    await DataStore.deleteDepartment(req.params.id);
    res.json({ message: 'Department deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error deleting department.' });
  }
});

export default router;
