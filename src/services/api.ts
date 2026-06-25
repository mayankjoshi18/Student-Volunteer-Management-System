import axios from 'axios';
import { User, Event, Registration, Certificate, SystemConfig, UserRole, RegistrationStatus } from '../types';

const API_URL = 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vms_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors like 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and current user if unauthorized
      localStorage.removeItem('vms_token');
      localStorage.removeItem('vms_current_user');
      // Optional: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth API
  register: async (userData: any) => {
    const res = await apiClient.post('/auth/register', userData);
    return res.data;
  },

  login: async (credentials: { email: string; role: UserRole; password?: string }) => {
    const res = await apiClient.post('/auth/login', credentials);
    return res.data;
  },

  logout: async () => {
    const res = await apiClient.post('/auth/logout');
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await apiClient.post('/auth/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (token: string, password: string) => {
    const res = await apiClient.post('/auth/reset-password', { token, password });
    return res.data;
  },

  // User profile API
  getProfile: async () => {
    const res = await apiClient.get('/users/profile');
    return res.data;
  },

  updateProfile: async (profileData: any) => {
    const res = await apiClient.put('/users/profile', profileData);
    return res.data;
  },

  changePassword: async (passwords: any) => {
    const res = await apiClient.put('/users/change-password', passwords);
    return res.data;
  },

  viewVolunteerHours: async () => {
    const res = await apiClient.get('/users/hours');
    return res.data;
  },

  // Events API
  getEvents: async (filters?: { category?: string; status?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
    }
    const res = await apiClient.get(`/events?${params.toString()}`);
    return res.data.events;
  },

  getEventById: async (id: string) => {
    const res = await apiClient.get(`/events/${id}`);
    return res.data.event;
  },

  createEvent: async (eventData: Omit<Event, 'id' | 'registeredCount' | 'coordinatorId' | 'coordinatorName'>) => {
    const res = await apiClient.post('/events', eventData);
    return res.data.event;
  },

  updateEvent: async (id: string, updatedData: Partial<Event>) => {
    const res = await apiClient.put(`/events/${id}`, updatedData);
    return res.data.event;
  },

  deleteEvent: async (id: string) => {
    const res = await apiClient.delete(`/events/${id}`);
    return res.data;
  },

  // Registrations API
  getRegistrations: async () => {
    const res = await apiClient.get('/registrations');
    return res.data.registrations;
  },

  getRegistrationsByStudent: async (studentId: string) => {
    const res = await apiClient.get(`/registrations/student/${studentId}`);
    return res.data.registrations;
  },

  getRegistrationsByEvent: async (eventId: string) => {
    const res = await apiClient.get(`/registrations/event/${eventId}`);
    return res.data.registrations;
  },

  registerForEvent: async (eventId: string) => {
    const res = await apiClient.post(`/registrations/register/${eventId}`);
    return res.data.registration;
  },

  cancelRegistration: async (registrationId: string) => {
    const res = await apiClient.post(`/registrations/cancel/${registrationId}`);
    return res.data;
  },

  updateRegistrationStatus: async (registrationId: string, status: RegistrationStatus) => {
    const res = await apiClient.put(`/registrations/${registrationId}/status`, { status });
    return res.data.registration;
  },

  // Attendance APIs
  generateEventQRCode: async (eventId: string) => {
    const res = await apiClient.get(`/attendance/generate/${eventId}`);
    return res.data;
  },

  markAttendanceThroughQR: async (eventId: string) => {
    const res = await apiClient.post('/attendance/checkin', { eventId });
    return res.data;
  },

  updateAttendance: async (registrationId: string, attended: boolean, hoursApproved: number, feedback?: string) => {
    const res = await apiClient.put(`/attendance/update/${registrationId}`, {
      attended,
      hoursApproved,
      feedback,
    });
    return res.data.registration;
  },

  attendanceReports: async (eventId: string) => {
    const res = await apiClient.get(`/attendance/reports/${eventId}`);
    return res.data;
  },

  // Volunteer Hours APIs
  getStudentAnalytics: async (studentId: string) => {
    const res = await apiClient.get(`/hours/report/student/${studentId}`);
    return res.data.analytics;
  },

  recalculateHours: async (studentId: string) => {
    const res = await apiClient.post(`/hours/recalculate/${studentId}`);
    return res.data;
  },

  // Certificate APIs
  generateCertificate: async (studentId: string, eventId: string) => {
    const res = await apiClient.post('/certificates/generate', { studentId, eventId });
    return res.data.certificate;
  },

  getCertificates: async () => {
    const res = await apiClient.get('/certificates');
    return res.data.certificates;
  },

  getCertificatesByStudent: async (studentId: string) => {
    const res = await apiClient.get(`/certificates/student/${studentId}`);
    return res.data.certificates;
  },

  verifyCertificate: async (code: string) => {
    const res = await apiClient.get(`/certificates/verify/${code}`);
    return res.data;
  },

  getDownloadUrl: (id: string) => {
    return `${API_URL}/certificates/download/${id}`;
  },

  // Admin APIs
  getUsersList: async () => {
    const res = await apiClient.get('/admin/users');
    return res.data.users;
  },

  updateUserRole: async (userId: string, role: UserRole) => {
    const res = await apiClient.put(`/admin/users/${userId}/role`, { role });
    return res.data.user;
  },

  deleteUser: async (userId: string) => {
    const res = await apiClient.delete(`/admin/users/${userId}`);
    return res.data;
  },

  getAdminAnalytics: async () => {
    const res = await apiClient.get('/admin/analytics');
    return res.data;
  },

  getSystemConfig: async () => {
    const res = await apiClient.get('/admin/config');
    return res.data.config;
  },

  updateSystemConfig: async (configData: Partial<SystemConfig>) => {
    const res = await apiClient.put('/admin/config', configData);
    return res.data.config;
  },

  resetDatabase: async () => {
    // Calling backend DB seed trigger (we can hook this route up)
    const res = await apiClient.post('/admin/reset-db');
    return res.data;
  },
};
