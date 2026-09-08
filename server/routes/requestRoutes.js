import express from 'express';
import { DataStore } from '../config/dataStore.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/requests
// @desc    Get user requests or all requests for admin
router.get('/', protect, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { userId: req.user._id };
    const requests = await DataStore.getAllRequests(query);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests.' });
  }
});

// @route   POST /api/requests
// @desc    Create a new leave or gate pass request
router.post('/', protect, async (req, res) => {
  try {
    const newRequest = await DataStore.createRequest({
      userId: req.user._id,
      studentName: req.user.name,
      rollNo: req.user.rollNo,
      ...req.body,
    });
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error creating request.' });
  }
});

// @route   PATCH /api/requests/:id/status
// @desc    Admin approve/reject request
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const updatedRequest = await DataStore.updateRequestStatus(req.params.id, status, remarks);
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found.' });
    }
    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error updating request status.' });
  }
});

export default router;
