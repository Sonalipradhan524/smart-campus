import express from 'express';
import { DataStore } from '../config/dataStore.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/complaints
// @desc    Get user complaints (student) or all complaints for admin
router.get('/', protect, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { userId: req.user._id };
    const complaints = await DataStore.getAllComplaints(query);
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaints.' });
  }
});

// @route   POST /api/complaints
// @desc    File a new complaint with transparent keyword triaging
router.post('/', protect, async (req, res) => {
  try {
    const newComplaint = await DataStore.createComplaint({
      userId: req.user._id,
      user: req.user._id,
      studentName: req.user.name,
      rollNo: req.user.rollNo || '',
      hostel: req.user.hostel || 'Hostel Block',
      roomNo: req.user.roomNo || '',
      ...req.body,
    });
    res.status(201).json(newComplaint);
  } catch (error) {
    res.status(500).json({ message: 'Error logging complaint.' });
  }
});

// @route   PATCH /api/complaints/:id/status
// @desc    Admin update complaint status, assignment & resolution notes
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, note, assignedTo, category, assignedDept } = req.body;
    const updatedComplaint = await DataStore.updateComplaintStatus(
      req.params.id,
      {
        status,
        note,
        assignedTo,
        category,
        assignedDept,
        updatedBy: req.user.name || 'Campus Administrator',
      }
    );
    if (!updatedComplaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }
    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: 'Error updating complaint status.' });
  }
});

// @route   PUT /api/complaints/:id or PATCH /api/complaints/:id
// @desc    Admin update complaint details
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status, note, assignedTo, category, assignedDept } = req.body;
    const updatedComplaint = await DataStore.updateComplaintStatus(
      req.params.id,
      {
        status,
        note,
        assignedTo,
        category,
        assignedDept,
        updatedBy: req.user.name || 'Campus Administrator',
      }
    );
    if (!updatedComplaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }
    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: 'Error updating complaint.' });
  }
});

router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status, note, assignedTo, category, assignedDept } = req.body;
    const updatedComplaint = await DataStore.updateComplaintStatus(
      req.params.id,
      {
        status,
        note,
        assignedTo,
        category,
        assignedDept,
        updatedBy: req.user.name || 'Campus Administrator',
      }
    );
    if (!updatedComplaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }
    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: 'Error updating complaint.' });
  }
});

export default router;
