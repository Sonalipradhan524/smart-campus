import express from 'express';
import { FaceEmbedding } from '../models/FaceEmbedding.js';
import { FaceAttendanceLog } from '../models/FaceAttendanceLog.js';
import { User } from '../models/User.js';
import { ClassSessionAttendance } from '../models/Attendance.js';
import { DataStore, getIsMongoConnected } from '../config/dataStore.js';
import { protect, adminOrTeacher } from '../middleware/auth.js';

const router = express.Router();

// Helper: Calculate Euclidean distance between two 128D vectors
const calculateEuclideanDistance = (v1, v2) => {
  if (!v1 || !v2 || v1.length !== v2.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < v1.length; i++) {
    const diff = v1[i] - v2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
};

// In-Memory fallback cache for face embeddings
const memoryEmbeddings = [];
const memoryAttendanceLogs = [];

// @route   POST /api/face-attendance/register
// @desc    Register or update biometric face embeddings for a user
router.post('/register', protect, adminOrTeacher, async (req, res) => {
  try {
    const { userId, embeddings, faceImages, registeredBy } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    if (!embeddings || !Array.isArray(embeddings) || embeddings.length === 0) {
      return res.status(400).json({ message: 'At least one face embedding descriptor is required.' });
    }

    // Find target user
    let targetUser = null;
    if (getIsMongoConnected()) {
      targetUser = await User.findById(userId);
    } else {
      targetUser = await DataStore.findUserById(userId);
    }

    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found in database.' });
    }

    const rollNo = targetUser.rollNo || targetUser.studentId || '';
    const employeeId = targetUser.employeeId || '';
    const name = targetUser.name || 'User';
    const role = targetUser.role || 'student';
    const department = targetUser.department || targetUser.branch || 'Computer Science & Engineering';

    if (getIsMongoConnected()) {
      let doc = await FaceEmbedding.findOne({ user: userId });
      if (doc) {
        doc.embeddings = embeddings;
        if (faceImages && faceImages.length > 0) doc.faceImages = faceImages;
        doc.registeredBy = registeredBy || req.user.name || 'Admin';
        await doc.save();
      } else {
        doc = await FaceEmbedding.create({
          user: userId,
          userId: targetUser._id.toString(),
          name,
          rollNo,
          employeeId,
          role,
          department,
          embeddings,
          faceImages: faceImages || [],
          registeredBy: registeredBy || req.user.name || 'Admin',
        });
      }
    } else {
      // Memory fallback
      const existingIdx = memoryEmbeddings.findIndex((item) => item.userId === userId || item.user === userId);
      const record = {
        _id: `mem_face_${Date.now()}`,
        user: userId,
        userId,
        name,
        rollNo,
        employeeId,
        role,
        department,
        embeddings,
        faceImages: faceImages || [],
        registeredBy: registeredBy || req.user.name || 'Admin',
        updatedAt: new Date().toISOString(),
      };
      if (existingIdx !== -1) {
        memoryEmbeddings[existingIdx] = record;
      } else {
        memoryEmbeddings.push(record);
      }
    }

    // Record audit log
    await DataStore.createAuditLog({
      user: req.user.name,
      role: req.user.role,
      action: 'Face Registration',
      details: `Biometric face embeddings registered for ${name} (${rollNo || employeeId || userId})`,
      ipAddress: req.ip || '127.0.0.1',
    });

    res.status(200).json({
      success: true,
      message: `Face profile successfully registered for ${name}.`,
      user: {
        id: userId,
        name,
        rollNo,
        employeeId,
        role,
        department,
      },
    });
  } catch (error) {
    console.error('[Face Registration Error]', error);
    res.status(500).json({ message: error.message || 'Error saving face registration.' });
  }
});

// @route   GET /api/face-attendance/registered-users
// @desc    Get all users with their biometric face registration status
router.get('/registered-users', protect, async (req, res) => {
  try {
    let allUsers = [];
    let registeredDocs = [];

    if (getIsMongoConnected()) {
      allUsers = await User.find({}).select('-password').sort({ name: 1 });
      registeredDocs = await FaceEmbedding.find({});
    } else {
      const students = await DataStore.getAllStudents();
      const teachers = await DataStore.getAllTeachers();
      allUsers = [...students, ...teachers];
      registeredDocs = memoryEmbeddings;
    }

    const registeredMap = {};
    registeredDocs.forEach((doc) => {
      const uId = doc.user ? doc.user.toString() : doc.userId;
      registeredMap[uId] = doc;
    });

    const results = allUsers.map((user) => {
      const uId = user._id.toString();
      const regData = registeredMap[uId];
      return {
        id: uId,
        _id: uId,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNo: user.rollNo || user.studentId || '-',
        employeeId: user.employeeId || '-',
        department: user.department || user.branch || 'CSE',
        course: user.course || 'B.Tech',
        semester: user.semester || '1st Semester',
        section: user.section || 'Section A',
        avatar: user.avatar,
        isFaceRegistered: !!regData,
        embeddingCount: regData ? (regData.embeddings ? regData.embeddings.length : 0) : 0,
        sampleImage: regData && regData.faceImages && regData.faceImages.length > 0 ? regData.faceImages[0] : null,
        registeredAt: regData ? regData.updatedAt || regData.createdAt : null,
      };
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registered face users.' });
  }
});

// @route   DELETE /api/face-attendance/registered-users/:userId
// @desc    Remove face embedding for a specific user
router.delete('/registered-users/:userId', protect, adminOrTeacher, async (req, res) => {
  try {
    const { userId } = req.params;

    if (getIsMongoConnected()) {
      await FaceEmbedding.deleteOne({ user: userId });
    } else {
      const idx = memoryEmbeddings.findIndex((item) => item.userId === userId || item.user === userId);
      if (idx !== -1) memoryEmbeddings.splice(idx, 1);
    }

    res.json({ success: true, message: 'Face registration deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting face registration.' });
  }
});

// @route   POST /api/face-attendance/recognize
// @desc    Match input 128D face descriptor vector against all registered embeddings
router.post('/recognize', protect, async (req, res) => {
  try {
    const { embedding, distanceThreshold = 0.60 } = req.body;

    if (!embedding || !Array.isArray(embedding) || embedding.length !== 128) {
      return res.status(400).json({ message: 'Valid 128-dimensional face descriptor array is required.' });
    }

    let registeredDocs = [];
    if (getIsMongoConnected()) {
      registeredDocs = await FaceEmbedding.find({}).populate('user', '-password');
    } else {
      registeredDocs = memoryEmbeddings;
    }

    if (registeredDocs.length === 0) {
      return res.json({
        recognized: false,
        message: 'No registered face embeddings found in database. Please register users first.',
      });
    }

    let bestMatch = null;
    let minDistance = Infinity;

    for (const doc of registeredDocs) {
      const embeddingsList = doc.embeddings || [];
      for (const storedVec of embeddingsList) {
        const dist = calculateEuclideanDistance(embedding, storedVec);
        if (dist < minDistance) {
          minDistance = dist;
          bestMatch = doc;
        }
      }
    }

    if (!bestMatch || minDistance > distanceThreshold) {
      return res.json({
        recognized: false,
        distance: minDistance < Infinity ? Number(minDistance.toFixed(4)) : null,
        message: 'Face detected but identity not recognized in registered database.',
      });
    }

    // Match found! Get user details
    const targetUserId = bestMatch.user
      ? (bestMatch.user._id ? bestMatch.user._id.toString() : bestMatch.user.toString())
      : bestMatch.userId;

    let userDetails = bestMatch.user && typeof bestMatch.user === 'object' ? bestMatch.user : null;
    if (!userDetails) {
      if (getIsMongoConnected()) {
        userDetails = await User.findById(targetUserId).select('-password');
      } else {
        userDetails = await DataStore.findUserById(targetUserId);
      }
    }

    const todayStr = new Date().toISOString().split('T')[0];
    let alreadyMarkedToday = false;
    let todayLog = null;

    if (getIsMongoConnected()) {
      todayLog = await FaceAttendanceLog.findOne({
        user: targetUserId,
        date: todayStr,
      });
      if (todayLog) alreadyMarkedToday = true;
    } else {
      todayLog = memoryAttendanceLogs.find(
        (log) => (log.user === targetUserId || log.userId === targetUserId) && log.date === todayStr
      );
      if (todayLog) alreadyMarkedToday = true;
    }

    // Calculate Confidence Score (%)
    // Euclidean distance 0.0 -> 100% confidence, distance 0.60 -> ~50% confidence threshold
    const confidence = Math.max(0, Math.min(99.9, Number(((1 - minDistance / 1.2) * 100).toFixed(1))));

    res.json({
      recognized: true,
      distance: Number(minDistance.toFixed(4)),
      confidence,
      alreadyMarkedToday,
      todayLog,
      user: {
        id: targetUserId,
        _id: targetUserId,
        name: userDetails ? userDetails.name : bestMatch.name,
        rollNo: userDetails ? userDetails.rollNo || userDetails.studentId || '-' : bestMatch.rollNo,
        employeeId: userDetails ? userDetails.employeeId || '-' : bestMatch.employeeId,
        role: userDetails ? userDetails.role : bestMatch.role,
        department: userDetails ? userDetails.department || userDetails.branch || 'CSE' : bestMatch.department,
        course: userDetails ? userDetails.course || 'B.Tech' : 'B.Tech',
        semester: userDetails ? userDetails.semester || '1st Semester' : '1st Semester',
        section: userDetails ? userDetails.section || 'Section A' : 'Section A',
        avatar: userDetails ? userDetails.avatar : null,
      },
    });
  } catch (error) {
    console.error('[Face Recognition Error]', error);
    res.status(500).json({ message: error.message || 'Face recognition processing error.' });
  }
});

// @route   POST /api/face-attendance/mark
// @desc    Automatically mark attendance for recognized user with duplicate check
router.post('/mark', protect, async (req, res) => {
  try {
    const { userId, date, time, status, confidence, recognitionDistance, snapshot, section, subject } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const targetDate = date || new Date().toISOString().split('T')[0];
    const targetTime = time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Find User
    let userDoc = null;
    if (getIsMongoConnected()) {
      userDoc = await User.findById(userId);
    } else {
      userDoc = await DataStore.findUserById(userId);
    }

    if (!userDoc) {
      return res.status(404).json({ message: 'User not found in system.' });
    }

    // Duplicate Check
    let existingLog = null;
    if (getIsMongoConnected()) {
      existingLog = await FaceAttendanceLog.findOne({ user: userId, date: targetDate });
    } else {
      existingLog = memoryAttendanceLogs.find(
        (log) => (log.user === userId || log.userId === userId) && log.date === targetDate
      );
    }

    if (existingLog) {
      return res.status(409).json({
        isDuplicate: true,
        message: `Attendance has already been marked today (${targetDate}) for ${userDoc.name} at ${existingLog.time}.`,
        log: existingLog,
      });
    }

    const rollNo = userDoc.rollNo || userDoc.studentId || '';
    const employeeId = userDoc.employeeId || '';
    const name = userDoc.name || 'User';
    const role = userDoc.role || 'student';
    const department = userDoc.department || userDoc.branch || 'Computer Science';
    const course = userDoc.course || 'B.Tech';
    const semester = userDoc.semester || '1st Semester';
    const sec = section || userDoc.section || 'Section A';

    let newLog = null;
    if (getIsMongoConnected()) {
      newLog = await FaceAttendanceLog.create({
        user: userId,
        studentId: rollNo,
        rollNo,
        employeeId,
        name,
        role,
        department,
        course,
        semester,
        section: sec,
        date: targetDate,
        time: targetTime,
        status: status || 'Present',
        confidence: confidence || 95.0,
        recognitionDistance: recognitionDistance || 0.15,
        method: 'AI Face Recognition',
        snapshot: snapshot || '',
        verifiedBy: req.user.name || 'AI Face Engine',
      });
    } else {
      newLog = {
        _id: `mem_log_${Date.now()}`,
        user: userId,
        userId,
        studentId: rollNo,
        rollNo,
        employeeId,
        name,
        role,
        department,
        course,
        semester,
        section: sec,
        date: targetDate,
        time: targetTime,
        status: status || 'Present',
        confidence: confidence || 95.0,
        recognitionDistance: recognitionDistance || 0.15,
        method: 'AI Face Recognition',
        snapshot: snapshot || '',
        verifiedBy: req.user.name || 'AI Face Engine',
        createdAt: new Date().toISOString(),
      };
      memoryAttendanceLogs.unshift(newLog);
    }

    // Sync to ClassSessionAttendance so student overall stats are updated!
    try {
      await DataStore.markClassAttendance({
        teacherId: req.user._id ? req.user._id.toString() : 'AI_SYSTEM',
        teacherName: 'AI Face Attendance Engine',
        subject: subject || 'AI Attendance Verification',
        subjectCode: 'AI-FACE-101',
        semester,
        section: sec,
        date: targetDate,
        allowUpdate: true,
        records: [
          {
            studentId: rollNo || userId,
            studentName: name,
            rollNo: rollNo || userId,
            status: 'present',
          },
        ],
      });
    } catch (syncErr) {
      console.warn('[Sync to ClassSession Warning]', syncErr);
    }

    res.status(201).json({
      success: true,
      message: `Attendance recorded successfully for ${name} on ${targetDate} at ${targetTime}.`,
      log: newLog,
    });
  } catch (error) {
    console.error('[Mark Face Attendance Error]', error);
    res.status(500).json({ message: error.message || 'Error marking face attendance.' });
  }
});

// @route   GET /api/face-attendance/dashboard-stats
// @desc    Get real-time face attendance analytics and summary metrics
router.get('/dashboard-stats', protect, async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    let allUsers = [];
    let registeredFaceDocs = [];
    let todayLogs = [];
    let allLogs = [];

    if (getIsMongoConnected()) {
      allUsers = await User.find({}).select('-password');
      registeredFaceDocs = await FaceEmbedding.find({});
      todayLogs = await FaceAttendanceLog.find({ date: todayStr }).sort({ createdAt: -1 });
      allLogs = await FaceAttendanceLog.find({}).sort({ createdAt: -1 }).limit(100);
    } else {
      const students = await DataStore.getAllStudents();
      const teachers = await DataStore.getAllTeachers();
      allUsers = [...students, ...teachers];
      registeredFaceDocs = memoryEmbeddings;
      todayLogs = memoryAttendanceLogs.filter((log) => log.date === todayStr);
      allLogs = memoryAttendanceLogs;
    }

    const totalUsers = allUsers.length;
    const registeredCount = registeredFaceDocs.length;
    const presentTodayCount = todayLogs.filter((l) => l.status === 'Present').length;
    const absentTodayCount = Math.max(0, registeredCount - presentTodayCount);

    const attendanceRate = registeredCount > 0 ? Number(((presentTodayCount / registeredCount) * 100).toFixed(1)) : 0;

    let totalConf = 0;
    todayLogs.forEach((l) => {
      totalConf += l.confidence || 95;
    });
    const avgConfidence = todayLogs.length > 0 ? Number((totalConf / todayLogs.length).toFixed(1)) : 96.5;

    // Department breakdown
    const deptMap = {};
    todayLogs.forEach((l) => {
      const dept = l.department || 'Computer Science';
      if (!deptMap[dept]) deptMap[dept] = 0;
      deptMap[dept]++;
    });

    res.json({
      totalUsers,
      registeredCount,
      unregisteredCount: Math.max(0, totalUsers - registeredCount),
      presentTodayCount,
      absentTodayCount,
      attendanceRate,
      avgConfidence,
      todayDate: todayStr,
      recentLogs: allLogs.slice(0, 10),
      departmentBreakdown: deptMap,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error loading face attendance dashboard metrics.' });
  }
});

// @route   GET /api/face-attendance/logs
// @desc    Query face attendance logs with filters
router.get('/logs', protect, async (req, res) => {
  try {
    const { date, department, status, role, search } = req.query;

    let logs = [];
    if (getIsMongoConnected()) {
      const query = {};
      if (date) query.date = date;
      if (department) query.department = new RegExp(department, 'i');
      if (status) query.status = status;
      if (role) query.role = role;

      logs = await FaceAttendanceLog.find(query).sort({ createdAt: -1 });
    } else {
      logs = [...memoryAttendanceLogs];
      if (date) logs = logs.filter((l) => l.date === date);
      if (department) {
        const norm = department.toLowerCase();
        logs = logs.filter((l) => (l.department || '').toLowerCase().includes(norm));
      }
      if (status) logs = logs.filter((l) => l.status === status);
      if (role) logs = logs.filter((l) => l.role === role);
    }

    if (search) {
      const searchNorm = search.toLowerCase();
      logs = logs.filter(
        (l) =>
          (l.name || '').toLowerCase().includes(searchNorm) ||
          (l.rollNo || '').toLowerCase().includes(searchNorm) ||
          (l.employeeId || '').toLowerCase().includes(searchNorm)
      );
    }

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching face attendance logs.' });
  }
});

// @route   GET /api/face-attendance/export-csv
// @desc    Export attendance logs as a CSV file
router.get('/export-csv', protect, async (req, res) => {
  try {
    const { date } = req.query;
    let logs = [];

    if (getIsMongoConnected()) {
      const query = date ? { date } : {};
      logs = await FaceAttendanceLog.find(query).sort({ createdAt: -1 });
    } else {
      logs = date ? memoryAttendanceLogs.filter((l) => l.date === date) : memoryAttendanceLogs;
    }

    let csvHeader = 'Name,Roll/Employee ID,Role,Department,Date,Time,Status,Confidence,Method,Verified By\n';
    let csvRows = logs
      .map((l) => {
        return `"${l.name}","${l.rollNo || l.employeeId || '-'}","${l.role}","${l.department}","${l.date}","${l.time}","${l.status}","${l.confidence}%","${l.method}","${l.verifiedBy}"`;
      })
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=Face_Attendance_Report_${date || 'all'}.csv`);
    res.status(200).send(csvHeader + csvRows);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting attendance CSV.' });
  }
});

export default router;
