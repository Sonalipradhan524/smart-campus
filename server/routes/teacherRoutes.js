import express from 'express';
import { DataStore } from '../config/dataStore.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Role Guard Middleware for Teacher Portal (Teachers or Admins)
const teacherOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'teacher' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden. Teacher or Admin privileges required.' });
  }
};

// @route   GET /api/teacher/dashboard
// @desc    Get teacher dashboard metrics
router.get('/dashboard', protect, teacherOrAdmin, async (req, res) => {
  try {
    const students = await DataStore.getAllStudents();
    const requests = await DataStore.getAllRequests();
    const notices = await DataStore.getAllNotices();
    const history = await DataStore.getClassAttendanceHistory(req.user._id);

    const assignedClasses = req.user.assignedClasses || [
      { subject: 'Data Structures & Algorithms', code: 'CSE-301', semester: '6th Semester', section: 'Section A', enrolledCount: 45 },
      { subject: 'Database Management Systems', code: 'CSE-304', semester: '4th Semester', section: 'Section B', enrolledCount: 42 },
    ];

    res.json({
      teacherName: req.user.name,
      employeeId: req.user.employeeId,
      department: req.user.department,
      assignedClassesCount: assignedClasses.length,
      totalEnrolledStudents: students.length,
      pendingRequestsCount: requests.filter(r => r.status === 'pending').length,
      recentMarkedSessions: history.slice(0, 5),
      recentRequests: requests.slice(0, 5),
      notices: notices.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teacher dashboard.' });
  }
});

// @route   GET /api/teacher/classes
// @desc    Get assigned classes & enrolled students
router.get('/classes', protect, teacherOrAdmin, async (req, res) => {
  try {
    const assignedClasses = req.user.assignedClasses || [
      { subject: 'Data Structures & Algorithms', code: 'CSE-301', semester: '6th Semester', section: 'Section A', enrolledCount: 45 },
      { subject: 'Database Management Systems', code: 'CSE-304', semester: '4th Semester', section: 'Section B', enrolledCount: 42 },
      { subject: 'Artificial Intelligence & ML', code: 'CSE-402', semester: '8th Semester', section: 'Section A', enrolledCount: 38 }
    ];
    const students = await DataStore.getAllStudents();
    res.json({
      classes: assignedClasses,
      students: students
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assigned classes.' });
  }
});

// @route   POST /api/teacher/attendance
// @desc    Mark & save class session attendance to REAL database
router.post('/attendance', protect, teacherOrAdmin, async (req, res) => {
  try {
    const { subject, subjectCode, semester, section, date, records } = req.body;
    const session = await DataStore.markClassAttendance({
      teacherId: req.user._id,
      teacherName: req.user.name,
      subject,
      subjectCode,
      semester,
      section,
      date: date || new Date().toISOString().split('T')[0],
      records: records || []
    });
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error saving class attendance.' });
  }
});

// @route   GET /api/teacher/attendance
// @desc    Get past attendance sessions marked by teacher
router.get('/attendance', protect, teacherOrAdmin, async (req, res) => {
  try {
    const history = await DataStore.getClassAttendanceHistory(req.user._id);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance history.' });
  }
});

// @route   GET /api/teacher/requests
// @desc    Get student requests for teacher review
router.get('/requests', protect, teacherOrAdmin, async (req, res) => {
  try {
    const requests = await DataStore.getAllRequests();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student requests.' });
  }
});

// @route   PATCH /api/teacher/requests/:id/status
// @desc    Teacher approve/reject request
router.patch('/requests/:id/status', protect, teacherOrAdmin, async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const updated = await DataStore.updateRequestStatus(req.params.id, status, remarks);
    if (!updated) {
      return res.status(404).json({ message: 'Request not found.' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating request status.' });
  }
});

// @route   POST /api/teacher/notices
// @desc    Teacher publish class notice
router.post('/notices', protect, teacherOrAdmin, async (req, res) => {
  try {
    const newNotice = await DataStore.createNotice({
      postedBy: `Prof. ${req.user.name}`,
      category: 'Academic',
      department: req.user.department || 'Computer Science & Engineering',
      ...req.body
    });
    res.status(201).json(newNotice);
  } catch (error) {
    res.status(500).json({ message: 'Error publishing class notice.' });
  }
});

export default router;
