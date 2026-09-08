import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    overallPercentage: { type: Number, default: 88 },
    totalClasses: { type: Number, default: 50 },
    attendedClasses: { type: Number, default: 44 },
    absentClasses: { type: Number, default: 6 },
    subjects: [
      {
        code: { type: String, required: true },
        name: { type: String, required: true },
        attended: { type: Number, default: 22 },
        total: { type: Number, default: 25 },
        percentage: { type: Number, default: 88 },
        teacher: { type: String, default: '' },
        lowWarning: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

const classSessionSchema = new mongoose.Schema(
  {
    teacherId: { type: String, required: true },
    teacherName: { type: String, required: true },
    subject: { type: String, required: true },
    subjectCode: { type: String, default: 'CSE-301' },
    semester: { type: String, default: '6th Semester' },
    section: { type: String, default: 'Section A' },
    date: { type: String, required: true },
    records: [
      {
        studentId: { type: String },
        studentName: { type: String, required: true },
        rollNo: { type: String, required: true },
        status: { type: String, enum: ['present', 'absent'], default: 'present' },
      }
    ]
  },
  { timestamps: true }
);

export const Attendance = mongoose.model('Attendance', attendanceSchema);
export const ClassSessionAttendance = mongoose.model('ClassSessionAttendance', classSessionSchema);
