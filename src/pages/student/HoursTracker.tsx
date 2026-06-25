/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockApi } from '../../services/mockApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Clock, TrendingUp, Award, Zap, HelpCircle } from 'lucide-react';

export default function HoursTracker() {
  const { currentUser, addToast } = useApp();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const stats = await mockApi.getStudentAnalytics(currentUser.id);
        setAnalytics(stats);
      } catch (err) {
        addToast('error', 'Error Syncing Analytics', 'Could not sync volunteer logs.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [currentUser]);

  if (loading || !analytics) {
    return (
      <div className="flex-1 p-8 text-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-gray-500 font-semibold">Analyzing volunteer logs...</p>
      </div>
    );
  }

  return (
    <div id="student-hours-tracker" className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight leading-none">
          Hours Tracker & Milestones
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Visualize your social service contributions, track your points growth, and review academic service trends.
        </p>
      </div>

      {/* Row Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans">
        {/* Stat 1 */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 rounded-2xl">
            <Clock className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Service Hours</p>
            <h3 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white">{analytics.totalHours} Hrs</h3>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 rounded-2xl">
            <Zap className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Accumulated Points</p>
            <h3 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white">{currentUser?.points} PTS</h3>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 rounded-2xl">
            <Award className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Academic Leaderboard Rank</p>
            <h3 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white">Rank #{currentUser?.rank || '4'}</h3>
          </div>
        </div>
      </div>

      {/* Recharts Bar Chart */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-gray-950 dark:text-white text-base">Monthly Hour Accumulation</h3>
          <p className="text-xs text-gray-400 mt-1">SaaS metrics representing logged academic community service hours per month.</p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:hidden" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} formatter={(v) => [`${v} Hours`, 'Logged']} />
              <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={45} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rewards Milestones Panel */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
        <h3 className="font-bold text-gray-950 dark:text-white flex items-center gap-1.5 text-base">
          <Award className="w-5 h-5 text-amber-500" />
          Eligible Award Badges
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
          
          <div className={`p-4 rounded-2xl border flex items-start gap-4 ${
            analytics.totalHours >= 5
              ? 'bg-emerald-50/40 border-emerald-100 text-emerald-950 dark:bg-emerald-950/15 dark:border-emerald-900/50 dark:text-emerald-300'
              : 'bg-gray-50/50 border-gray-100 text-gray-500 opacity-60'
          }`}>
            <Award className="w-10 h-10 text-emerald-500 shrink-0" />
            <div className="space-y-1">
              <p className="font-bold text-xs">Rookie Volunteer Badge</p>
              <p className="text-[10px] text-gray-400">Awarded for logging 5 service hours. {analytics.totalHours >= 5 ? 'Unlocked!' : 'Locked'}</p>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border flex items-start gap-4 ${
            analytics.totalHours >= 15
              ? 'bg-emerald-50/40 border-emerald-100 text-emerald-950 dark:bg-emerald-950/15 dark:border-emerald-900/50 dark:text-emerald-300'
              : 'bg-gray-50/50 border-gray-100 text-gray-500 opacity-60'
          }`}>
            <Award className="w-10 h-10 text-blue-500 shrink-0" />
            <div className="space-y-1">
              <p className="font-bold text-xs">Community Champion Shield</p>
              <p className="text-[10px] text-gray-400">Awarded for logging 15 service hours. {analytics.totalHours >= 15 ? 'Unlocked!' : 'Locked'}</p>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border flex items-start gap-4 ${
            analytics.totalHours >= 30
              ? 'bg-emerald-50/40 border-emerald-100 text-emerald-950 dark:bg-emerald-950/15 dark:border-emerald-900/50 dark:text-emerald-300'
              : 'bg-gray-50/50 border-gray-100 text-gray-500 opacity-60'
          }`}>
            <Award className="w-10 h-10 text-amber-500 shrink-0" />
            <div className="space-y-1">
              <p className="font-bold text-xs">ASU Social Ambassador Crest</p>
              <p className="text-[10px] text-gray-400">Awarded for logging 30 service hours. {analytics.totalHours >= 30 ? 'Unlocked!' : 'Locked'}</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
