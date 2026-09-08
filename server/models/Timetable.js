import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema(
  {
    day: { type: String, required: true }, // 'Monday', 'Tuesday', etc.
    time: { type: String, required: true },
    subject: { type: String, required: true },
    code: { type: String, required: true },
    faculty: { type: String, required: true },
    room: { type: String, required: true },
    type: { type: String, default: 'Lecture' }, // 'Lecture' | 'Practical' | 'Tutorial'
    department: { type: String, default: 'Computer Science & Engineering' },
    semester: { type: String, default: '6th Semester' },
  },
  { timestamps: true }
);

export const Timetable = mongoose.model('Timetable', timetableSchema);
