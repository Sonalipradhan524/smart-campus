import express from 'express';
import { DataStore } from '../config/dataStore.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get real administrative dashboard overview
router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    const students = await DataStore.getAllStudents();
    const teachers = await DataStore.getAllTeachers();
    const requests = await DataStore.getAllRequests();
    const complaints = await DataStore.getAllComplaints();
    const notices = await DataStore.getAllNotices();

    const pendingRequests = requests.filter(r => r.status === 'pending').length;
    const pendingComplaints = complaints.filter(c => c.status === 'pending' || c.status === 'in-progress').length;

    res.json({
      totalStudents: students.length,
      totalTeachers: teachers.length,
      pendingRequests,
      pendingComplaints,
      totalNotices: notices.length,
      recentRequests: requests.slice(0, 5),
      recentComplaints: complaints.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin dashboard.' });
  }
});

// @route   GET /api/admin/students
// @desc    Get all registered student directory
router.get('/students', protect, adminOnly, async (req, res) => {
  try {
    const students = await DataStore.getAllStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student directory.' });
  }
});

// @route   GET /api/admin/teachers
// @desc    Get all faculty / teacher directory
router.get('/teachers', protect, adminOnly, async (req, res) => {
  try {
    const teachers = await DataStore.getAllTeachers();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teacher directory.' });
  }
});

// @route   POST /api/admin/teachers
// @desc    Register a new faculty member
router.post('/teachers', protect, adminOnly, async (req, res) => {
  try {
    const newTeacher = await DataStore.createTeacher(req.body);
    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(500).json({ message: 'Error registering teacher.' });
  }
});

export default router;
