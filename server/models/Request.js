import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
  {
    reqId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true }, // 'Gate Pass' | 'Leave Application' | 'Certificate'
    title: { type: String, required: true },
    submittedDate: { type: String, required: true },
    lastUpdated: { type: String, default: 'Just now' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Approved', 'Rejected', 'Completed'], default: 'Pending' },
    priority: { type: String, default: 'Medium' },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    timeline: [
      {
        step: { type: String, required: true },
        time: { type: String, required: true },
        status: { type: String, required: true }, // 'completed' | 'current' | 'upcoming' | 'rejected'
      },
    ],
  },
  { timestamps: true }
);

export const Request = mongoose.model('Request', requestSchema);
