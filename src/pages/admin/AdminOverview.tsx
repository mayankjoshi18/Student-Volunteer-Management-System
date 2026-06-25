/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockApi } from '../../services/mockApi';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, Server, ShieldCheck, RefreshCw, HardDrive, Cpu, Layers, Star } from 'lucide-react';

export default function AdminOverview() {
  const { addToast } = useApp();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  const loadAdminStats = async () => {
    setLoading(true);
    try {
      const allUsers = await mockApi.getUsers();
      const allEvents = await mockApi.getEvents();
      const allRegs = await mockApi.getRegistrations();
      const certs = await mockApi.getCertificates();

      const students = allUsers.filter(u => u.role === 'student');
      const coords = allUsers.filter(u => u.role === 'coordinator');

      const totalHours = certs.reduce((acc, curr) => acc + (curr.hoursApproved || 4), 0);

      // Seed stats
      setStats({
        usersCount: allUsers.length,
        studentsCount: students.length,
        coordsCount: coords.length,
        eventsCount: allEvents.length,
        regsCount: allRegs.length,
        certsCount: certs.length,
        totalCertifiedHours: totalHours + 24, // baseline
        registrationTimeline: [
          { name: 'Mon', signups: 14, active: 10 },
          { name: 'Tue', signups: 22, active: 18 },
          { name: 'Wed', signups: 35, active: 28 },
          { name: 'Thu', signups: 42, active: 31 },
          { name: 'Fri', signups: 64, active: 48 },
          { name: 'Sat', signups: 72, active: 55 },
          { name: 'Sun', signups: 88, active: 65 },
        ]
      });
    } catch (err) {
      addToast('error', 'Sync Failed', 'Could not sync administrative metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex-1 p-8 text-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-gray-500 font-semibold font-sans">Compiling administrative logs...</p>
      </div>
    );
  }

  return (
    <div id="admin-overview" className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto bg-slate-50 dark:bg-slate-950">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight leading-none flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-500" />
            Administrative Overview
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-sans mt-1">
            System control console. Monitor registrations, inspect active coordinator verification queues, and audit server runtimes.
          </p>
        </div>
        <button
          id="refresh-admin-btn"
          onClick={loadAdminStats}
          className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-gray-500 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Row Stats (Bento Grid Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
        
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registered Accounts</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-gray-950 dark:text-white">{stats.usersCount} Users</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">{stats.studentsCount} students • {stats.coordsCount} coords</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Published Campaigns</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-gray-950 dark:text-white">{stats.eventsCount} Drives</h3>
            <p className="text-[11px] text-emerald-500 font-semibold mt-1">Active across all sectors</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">SEC Roster Sign-ups</span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-gray-950 dark:text-white">{stats.regsCount} Logs</h3>
            <p className="text-[11px] text-blue-500 font-semibold mt-1">Processed database logs</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified Service Hours</span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-gray-950 dark:text-white">{stats.totalCertifiedHours} Hours</h3>
            <p className="text-[11px] text-amber-500 font-semibold mt-1">Official academic certification</p>
          </div>
        </div>

      </div>

      {/* Grid for System Monitor Logs & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Site Trends linechart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 space-y-4">
          <div>
            <h3 className="font-extrabold text-gray-950 dark:text-white text-sm">Active Users Signup Timeline</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Timeline reflecting volunteer engagement velocity this week.</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.registrationTimeline}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:hidden" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="signups" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Total Sign-ups" />
                <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Active Volunteers" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Server metrics side monitor */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 space-y-6 font-sans">
          <div>
            <h3 className="font-extrabold text-gray-950 dark:text-white text-sm">Live System Integrity</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Real-time mock server vitals and database connections state.</p>
          </div>

          <div className="space-y-4">
            {/* Vital 1 */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-5 h-5 text-blue-500" />
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Server CPU load</div>
              </div>
              <span className="text-xs font-black text-gray-900 dark:text-white">12.4%</span>
            </div>

            {/* Vital 2 */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850">
              <div className="flex items-center gap-2.5">
                <HardDrive className="w-5 h-5 text-indigo-500" />
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Database Space</div>
              </div>
              <span className="text-xs font-black text-gray-900 dark:text-white font-mono">0.42 / 10 GB</span>
            </div>

            {/* Vital 3 */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850">
              <div className="flex items-center gap-2.5">
                <Server className="w-5 h-5 text-emerald-500 animate-pulse" />
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">API Proxy status</div>
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/20 px-2.5 py-0.5 rounded-md uppercase tracking-wider">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
