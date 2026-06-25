/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'student' | 'coordinator' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  studentId?: string;
  hoursLogged: number;
  points: number;
  rank?: number;
  avatar?: string;
  bio?: string;
  joinDate?: string;
}

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type EventCategory = 'education' | 'environment' | 'health' | 'community' | 'disaster-relief';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  coordinatorId: string;
  coordinatorName: string;
  slots: number;
  registeredCount: number;
  status: EventStatus;
  hours: number;
  category: EventCategory;
  image: string;
}

export type RegistrationStatus = 'pending' | 'approved' | 'declined';

export interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentDepartment?: string;
  status: RegistrationStatus;
  registeredAt: string;
  attended: boolean;
  hoursApproved: number;
  feedback?: string;
}

export interface Certificate {
  id: string;
  eventId: string;
  eventTitle: string;
  studentId: string;
  studentName: string;
  issuedAt: string;
  issuedBy: string;
  certificateCode: string;
  hoursApproved?: number;
}

export interface SystemConfig {
  universityName: string;
  allowSelfRegistration: boolean;
  autoApproveHours: boolean;
  maxEventsPerStudent: number;
  academicYear: string;
  maintenanceMode: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
}
