import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema(
  {
    day: { type: String, required: true }, // 'Monday', 'Tuesday', etc.
    roomNo: { type: String, required: true },
    branch: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    time: { type: String, required: true },
    subject: { type: String, required: true },
    teacher: { type: String, required: true },
    faculty: { type: String },
    code: { type: String },
    classType: { type: String, required: true, default: 'Lecture' },
    semester: { type: String, default: '3rd Semester' },
    course: { type: String, default: 'B.Tech' },
    academicYear: { type: String, default: '2026-27' },
    effectiveFrom: { type: String, default: '20-07-2026' },
    status: { type: String, default: 'Verified' }
  },
  { timestamps: true }
);

export const Timetable = mongoose.model('Timetable', timetableSchema);

