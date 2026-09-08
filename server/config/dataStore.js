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
import { Fee } from '../models/Fee.js';

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
      department: 'Computer Science & Engineering',
      course: 'B.Tech',
      semester: '6th Semester',
      section: 'Section A',
      admissionYear: '2022',
      batch: '2022 - 2026',
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
  }
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
    return memoryStore.complaints.filter(c => {
      if (query.userId && c.userId !== query.userId) return false;
      if (query.status && c.status !== query.status) return false;
      return true;
    });
  },

  async createComplaint(data) {
    if (isMongoConnected) {
      return await Complaint.create(data);
    }
    const newComp = {
      _id: `mem_comp_${Date.now()}`,
      userId: data.userId,
      studentName: data.studentName,
      rollNo: data.rollNo,
      hostel: data.hostel,
      roomNo: data.roomNo,
      category: data.category,
      title: data.title,
      description: data.description,
      priority: data.priority || 'medium',
      image: data.image || '',
      status: 'pending',
      aiClassification: {
        category: data.category,
        priority: data.priority || 'medium',
        suggestedDepartment: `${data.category} Maintenance Dept`,
        confidence: 0.95
      },
      updates: [
        { date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), note: 'Complaint logged. Smart AI route assigned to Maintenance Dept.' }
      ],
      createdAt: new Date().toISOString()
    };
    memoryStore.complaints.unshift(newComp);
    return newComp;
  },

  async updateComplaintStatus(id, status, note = '') {
    if (isMongoConnected) {
      const comp = await Complaint.findById(id);
      if (!comp) return null;
      comp.status = status;
      comp.updates.push({
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        note: note || `Status updated to ${status}.`
      });
      await comp.save();

      await Notification.create({
        userId: comp.userId,
        title: `Complaint Status: ${status.toUpperCase()}`,
        message: `Your complaint "${comp.title}" is now marked as ${status}.`,
        type: 'complaint',
        link: '/complaints'
      });
      return comp;
    }
    const comp = memoryStore.complaints.find(c => c._id === id);
    if (!comp) return null;
    comp.status = status;
    comp.updates.push({
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      note: note || `Status updated to ${status}.`
    });

    memoryStore.notifications.unshift({
      _id: `mem_notif_${Date.now()}`,
      userId: comp.userId,
      title: `Complaint Status: ${status.toUpperCase()}`,
      message: `Your complaint "${comp.title}" is now marked as ${status}.`,
      type: 'complaint',
      read: false,
      date: 'Just now'
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
    if (isMongoConnected) {
      const { ClassSessionAttendance } = await import('../models/Attendance.js');
      return await ClassSessionAttendance.create(sessionData);
    }
    const newSession = {
      _id: `mem_session_${Date.now()}`,
      teacherId: sessionData.teacherId,
      teacherName: sessionData.teacherName,
      subject: sessionData.subject,
      subjectCode: sessionData.subjectCode || 'CSE-301',
      semester: sessionData.semester || '6th Semester',
      section: sessionData.section || 'Section A',
      date: sessionData.date || new Date().toISOString().split('T')[0],
      records: sessionData.records || []
    };
    memoryStore.classSessions.unshift(newSession);
    return newSession;
  },

  async getClassAttendanceHistory(teacherId) {
    if (isMongoConnected) {
      const { ClassSessionAttendance } = await import('../models/Attendance.js');
      return await ClassSessionAttendance.find({ teacherId }).sort({ createdAt: -1 });
    }
    return memoryStore.classSessions.filter(s => s.teacherId === teacherId);
  }
};
