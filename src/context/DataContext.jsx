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
];

const DataContext = createContext();


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
  const [messMenu, setMessMenu] = useState({
    todayDay: 'Tuesday',
    breakfast: { title: 'No meal published', time: '' },
    lunch: { title: 'No meal published', time: '' },
    snacks: { title: 'No meal published', time: '' },
    dinner: { title: 'No meal published', time: '' },
    weeklyHighlights: [],
    feedbacks: [],
  });
  const [fees, setFees] = useState({
    totalFee: 0,
    paidFee: 0,
    dueFee: 0,
    dueDate: '-',
    transactions: [],
  });
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
      const [reqData, cmpData, notData, ntfData, attData, ttData, hstData, messData] =
        await Promise.allSettled([
          requestsAPI.getAll(),
          complaintsAPI.getAll(),
          noticesAPI.getAll(),
          notificationsAPI.getAll(),
          attendanceAPI.get(),
          timetableAPI.getAll(),
          hostelAPI.get(),
          messAPI.get(),
        ]);

      if (reqData.status === 'fulfilled') setRequests(reqData.value || []);
      if (cmpData.status === 'fulfilled') setComplaints(cmpData.value || []);
      if (notData.status === 'fulfilled') setNotices(notData.value || []);
      if (ntfData.status === 'fulfilled') setNotifications(ntfData.value || []);
      if (attData.status === 'fulfilled' && attData.value) setAttendance(attData.value);
      if (ttData.status === 'fulfilled') setTimetable(ttData.value || []);
      if (hstData.status === 'fulfilled' && hstData.value) setHostel(hstData.value);
      if (messData.status === 'fulfilled' && messData.value) setMessMenu(messData.value);

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
      const newCmpId = `CMP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      const newCmp = {
        id: newCmpId,
        cmpId: newCmpId,
        title: complaintData.title,
        category: complaintData.category || 'General',
        location: complaintData.location || 'Hostel Block B',
        submittedDate: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        priority: complaintData.priority || 'Medium',
        status: 'Submitted',
        assignedTo: 'AI Maintenance Cell',
        description: complaintData.description,
        aiMetadata: {
          detectedCategory: complaintData.category,
          confidence: '97%',
          detectedPriority: complaintData.priority,
          targetDept: 'Maintenance',
          estimatedResolution: '4 Hours',
        },
        updates: [{ date: 'Just now', note: 'Grievance logged.' }],
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

  const updateComplaintStatus = async (id, newStatus, staffName) => {
    try {
      await complaintsAPI.updateStatus(id, newStatus, staffName);
    } catch (e) {}
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id || c.cmpId === id
          ? { ...c, status: newStatus, assignedTo: staffName || c.assignedTo }
          : c
      )
    );
    showToast(`Complaint updated to ${newStatus}.`, 'info');
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
      return data;
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
        publishNotice,
        submitMessFeedback,
        payFeeDemo,
        getAIResponse,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
