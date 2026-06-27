/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Opportunities from './pages/public/Opportunities';
import EventDetails from './pages/public/EventDetails';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';

// Student Dashboard
import StudentOverview from './pages/student/StudentOverview';
import StudentBrowseEvents from './pages/student/BrowseEvents';
import RegisteredEvents from './pages/student/RegisteredEvents';
import HoursTracker from './pages/student/HoursTracker';
import AttendanceHistory from './pages/student/AttendanceHistory';
import Certificates from './pages/student/Certificates';
import ProfileSettings from './pages/student/ProfileSettings';

// Coordinator Dashboard
import CoordinatorOverview from './pages/coordinator/CoordinatorOverview';
import CreateEvent from './pages/coordinator/CreateEvent';
import ManageEvents from './pages/coordinator/ManageEvents';
import ManageRegistrations from './pages/coordinator/ManageRegistrations';
import AttendanceManagement from './pages/coordinator/AttendanceManagement';
import GenerateCertificates from './pages/coordinator/GenerateCertificates';
import Reports from './pages/coordinator/Reports';

// Admin Dashboard
import AdminOverview from './pages/admin/AdminOverview';
import UserManagement from './pages/admin/UserManagement';
import CoordinatorManagement from './pages/admin/CoordinatorManagement';
import EventMonitoring from './pages/admin/EventMonitoring';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import SystemSettings from './pages/admin/SystemSettings';

// Protected Route Guard
function ProtectedRoute({ allowedRoles }: { allowedRoles: string[] }) {
  const { currentUser, isLoading: loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to={`/${currentUser.role}`} replace />;
  }

  return <Outlet />;
}

// Layout for Public Pages
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Layout for Dashboards (Sidebar + Navbar + Content wrapper)
function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />
      <div className="flex flex-1 relative">
        <Sidebar />
        <main id="dashboard-content-area" className="flex-1 flex flex-col min-h-[calc(100vh-4rem)] max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <ToastContainer />
        <Routes>
          
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/event/:id" element={<EventDetails />} />
          </Route>

          {/* Auth Routes (unprotected layouts) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Student Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/student" element={<StudentOverview />} />
              <Route path="/student/events" element={<StudentBrowseEvents />} />
              <Route path="/student/registered" element={<RegisteredEvents />} />
              <Route path="/student/hours" element={<HoursTracker />} />
              <Route path="/student/attendance" element={<AttendanceHistory />} />
              <Route path="/student/certificates" element={<Certificates />} />
              <Route path="/student/profile" element={<ProfileSettings />} />
            </Route>
          </Route>

          {/* Coordinator Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['coordinator']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/coordinator" element={<CoordinatorOverview />} />
              <Route path="/coordinator/create-event" element={<CreateEvent />} />
              <Route path="/coordinator/events" element={<ManageEvents />} />
              <Route path="/coordinator/registrations" element={<ManageRegistrations />} />
              <Route path="/coordinator/attendance" element={<AttendanceManagement />} />
              <Route path="/coordinator/generate-certificates" element={<GenerateCertificates />} />
              <Route path="/coordinator/reports" element={<Reports />} />
            </Route>
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminOverview />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/coordinators" element={<CoordinatorManagement />} />
              <Route path="/admin/monitoring" element={<EventMonitoring />} />
              <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
              <Route path="/admin/settings" element={<SystemSettings />} />
            </Route>
          </Route>

          {/* Catch All Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    </AppProvider>
  );
}
