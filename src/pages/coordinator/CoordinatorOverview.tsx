/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockApi } from '../../services/mockApi';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Calendar, Users, ClipboardCheck, Sparkles, ArrowRight, ShieldAlert, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CoordinatorOverview() {
  const { currentUser, addToast } = useApp();
  const [stats, setStats] = useState<any>(null);
  const [pendingRegs, setPendingRegs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getCoordinatorAnalytics();
      setStats(data);

      const regs = await mockApi.getRegistrations();
      setPendingRegs(regs.filter(r => r.status === 'pending').slice(0, 3));
    } catch (err) {
      addToast('error', 'Sync Failed', 'Could not sync coordinator analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [currentUser]);

  const handleApproveRegistration = async (id: string, studentName: string) => {
    try {
      await mockApi.updateRegistrationStatus(id, 'approved');
      addToast('success', 'Registration Approved', `Approved ${studentName} for the event roster.`);
      fetchStats();
    } catch (err) {
      addToast('error', 'Action Failed', 'Could not approve registration.');
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex-1 p-8 text-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-gray-500 font-semibold">Compiling coordinator analytics...</p>
      </div>
    );
  }

  return (
    <div id="coordinator-overview" className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto bg-slate-50 dark:bg-slate-950">
      
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight leading-none flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Coordinator Workspace
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 font-sans">
            Oversee active events, approve student logs, and organize upcoming campaigns.
          </p>
        </div>
        <Link
          id="coordinator-create-cta"
          to="/coordinator/create-event"
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/15 cursor-pointer text-center active:scale-[0.98] transition-all"
        >
          Publish New Event
        </Link>
      </div>

      {/* Stats Cards (Bento Grid Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
        
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Campaigns</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-gray-950 dark:text-white">{stats.activeEventsCount} Events</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">Currently live on campus</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sign-ups</span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl">
              <Users className="w-5 h-5 text-indigo-500" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-gray-950 dark:text-white">{stats.totalRegistrationsCount} Logs</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">Accumulated participants</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Rosters</span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded-xl">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-amber-500">{stats.pendingRegsCount} Requests</h3>
            <p className="text-[11px] text-amber-500 font-bold mt-1">Requires immediate check</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Capacity Slots</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl">
              <ClipboardCheck className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-gray-950 dark:text-white">{stats.totalSlots} Seats</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">Available across openings</p>
          </div>
        </div>

      </div>

      {/* Row Chart & Action list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Participation Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 space-y-4">
          <div>
            <h3 className="font-extrabold text-gray-950 dark:text-white text-sm">Volunteer Intake Metrics</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">SaaS timeline representing monthly registrations vs active participants.</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.participationTrend}>
                <defs>
                  <linearGradient id="colorRegs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:hidden" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="registrations" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRegs)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending approvals side section */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-gray-950 dark:text-white text-sm">Action Required ({stats.pendingRegsCount})</h3>
            <Link to="/coordinator/registrations" className="text-xs text-blue-600 hover:underline dark:text-blue-400 font-bold">
              View All
            </Link>
          </div>

          {pendingRegs.length > 0 ? (
            <div className="space-y-3 font-sans">
              {pendingRegs.map((r) => (
                <div key={r.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col gap-2 text-xs">
                  <div>
                    <h4 className="font-bold text-gray-950 dark:text-white truncate">{r.studentName}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">For: {r.eventTitle}</p>
                  </div>
                  <div className="flex justify-end gap-1.5 pt-1">
                    <button
                      id={`coord-approve-reg-${r.id}`}
                      onClick={() => handleApproveRegistration(r.id, r.studentName)}
                      className="p-1 rounded bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm cursor-pointer transition-colors"
                      title="Approve"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <Link
                      id={`coord-view-reg-${r.id}`}
                      to="/coordinator/registrations"
                      className="px-2.5 py-1 bg-white border border-slate-200 text-gray-600 rounded font-bold hover:bg-slate-100"
                      style={{ fontSize: '10px' }}
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center text-xs text-slate-400">
              No pending registrations. Your event rosters are currently fully verified.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
