import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import { Login } from './pages/auth/Login';
import { StudentLogin } from './pages/auth/StudentLogin';
import { StudentRegister } from './pages/auth/StudentRegister';
import { TeacherLogin } from './pages/auth/TeacherLogin';
import { TeacherRegister } from './pages/auth/TeacherRegister';
import { AdminLogin } from './pages/auth/AdminLogin';
import { ForgotPassword } from './pages/auth/ForgotPassword';

import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { ServicesHub } from './pages/student/ServicesHub';
import { RequestsPage } from './pages/student/RequestsPage';
import { LeaveApplyPage } from './pages/student/LeaveApplyPage';
import { GatePassPage } from './pages/student/GatePassPage';
import { CertificatesPage } from './pages/student/CertificatesPage';
import { HostelPage } from './pages/student/HostelPage';
import { MessPage } from './pages/student/MessPage';
import { ComplaintsPage } from './pages/student/ComplaintsPage';
import { AttendancePage } from './pages/student/AttendancePage';
import { TimetablePage } from './pages/student/TimetablePage';
import { NoticesPage } from './pages/student/NoticesPage';
import { NotificationsPage } from './pages/student/NotificationsPage';
import { FeesPage } from './pages/student/FeesPage';
import { CampusAIAssistant } from './pages/student/CampusAIAssistant';
import { StudentProfilePage } from './pages/student/StudentProfilePage';

// Teacher / Faculty Pages
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { TeacherClassesPage } from './pages/teacher/TeacherClassesPage';
import { TeacherAttendancePage } from './pages/teacher/TeacherAttendancePage';
import { TeacherStudentsPage } from './pages/teacher/TeacherStudentsPage';
import { TeacherTimetablePage } from './pages/teacher/TeacherTimetablePage';
import { TeacherRequestsPage } from './pages/teacher/TeacherRequestsPage';
import { TeacherNoticesPage } from './pages/teacher/TeacherNoticesPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminRequestsPage } from './pages/admin/AdminRequestsPage';
import { AdminComplaintsPage } from './pages/admin/AdminComplaintsPage';
import { AdminStudentsPage } from './pages/admin/AdminStudentsPage';
import { AdminTeachersPage } from './pages/admin/AdminTeachersPage';
import { AdminAttendancePage } from './pages/admin/AdminAttendancePage';
import { AdminTimetablePage } from './pages/admin/AdminTimetablePage';
import { AdminNoticesPage } from './pages/admin/AdminNoticesPage';
import { AdminHostelMessPage } from './pages/admin/AdminHostelMessPage';
import { AdminFeesPage } from './pages/admin/AdminFeesPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/student/register" element={<StudentRegister />} />
            <Route path="/teacher/login" element={<TeacherLogin />} />
            <Route path="/teacher/register" element={<TeacherRegister />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Student Protected Portal */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={['student', 'admin']}>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<StudentDashboard />} />
              <Route path="services" element={<ServicesHub />} />
              <Route path="requests" element={<RequestsPage />} />
              <Route path="leave" element={<LeaveApplyPage />} />
              <Route path="gate-pass" element={<GatePassPage />} />
              <Route path="certificates" element={<CertificatesPage />} />
              <Route path="hostel" element={<HostelPage />} />
              <Route path="mess" element={<MessPage />} />
              <Route path="complaints" element={<ComplaintsPage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="timetable" element={<TimetablePage />} />
              <Route path="notices" element={<NoticesPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="fees" element={<FeesPage />} />
              <Route path="assistant" element={<CampusAIAssistant />} />
              <Route path="profile" element={<StudentProfilePage />} />
            </Route>

            {/* Teacher / Faculty Protected Portal */}
            <Route
              path="/teacher"
              element={
                <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<TeacherDashboard />} />
              <Route path="classes" element={<TeacherClassesPage />} />
              <Route path="attendance" element={<TeacherAttendancePage />} />
              <Route path="students" element={<TeacherStudentsPage />} />
              <Route path="timetable" element={<TeacherTimetablePage />} />
              <Route path="assignments" element={<TeacherClassesPage />} />
              <Route path="requests" element={<TeacherRequestsPage />} />
              <Route path="notices" element={<TeacherNoticesPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<StudentProfilePage />} />
            </Route>

            {/* Admin Protected Portal */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="requests" element={<AdminRequestsPage />} />
              <Route path="complaints" element={<AdminComplaintsPage />} />
              <Route path="students" element={<AdminStudentsPage />} />
              <Route path="teachers" element={<AdminTeachersPage />} />
              <Route path="attendance" element={<AdminAttendancePage />} />
              <Route path="timetable" element={<AdminTimetablePage />} />
              <Route path="notices" element={<AdminNoticesPage />} />
              <Route path="hostel" element={<AdminHostelMessPage />} />
              <Route path="mess" element={<AdminHostelMessPage />} />
              <Route path="fees" element={<AdminFeesPage />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
              <Route path="notifications" element={<AdminNotificationsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/student" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
