import mongoose from 'mongoose';

const faceAttendanceLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    studentId: { type: String, default: '' },
    rollNo: { type: String, default: '' },
    employeeId: { type: String, default: '' },
    name: { type: String, required: true },
    role: { type: String, default: 'student' },
    department: { type: String, default: 'Computer Science' },
    course: { type: String, default: 'B.Tech' },
    semester: { type: String, default: '1st Semester' },
    section: { type: String, default: 'Section A' },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    time: { type: String, required: true }, // Format: HH:MM:SS AM/PM
    status: { type: String, enum: ['Present', 'Late', 'Absent'], default: 'Present' },
    confidence: { type: Number, default: 95.0 }, // Percentage confidence score
    recognitionDistance: { type: Number, default: 0.15 }, // Euclidean distance
    method: { type: String, default: 'AI Face Recognition' },
    snapshot: { type: String, default: '' }, // Captured frame base64 thumbnail
    verifiedBy: { type: String, default: 'AI System' },
  },
  { timestamps: true }
);

export const FaceAttendanceLog = mongoose.model('FaceAttendanceLog', faceAttendanceLogSchema);
