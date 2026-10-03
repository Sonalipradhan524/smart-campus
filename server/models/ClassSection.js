import mongoose from 'mongoose';

const classSectionSchema = new mongoose.Schema(
  {
    course: { type: String, required: true },
    semester: { type: String, required: true },
    section: { type: String, required: true },
    department: { type: String, required: true },
    teacher: { type: String, default: 'Unassigned' },
    subject: { type: String, default: '' },
    room: { type: String, default: '' },
    academicYear: { type: String, default: '2026-27' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
  },
  { timestamps: true }
);

export const ClassSection = mongoose.model('ClassSection', classSectionSchema);
