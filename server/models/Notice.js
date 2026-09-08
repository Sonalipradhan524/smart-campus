import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    noticeId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    department: { type: String, required: true },
    date: { type: String, required: true },
    priority: { type: String, default: 'Medium' },
    category: { type: String, default: 'General' },
    content: { type: String, required: true },
    readStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notice = mongoose.model('Notice', noticeSchema);
