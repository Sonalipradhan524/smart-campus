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
    targetAudience: { type: String, default: 'All' }, // 'All' | 'Students' | 'Teachers' | 'Department' | 'Course' | 'Semester' | 'Section'
    targetDepartment: { type: String, default: '' },
    targetCourse: { type: String, default: '' },
    targetSemester: { type: String, default: '' },
    targetSection: { type: String, default: '' }
  },
  { timestamps: true }
);

export const Notice = mongoose.model('Notice', noticeSchema);
