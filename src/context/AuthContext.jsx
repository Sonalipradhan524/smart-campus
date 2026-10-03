import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const defaultStudentUser = {
  _id: 'mem_user_student_1',
  name: 'Rahul Sharma',
  email: 'student@bput.ac.in',
  role: 'student',
  rollNo: '2201105042',
  department: 'Computer Science & Engineering',
  semester: '6th Semester',
  batch: '2022 - 2026',
  cgpa: '8.84',
  hostel: 'Kalpana Chawla Hall (Block B)',
  roomNo: 'B-204',
  phone: '+91 98765 43210',
  guardianPhone: '+91 98765 00112',
  bloodGroup: 'O+',
  address: 'Bhubaneswar, Odisha',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

const defaultTeacherUser = {
  _id: 'mem_user_teacher_1',
  name: 'Prof. Ananya Roy',
  email: 'teacher@bput.ac.in',
  role: 'teacher',
  employeeId: 'FAC-CSE-004',
  designation: 'Associate Professor',
  department: 'Computer Science & Engineering',
  officeRoom: 'Academic Block 2, Room 304',
  phone: '+91 94372 99881',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  assignedClasses: [
    { subject: 'Data Structures & Algorithms', code: 'CSE-301', semester: '6th Semester', section: 'Section A', enrolledCount: 45 },
    { subject: 'Database Management Systems', code: 'CSE-304', semester: '4th Semester', section: 'Section B', enrolledCount: 42 },
    { subject: 'Artificial Intelligence & ML', code: 'CSE-402', semester: '8th Semester', section: 'Section A', enrolledCount: 38 }
  ]
};

const defaultAdminUser = {
  _id: 'mem_user_admin_1',
  name: 'Dr. Arisudan Mohanty',
  email: 'admin@bput.ac.in',
  role: 'admin',
  rollNo: 'ADMIN-001',
  department: 'Campus Administration & Student Affairs',
  semester: 'N/A',
  batch: 'N/A',
  cgpa: 'N/A',
  hostel: 'Admin Residence',
  roomNo: 'A-101',
  phone: '+91 94370 12345',
  guardianPhone: 'N/A',
  bloodGroup: 'A+',
  address: 'BPUT Campus, Rourkela',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('campusos_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('campusos_token') || null;
  });

  const [role, setRole] = useState(() => {
    try {
      const savedUser = localStorage.getItem('campusos_user');
      if (savedUser) {
        return JSON.parse(savedUser).role || null;
      }
    } catch (e) {}
    return null;
  });

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Sync token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('campusos_token', token);
    } else {
      localStorage.removeItem('campusos_token');
    }
  }, [token]);

  // Sync user object
  useEffect(() => {
    if (user) {
      localStorage.setItem('campusos_user', JSON.stringify(user));
      setRole(user.role || 'student');
    } else {
      localStorage.removeItem('campusos_user');
    }
  }, [user]);

  // Role-Specific Real Logins
  const loginStudent = async (identifier, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await authAPI.studentLogin(identifier, password);
      setUser(data.user || data);
      setToken(data.token);
      setRole('student');
      setLoading(false);
      return { success: true, user: data.user || data };
    } catch (err) {
      setLoading(false);
      setAuthError(err.message);
      return { success: false, message: err.message };
    }
  };

  const registerStudent = async (studentData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await authAPI.studentRegister(studentData);
      setUser(data.user || data);
      setToken(data.token);
      setRole('student');
      setLoading(false);
      return { success: true, message: data.message || 'Student registration successful.', user: data.user || data };
    } catch (err) {
      setLoading(false);
      setAuthError(err.message);
      return { success: false, message: err.message };
    }
  };

  const loginTeacher = async (identifier, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await authAPI.teacherLogin(identifier, password);
      setUser(data.user || data);
      setToken(data.token);
      setRole('teacher');
      setLoading(false);
      return { success: true, user: data.user || data };
    } catch (err) {
      setLoading(false);
      setAuthError(err.message);
      return { success: false, message: err.message };
    }
  };

  const registerTeacher = async (teacherData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await authAPI.teacherRegister(teacherData);
      setUser(data.user || data);
      setToken(data.token);
      setRole('teacher');
      setLoading(false);
      return { success: true, message: data.message || 'Faculty registration successful.', user: data.user || data };
    } catch (err) {
      setLoading(false);
      setAuthError(err.message);
      return { success: false, message: err.message };
    }
  };

  const loginAdmin = async (identifier, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await authAPI.adminLogin(identifier, password);
      setUser(data.user || data);
      setToken(data.token);
      setRole('admin');
      setLoading(false);
      return { success: true, user: data.user || data };
    } catch (err) {
      setLoading(false);
      setAuthError(err.message);
      return { success: false, message: err.message };
    }
  };

  const sendForgotPassword = async (email) => {
    setLoading(true);
    try {
      const res = await authAPI.forgotPassword(email);
      setLoading(false);
      return { success: true, message: res.message };
    } catch (err) {
      setLoading(false);
      return { success: false, message: err.message };
    }
  };

  // Legacy/General Login
  const login = async (email, password, selectedRole) => {
    if (selectedRole === 'teacher') return await loginTeacher(email, password);
    if (selectedRole === 'admin') return await loginAdmin(email, password);
    return await loginStudent(email, password);
  };

  // Real Profile Update
  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await authAPI.updateProfile(profileData);
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (err) {
      if (user) {
        const localUpdated = { ...user, ...profileData };
        setUser(localUpdated);
      }
      return { success: true, isOffline: true };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem('campusos_token');
    localStorage.removeItem('campusos_user');
  };

  const switchRole = (newRole) => {
    setRole(newRole);
    let targetUser = defaultStudentUser;
    if (newRole === 'admin') targetUser = defaultAdminUser;
    if (newRole === 'teacher') targetUser = defaultTeacherUser;
    setUser(targetUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: role || (user ? user.role : null),
        token,
        loading,
        authError,
        login,
        loginStudent,
        loginTeacher,
        loginAdmin,
        registerStudent,
        registerTeacher,
        sendForgotPassword,
        updateProfile,
        logout,
        switchRole,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
