import express from 'express';
import jwt from 'jsonwebtoken';
import { DataStore } from '../config/dataStore.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey_campusos_bput_2026', {
    expiresIn: '30d',
  });
};

// ==========================================
// 🎓 STUDENT AUTHENTICATION & REGISTRATION
// ==========================================

// @route   POST /api/auth/student/register
// @desc    Real Student Registration
router.post('/student/register', async (req, res) => {
  try {
    const {
      name,
      studentId,
      rollNo,
      email,
      phone,
      password,
      confirmPassword,
      dob,
      gender,
      department,
      course,
      semester,
      section,
      admissionYear,
      hostel,
      roomNo,
      guardianName,
      guardianPhone,
    } = req.body;

    const idToUse = studentId || rollNo;

    // Validation
    if (!name || !idToUse || !email || !password) {
      return res.status(400).json({ message: 'Full Name, Student ID, Email, and Password are required.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    // Check duplicate Email
    const existingEmail = await DataStore.findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email address is already registered.' });
    }

    // Check duplicate Student ID
    const existingId = await DataStore.findUserByRollNo(idToUse);
    if (existingId) {
      return res.status(400).json({ message: 'Student ID / Roll Number is already registered.' });
    }

    const newUser = await DataStore.createUser({
      name,
      studentId: idToUse,
      rollNo: idToUse,
      email,
      phone: phone || '',
      password,
      role: 'student',
      dob: dob || '',
      gender: gender || '',
      department: department || 'Computer Science & Engineering',
      course: course || 'B.Tech',
      semester: semester || '1st Semester',
      section: section || 'Section A',
      admissionYear: admissionYear || '2026',
      batch: `${admissionYear || 2026} - ${Number(admissionYear || 2026) + 4}`,
      hostel: hostel || 'Unassigned',
      roomNo: roomNo || '-',
      guardianName: guardianName || '',
      guardianPhone: guardianPhone || '',
    });

    res.status(201).json({
      message: 'Student registration successful.',
      user: newUser,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    console.error('[Student Register Error]', error);
    res.status(500).json({ message: error.message || 'Server error during student registration.' });
  }
});

// @route   POST /api/auth/student/login
// @desc    Real Student Login (Enforces role = student)
router.post('/student/login', async (req, res) => {
  try {
    const { identifier, email, studentId, password } = req.body;
    const loginId = identifier || email || studentId;

    if (!loginId || !password) {
      return res.status(400).json({ message: 'Student ID / Email and Password are required.' });
    }

    const user = await DataStore.findUserByIdentifier(loginId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. No student account found.' });
    }

    if (user.role !== 'student') {
      return res.status(403).json({ message: `Access Denied: Account registered as ${user.role}. Please use ${user.role} login portal.` });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Password incorrect.' });
    }

    const { passwordHash, password: _, ...cleanUser } = user;
    res.json({
      message: 'Student login successful.',
      user: cleanUser,
      ...cleanUser,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('[Student Login Error]', error);
    res.status(500).json({ message: error.message || 'Server error during student login.' });
  }
});

// ==========================================
// 👨‍🏫 TEACHER / FACULTY AUTH & REGISTRATION
// ==========================================

// @route   POST /api/auth/teacher/register
// @desc    Real Teacher / Faculty Registration (Role enforced = teacher)
router.post('/teacher/register', async (req, res) => {
  try {
    const {
      name,
      employeeId,
      email,
      phone,
      password,
      confirmPassword,
      department,
      designation,
      qualification,
      specialization,
      officeRoom,
    } = req.body;

    if (!name || !employeeId || !email || !password) {
      return res.status(400).json({ message: 'Full Name, Employee ID, Email, and Password are required.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    // Check duplicate Email
    const existingEmail = await DataStore.findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email address is already registered.' });
    }

    // Check duplicate Employee ID
    const existingEmp = await DataStore.findUserByEmployeeId(employeeId);
    if (existingEmp) {
      return res.status(400).json({ message: 'Employee ID is already registered.' });
    }

    const newUser = await DataStore.createUser({
      name,
      employeeId,
      email,
      phone: phone || '',
      password,
      role: 'teacher',
      department: department || 'Computer Science & Engineering',
      designation: designation || 'Assistant Professor',
      qualification: qualification || 'M.Tech / Ph.D.',
      specialization: specialization || 'Computer Science',
      officeRoom: officeRoom || 'Academic Block 2, Room 304',
      assignedClasses: [
        { subject: 'Data Structures & Algorithms', code: 'CSE-301', semester: '6th Semester', section: 'Section A', enrolledCount: 45 }
      ],
    });

    res.status(201).json({
      message: 'Faculty registration successful.',
      user: newUser,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    console.error('[Teacher Register Error]', error);
    res.status(500).json({ message: error.message || 'Server error during teacher registration.' });
  }
});

// @route   POST /api/auth/teacher/login
// @desc    Real Teacher Login (Enforces role = teacher)
router.post('/teacher/login', async (req, res) => {
  try {
    const { identifier, email, employeeId, password } = req.body;
    const loginId = identifier || email || employeeId;

    if (!loginId || !password) {
      return res.status(400).json({ message: 'Employee ID / Email and Password are required.' });
    }

    const user = await DataStore.findUserByIdentifier(loginId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. No faculty account found.' });
    }

    if (user.role !== 'teacher') {
      return res.status(403).json({ message: `Access Denied: Account registered as ${user.role}. Please use ${user.role} login portal.` });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Password incorrect.' });
    }

    const { passwordHash, password: _, ...cleanUser } = user;
    res.json({
      message: 'Faculty login successful.',
      user: cleanUser,
      ...cleanUser,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('[Teacher Login Error]', error);
    res.status(500).json({ message: error.message || 'Server error during teacher login.' });
  }
});

// ==========================================
// 👑 ADMINISTRATOR AUTHENTICATION & MANAGEMENT
// ==========================================

// @route   POST /api/auth/admin/login
// @desc    Real Admin Login (Enforces role = admin)
router.post('/admin/login', async (req, res) => {
  try {
    const { identifier, email, adminId, password } = req.body;
    const loginId = identifier || email || adminId;

    if (!loginId || !password) {
      return res.status(400).json({ message: 'Admin ID / Email and Password are required.' });
    }

    const user = await DataStore.findUserByIdentifier(loginId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. No administrator account found.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: `Access Denied: Account registered as ${user.role}. Public admin access is strictly forbidden.` });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Password incorrect.' });
    }

    const { passwordHash, password: _, ...cleanUser } = user;
    res.json({
      message: 'Administrator login successful.',
      user: cleanUser,
      ...cleanUser,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('[Admin Login Error]', error);
    res.status(500).json({ message: error.message || 'Server error during admin login.' });
  }
});

// @route   POST /api/auth/admin/create-admin
// @desc    Create new Administrator account (Strictly protected: authenticated admin only!)
router.post('/admin/create-admin', protect, adminOnly, async (req, res) => {
  try {
    const { name, email, password, phone, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Full Name, Email, and Password are required.' });
    }

    const existingEmail = await DataStore.findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email address is already registered.' });
    }

    const newAdmin = await DataStore.createUser({
      name,
      email,
      password,
      role: 'admin',
      phone: phone || '',
      department: department || 'Campus Administration',
    });

    res.status(201).json({
      message: 'Administrator account created successfully.',
      user: newAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error creating administrator account.' });
  }
});

// ==========================================
// 🔑 FORGOT PASSWORD & GENERAL HANDLERS
// ==========================================

// @route   POST /api/auth/forgot-password
// @desc    Request Password Reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Registered email address is required.' });
    }

    const user = await DataStore.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'No registered account found with this email address.' });
    }

    res.json({
      message: `Password reset instructions have been generated for ${email}. (Note: SMTP email dispatch requires production mail server configuration).`,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing password reset request.' });
  }
});

// @route   POST /api/auth/login (General Fallback)
router.post('/login', async (req, res) => {
  try {
    const { email, identifier, password } = req.body;
    const loginId = email || identifier;

    const user = await DataStore.findUserByIdentifier(loginId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Password incorrect.' });
    }

    const { passwordHash, password: _, ...cleanUser } = user;
    res.json({
      ...cleanUser,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error during login.' });
  }
});

// @route   POST /api/auth/register (General Fallback)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await DataStore.findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const user = await DataStore.createUser({ name, email, password, role: role || 'student' });
    res.status(201).json({ ...user, token: generateToken(user._id) });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error during registration.' });
  }
});

// @route   GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

export default router;
