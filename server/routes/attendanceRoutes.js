import express from 'express';
import { Attendance } from '../models/Attendance.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/attendance
// @desc    Get user attendance record
router.get('/', protect, async (req, res) => {
  try {
    let attendance = await Attendance.findOne({ user: req.user._id });
    if (!attendance) {
      // Create empty default structure for student
      attendance = {
        overallPercentage: 0,
        totalClasses: 0,
        attendedClasses: 0,
        absentClasses: 0,
        subjects: [],
      };
    }
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching attendance.' });
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
