import { User, Event, Registration, Certificate, SystemConfig, UserRole, RegistrationStatus } from '../types';
import { api } from './api';

export const mockApi = {
  // Authentication
  login: async (email: string, role: UserRole): Promise<User> => {
    // Defaults password to password123 as supported by seeder presets
    const data = await api.login({ email, role, password: 'password123' });
    return data.user;
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('vms_current_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem('vms_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vms_current_user');
      localStorage.removeItem('vms_token');
    }
  },

  logout: async (): Promise<boolean> => {
    try {
      await api.logout();
    } catch (e) {
      console.warn('Backend logout failed/skipped:', e);
    } finally {
      localStorage.removeItem('vms_current_user');
      localStorage.removeItem('vms_token');
    }
    return true;
  },

  signup: async (name: string, email: string, role: UserRole, department: string, studentId?: string): Promise<User> => {
    const data = await api.register({
      name,
      email,
      role,
      department,
      studentId,
      password: 'password123', // default preset password
    });
    return data.user;
  },

  // Events API
  getEvents: async (filters?: { category?: string; status?: string; search?: string }): Promise<Event[]> => {
    return await api.getEvents(filters);
  },

  getEventById: async (id: string): Promise<Event | undefined> => {
    return await api.getEventById(id);
  },

  createEvent: async (eventData: Omit<Event, 'id' | 'registeredCount' | 'coordinatorId' | 'coordinatorName'>): Promise<Event> => {
    return await api.createEvent(eventData);
  },

  updateEvent: async (id: string, updatedData: Partial<Event>): Promise<Event> => {
    return await api.updateEvent(id, updatedData);
  },

  deleteEvent: async (id: string): Promise<boolean> => {
    await api.deleteEvent(id);
    return true;
  },

  // Registrations API
  getRegistrations: async (): Promise<Registration[]> => {
    return await api.getRegistrations();
  },

  getRegistrationsByStudent: async (studentId: string): Promise<Registration[]> => {
    return await api.getRegistrationsByStudent(studentId);
  },

  getRegistrationsByEvent: async (eventId: string): Promise<Registration[]> => {
    return await api.getRegistrationsByEvent(eventId);
  },

  registerForEvent: async (eventId: string): Promise<Registration> => {
    return await api.registerForEvent(eventId);
  },

  cancelRegistration: async (registrationId: string): Promise<boolean> => {
    await api.cancelRegistration(registrationId);
    return true;
  },

  updateRegistrationStatus: async (registrationId: string, status: RegistrationStatus): Promise<Registration> => {
    return await api.updateRegistrationStatus(registrationId, status);
  },

  updateAttendance: async (registrationId: string, attended: boolean, hoursApproved: number, feedback?: string): Promise<Registration> => {
    return await api.updateAttendance(registrationId, attended, hoursApproved, feedback);
  },

  // Certificates API
  getCertificates: async (): Promise<Certificate[]> => {
    return await api.getCertificates();
  },

  getCertificatesByStudent: async (studentId: string): Promise<Certificate[]> => {
    return await api.getCertificatesByStudent(studentId);
  },

  getCertificateByCode: async (code: string): Promise<Certificate | undefined> => {
    try {
      const res = await api.verifyCertificate(code);
      return res.certificate;
    } catch (err) {
      console.warn('Certificate code verify failed:', err);
      return undefined;
    }
  },

  issueCertificate: async (eventId: string, studentId: string): Promise<Certificate> => {
    return await api.generateCertificate(studentId, eventId);
  },

  // Leaderboard
  getLeaderboard: async (): Promise<User[]> => {
    try {
      const users = await api.getUsersList();
      const students = users.filter((u: User) => u.role === 'student');
      const sorted = [...students].sort((a, b) => b.hoursLogged - a.hoursLogged);
      return sorted.map((student, idx) => ({
        ...student,
        rank: idx + 1,
      }));
    } catch (err) {
      console.error('Failed to get live leaderboard, returning empty:', err);
      return [];
    }
  },

  // System Configuration
  getSystemConfig: async (): Promise<SystemConfig> => {
    return await api.getSystemConfig();
  },

  updateSystemConfig: async (configData: Partial<SystemConfig>): Promise<SystemConfig> => {
    return await api.updateSystemConfig(configData);
  },

  // Users List API (Admins / Coordinators)
  getUsersList: async (): Promise<User[]> => {
    return await api.getUsersList();
  },

  updateUserRole: async (userId: string, role: UserRole): Promise<User> => {
    return await api.updateUserRole(userId, role);
  },

  deleteUser: async (userId: string): Promise<boolean> => {
    await api.deleteUser(userId);
    return true;
  },

  // Analytics Helpers
  getStudentAnalytics: async (studentId: string) => {
    return await api.getStudentAnalytics(studentId);
  },

  getCoordinatorAnalytics: async () => {
    try {
      const events = await api.getEvents();
      const regs = await api.getRegistrations();

      const activeEventsCount = events.filter((e: any) => e.status === 'upcoming' || e.status === 'ongoing').length;
      const completedEventsCount = events.filter((e: any) => e.status === 'completed').length;
      const totalSlots = events.reduce((acc: number, e: any) => acc + e.slots, 0);
      const totalRegistrationsCount = regs.length;
      const pendingRegsCount = regs.filter((r: any) => r.status === 'pending').length;

      const participationTrend = [
        { name: 'Jan', volunteers: 15, registrations: 20 },
        { name: 'Feb', volunteers: 24, registrations: 32 },
        { name: 'Mar', volunteers: 45, registrations: 55 },
        { name: 'Apr', volunteers: 62, registrations: 78 },
        { name: 'May', volunteers: 88, registrations: 110 },
        { name: 'Jun', volunteers: 95, registrations: 125 },
      ];

      const categoryStats = events.reduce((acc: any, e: any) => {
        const idx = acc.findIndex((item: any) => item.category === e.category);
        if (idx !== -1) {
          acc[idx].events += 1;
          acc[idx].slots += e.slots;
          acc[idx].registered += e.registeredCount;
        } else {
          acc.push({ category: e.category, events: 1, slots: e.slots, registered: e.registeredCount });
        }
        return acc;
      }, []);

      return {
        activeEventsCount,
        completedEventsCount,
        totalSlots,
        totalRegistrationsCount,
        pendingRegsCount,
        participationTrend,
        categoryStats,
      };
    } catch (err) {
      console.error('Coordinator analytics fetch error:', err);
      return {
        activeEventsCount: 0,
        completedEventsCount: 0,
        totalSlots: 0,
        totalRegistrationsCount: 0,
        pendingRegsCount: 0,
        participationTrend: [],
        categoryStats: [],
      };
    }
  },

  getAdminAnalytics: async () => {
    return await api.getAdminAnalytics();
  },

  getUsers: async (): Promise<User[]> => {
    return await api.getUsersList();
  },

  resetDatabase: async () => {
    await api.resetDatabase();
  },

  generateCertificate: async (studentId: string, eventId: string, eventTitle: string, issuedBy: string): Promise<Certificate> => {
    return await api.generateCertificate(studentId, eventId);
  },
};
