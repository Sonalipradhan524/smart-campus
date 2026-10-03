// Centralized Frontend API Service Layer for CampusOS

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const getHeaders = () => {
  const token = localStorage.getItem('campusos_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMsg = 'API Request Failed';
    try {
      const errData = await response.json();
      errorMsg = errData.message || errorMsg;
    } catch (e) {
      errorMsg = response.statusText || errorMsg;
    }
    const error = new Error(errorMsg);
    error.status = response.status;
    throw error;
  }
  return await response.json();
};

export const apiHealthCheck = async () => {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await handleResponse(res);
  } catch (err) {
    return { status: 'error', error: err.message };
  }
};

export const authAPI = {
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await handleResponse(res);
  },
  studentLogin: async (identifier, password) => {
    const res = await fetch(`${API_BASE}/auth/student/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    return await handleResponse(res);
  },
  studentRegister: async (studentData) => {
    const res = await fetch(`${API_BASE}/auth/student/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });
    return await handleResponse(res);
  },
  teacherLogin: async (identifier, password) => {
    const res = await fetch(`${API_BASE}/auth/teacher/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    return await handleResponse(res);
  },
  teacherRegister: async (teacherData) => {
    const res = await fetch(`${API_BASE}/auth/teacher/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teacherData),
    });
    return await handleResponse(res);
  },
  adminLogin: async (identifier, password) => {
    const res = await fetch(`${API_BASE}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    return await handleResponse(res);
  },
  createAdmin: async (adminData) => {
    const res = await fetch(`${API_BASE}/auth/admin/create-admin`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(adminData),
    });
    return await handleResponse(res);
  },
  forgotPassword: async (email) => {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return await handleResponse(res);
  },
  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return await handleResponse(res);
  },
  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    return await handleResponse(res);
  },
  updateProfile: async (profileData) => {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });
    return await handleResponse(res);
  },
};

export const requestsAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/requests`, { headers: getHeaders() });
    return await handleResponse(res);
  },
  create: async (reqData) => {
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reqData),
    });
    return await handleResponse(res);
  },
  updateStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/requests/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return await handleResponse(res);
  },
};

export const complaintsAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/complaints`, { headers: getHeaders() });
    return await handleResponse(res);
  },
  create: async (cmpData) => {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(cmpData),
    });
    return await handleResponse(res);
  },
  updateStatus: async (id, updatePayload, staffName = '', note = '') => {
    const body =
      typeof updatePayload === 'object' && updatePayload !== null
        ? updatePayload
        : { status: updatePayload, assignedTo: staffName, note };
    const res = await fetch(`${API_BASE}/complaints/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return await handleResponse(res);
  },
};

export const noticesAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/notices`, { headers: getHeaders() });
    return await handleResponse(res);
  },
  create: async (noticeData) => {
    const res = await fetch(`${API_BASE}/notices`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(noticeData),
    });
    return await handleResponse(res);
  },
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/notices/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return await handleResponse(res);
  },
};

export const attendanceAPI = {
  get: async () => {
    const res = await fetch(`${API_BASE}/attendance`, { headers: getHeaders() });
    return await handleResponse(res);
  },
  getMy: async () => {
    const res = await fetch(`${API_BASE}/attendance/my`, { headers: getHeaders() });
    return await handleResponse(res);
  },
  getHistory: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_BASE}/attendance/history?${query}` : `${API_BASE}/attendance/history`;
    const res = await fetch(url, { headers: getHeaders() });
    return await handleResponse(res);
  },
  checkDuplicate: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE}/attendance/check-duplicate?${query}`;
    const res = await fetch(url, { headers: getHeaders() });
    return await handleResponse(res);
  },
};

export const timetableAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_BASE}/timetable?${query}` : `${API_BASE}/timetable`;
    const res = await fetch(url, { headers: getHeaders() });
    return await handleResponse(res);
  },
  getById: async (id) => {
    const res = await fetch(`${API_BASE}/timetable/${id}`, { headers: getHeaders() });
    return await handleResponse(res);
  },
  getByBranch: async (branch) => {
    const res = await fetch(`${API_BASE}/timetable/branch/${encodeURIComponent(branch)}`, { headers: getHeaders() });
    return await handleResponse(res);
  },
  getByDay: async (day) => {
    const res = await fetch(`${API_BASE}/timetable/day/${encodeURIComponent(day)}`, { headers: getHeaders() });
    return await handleResponse(res);
  },
  getByTeacher: async (teacher) => {
    const res = await fetch(`${API_BASE}/timetable/teacher/${encodeURIComponent(teacher)}`, { headers: getHeaders() });
    return await handleResponse(res);
  },
  create: async (slotData) => {
    const res = await fetch(`${API_BASE}/timetable`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(slotData),
    });
    return await handleResponse(res);
  },
  update: async (id, slotData) => {
    const res = await fetch(`${API_BASE}/timetable/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(slotData),
    });
    return await handleResponse(res);
  },
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/timetable/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return await handleResponse(res);
  },
};

export const notificationsAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/notifications`, { headers: getHeaders() });
    return await handleResponse(res);
  },
  markRead: async (id) => {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return await handleResponse(res);
  },
};

export const hostelAPI = {
  get: async () => {
    const res = await fetch(`${API_BASE}/hostel`, { headers: getHeaders() });
    return await handleResponse(res);
  },
};

export const messAPI = {
  get: async () => {
    const res = await fetch(`${API_BASE}/mess`, { headers: getHeaders() });
    return await handleResponse(res);
  },
  submitFeedback: async (feedback) => {
    const res = await fetch(`${API_BASE}/mess/feedback`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(feedback),
    });
    return await handleResponse(res);
  },
  getFoodWaste: async () => {
    const res = await fetch(`${API_BASE}/mess/food-waste`, { headers: getHeaders() });
    return await handleResponse(res);
  },
  createFoodWaste: async (data) => {
    const res = await fetch(`${API_BASE}/mess/food-waste`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  },
  deleteFoodWaste: async (id) => {
    const res = await fetch(`${API_BASE}/mess/food-waste/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return await handleResponse(res);
  },
};

export const feesAPI = {
  get: async () => {
    const res = await fetch(`${API_BASE}/fees`, { headers: getHeaders() });
    return await handleResponse(res);
  },
  pay: async (amount, method) => {
    const res = await fetch(`${API_BASE}/fees/pay`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ amount, method }),
    });
    return await handleResponse(res);
  },
};

export const teacherAPI = {
  getDashboard: async () => {
    const res = await fetch(`${API_BASE}/teacher/dashboard`, { headers: getHeaders() });
    return await handleResponse(res);
  },
  getClasses: async () => {
    const res = await fetch(`${API_BASE}/teacher/classes`, { headers: getHeaders() });
    return await handleResponse(res);
  },
  markAttendance: async (sessionData) => {
    const res = await fetch(`${API_BASE}/teacher/attendance`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(sessionData),
    });
    return await handleResponse(res);
  },
  getAttendanceHistory: async () => {
    const res = await fetch(`${API_BASE}/teacher/attendance`, { headers: getHeaders() });
    return await handleResponse(res);
  },
};

export const adminAPI = {
  getDashboard: async () => {
    const res = await fetch(`${API_BASE}/admin/dashboard`, { headers: getHeaders() });
    return await handleResponse(res);
  },
  getAnalytics: async () => {
    const res = await fetch(`${API_BASE}/admin/analytics`, { headers: getHeaders() });
    return await handleResponse(res);
  },
  getStudents: async () => {
    const res = await fetch(`${API_BASE}/admin/students`, { headers: getHeaders() });
    return await handleResponse(res);
  },
  createStudent: async (studentData) => {
    const res = await fetch(`${API_BASE}/admin/students`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(studentData),
    });
    return await handleResponse(res);
  },
  updateStudent: async (id, studentData) => {
    const res = await fetch(`${API_BASE}/admin/students/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(studentData),
    });
    return await handleResponse(res);
  },
  deleteStudent: async (id) => {
    const res = await fetch(`${API_BASE}/admin/students/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return await handleResponse(res);
  },
  getTeachers: async () => {
    const res = await fetch(`${API_BASE}/admin/teachers`, { headers: getHeaders() });
    return await handleResponse(res);
  },
  createTeacher: async (teacherData) => {
    const res = await fetch(`${API_BASE}/admin/teachers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(teacherData),
    });
    return await handleResponse(res);
  },
  updateTeacher: async (id, teacherData) => {
    const res = await fetch(`${API_BASE}/admin/teachers/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(teacherData),
    });
    return await handleResponse(res);
  },
  deleteTeacher: async (id) => {
    const res = await fetch(`${API_BASE}/admin/teachers/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return await handleResponse(res);
  },
};

export const departmentAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/departments`, { headers: getHeaders() });
    return await handleResponse(res);
  },
  create: async (data) => {
    const res = await fetch(`${API_BASE}/departments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  },
  update: async (id, data) => {
    const res = await fetch(`${API_BASE}/departments/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  },
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/departments/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return await handleResponse(res);
  },
};

export const courseAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/courses`, { headers: getHeaders() });
    return await handleResponse(res);
  },
  create: async (data) => {
    const res = await fetch(`${API_BASE}/courses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  },
  update: async (id, data) => {
    const res = await fetch(`${API_BASE}/courses/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  },
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/courses/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return await handleResponse(res);
  },
};

export const subjectAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/subjects`, { headers: getHeaders() });
    return await handleResponse(res);
  },
  create: async (data) => {
    const res = await fetch(`${API_BASE}/subjects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  },
  update: async (id, data) => {
    const res = await fetch(`${API_BASE}/subjects/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  },
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/subjects/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return await handleResponse(res);
  },
};

export const classSectionAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/classes`, { headers: getHeaders() });
    return await handleResponse(res);
  },
  create: async (data) => {
    const res = await fetch(`${API_BASE}/classes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  },
  update: async (id, data) => {
    const res = await fetch(`${API_BASE}/classes/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  },
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/classes/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return await handleResponse(res);
  },
};

export const aiAPI = {
  chat: async (message) => {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ message }),
    });
    return await handleResponse(res);
  },
};

export const auditLogAPI = {
  getLogs: async () => {
    const res = await fetch(`${API_BASE}/audit-logs`, { headers: getHeaders() });
    return await handleResponse(res);
  },
  createLog: async (logData) => {
    const res = await fetch(`${API_BASE}/audit-logs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(logData),
    });
    return await handleResponse(res);
  },
};

