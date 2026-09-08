import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
    rollNo: { type: String, default: '' },
    studentId: { type: String, default: '' },
    employeeId: { type: String, default: '' },
    designation: { type: String, default: 'Assistant Professor' },
    department: { type: String, default: 'Computer Science & Engineering' },
    course: { type: String, default: 'B.Tech' },
    semester: { type: String, default: '1st Semester' },
    section: { type: String, default: 'Section A' },
    admissionYear: { type: String, default: '2026' },
    batch: { type: String, default: '2026 - 2030' },
    cgpa: { type: String, default: '0.0' },
    dob: { type: String, default: '' },
    gender: { type: String, default: '' },
    hostel: { type: String, default: 'Unassigned' },
    roomNo: { type: String, default: '-' },
    guardianName: { type: String, default: '' },
    guardianPhone: { type: String, default: '' },
    officeRoom: { type: String, default: 'Academic Block 2, Room 304' },
    qualification: { type: String, default: '' },
    specialization: { type: String, default: '' },
    phone: { type: String, default: '' },
    bloodGroup: { type: String, default: '' },
    address: { type: String, default: '' },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    assignedClasses: [
      {
        subject: { type: String },
        code: { type: String },
        semester: { type: String },
        section: { type: String, default: 'Section A' },
        enrolledCount: { type: Number, default: 45 },
      }
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
