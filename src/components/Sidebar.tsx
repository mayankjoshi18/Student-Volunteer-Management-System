/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  CalendarDays,
  FileBadge,
  Clock,
  History,
  Settings,
  PlusCircle,
  FileSpreadsheet,
  Users,
  Building,
  Activity,
  UserCheck,
  ShieldCheck,
  Award,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
  const { currentUser } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  if (!currentUser) return null;

  const role = currentUser.role;

  const linksByRole = {
    student: [
      { to: '/student', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
      { to: '/student/events', label: 'Browse Events', icon: <CalendarDays className="w-5 h-5" /> },
      { to: '/student/registered', label: 'Registered Events', icon: <UserCheck className="w-5 h-5" /> },
      { to: '/student/hours', label: 'Hours Tracker', icon: <Clock className="w-5 h-5" /> },
      { to: '/student/attendance', label: 'Attendance History', icon: <History className="w-5 h-5" /> },
      { to: '/student/certificates', label: 'Certificates', icon: <Award className="w-5 h-5" /> },
      { to: '/student/profile', label: 'Profile Settings', icon: <Settings className="w-5 h-5" /> },
    ],
    coordinator: [
      { to: '/coordinator', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
      { to: '/coordinator/create-event', label: 'Create Event', icon: <PlusCircle className="w-5 h-5" /> },
      { to: '/coordinator/events', label: 'Manage Events', icon: <CalendarDays className="w-5 h-5" /> },
      { to: '/coordinator/registrations', label: 'Manage Registrations', icon: <Users className="w-5 h-5" /> },
      { to: '/coordinator/attendance', label: 'Attendance', icon: <UserCheck className="w-5 h-5" /> },
      { to: '/coordinator/generate-certificates', label: 'Certificates', icon: <FileBadge className="w-5 h-5" /> },
      { to: '/coordinator/reports', label: 'Reports', icon: <FileSpreadsheet className="w-5 h-5" /> },
    ],
    admin: [
      { to: '/admin', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
      { to: '/admin/users', label: 'User Management', icon: <Users className="w-5 h-5" /> },
      { to: '/admin/coordinators', label: 'Coordinators', icon: <Building className="w-5 h-5" /> },
      { to: '/admin/monitoring', label: 'Event Monitoring', icon: <Activity className="w-5 h-5" /> },
      { to: '/admin/analytics', label: 'Analytics Dashboard', icon: <FileSpreadsheet className="w-5 h-5" /> },
      { to: '/admin/settings', label: 'System Settings', icon: <ShieldCheck className="w-5 h-5" /> },
    ],
  };

  const links = linksByRole[role] || [];

  return (
    <aside
      id="dashboard-sidebar"
      className={`hidden lg:flex flex-col shrink-0 border-r border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 h-[calc(100vh-4rem)] sticky top-16 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header Info / Toggle */}
      <div className="p-4 border-b border-gray-50 dark:border-slate-800/80 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 uppercase tracking-wider">
              {role} Space
            </span>
          </div>
        )}
        <button
          id="sidebar-toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg border border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-500 transition-colors mx-auto lg:mx-0"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav Links */}
      <nav id="sidebar-navigation" className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            id={`sidebar-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
            to={link.to}
            end={link.to === `/${role}`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/15 font-semibold'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-950 dark:hover:text-white'
              }`
            }
          >
            <div className="shrink-0">{link.icon}</div>
            {!collapsed && <span className="truncate">{link.label}</span>}
            {collapsed && (
              <span className="absolute left-16 bg-gray-900 text-white text-xs py-1 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                {link.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Profile Info Summary */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-50 dark:border-slate-800/80 bg-gray-50/30 dark:bg-slate-800/10">
          <div className="flex items-center gap-3">
            <img
              id="sidebar-profile-avatar"
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-slate-700"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{currentUser.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
