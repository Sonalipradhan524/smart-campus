import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    duration: { type: String, default: '4 Years (8 Semesters)' },
    description: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
  },
  { timestamps: true }
);

export const Course = mongoose.model('Course', courseSchema);
