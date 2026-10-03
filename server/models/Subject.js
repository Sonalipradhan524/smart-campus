import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    course: { type: String, default: 'B.Tech' },
    semester: { type: String, default: '3rd Semester' },
    credits: { type: Number, default: 3 },
    subjectType: { type: String, enum: ['Theory', 'Practical', 'Lab', 'Elective'], default: 'Theory' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
  },
  { timestamps: true }
);

export const Subject = mongoose.model('Subject', subjectSchema);
