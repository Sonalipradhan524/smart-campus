import express from 'express';
import { Attendance, ClassSessionAttendance } from '../models/Attendance.js';
import { DataStore, getIsMongoConnected } from '../config/dataStore.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Helper to calculate student attendance statistics & insights
const calculateStudentAttendance = async (student) => {
  const identifier = student.studentId || student.rollNo || student._id;

  let sessions = [];
  if (getIsMongoConnected()) {
    sessions = await ClassSessionAttendance.find({
      $or: [
        { 'records.studentId': identifier },
        { 'records.rollNo': identifier }
      ]
    }).sort({ date: 1 });
  } else {
    const allSessions = await DataStore.getClassAttendanceHistory();
    sessions = (allSessions || []).filter(s =>
      (s.records || []).some(r => r.studentId === identifier || r.rollNo === identifier || r.studentName === student.name)
    );
  }

  if (!sessions || sessions.length === 0) {
    const savedDoc = await Attendance.findOne({ user: student._id });
    if (savedDoc && savedDoc.subjects && savedDoc.subjects.length > 0) {
      return savedDoc;
    }

    return {
      overallPercentage: 0,
      totalClasses: 0,
      attendedClasses: 0,
      absentClasses: 0,
      subjects: [],
      calendarRecords: {},
      consecutiveNeeded: 0,
      smartInsight: 'No attendance recorded yet. Attend upcoming lectures to build your academic presence record.',
      message: 'No attendance records yet.'
    };
  }

  const subjectMap = {};
  let totalClasses = 0;
  let totalAttended = 0;
  const calendarRecords = {};
  const detailedHistory = [];

  sessions.forEach(sess => {
    const subKey = sess.subjectCode || sess.subject;
    if (!subjectMap[subKey]) {
      subjectMap[subKey] = {
        code: subKey,
        name: sess.subject,
        attended: 0,
        total: 0,
        teacher: sess.teacherName || 'Faculty'
      };
    }
    subjectMap[subKey].total += 1;
    totalClasses += 1;

    const myRecord = (sess.records || []).find(r =>
      r.studentId === identifier || r.rollNo === identifier || r.studentName === student.name
    );

    const isPresent = myRecord && (myRecord.status === 'present' || myRecord.status === 'PRESENT');

    if (isPresent) {
      subjectMap[subKey].attended += 1;
      totalAttended += 1;
    }

    if (sess.date) {
      calendarRecords[sess.date] = {
        date: sess.date,
        status: isPresent ? 'present' : 'absent',
        subject: sess.subject,
        subjectCode: subKey,
        teacher: sess.teacherName
      };
    }

    detailedHistory.push({
      date: sess.date,
      subject: sess.subject,
      subjectCode: subKey,
      section: sess.section,
      semester: sess.semester,
      teacherName: sess.teacherName,
      status: isPresent ? 'present' : 'absent'
    });
  });

  const subjects = Object.values(subjectMap).map(sub => {
    const percentage = sub.total > 0 ? Number(((sub.attended / sub.total) * 100).toFixed(1)) : 0;
    
    // Mathematical calculation for consecutive future classes needed to reach 75% for this subject
    // (attended + x) / (total + x) >= 0.75 => x >= ceil((0.75 * total - attended) / 0.25)
    let neededFor75 = 0;
    if (percentage < 75 && sub.total > 0) {
      neededFor75 = Math.max(0, Math.ceil(3 * sub.total - 4 * sub.attended));
    }

    return {
      ...sub,
      percentage,
      lowWarning: percentage < 75,
      neededFor75
    };
  });

  const overallPercentage = totalClasses > 0 ? Number(((totalAttended / totalClasses) * 100).toFixed(1)) : 0;
  const isOverallLow = overallPercentage < 75;

  // Exact mathematical calculation for overall consecutive classes needed to reach 75%
  let overallNeeded = 0;
  if (isOverallLow && totalClasses > 0) {
    overallNeeded = Math.max(0, Math.ceil(3 * totalClasses - 4 * totalAttended));
  }

  let smartInsight = `You have attended ${totalAttended} out of ${totalClasses} total classes.`;
  if (isOverallLow) {
    smartInsight = `Your overall attendance is ${overallPercentage}%, which is below the 75% threshold. You need to attend the next ${overallNeeded} consecutive classes to reach 75%.`;
  } else {
    smartInsight = `Your attendance is ${overallPercentage}%, which meets the university's 75% mandatory requirement. Keep up the good work!`;
  }

  return {
    overallPercentage,
    totalClasses,
    attendedClasses: totalAttended,
    absentClasses: totalClasses - totalAttended,
    isLowAttendance: isOverallLow,
    consecutiveNeeded: overallNeeded,
    smartInsight,
    subjects,
    calendarRecords,
    detailedHistory: detailedHistory.reverse()
  };
};

// @route   GET /api/attendance
// @desc    Get current student's attendance details with smart insights & calendar
router.get('/', protect, async (req, res) => {
  try {
    const data = await calculateStudentAttendance(req.user);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching attendance.' });
  }
});

// @route   GET /api/attendance/my
// @desc    Alias for student's own attendance details
router.get('/my', protect, async (req, res) => {
  try {
    const data = await calculateStudentAttendance(req.user);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching attendance.' });
  }
});

// @route   GET /api/attendance/history
// @desc    Get attendance history with query parameters
router.get('/history', protect, async (req, res) => {
  try {
    const data = await calculateStudentAttendance(req.user);
    res.json(data.detailedHistory || []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance history.' });
  }
});

// @route   GET /api/attendance/check-duplicate
// @desc    Pre-flight check if attendance already recorded for class & date
router.get('/check-duplicate', protect, async (req, res) => {
  try {
    const { subjectCode, subject, section, date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];
    const subCode = subjectCode || subject;

    let existing = null;
    if (getIsMongoConnected()) {
      existing = await ClassSessionAttendance.findOne({
        $or: [{ subjectCode: subCode }, { subject: subject }],
        section: section || 'Section A',
        date: targetDate,
      });
    } else {
      const allSessions = await DataStore.getClassAttendanceHistory();
      existing = (allSessions || []).find(
        (s) =>
          (s.subjectCode === subCode || s.subject === subject) &&
          s.section === (section || 'Section A') &&
          s.date === targetDate
      );
    }

    if (existing) {
      return res.json({
        isDuplicate: true,
        message: `Attendance has already been recorded for ${subject || subCode} (${section || 'Section A'}) on ${targetDate}.`,
        session: existing
      });
    }

    res.json({ isDuplicate: false });
  } catch (error) {
    res.status(500).json({ message: 'Error checking duplicate status.' });
  }
});

// @route   POST /api/attendance
// @desc    Publish / Update student attendance (Admin action)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { userId, overallPercentage, totalClasses, attendedClasses, absentClasses, subjects } = req.body;
    let attendance = await Attendance.findOne({ user: userId });

    if (attendance) {
      attendance.overallPercentage = overallPercentage;
      attendance.totalClasses = totalClasses;
      attendance.attendedClasses = attendedClasses;
      attendance.absentClasses = absentClasses;
      attendance.subjects = subjects;
      await attendance.save();
    } else {
      attendance = await Attendance.create({
        user: userId,
        overallPercentage,
        totalClasses,
        attendedClasses,
        absentClasses,
        subjects,
      });
    }

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating attendance.' });
  }
});

export default router;
