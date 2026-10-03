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

// @route   POST /api/admin/students
// @desc    Admin register new student
router.post('/students', protect, adminOnly, async (req, res) => {
  try {
    const student = await DataStore.createUser({ ...req.body, role: 'student' });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error creating student.' });
  }
});

// @route   PUT /api/admin/students/:id
// @desc    Admin update student details or status
router.put('/students/:id', protect, adminOnly, async (req, res) => {
  try {
    const updated = await DataStore.updateUserProfile(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Student not found.' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating student.' });
  }
});

// @route   DELETE /api/admin/students/:id
// @desc    Admin delete student
router.delete('/students/:id', protect, adminOnly, async (req, res) => {
  try {
    const deleted = await DataStore.deleteUser(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Student not found.' });
    res.json({ message: 'Student deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error deleting student.' });
  }
});

// @route   PUT /api/admin/teachers/:id
// @desc    Admin update teacher details or status
router.put('/teachers/:id', protect, adminOnly, async (req, res) => {
  try {
    const updated = await DataStore.updateUserProfile(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Teacher not found.' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating teacher.' });
  }
});

// @route   DELETE /api/admin/teachers/:id
// @desc    Admin delete teacher
router.delete('/teachers/:id', protect, adminOnly, async (req, res) => {
  try {
    const deleted = await DataStore.deleteUser(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Teacher not found.' });
    res.json({ message: 'Teacher deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error deleting teacher.' });
  }
});

// @route   GET /api/admin/attendance
// @desc    Get campus-wide attendance overview and monitoring statistics
router.get('/attendance', protect, adminOnly, async (req, res) => {
  try {
    const overview = await DataStore.getAdminAttendanceOverview(req.query);
    res.json(overview);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campus attendance monitoring.' });
  }
});

export default router;
