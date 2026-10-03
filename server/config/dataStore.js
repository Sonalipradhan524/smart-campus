import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Request } from '../models/Request.js';
import { Complaint } from '../models/Complaint.js';
import { Notice } from '../models/Notice.js';
import { Attendance } from '../models/Attendance.js';
import { Timetable } from '../models/Timetable.js';
import { Notification } from '../models/Notification.js';
import { Hostel } from '../models/Hostel.js';
import { Mess } from '../models/Mess.js';
import { FoodWaste } from '../models/FoodWaste.js';
import { Fee } from '../models/Fee.js';
import { AuditLog } from '../models/AuditLog.js';
import { realTimetableEntries } from './realTimetableData.js';
import { serverTriageComplaint } from './triageHelper.js';

let isMongoConnected = false;

export const setMongoConnected = (status) => {
  isMongoConnected = status;
};

export const getIsMongoConnected = () => isMongoConnected;

// In-Memory Storage Fallback
const memoryStore = {
  users: [
    {
      _id: 'mem_user_student_1',
      name: 'Rahul Sharma',
      email: 'student@bput.ac.in',
      passwordHash: '$2b$10$PSaVFu3gYiN59L6m7LKdwehjtq10pVxLcFF8uTgcWygVzksOuWPzO', // 'student123'
      role: 'student',
      rollNo: '2201105042',
      studentId: '2201105042',
      department: 'CSE',
      branch: 'CSE',
      course: 'B.Tech',
      semester: '3rd Semester',
      section: 'Section A',
      admissionYear: '2025',
      batch: '2025 - 2029',
      cgpa: '8.84',
      hostel: 'Kalpana Chawla Hall (Block B)',
      roomNo: 'B-204',
      phone: '+91 98765 43210',
      guardianName: 'Ramesh Sharma',
      guardianPhone: '+91 98765 00112',
      bloodGroup: 'O+',
      address: 'Bhubaneswar, Odisha',
      avatar: '',
    },
    {
      _id: 'mem_user_teacher_1',
      name: 'Prof. Ananya Roy',
      email: 'teacher@bput.ac.in',
      passwordHash: '$2b$10$.lqMaWRF1uhTbIWstlR6SOAz866zQy/VXbxHkvmZJeX4pcMzQBLJy', // 'teacher123'
      role: 'teacher',
      employeeId: 'FAC-CSE-004',
      designation: 'Associate Professor',
      department: 'Computer Science & Engineering',
      qualification: 'Ph.D. in Computer Science (IIT Kharagpur)',
      specialization: 'Artificial Intelligence & Data Structures',
      officeRoom: 'Academic Block 2, Room 304',
      phone: '+91 94372 99881',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      assignedClasses: [
        { subject: 'Data Structures & Algorithms', code: 'CSE-301', semester: '6th Semester', section: 'Section A', enrolledCount: 45 },
        { subject: 'Database Management Systems', code: 'CSE-304', semester: '4th Semester', section: 'Section B', enrolledCount: 42 },
        { subject: 'Artificial Intelligence & ML', code: 'CSE-402', semester: '8th Semester', section: 'Section A', enrolledCount: 38 }
      ]
    },
    {
      _id: 'mem_user_admin_1',
      name: 'Dr. Arisudan Mohanty',
      email: 'admin@bput.ac.in',
      passwordHash: '$2b$10$Cxl3sQ6CMG1EnYU4JSwP5e9Jzk/3UrzfUnQp4e4UGg4F31IVtnlPW', // 'admin123'
      role: 'admin',
      rollNo: 'ADMIN-001',
      employeeId: 'ADMIN-001',
      department: 'Campus Administration & Student Affairs',
      phone: '+91 94370 12345',
      address: 'BPUT Campus, Rourkela',
      avatar: '',
    }
  ],
  classSessions: [],
  requests: [],
  complaints: [],
  notices: [],
  notifications: [],
  hostels: [
    {
      _id: 'mem_hostel_1',
      name: 'Kalpana Chawla Hall (Block B)',
      warden: 'Dr. S. K. Nayak (+91 94371 88900)',
      caretaker: 'Mr. Rajesh Kumar (+91 98612 33445)',
      capacity: 350,
      occupied: 312,
      curfew: '09:30 PM (Daily)',
      facilities: ['Wi-Fi 6 GigaFiber', '24/7 Water Purifiers', 'Common Gym Room', 'Table Tennis Court'],
      rules: ['Gate closes strictly at 9:30 PM', 'No high-wattage electrical appliances', 'Visitors permitted only in guest lounge']
    }
  ],
  mess: [
    {
      _id: 'mem_mess_1',
      hostel: 'Kalpana Chawla Hall (Block B)',
      provider: 'Annapurna Catering Services',
      timings: {
        breakfast: '07:30 AM - 09:15 AM',
        lunch: '12:30 PM - 02:15 PM',
        snacks: '05:00 PM - 06:15 PM',
        dinner: '08:00 PM - 09:45 PM'
      },
      menu: {
        Monday: { breakfast: 'Idli, Sambar, Coconut Chutney, Tea/Coffee', lunch: 'Rice, Dal, Alu Bhaja, Paneer Curry, Curd', snacks: 'Samosa, Black Tea', dinner: 'Roti, Mixed Veg, Dal Fry, Kheer' },
        Tuesday: { breakfast: 'Puri, Ghuguni, Tea/Coffee', lunch: 'Rice, Dalma, Saga Bhaja, Mushroom Curry', snacks: 'Vada, Tea', dinner: 'Roti, Chicken Curry / Kadai Paneer, Rice' },
        Wednesday: { breakfast: 'Upma, Ghuguni, Tea', lunch: 'Rice, Dal, Fish Curry / Soyabean, Dahi Baigana', snacks: 'Biscuits, Coffee', dinner: 'Roti, Dal, Egg Curry / Paneer Butter Masala' },
        Thursday: { breakfast: 'Dosa, Sambar, Chutney, Tea', lunch: 'Rice, Kanika, Chana Masala, Papad, Sweet', snacks: 'Pakoda, Tea', dinner: 'Roti, Dal Fry, Alu Gobi' },
        Friday: { breakfast: 'Poha, Sev, Tea/Coffee', lunch: 'Rice, Dal, Egg Bhurji / Kadhi Pakoda, Chips', snacks: 'Bread Chop, Tea', dinner: 'Roti, Chicken Biryani / Veg Biryani, Raita' },
        Saturday: { breakfast: 'Chakuli Pitha, Ghuguni, Tea', lunch: 'Rice, Dal, Baigana Bhaja, Veg Tadka', snacks: 'Jhalmuri, Coffee', dinner: 'Roti, Dal Makhani, Mix Veg' },
        Sunday: { breakfast: 'Chole Bhature, Tea/Coffee', lunch: 'Special Veg/Non-Veg Thali, Ice Cream', snacks: 'Tea/Coffee', dinner: 'Roti, Dal, Veg Korma / Paneer Tikka' }
      },
      feedback: []
    }
  ],
  fees: {
    'mem_user_student_1': {
      semesterFee: 45000,
      hostelFee: 18000,
      messFee: 14000,
      examFee: 2500,
      libraryFee: 1500,
      totalAmount: 81000,
      paidAmount: 65000,
      dueAmount: 16000,
      dueDate: 'March 31, 2026',
      transactions: [
        { id: 'TXN-90112', title: 'Semester & Hostel Admission Fee', date: 'Jan 10, 2026', amount: 65000, method: 'Online NetBanking', status: 'Completed' }
      ]
    }
  },
  timetable: [...realTimetableEntries],
  departments: [],
  courses: [],
  subjects: [],
  classSections: [],
  rooms: [],
  auditLogs: []
};

// Data Service helper matching Mongo interface & fallback
export const DataStore = {
  // USER OPERATIONS
  async findUserByEmail(email) {
    if (isMongoConnected) {
      return await User.findOne({ email }).select('+password');
    }
    const emailNorm = (email || '').toLowerCase().trim();
    const user = memoryStore.users.find(u => u.email && u.email.toLowerCase() === emailNorm);
    if (!user) return null;
    return {
      ...user,
      matchPassword: async (pwd) => {
        return await bcrypt.compare(pwd, user.passwordHash);
      }
    };
  },

  async findUserByRollNo(rollNo) {
    if (isMongoConnected) {
      return await User.findOne({ $or: [{ rollNo }, { studentId: rollNo }] }).select('+password');
    }
    const norm = (rollNo || '').toLowerCase().trim();
    const user = memoryStore.users.find(u => (u.rollNo && u.rollNo.toLowerCase() === norm) || (u.studentId && u.studentId.toLowerCase() === norm));
    if (!user) return null;
    return {
      ...user,
      matchPassword: async (pwd) => await bcrypt.compare(pwd, user.passwordHash)
    };
  },

  async findUserByEmployeeId(employeeId) {
    if (isMongoConnected) {
      return await User.findOne({ employeeId }).select('+password');
    }
    const norm = (employeeId || '').toLowerCase().trim();
    const user = memoryStore.users.find(u => u.employeeId && u.employeeId.toLowerCase() === norm);
    if (!user) return null;
    return {
      ...user,
      matchPassword: async (pwd) => await bcrypt.compare(pwd, user.passwordHash)
    };
  },

  async findUserByIdentifier(identifier) {
    const norm = (identifier || '').toLowerCase().trim();
    if (!norm) return null;
    if (isMongoConnected) {
      return await User.findOne({
        $or: [
          { email: norm },
          { rollNo: norm },
          { studentId: norm },
          { employeeId: norm }
        ]
      }).select('+password');
    }
    const user = memoryStore.users.find(u => 
      (u.email && u.email.toLowerCase() === norm) ||
      (u.rollNo && u.rollNo.toLowerCase() === norm) ||
      (u.studentId && u.studentId.toLowerCase() === norm) ||
      (u.employeeId && u.employeeId.toLowerCase() === norm)
    );
    if (!user) return null;
    return {
      ...user,
      matchPassword: async (pwd) => await bcrypt.compare(pwd, user.passwordHash)
    };
  },

  async findUserById(id) {
    if (isMongoConnected) {
      return await User.findById(id).select('-password');
    }
    const user = memoryStore.users.find(u => u._id === id);
    if (!user) return null;
    const { passwordHash, ...userInfo } = user;
    return userInfo;
  },

  async createUser(userData) {
    if (isMongoConnected) {
      return await User.create(userData);
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.password || 'student123', salt);
    const newUser = {
      _id: `mem_user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      passwordHash,
      role: userData.role || 'student',
      rollNo: userData.rollNo || userData.studentId || '',
      studentId: userData.studentId || userData.rollNo || '',
      employeeId: userData.employeeId || '',
      department: userData.department || 'Computer Science & Engineering',
      course: userData.course || 'B.Tech',
      semester: userData.semester || '1st Semester',
      section: userData.section || 'Section A',
      admissionYear: userData.admissionYear || '2026',
      batch: userData.batch || '2026 - 2030',
      cgpa: userData.cgpa || '0.0',
      dob: userData.dob || '',
      gender: userData.gender || '',
      hostel: userData.hostel || 'Unassigned',
      roomNo: userData.roomNo || '-',
      guardianName: userData.guardianName || '',
      guardianPhone: userData.guardianPhone || '',
      designation: userData.designation || '',
      qualification: userData.qualification || '',
      specialization: userData.specialization || '',
      officeRoom: userData.officeRoom || '',
      phone: userData.phone || '',
      bloodGroup: userData.bloodGroup || '',
      address: userData.address || '',
      avatar: userData.avatar || '',
    };
    memoryStore.users.push(newUser);
    const { passwordHash: _, ...result } = newUser;
    return result;
  },

  async updateUserProfile(userId, updateData) {
    if (isMongoConnected) {
      const user = await User.findById(userId);
      if (!user) return null;
      Object.assign(user, updateData);
      await user.save();
      return user;
    }
    const userIndex = memoryStore.users.findIndex(u => u._id === userId);
    if (userIndex === -1) return null;
    memoryStore.users[userIndex] = { ...memoryStore.users[userIndex], ...updateData };
    const { passwordHash: _, ...updated } = memoryStore.users[userIndex];
    return updated;
  },

  async getAllStudents() {
    if (isMongoConnected) {
      return await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
    }
    return memoryStore.users.filter(u => u.role === 'student').map(({ passwordHash, ...u }) => u);
  },

  // REQUEST OPERATIONS
  async getAllRequests(query = {}) {
    if (isMongoConnected) {
      return await Request.find(query).sort({ createdAt: -1 });
    }
    return memoryStore.requests.filter(r => {
      if (query.userId && r.userId !== query.userId) return false;
      if (query.type && r.type !== query.type) return false;
      return true;
    });
  },

  async createRequest(reqData) {
    if (isMongoConnected) {
      return await Request.create(reqData);
    }
    const newReq = {
      _id: `mem_req_${Date.now()}`,
      userId: reqData.userId,
      studentName: reqData.studentName,
      rollNo: reqData.rollNo,
      type: reqData.type,
      title: reqData.title,
      reason: reqData.reason,
      startDate: reqData.startDate || new Date().toISOString().split('T')[0],
      endDate: reqData.endDate || new Date().toISOString().split('T')[0],
      outTime: reqData.outTime || '05:00 PM',
      inTime: reqData.inTime || '08:30 PM',
      destination: reqData.destination || 'Market',
      status: 'pending',
      timeline: [
        { stage: 'Submitted', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'completed' },
        { stage: 'Warden Approval', time: 'Pending', status: 'current' },
        { stage: 'Gate Verification', time: 'Pending', status: 'pending' },
      ],
      createdAt: new Date().toISOString()
    };
    memoryStore.requests.unshift(newReq);
    return newReq;
  },

  async updateRequestStatus(id, status, remarks = '') {
    if (isMongoConnected) {
      const reqDoc = await Request.findById(id);
      if (!reqDoc) return null;
      reqDoc.status = status;
      reqDoc.timeline[1] = { stage: `Warden ${status}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'completed' };
      reqDoc.timeline[2] = { stage: 'Gate Verification', time: status === 'approved' ? 'Active at Security Desk' : 'N/A', status: status === 'approved' ? 'current' : 'rejected' };
      await reqDoc.save();

      // Create Notification
      await Notification.create({
        userId: reqDoc.userId,
        title: `Request ${status.toUpperCase()}`,
        message: `Your request "${reqDoc.title}" has been ${status}. ${remarks}`,
        type: 'request',
        link: '/requests'
      });
      return reqDoc;
    }
    const reqItem = memoryStore.requests.find(r => r._id === id);
    if (!reqItem) return null;
    reqItem.status = status;
    reqItem.timeline[1] = { stage: `Warden ${status}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'completed' };
    reqItem.timeline[2] = { stage: 'Gate Verification', time: status === 'approved' ? 'Active at Security Desk' : 'N/A', status: status === 'approved' ? 'current' : 'rejected' };
    
    // Add memory notification
    memoryStore.notifications.unshift({
      _id: `mem_notif_${Date.now()}`,
      userId: reqItem.userId,
      title: `Request ${status.toUpperCase()}`,
      message: `Your request "${reqItem.title}" has been ${status}. ${remarks}`,
      type: 'request',
      read: false,
      date: 'Just now'
    });
    return reqItem;
  },

  // COMPLAINT OPERATIONS
  async getAllComplaints(query = {}) {
    if (isMongoConnected) {
      return await Complaint.find(query).sort({ createdAt: -1 });
    }
    return (memoryStore.complaints || []).filter(c => {
      if (query.userId && c.userId && c.userId.toString() !== query.userId.toString()) return false;
      if (query.status && c.status !== query.status) return false;
      return true;
    });
  },

  async createComplaint(data) {
    const triage = serverTriageComplaint(data.title || '', data.description || '', data.category || '');
    const cmpId = data.cmpId || `CMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const formattedDate = data.submittedDate || new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    const assignedDept = data.assignedDept || triage.targetDept || 'Campus Administrator';
    const assignedTo = data.assignedTo || 'Unassigned';
    const priority = data.priority || triage.priority || 'Medium';
    const category = data.category && data.category !== 'Other' ? data.category : triage.category;

    const complaintPayload = {
      cmpId,
      user: data.userId || data.user,
      userId: data.userId || data.user,
      studentName: data.studentName || 'Student',
      rollNo: data.rollNo || '',
      hostel: data.hostel || 'Campus Hostel',
      roomNo: data.roomNo || '',
      category,
      title: data.title,
      description: data.description,
      location: data.location || 'Campus Premises',
      priority,
      status: 'Submitted',
      assignedTo,
      assignedDept,
      imagePreview: data.imagePreview || data.image || null,
      submittedDate: formattedDate,
      aiMetadata: {
        detectedCategory: triage.category,
        confidence: 'High',
        detectedPriority: triage.priority,
        targetDept: triage.targetDept,
        estimatedResolution: triage.estimatedResolution,
        matchedKeywords: triage.matchedKeywords || [],
        routingLogic: triage.routingLogic,
      },
      updates: [
        {
          status: 'Submitted',
          date: formattedDate,
          note: `Grievance submitted by student. Routed to ${assignedDept} for action.`,
          updatedBy: data.studentName || 'Student',
        },
      ],
    };

    if (isMongoConnected) {
      return await Complaint.create(complaintPayload);
    }

    const newComp = {
      _id: `mem_comp_${Date.now()}`,
      id: cmpId,
      ...complaintPayload,
      createdAt: new Date().toISOString(),
    };
    if (!memoryStore.complaints) memoryStore.complaints = [];
    memoryStore.complaints.unshift(newComp);
    return newComp;
  },

  async updateComplaintStatus(id, updateData, noteParam = '', staffNameParam = '', updatedByParam = 'Administrator') {
    let newStatus = 'In Progress';
    let note = noteParam;
    let assignedTo = staffNameParam;
    let category = null;
    let assignedDept = null;
    let updatedBy = updatedByParam;

    if (typeof updateData === 'object' && updateData !== null) {
      newStatus = updateData.status || newStatus;
      note = updateData.note !== undefined ? updateData.note : note;
      assignedTo = updateData.assignedTo !== undefined ? updateData.assignedTo : assignedTo;
      category = updateData.category || null;
      assignedDept = updateData.assignedDept || null;
      updatedBy = updateData.updatedBy || updatedBy;
    } else if (typeof updateData === 'string') {
      newStatus = updateData;
    }

    const currentDateStr = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    const updateHistoryItem = {
      status: newStatus,
      date: currentDateStr,
      note: note || `Status updated to ${newStatus}.`,
      updatedBy: updatedBy || 'Administrator',
    };

    if (isMongoConnected) {
      const comp = await Complaint.findById(id) || await Complaint.findOne({ cmpId: id });
      if (!comp) return null;
      comp.status = newStatus;
      if (assignedTo) comp.assignedTo = assignedTo;
      if (category) comp.category = category;
      if (assignedDept) comp.assignedDept = assignedDept;
      comp.updates.push(updateHistoryItem);
      await comp.save();

      await Notification.create({
        userId: comp.user || comp.userId,
        title: `Complaint Status: ${newStatus.toUpperCase()}`,
        message: `Your grievance "${comp.title}" is now marked as ${newStatus}. ${note ? `Note: ${note}` : ''}`,
        type: 'complaint',
        link: '/student/complaints',
      });
      return comp;
    }

    const comp = (memoryStore.complaints || []).find(c => c._id === id || c.id === id || c.cmpId === id);
    if (!comp) return null;
    comp.status = newStatus;
    if (assignedTo) comp.assignedTo = assignedTo;
    if (category) comp.category = category;
    if (assignedDept) comp.assignedDept = assignedDept;
    if (!comp.updates) comp.updates = [];
    comp.updates.push(updateHistoryItem);

    if (!memoryStore.notifications) memoryStore.notifications = [];
    memoryStore.notifications.unshift({
      _id: `mem_notif_${Date.now()}`,
      userId: comp.userId || comp.user,
      title: `Complaint Status: ${newStatus.toUpperCase()}`,
      message: `Your grievance "${comp.title}" is now marked as ${newStatus}. ${note ? `Note: ${note}` : ''}`,
      type: 'complaint',
      read: false,
      date: 'Just now',
    });
    return comp;
  },

  // NOTICE OPERATIONS
  async getAllNotices() {
    if (isMongoConnected) {
      return await Notice.find().sort({ createdAt: -1 });
    }
    return memoryStore.notices;
  },

  async createNotice(noticeData) {
    if (isMongoConnected) {
      return await Notice.create(noticeData);
    }
    const newNotice = {
      _id: `mem_notice_${Date.now()}`,
      title: noticeData.title,
      category: noticeData.category || 'General',
      department: noticeData.department || 'All Departments',
      content: noticeData.content,
      priority: noticeData.priority || 'medium',
      postedBy: noticeData.postedBy || 'Campus Administration',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      attachment: noticeData.attachment || ''
    };
    memoryStore.notices.unshift(newNotice);
    return newNotice;
  },

  async deleteNotice(id) {
    if (isMongoConnected) {
      return await Notice.findByIdAndDelete(id);
    }
    const idx = memoryStore.notices.findIndex(n => n._id === id);
    if (idx !== -1) {
      return memoryStore.notices.splice(idx, 1)[0];
    }
    return null;
  },

  // NOTIFICATION OPERATIONS
  async getNotificationsByUser(userId) {
    if (isMongoConnected) {
      return await Notification.find({ userId }).sort({ createdAt: -1 });
    }
    return memoryStore.notifications.filter(n => n.userId === userId);
  },

  async markNotificationRead(id) {
    if (isMongoConnected) {
      return await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    }
    const notif = memoryStore.notifications.find(n => n._id === id);
    if (notif) notif.read = true;
    return notif;
  },

  // HOSTEL & MESS
  async getHostelDetails() {
    if (isMongoConnected) {
      let hostel = await Hostel.findOne();
      if (!hostel) {
        hostel = await Hostel.create(memoryStore.hostels[0]);
      }
      return hostel;
    }
    return memoryStore.hostels[0];
  },

  async getMessDetails() {
    if (isMongoConnected) {
      let mess = await Mess.findOne();
      if (!mess) {
        mess = await Mess.create(memoryStore.mess[0]);
      }
      return mess;
    }
    return memoryStore.mess[0];
  },

  async submitMessFeedback(feedbackData) {
    if (isMongoConnected) {
      let mess = await Mess.findOne();
      if (!mess) mess = await Mess.create(memoryStore.mess[0]);
      mess.feedback.unshift(feedbackData);
      await mess.save();
      return mess;
    }
    memoryStore.mess[0].feedback.unshift(feedbackData);
    return memoryStore.mess[0];
  },

  // FOOD WASTE MANAGEMENT
  async getFoodWasteLogs() {
    if (isMongoConnected) {
      return await FoodWaste.find().sort({ date: -1, createdAt: -1 });
    }
    return (memoryStore.foodWaste || []).sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
  },

  async createFoodWasteLog(data) {
    const logId = `FW-${Date.now().toString().slice(-6)}`;
    const prepared = Number(data.foodPreparedKg) || 0;
    const wasted = Number(data.foodWastedKg) || 0;
    const wastePercentage = prepared > 0 ? Number(((wasted / prepared) * 100).toFixed(1)) : 0;

    const logPayload = {
      logId,
      date: data.date || new Date().toISOString().split('T')[0],
      mealType: data.mealType || 'Lunch',
      canteenName: data.canteenName || 'Central Dining Hall / Mess',
      expectedStudents: Number(data.expectedStudents) || 0,
      actualStudentsServed: Number(data.actualStudentsServed) || 0,
      foodPreparedKg: prepared,
      foodWastedKg: wasted,
      notes: data.notes || '',
      loggedBy: data.loggedBy || 'Campus Administration',
      wastePercentage,
    };

    if (isMongoConnected) {
      return await FoodWaste.create(logPayload);
    }

    const newLog = {
      _id: `mem_fw_${Date.now()}`,
      id: logId,
      ...logPayload,
      createdAt: new Date().toISOString(),
    };
    if (!memoryStore.foodWaste) memoryStore.foodWaste = [];
    memoryStore.foodWaste.unshift(newLog);
    return newLog;
  },

  async deleteFoodWasteLog(id) {
    if (isMongoConnected) {
      return await FoodWaste.findByIdAndDelete(id) || await FoodWaste.findOneAndDelete({ logId: id });
    }
    if (!memoryStore.foodWaste) return null;
    const idx = memoryStore.foodWaste.findIndex(f => f._id === id || f.id === id || f.logId === id);
    if (idx !== -1) {
      return memoryStore.foodWaste.splice(idx, 1)[0];
    }
    return null;
  },

  // FEES
  async getFeeDetails(userId) {
    if (isMongoConnected) {
      let fee = await Fee.findOne({ userId });
      if (!fee) {
        fee = await Fee.create({ userId, ...memoryStore.fees['mem_user_student_1'] });
      }
      return fee;
    }
    if (!memoryStore.fees[userId]) {
      memoryStore.fees[userId] = { ...memoryStore.fees['mem_user_student_1'], userId };
    }
    return memoryStore.fees[userId];
  },

  async recordFeePayment(userId, amount, method) {
    const txn = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      title: 'Tuition / Hostel Fee Payment',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: Number(amount),
      method: method || 'Online UPI / Card',
      status: 'Completed'
    };
    if (isMongoConnected) {
      let fee = await Fee.findOne({ userId });
      if (!fee) fee = await Fee.create({ userId, ...memoryStore.fees['mem_user_student_1'] });
      fee.paidAmount += Number(amount);
      fee.dueAmount = Math.max(0, fee.totalAmount - fee.paidAmount);
      fee.transactions.unshift(txn);
      await fee.save();
      return fee;
    }
    const fee = await this.getFeeDetails(userId);
    fee.paidAmount += Number(amount);
    fee.dueAmount = Math.max(0, fee.totalAmount - fee.paidAmount);
    fee.transactions.unshift(txn);
    return fee;
  },

  // TEACHER OPERATIONS
  async getAllTeachers() {
    if (isMongoConnected) {
      return await User.find({ role: 'teacher' }).select('-password').sort({ createdAt: -1 });
    }
    return memoryStore.users.filter(u => u.role === 'teacher').map(({ passwordHash, ...u }) => u);
  },

  async createTeacher(teacherData) {
    if (isMongoConnected) {
      return await User.create({ ...teacherData, role: 'teacher' });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(teacherData.password || 'teacher123', salt);
    const newTeacher = {
      _id: `mem_user_teacher_${Date.now()}`,
      name: teacherData.name,
      email: teacherData.email,
      passwordHash,
      role: 'teacher',
      employeeId: teacherData.employeeId || `FAC-${Math.floor(100 + Math.random() * 900)}`,
      designation: teacherData.designation || 'Assistant Professor',
      department: teacherData.department || 'Computer Science & Engineering',
      officeRoom: teacherData.officeRoom || 'Academic Block 2, Room 304',
      phone: teacherData.phone || '+91 94372 99881',
      avatar: teacherData.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      assignedClasses: teacherData.assignedClasses || [
        { subject: 'Data Structures & Algorithms', code: 'CSE-301', semester: '6th Semester', section: 'Section A', enrolledCount: 45 }
      ]
    };
    memoryStore.users.push(newTeacher);
    const { passwordHash: _, ...result } = newTeacher;
    return result;
  },

  async markClassAttendance(sessionData) {
    const targetDate = sessionData.date || new Date().toISOString().split('T')[0];
    const subCode = sessionData.subjectCode || sessionData.subject;
    const sec = sessionData.section || 'Section A';

    if (isMongoConnected) {
      const { ClassSessionAttendance } = await import('../models/Attendance.js');
      const existing = await ClassSessionAttendance.findOne({
        $or: [{ subjectCode: subCode }, { subject: sessionData.subject }],
        section: sec,
        date: targetDate,
      });
      if (existing && !sessionData.allowUpdate) {
        return {
          isDuplicate: true,
          message: `Attendance has already been recorded for ${sessionData.subject} (${sec}) on ${targetDate}.`,
          existingSession: existing,
        };
      }
      if (existing && sessionData.allowUpdate) {
        existing.records = sessionData.records || [];
        await existing.save();
        return existing;
      }
      return await ClassSessionAttendance.create({ ...sessionData, date: targetDate });
    }

    // Fallback In-Memory check
    const existingIdx = memoryStore.classSessions.findIndex(
      (s) =>
        (s.subjectCode === subCode || s.subject === sessionData.subject) &&
        s.section === sec &&
        s.date === targetDate
    );

    if (existingIdx !== -1 && !sessionData.allowUpdate) {
      return {
        isDuplicate: true,
        message: `Attendance has already been recorded for ${sessionData.subject} (${sec}) on ${targetDate}.`,
        existingSession: memoryStore.classSessions[existingIdx],
      };
    }

    if (existingIdx !== -1 && sessionData.allowUpdate) {
      memoryStore.classSessions[existingIdx].records = sessionData.records || [];
      return memoryStore.classSessions[existingIdx];
    }

    const newSession = {
      _id: `mem_session_${Date.now()}`,
      teacherId: sessionData.teacherId,
      teacherName: sessionData.teacherName,
      subject: sessionData.subject,
      subjectCode: subCode,
      semester: sessionData.semester || '6th Semester',
      section: sec,
      date: targetDate,
      records: sessionData.records || [],
      createdAt: new Date().toISOString(),
    };
    memoryStore.classSessions.unshift(newSession);
    return newSession;
  },

  async getClassAttendanceHistory(teacherId, filters = {}) {
    let sessions = [];
    if (isMongoConnected) {
      const { ClassSessionAttendance } = await import('../models/Attendance.js');
      const query = {};
      if (teacherId) query.teacherId = teacherId;
      if (filters.date) query.date = filters.date;
      if (filters.subject) query.subject = new RegExp(filters.subject, 'i');
      if (filters.subjectCode) query.subjectCode = filters.subjectCode;
      if (filters.section) query.section = filters.section;
      if (filters.semester) query.semester = filters.semester;
      sessions = await ClassSessionAttendance.find(query).sort({ createdAt: -1 });
    } else {
      sessions = memoryStore.classSessions;
      if (teacherId) {
        sessions = sessions.filter((s) => s.teacherId === teacherId);
      }
      if (filters.date) {
        sessions = sessions.filter((s) => s.date === filters.date);
      }
      if (filters.subject) {
        const norm = filters.subject.toLowerCase();
        sessions = sessions.filter(
          (s) =>
            (s.subject || '').toLowerCase().includes(norm) ||
            (s.subjectCode || '').toLowerCase().includes(norm)
        );
      }
      if (filters.section) {
        sessions = sessions.filter((s) => s.section === filters.section);
      }
      if (filters.semester) {
        sessions = sessions.filter((s) => s.semester === filters.semester);
      }
    }
    return sessions;
  },

  async getAdminAttendanceOverview(filters = {}) {
    let sessions = [];
    let students = [];
    if (isMongoConnected) {
      const { ClassSessionAttendance } = await import('../models/Attendance.js');
      const query = {};
      if (filters.date) query.date = filters.date;
      if (filters.section) query.section = filters.section;
      if (filters.semester) query.semester = filters.semester;
      sessions = await ClassSessionAttendance.find(query).sort({ createdAt: -1 });
      students = await User.find({ role: 'student' }).select('-password');
    } else {
      sessions = memoryStore.classSessions;
      if (filters.date) sessions = sessions.filter((s) => s.date === filters.date);
      if (filters.section) sessions = sessions.filter((s) => s.section === filters.section);
      if (filters.semester) sessions = sessions.filter((s) => s.semester === filters.semester);
      students = memoryStore.users.filter((u) => u.role === 'student');
    }

    if (filters.department) {
      const depNorm = filters.department.toLowerCase();
      students = students.filter(
        (s) => (s.department || s.branch || '').toLowerCase().includes(depNorm)
      );
    }

    let totalRecordedPresent = 0;
    let totalRecordedAbsent = 0;
    const studentStats = {};

    students.forEach((st) => {
      const id = st._id || st.studentId || st.rollNo;
      studentStats[id] = {
        studentId: id,
        name: st.name,
        rollNo: st.rollNo || st.studentId || 'N/A',
        department: st.department || st.branch || 'CSE',
        semester: st.semester || '3rd Semester',
        attended: 0,
        total: 0,
      };
    });

    sessions.forEach((sess) => {
      (sess.records || []).forEach((rec) => {
        if (rec.status === 'present') totalRecordedPresent++;
        if (rec.status === 'absent') totalRecordedAbsent++;

        const id = rec.studentId || rec.rollNo;
        if (!studentStats[id]) {
          studentStats[id] = {
            studentId: id,
            name: rec.studentName || 'Student',
            rollNo: rec.rollNo || id,
            department: 'CSE',
            semester: sess.semester || '3rd Semester',
            attended: 0,
            total: 0,
          };
        }
        studentStats[id].total += 1;
        if (rec.status === 'present') studentStats[id].attended += 1;
      });
    });

    const lowAttendanceList = Object.values(studentStats)
      .map((st) => {
        const percentage =
          st.total > 0 ? Number(((st.attended / st.total) * 100).toFixed(1)) : 100;
        return { ...st, percentage, lowWarning: percentage < 75 };
      })
      .filter((st) => st.total > 0 && st.lowWarning);

    const totalRecords = totalRecordedPresent + totalRecordedAbsent;
    const overallPercentage =
      totalRecords > 0 ? Number(((totalRecordedPresent / totalRecords) * 100).toFixed(1)) : 0;

    return {
      totalStudents: students.length,
      totalSessions: sessions.length,
      totalRecords,
      presentCount: totalRecordedPresent,
      absentCount: totalRecordedAbsent,
      overallPercentage,
      lowAttendanceCount: lowAttendanceList.length,
      lowAttendanceList,
      recentSessions: sessions.slice(0, 10),
    };
  },

  // TIMETABLE OPERATIONS
  async getTimetable(filters = {}) {
    const { branch, day, teacher, roomNo, semester } = filters;
    if (isMongoConnected) {
      const query = {};
      if (branch) query.branch = new RegExp(`^${branch}$`, 'i');
      if (day) query.day = new RegExp(`^${day}$`, 'i');
      if (teacher) {
        query.$or = [
          { teacher: new RegExp(teacher, 'i') },
          { faculty: new RegExp(teacher, 'i') }
        ];
      }
      if (roomNo) query.roomNo = new RegExp(`^${roomNo}$`, 'i');
      if (semester) query.semester = new RegExp(`^${semester}$`, 'i');
      const slots = await Timetable.find(query).sort({ createdAt: 1 });
      if (slots.length > 0) return slots;
    }

    return memoryStore.timetable.filter(slot => {
      if (branch && slot.branch.toLowerCase() !== branch.toLowerCase()) return false;
      if (day && slot.day.toLowerCase() !== day.toLowerCase()) return false;
      if (teacher) {
        const tNorm = teacher.toLowerCase();
        const slotTeacher = (slot.teacher || '').toLowerCase();
        const slotFaculty = (slot.faculty || '').toLowerCase();
        if (!slotTeacher.includes(tNorm) && !slotFaculty.includes(tNorm)) return false;
      }
      if (roomNo && (slot.roomNo || slot.room || '').toLowerCase() !== roomNo.toLowerCase()) return false;
      if (semester && slot.semester.toLowerCase() !== semester.toLowerCase()) return false;
      return true;
    });
  },

  async getTimetableById(id) {
    if (isMongoConnected) {
      return await Timetable.findById(id);
    }
    return memoryStore.timetable.find(t => t.id === id || t._id === id);
  },

  async createTimetableSlot(slotData) {
    if (isMongoConnected) {
      return await Timetable.create(slotData);
    }
    const newSlot = {
      id: `tt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      _id: `tt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      day: slotData.day || 'Monday',
      roomNo: slotData.roomNo || '109',
      branch: slotData.branch || 'CSE',
      startTime: slotData.startTime || '09:00 AM',
      endTime: slotData.endTime || '10:00 AM',
      time: slotData.time || `${slotData.startTime || '09:00 AM'} - ${slotData.endTime || '10:00 AM'}`,
      subject: slotData.subject || 'Subject',
      teacher: slotData.teacher || 'SSM',
      faculty: slotData.teacher || 'SSM',
      code: slotData.code || 'CSE-301',
      classType: slotData.classType || 'Lecture',
      semester: slotData.semester || '3rd Semester',
      course: slotData.course || 'B.Tech',
      academicYear: slotData.academicYear || '2026-27',
      effectiveFrom: slotData.effectiveFrom || '20-07-2026',
      status: slotData.status || 'Verified',
      createdAt: new Date().toISOString()
    };
    memoryStore.timetable.push(newSlot);
    return newSlot;
  },

  async updateTimetableSlot(id, slotData) {
    if (isMongoConnected) {
      return await Timetable.findByIdAndUpdate(id, slotData, { new: true });
    }
    const idx = memoryStore.timetable.findIndex(t => t.id === id || t._id === id);
    if (idx === -1) return null;
    memoryStore.timetable[idx] = {
      ...memoryStore.timetable[idx],
      ...slotData,
      time: slotData.time || (slotData.startTime && slotData.endTime ? `${slotData.startTime} - ${slotData.endTime}` : memoryStore.timetable[idx].time)
    };
    return memoryStore.timetable[idx];
  },

  async deleteTimetableSlot(id) {
    if (isMongoConnected) {
      return await Timetable.findByIdAndDelete(id);
    }
    const idx = memoryStore.timetable.findIndex(t => t.id === id || t._id === id);
    if (idx !== -1) {
      memoryStore.timetable.splice(idx, 1);
      return true;
    }
    return false;
  },

  // USER DELETION AND STATUS
  async deleteUser(id) {
    if (isMongoConnected) {
      return await User.findByIdAndDelete(id);
    }
    const idx = memoryStore.users.findIndex(u => u._id === id);
    if (idx !== -1) return memoryStore.users.splice(idx, 1)[0];
    return null;
  },

  async updateUserStatus(id, status) {
    if (isMongoConnected) {
      return await User.findByIdAndUpdate(id, { status }, { new: true });
    }
    const user = memoryStore.users.find(u => u._id === id);
    if (user) user.status = status;
    return user;
  },

  // DEPARTMENTS
  async getDepartments() {
    return memoryStore.departments || [];
  },
  async createDepartment(data) {
    const dep = { _id: `mem_dep_${Date.now()}`, ...data, createdAt: new Date().toISOString() };
    if (!memoryStore.departments) memoryStore.departments = [];
    memoryStore.departments.unshift(dep);
    return dep;
  },
  async updateDepartment(id, data) {
    const idx = (memoryStore.departments || []).findIndex(d => d._id === id);
    if (idx === -1) return null;
    memoryStore.departments[idx] = { ...memoryStore.departments[idx], ...data };
    return memoryStore.departments[idx];
  },
  async deleteDepartment(id) {
    const idx = (memoryStore.departments || []).findIndex(d => d._id === id);
    if (idx !== -1) return memoryStore.departments.splice(idx, 1)[0];
    return null;
  },

  // COURSES
  async getCourses() {
    return memoryStore.courses || [];
  },
  async createCourse(data) {
    const crs = { _id: `mem_crs_${Date.now()}`, ...data, createdAt: new Date().toISOString() };
    if (!memoryStore.courses) memoryStore.courses = [];
    memoryStore.courses.unshift(crs);
    return crs;
  },
  async updateCourse(id, data) {
    const idx = (memoryStore.courses || []).findIndex(c => c._id === id);
    if (idx === -1) return null;
    memoryStore.courses[idx] = { ...memoryStore.courses[idx], ...data };
    return memoryStore.courses[idx];
  },
  async deleteCourse(id) {
    const idx = (memoryStore.courses || []).findIndex(c => c._id === id);
    if (idx !== -1) return memoryStore.courses.splice(idx, 1)[0];
    return null;
  },

  // SUBJECTS
  async getSubjects() {
    return memoryStore.subjects || [];
  },
  async createSubject(data) {
    const sub = { _id: `mem_sub_${Date.now()}`, ...data, createdAt: new Date().toISOString() };
    if (!memoryStore.subjects) memoryStore.subjects = [];
    memoryStore.subjects.unshift(sub);
    return sub;
  },
  async updateSubject(id, data) {
    const idx = (memoryStore.subjects || []).findIndex(s => s._id === id);
    if (idx === -1) return null;
    memoryStore.subjects[idx] = { ...memoryStore.subjects[idx], ...data };
    return memoryStore.subjects[idx];
  },
  async deleteSubject(id) {
    const idx = (memoryStore.subjects || []).findIndex(s => s._id === id);
    if (idx !== -1) return memoryStore.subjects.splice(idx, 1)[0];
    return null;
  },

  // CLASS SECTIONS
  async getClassSections() {
    return memoryStore.classSections || [];
  },
  async createClassSection(data) {
    const cls = { _id: `mem_cls_${Date.now()}`, ...data, createdAt: new Date().toISOString() };
    if (!memoryStore.classSections) memoryStore.classSections = [];
    memoryStore.classSections.unshift(cls);
    return cls;
  },
  async updateClassSection(id, data) {
    const idx = (memoryStore.classSections || []).findIndex(c => c._id === id);
    if (idx === -1) return null;
    memoryStore.classSections[idx] = { ...memoryStore.classSections[idx], ...data };
    return memoryStore.classSections[idx];
  },
  async deleteClassSection(id) {
    const idx = (memoryStore.classSections || []).findIndex(c => c._id === id);
    if (idx !== -1) return memoryStore.classSections.splice(idx, 1)[0];
    return null;
  },

  // AUDIT LOGS
  async getAuditLogs() {
    if (isMongoConnected) {
      return await AuditLog.find().sort({ createdAt: -1 });
    }
    return memoryStore.auditLogs || [];
  },

  async createAuditLog(logData) {
    if (isMongoConnected) {
      return await AuditLog.create({
        logId: `LOG-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        ...logData
      });
    }
    const newLog = {
      _id: `mem_log_${Date.now()}`,
      logId: `LOG-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      ...logData,
      createdAt: new Date().toISOString()
    };
    if (!memoryStore.auditLogs) memoryStore.auditLogs = [];
    memoryStore.auditLogs.unshift(newLog);
    return newLog;
  }
};
