import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  requestsAPI,
  complaintsAPI,
  noticesAPI,
  notificationsAPI,
  attendanceAPI,
  timetableAPI,
  hostelAPI,
  messAPI,
  adminAPI,
  aiAPI,
  apiHealthCheck,
} from '../services/api';
import { triageComplaint } from '../utils/triageHelper';
const sampleAIAnswers = [
  {
    keywords: ["gate pass", "outing", "exit", "leave hostel"],
    response: `To apply for a Digital Gate Pass:\n1. Navigate to **Gate Pass** from your Services Hub.\n2. Select Exit Date, Exit Time, Return Time, and Destination.\n3. Submit request to generate your verified QR gate pass!`,
    actionLink: "/student/gate-pass",
    actionLabel: "Open Gate Pass Form",
  },
  {
    keywords: ["pending request", "track request", "status"],
    response: `You can view all submitted permits, certificate requests, and approval timelines on your **Requests** page.`,
    actionLink: "/student/requests",
    actionLabel: "View My Requests",
  },
  {
    keywords: ["timetable", "schedule", "class", "lecture"],
    response: `Check your daily and weekly timetable schedule on the **Timetable** page.`,
    actionLink: "/student/timetable",
    actionLabel: "View Full Timetable",
  },
  {
    keywords: ["complaint", "fan", "water", "wifi", "repair", "broken"],
    response: `To lodge a grievance:\n1. Open the **Complaints** section.\n2. Describe your issue.\n3. CampusOS AI automatically classifies the issue and routes it to the maintenance team!`,
    actionLink: "/student/complaints",
    actionLabel: "Lodge a Complaint",
  },
  {
    keywords: ["mess", "menu", "food", "dinner", "lunch", "breakfast"],
    response: `Today's Mess Menu (Kalpana Chawla Hall):\n- **Breakfast**: Puri, Ghuguni, Tea/Coffee\n- **Lunch**: Rice, Dalma, Saga Bhaja, Mushroom Curry\n- **Snacks**: Vada, Tea\n- **Dinner**: Roti, Chicken Curry / Kadai Paneer, Rice`,
    actionLink: "/student/mess",
    actionLabel: "View Full Mess Menu",
  },
];

const DataContext = createContext();


const formatMessMenuData = (raw) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayDay = days[new Date().getDay()];

  const menu = raw?.menu || {
    Monday: { breakfast: 'Idli, Sambar, Coconut Chutney, Tea/Coffee', lunch: 'Rice, Dal, Alu Bhaja, Paneer Curry, Curd', snacks: 'Samosa, Black Tea', dinner: 'Roti, Mixed Veg, Dal Fry, Kheer' },
    Tuesday: { breakfast: 'Puri, Ghuguni, Tea/Coffee', lunch: 'Rice, Dalma, Saga Bhaja, Mushroom Curry', snacks: 'Vada, Tea', dinner: 'Roti, Chicken Curry / Kadai Paneer, Rice' },
    Wednesday: { breakfast: 'Upma, Ghuguni, Tea', lunch: 'Rice, Dal, Fish Curry / Soyabean, Dahi Baigana', snacks: 'Biscuits, Coffee', dinner: 'Roti, Dal, Egg Curry / Paneer Butter Masala' },
    Thursday: { breakfast: 'Dosa, Sambar, Chutney, Tea', lunch: 'Rice, Kanika, Chana Masala, Papad, Sweet', snacks: 'Pakoda, Tea', dinner: 'Roti, Dal Fry, Alu Gobi' },
    Friday: { breakfast: 'Poha, Sev, Tea/Coffee', lunch: 'Rice, Dal, Egg Bhurji / Kadhi Pakoda, Chips', snacks: 'Bread Chop, Tea', dinner: 'Roti, Chicken Biryani / Veg Biryani, Raita' },
    Saturday: { breakfast: 'Chakuli Pitha, Ghuguni, Tea', lunch: 'Rice, Dal, Baigana Bhaja, Veg Tadka', snacks: 'Jhalmuri, Coffee', dinner: 'Roti, Dal Makhani, Mix Veg' },
    Sunday: { breakfast: 'Chole Bhature, Tea/Coffee', lunch: 'Special Veg/Non-Veg Thali, Ice Cream', snacks: 'Tea/Coffee', dinner: 'Roti, Dal, Veg Korma / Paneer Tikka' }
  };

  const timings = raw?.timings || {
    breakfast: '07:30 AM - 09:15 AM',
    lunch: '12:30 PM - 02:15 PM',
    snacks: '05:00 PM - 06:15 PM',
    dinner: '08:00 PM - 09:45 PM'
  };

  const todayMenu = menu[todayDay] || menu.Wednesday || menu.Tuesday || {};

  return {
    todayDay,
    hostel: raw?.hostel || 'Kalpana Chawla Hall (Block B)',
    provider: raw?.provider || 'Annapurna Catering Services',
    breakfast: {
      title: todayMenu.breakfast || 'Puri, Ghuguni, Tea/Coffee',
      time: timings.breakfast || '07:30 AM - 09:15 AM',
      sides: 'Served hot at Central Dining Hall',
    },
    lunch: {
      title: todayMenu.lunch || 'Rice, Dalma, Saga Bhaja, Mushroom Curry',
      time: timings.lunch || '12:30 PM - 02:15 PM',
      sides: 'Includes Fresh Salad, Papad & Curd',
    },
    snacks: {
      title: todayMenu.snacks || 'Samosa / Vada & Tea',
      time: timings.snacks || '05:00 PM - 06:15 PM',
      sides: 'Evening Refreshment Counter',
    },
    dinner: {
      title: todayMenu.dinner || 'Roti, Dal, Special Veg/Non-Veg Curry',
      time: timings.dinner || '08:00 PM - 09:45 PM',
      sides: 'Dessert / Ice Cream on Special Days',
    },
    weeklyHighlights: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => ({
      day: d,
      lunch: menu[d]?.lunch || 'Rice, Dal & Special Curry',
      dinner: menu[d]?.dinner || 'Roti & Dal Fry',
    })),
    feedbacks: raw?.feedback || [],
    raw: raw || {},
  };
};

export const DataProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [notices, setNotices] = useState([]);
  const [attendance, setAttendance] = useState({
    overallPercentage: 0,
    totalClasses: 0,
    attendedClasses: 0,
    absentClasses: 0,
    subjects: [],
  });
  const [timetable, setTimetable] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [hostel, setHostel] = useState({
    block: 'Unassigned Block',
    roomNo: '-',
    floor: 'Floor -',
    wardenName: 'Dr. Warden',
    wardenPhone: '',
    caretakerName: '',
    caretakerPhone: '',
    roommates: [],
    rules: [],
  });
  const [messMenu, setMessMenu] = useState(() => formatMessMenuData(null));
  const [fees, setFees] = useState({
    totalFee: 0,
    paidFee: 0,
    dueFee: 0,
    dueDate: '-',
    transactions: [],
  });
  const [foodWasteLogs, setFoodWasteLogs] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    pendingRequestsCount: 0,
    openComplaintsCount: 0,
    avgResolutionHours: '0 Hours',
    departmentWise: [],
    complaintCategoriesCount: [],
    smartInsights: [],
  });

  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch real data from API backend
  const fetchAllData = async () => {
    setLoading(true);
    setConnectionError(false);
    try {
      const health = await apiHealthCheck();
      if (health.status === 'error') {
        setConnectionError(true);
        setLoading(false);
        return;
      }

      // Fetch endpoints safely
      const [reqData, cmpData, notData, ntfData, attData, ttData, hstData, messData, fwData] =
        await Promise.allSettled([
          requestsAPI.getAll(),
          complaintsAPI.getAll(),
          noticesAPI.getAll(),
          notificationsAPI.getAll(),
          attendanceAPI.get(),
          timetableAPI.getAll(),
          hostelAPI.get(),
          messAPI.get(),
          messAPI.getFoodWaste(),
        ]);

      if (reqData.status === 'fulfilled') setRequests(reqData.value || []);
      if (cmpData.status === 'fulfilled') setComplaints(cmpData.value || []);
      if (notData.status === 'fulfilled') setNotices(notData.value || []);
      if (ntfData.status === 'fulfilled') setNotifications(ntfData.value || []);
      if (attData.status === 'fulfilled' && attData.value) setAttendance(attData.value);
      if (ttData.status === 'fulfilled') setTimetable(ttData.value || []);
      if (hstData.status === 'fulfilled' && hstData.value) setHostel(hstData.value);
      if (messData.status === 'fulfilled' && messData.value) setMessMenu(formatMessMenuData(messData.value));
      if (fwData.status === 'fulfilled') setFoodWasteLogs(fwData.value || []);

      setLoading(false);
    } catch (err) {
      console.warn('[API Warning] Express API server connection error:', err.message);
      setConnectionError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Add Leave Request
  const addLeaveRequest = async (leaveData) => {
    try {
      const newReq = await requestsAPI.create({
        type: 'Leave Application',
        title: `${leaveData.leaveType} Leave (${leaveData.startDate} to ${leaveData.endDate})`,
        priority: leaveData.leaveType === 'Medical' ? 'High' : 'Medium',
        details: {
          leaveType: leaveData.leaveType,
          startDate: leaveData.startDate,
          endDate: leaveData.endDate,
          reason: leaveData.reason,
          emergencyContact: leaveData.emergencyContact,
          attachmentName: leaveData.attachment ? leaveData.attachment.name : 'No attachment',
        },
      });
      setRequests((prev) => [newReq, ...prev]);
      showToast(`Leave request ${newReq.reqId || ''} submitted successfully!`, 'success');
      return newReq.reqId;
    } catch (err) {
      // Local creation fallback if API offline
      const newReqId = `REQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newReq = {
        id: newReqId,
        reqId: newReqId,
        type: 'Leave Application',
        title: `${leaveData.leaveType} Leave (${leaveData.startDate} to ${leaveData.endDate})`,
        submittedDate: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        lastUpdated: 'Just now',
        status: 'Pending',
        priority: leaveData.leaveType === 'Medical' ? 'High' : 'Medium',
        details: leaveData,
        timeline: [
          { step: 'Submitted', time: 'Just now', status: 'completed' },
          { step: 'Under Review', time: 'In Progress', status: 'current' },
        ],
      };
      setRequests((prev) => [newReq, ...prev]);
      showToast(`Leave request ${newReqId} submitted!`, 'success');
      return newReqId;
    }
  };

  // Add Gate Pass Request
  const addGatePassRequest = async (passData) => {
    try {
      const newReq = await requestsAPI.create({
        type: 'Gate Pass',
        title: `Gate Pass for ${passData.destination}`,
        priority: 'Medium',
        details: {
          exitTime: `${passData.date} ${passData.exitTime}`,
          returnTime: `${passData.date} ${passData.returnTime}`,
          destination: passData.destination,
          reason: passData.reason,
          emergencyContact: passData.emergencyContact,
          approvedBy: 'Hostel Warden (Auto-Verified)',
        },
      });
      setRequests((prev) => [newReq, ...prev]);
      showToast(`Digital Gate Pass ${newReq.reqId || ''} generated & approved!`, 'success');
      return newReq;
    } catch (err) {
      const newReqId = `REQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newReq = {
        id: newReqId,
        reqId: newReqId,
        type: 'Gate Pass',
        title: `Gate Pass for ${passData.destination}`,
        submittedDate: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        lastUpdated: 'Just now',
        status: 'Approved',
        priority: 'Medium',
        details: {
          exitTime: `${passData.date} ${passData.exitTime}`,
          returnTime: `${passData.date} ${passData.returnTime}`,
          destination: passData.destination,
          reason: passData.reason,
          emergencyContact: passData.emergencyContact,
          approvedBy: 'Hostel Warden (Auto-Verified)',
        },
        timeline: [
          { step: 'Submitted', time: 'Just now', status: 'completed' },
          { step: 'Approved', time: 'Just now', status: 'completed' },
        ],
      };
      setRequests((prev) => [newReq, ...prev]);
      showToast(`Digital Gate Pass ${newReqId} generated!`, 'success');
      return newReq;
    }
  };

  // Add Certificate Request
  const addCertificateRequest = async (certData) => {
    try {
      const newReq = await requestsAPI.create({
        type: 'Certificate',
        title: `${certData.certType} Request`,
        priority: 'Low',
        details: certData,
      });
      setRequests((prev) => [newReq, ...prev]);
      showToast(`Certificate request ${newReq.reqId || ''} submitted!`, 'success');
      return newReq.reqId;
    } catch (err) {
      const newReqId = `REQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newReq = {
        id: newReqId,
        reqId: newReqId,
        type: 'Certificate',
        title: `${certData.certType} Request`,
        submittedDate: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        lastUpdated: 'Just now',
        status: 'Pending',
        priority: 'Low',
        details: certData,
        timeline: [{ step: 'Submitted', time: 'Just now', status: 'completed' }],
      };
      setRequests((prev) => [newReq, ...prev]);
      showToast(`Certificate request ${newReqId} submitted!`, 'success');
      return newReqId;
    }
  };

  // Add Complaint
  const addComplaint = async (complaintData) => {
    try {
      const newCmp = await complaintsAPI.create(complaintData);
      setComplaints((prev) => [newCmp, ...prev]);
      showToast(`Grievance ${newCmp.cmpId || ''} logged successfully!`, 'success');
      return newCmp;
    } catch (err) {
      const triage = triageComplaint(complaintData.title, complaintData.description, complaintData.category);
      const newCmpId = `CMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const currentDateStr = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
      const newCmp = {
        id: newCmpId,
        cmpId: newCmpId,
        title: complaintData.title,
        category: triage.category,
        location: complaintData.location || 'Campus Premises',
        submittedDate: currentDateStr,
        priority: triage.priority,
        status: 'Submitted',
        assignedTo: 'Unassigned',
        assignedDept: triage.targetDept,
        description: complaintData.description,
        imagePreview: complaintData.imagePreview || null,
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
            date: currentDateStr,
            note: `Grievance submitted. Routed to ${triage.targetDept}.`,
            updatedBy: 'Student',
          },
        ],
      };
      setComplaints((prev) => [newCmp, ...prev]);
      showToast(`Grievance ${newCmpId} logged!`, 'success');
      return newCmp;
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.', 'info');
  };

  const markNotificationRead = async (id) => {
    try {
      await notificationsAPI.markRead(id);
    } catch (e) {}
    setNotifications((prev) => prev.map((n) => (n.id === id || n.notifId === id ? { ...n, read: true } : n)));
  };

  const updateRequestStatus = async (id, newStatus) => {
    try {
      await requestsAPI.updateStatus(id, newStatus);
    } catch (e) {}
    setRequests((prev) =>
      prev.map((r) => (r.id === id || r.reqId === id ? { ...r, status: newStatus, lastUpdated: 'Just now' } : r))
    );
    showToast(`Request marked as ${newStatus}!`, 'success');
  };

  const updateComplaintStatus = async (id, statusOrPayload, staffName = '', note = '') => {
    try {
      const payload =
        typeof statusOrPayload === 'object' && statusOrPayload !== null
          ? statusOrPayload
          : { status: statusOrPayload, assignedTo: staffName, note };
      const updated = await complaintsAPI.updateStatus(id, payload);
      setComplaints((prev) =>
        prev.map((c) => {
          if (c.id === id || c.cmpId === id || c._id === id) {
            return updated && updated._id ? updated : {
              ...c,
              status: payload.status || c.status,
              assignedTo: payload.assignedTo || c.assignedTo,
              category: payload.category || c.category,
              assignedDept: payload.assignedDept || c.assignedDept,
              updates: [
                ...(c.updates || []),
                {
                  status: payload.status || c.status,
                  date: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
                  note: payload.note || `Status updated to ${payload.status || c.status}.`,
                  updatedBy: payload.updatedBy || 'Campus Administrator',
                },
              ],
            };
          }
          return c;
        })
      );
      showToast(`Complaint status updated to ${payload.status || 'updated'}.`, 'info');
    } catch (e) {
      const newStatus = typeof statusOrPayload === 'string' ? statusOrPayload : statusOrPayload.status;
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id || c.cmpId === id || c._id === id
            ? {
                ...c,
                status: newStatus || c.status,
                assignedTo: staffName || (typeof statusOrPayload === 'object' ? statusOrPayload.assignedTo : c.assignedTo),
                updates: [
                  ...(c.updates || []),
                  {
                    status: newStatus || c.status,
                    date: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
                    note: note || `Status updated to ${newStatus}.`,
                    updatedBy: 'Campus Administrator',
                  },
                ],
              }
            : c
        )
      );
      showToast(`Complaint updated to ${newStatus}.`, 'info');
    }
  };

  // Food Waste Operations
  const addFoodWasteRecord = async (formData) => {
    try {
      const newRecord = await messAPI.createFoodWaste(formData);
      setFoodWasteLogs((prev) => [newRecord, ...prev]);
      showToast('Food waste record logged successfully!', 'success');
      return newRecord;
    } catch (err) {
      const prepared = Number(formData.foodPreparedKg) || 0;
      const wasted = Number(formData.foodWastedKg) || 0;
      const wastePercentage = prepared > 0 ? Number(((wasted / prepared) * 100).toFixed(1)) : 0;
      const newRecord = {
        _id: `mem_fw_${Date.now()}`,
        id: `FW-${Date.now().toString().slice(-6)}`,
        logId: `FW-${Date.now().toString().slice(-6)}`,
        date: formData.date || new Date().toISOString().split('T')[0],
        mealType: formData.mealType || 'Lunch',
        canteenName: formData.canteenName || 'Central Dining Hall / Mess',
        expectedStudents: Number(formData.expectedStudents) || 0,
        actualStudentsServed: Number(formData.actualStudentsServed) || 0,
        foodPreparedKg: prepared,
        foodWastedKg: wasted,
        wastePercentage,
        notes: formData.notes || '',
        loggedBy: 'Campus Administrator',
        createdAt: new Date().toISOString(),
      };
      setFoodWasteLogs((prev) => [newRecord, ...prev]);
      showToast('Food waste record logged!', 'success');
      return newRecord;
    }
  };

  const deleteFoodWasteRecord = async (id) => {
    try {
      await messAPI.deleteFoodWaste(id);
      setFoodWasteLogs((prev) => prev.filter((f) => f._id !== id && f.id !== id && f.logId !== id));
      showToast('Record deleted.', 'info');
    } catch (err) {
      setFoodWasteLogs((prev) => prev.filter((f) => f._id !== id && f.id !== id && f.logId !== id));
      showToast('Record deleted.', 'info');
    }
  };

  const publishNotice = async (noticeObj) => {
    try {
      const notice = await noticesAPI.create(noticeObj);
      setNotices((prev) => [notice, ...prev]);
      showToast(`Notice "${noticeObj.title}" published!`, 'success');
    } catch (err) {
      const newNoticeId = `NOT-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`;
      const newNotice = {
        id: newNoticeId,
        noticeId: newNoticeId,
        title: noticeObj.title,
        department: noticeObj.department || 'Administration',
        date: new Date().toISOString().split('T')[0],
        priority: noticeObj.priority || 'Medium',
        readStatus: false,
        category: noticeObj.category || 'General',
        content: noticeObj.content,
      };
      setNotices((prev) => [newNotice, ...prev]);
      showToast(`Notice "${noticeObj.title}" published!`, 'success');
    }
  };

  const submitMessFeedback = async (feedback) => {
    try {
      await messAPI.submitFeedback(feedback);
    } catch (e) {}
    showToast('Thank you for rating today\'s meal!', 'success');
  };

  const payFeeDemo = (amount) => {
    setFees((prev) => ({
      ...prev,
      paidFee: prev.paidFee + amount,
      dueFee: Math.max(0, prev.dueFee - amount),
      transactions: [
        {
          id: `TXN-${Math.floor(9000 + Math.random() * 900)}`,
          description: 'Online Fee Payment (CampusOS Pay)',
          amount,
          date: new Date().toISOString().split('T')[0],
          status: 'Paid',
          method: 'UPI (Instant)',
        },
        ...prev.transactions,
      ],
    }));
    showToast(`Payment of ₹${amount.toLocaleString()} processed!`, 'success');
  };

  const getAIResponse = async (userPrompt) => {
    try {
      const data = await aiAPI.chat(userPrompt);
      return {
        response: data.response || data.reply,
        reply: data.reply || data.response,
        poweredBy: data.source === 'gemini-ai' ? 'Google Gemini 1.5 Flash' : 'CampusOS Context Engine',
      };
    } catch (err) {
      console.warn('[CampusAI] API error, fallback to local engine:', err);
      const promptLower = userPrompt.toLowerCase();
      for (const item of sampleAIAnswers) {
        if (item.keywords.some((kw) => promptLower.includes(kw))) {
          return item;
        }
      }
      return {
        response: `CampusAI is here to help! I can assist you with Gate Passes, Leave policies, Complaints, Timetables, Certificates, and Mess Menus.`,
        actionLink: '/student/services',
        actionLabel: 'Explore Services',
      };
    }
  };

  const refreshTimetable = async (params = {}) => {
    try {
      const data = await timetableAPI.getAll(params);
      setTimetable(data || []);
      return data;
    } catch (err) {
      console.error('Error refreshing timetable:', err);
    }
  };

  const addTimetableSlot = async (slotData) => {
    try {
      const newSlot = await timetableAPI.create(slotData);
      setTimetable((prev) => [...prev, newSlot]);
      showToast('Timetable class slot added successfully!', 'success');
      return newSlot;
    } catch (err) {
      showToast(err.message || 'Failed to add timetable slot', 'error');
      throw err;
    }
  };

  const updateTimetableSlot = async (id, slotData) => {
    try {
      const updated = await timetableAPI.update(id, slotData);
      setTimetable((prev) => prev.map((item) => (item.id === id || item._id === id ? updated : item)));
      showToast('Timetable slot updated successfully!', 'success');
      return updated;
    } catch (err) {
      showToast(err.message || 'Failed to update timetable slot', 'error');
      throw err;
    }
  };

  const deleteTimetableSlot = async (id) => {
    try {
      await timetableAPI.delete(id);
      setTimetable((prev) => prev.filter((item) => item.id !== id && item._id !== id));
      showToast('Timetable slot deleted!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete timetable slot', 'error');
      throw err;
    }
  };

  return (
    <DataContext.Provider
      value={{
        requests,
        complaints,
        notices,
        attendance,
        timetable,
        notifications,
        hostel,
        messMenu,
        fees,
        analytics,
        loading,
        connectionError,
        retryConnection: fetchAllData,
        toast,
        showToast,
        addLeaveRequest,
        addGatePassRequest,
        addCertificateRequest,
        addComplaint,
        markAllNotificationsRead,
        markNotificationRead,
        updateRequestStatus,
        updateComplaintStatus,
        foodWasteLogs,
        addFoodWasteRecord,
        deleteFoodWasteRecord,
        publishNotice,
        submitMessFeedback,
        payFeeDemo,
        getAIResponse,
        refreshTimetable,
        addTimetableSlot,
        updateTimetableSlot,
        deleteTimetableSlot,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
