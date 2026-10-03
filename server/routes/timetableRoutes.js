import express from 'express';
import { Timetable } from '../models/Timetable.js';
import { DataStore, getIsMongoConnected } from '../config/dataStore.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Helper to sanitize timetable objects
const mapSlot = (slot) => {
  if (!slot) return null;
  const raw = slot.toObject ? slot.toObject() : slot;
  return {
    id: raw._id || raw.id,
    _id: raw._id || raw.id,
    day: raw.day || 'Monday',
    roomNo: raw.roomNo || raw.room || '109',
    branch: raw.branch || 'CSE',
    startTime: raw.startTime || '09:00 AM',
    endTime: raw.endTime || '10:00 AM',
    time: raw.time || `${raw.startTime} - ${raw.endTime}`,
    subject: raw.subject || 'Subject',
    teacher: raw.teacher || raw.faculty || 'FACULTY',
    faculty: raw.faculty || raw.teacher || 'FACULTY',
    code: raw.code || 'SUB-101',
    classType: raw.classType || raw.type || 'Lecture',
    semester: raw.semester || '3rd Semester',
    course: raw.course || 'B.Tech',
    academicYear: raw.academicYear || '2026-27',
    effectiveFrom: raw.effectiveFrom || '20-07-2026',
    status: raw.status || 'Verified',
    createdAt: raw.createdAt || new Date().toISOString()
  };
};

// @route   GET /api/timetable
// @desc    Get timetable schedule with optional filters (branch, day, teacher, roomNo, semester)
router.get('/', async (req, res) => {
  try {
    const { branch, day, teacher, roomNo, semester } = req.query;
    const isMongo = getIsMongoConnected();

    if (isMongo) {
      const query = {};
      if (branch) query.branch = new RegExp(`^${branch}$`, 'i');
      if (day) query.day = new RegExp(`^${day}$`, 'i');
      if (teacher) {
        query.$or = [
          { teacher: new RegExp(teacher, 'i') },
          { faculty: new RegExp(teacher, 'i') }
        ];
      }
      if (roomNo) query.roomNo = new RegExp(`^${roomNo}$`, 'i');
      if (semester) query.semester = new RegExp(`^${semester}$`, 'i');

      const slots = await Timetable.find(query).sort({ createdAt: 1 });
      if (slots.length > 0) {
        return res.json(slots.map(mapSlot));
      }
    }

    // Fallback to DataStore memory store
    const slots = await DataStore.getTimetable({ branch, day, teacher, roomNo, semester });
    res.json(slots.map(mapSlot));
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching timetable.' });
  }
});

// @route   GET /api/timetable/branch/:branch
// @desc    Get timetable for a specific branch
router.get('/branch/:branch', async (req, res) => {
  try {
    const { branch } = req.params;
    const isMongo = getIsMongoConnected();

    if (isMongo) {
      const slots = await Timetable.find({ branch: new RegExp(`^${branch}$`, 'i') });
      if (slots.length > 0) return res.json(slots.map(mapSlot));
    }

    const slots = await DataStore.getTimetable({ branch });
    res.json(slots.map(mapSlot));
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching branch timetable.' });
  }
});

// @route   GET /api/timetable/day/:day
// @desc    Get timetable for a specific day
router.get('/day/:day', async (req, res) => {
  try {
    const { day } = req.params;
    const isMongo = getIsMongoConnected();

    if (isMongo) {
      const slots = await Timetable.find({ day: new RegExp(`^${day}$`, 'i') });
      if (slots.length > 0) return res.json(slots.map(mapSlot));
    }

    const slots = await DataStore.getTimetable({ day });
    res.json(slots.map(mapSlot));
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching day timetable.' });
  }
});

// @route   GET /api/timetable/teacher/:teacher
// @desc    Get timetable assigned to a specific teacher/faculty
router.get('/teacher/:teacher', async (req, res) => {
  try {
    const { teacher } = req.params;
    const isMongo = getIsMongoConnected();

    if (isMongo) {
      const slots = await Timetable.find({
        $or: [
          { teacher: new RegExp(teacher, 'i') },
          { faculty: new RegExp(teacher, 'i') }
        ]
      });
      if (slots.length > 0) return res.json(slots.map(mapSlot));
    }

    const slots = await DataStore.getTimetable({ teacher });
    res.json(slots.map(mapSlot));
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching teacher timetable.' });
  }
});

// @route   GET /api/timetable/:id
// @desc    Get single timetable slot by ID
router.get('/:id', async (req, res) => {
  try {
    const isMongo = getIsMongoConnected();
    if (isMongo) {
      const slot = await Timetable.findById(req.params.id);
      if (slot) return res.json(mapSlot(slot));
    }

    const slot = await DataStore.getTimetableById(req.params.id);
    if (!slot) return res.status(404).json({ message: 'Timetable slot not found.' });
    res.json(mapSlot(slot));
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching timetable slot.' });
  }
});

// @route   POST /api/timetable
// @desc    Add a timetable class slot (Admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const isMongo = getIsMongoConnected();
    let slot;
    if (isMongo) {
      slot = await Timetable.create(req.body);
    } else {
      slot = await DataStore.createTimetableSlot(req.body);
    }
    res.status(201).json(mapSlot(slot));
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error adding lecture slot.' });
  }
});

// @route   PUT /api/timetable/:id
// @desc    Update a timetable slot (Admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const isMongo = getIsMongoConnected();
    let slot;
    if (isMongo) {
      slot = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true });
    } else {
      slot = await DataStore.updateTimetableSlot(req.params.id, req.body);
    }
    if (!slot) return res.status(404).json({ message: 'Timetable slot not found.' });
    res.json(mapSlot(slot));
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating slot.' });
  }
});

// @route   DELETE /api/timetable/:id
// @desc    Delete a timetable slot (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const isMongo = getIsMongoConnected();
    if (isMongo) {
      await Timetable.findByIdAndDelete(req.params.id);
    } else {
      await DataStore.deleteTimetableSlot(req.params.id);
    }
    res.json({ message: 'Slot deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error deleting slot.' });
  }
});

export default router;
