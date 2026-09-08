import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    cmpId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    submittedDate: { type: String, required: true },
    priority: { type: String, default: 'Medium' },
    status: { type: String, enum: ['Submitted', 'Assigned', 'In Progress', 'Resolved'], default: 'Submitted' },
    assignedTo: { type: String, default: 'Unassigned' },
    description: { type: String, required: true },
    imagePreview: { type: String, default: null },
    aiMetadata: {
      detectedCategory: { type: String },
      confidence: { type: String },
      detectedPriority: { type: String },
      targetDept: { type: String },
      estimatedResolution: { type: String },
    },
    updates: [
      {
        date: { type: String },
        note: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const Complaint = mongoose.model('Complaint', complaintSchema);
