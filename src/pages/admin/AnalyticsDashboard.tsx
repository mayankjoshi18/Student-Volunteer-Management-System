/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockApi } from '../../services/mockApi';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { FileChartLine, Award, Users, TrendingUp, RefreshCw, Star } from 'lucide-react';

export default function AnalyticsDashboard() {
  const { addToast } = useApp();
  const [loading, setLoading] = useState(true);

  // Seed analytics data
  const sectorShare = [
    { name: 'Environment', hours: 45, students: 28 },
    { name: 'Education', hours: 62, students: 34 },
    { name: 'Health', hours: 38, students: 19 },
    { name: 'Community', hours: 55, students: 25 },
    { name: 'Relief', hours: 24, students: 12 },
  ];

  const registrationActivity = [
    { name: 'Mon', 'Hour requests': 10, Signups: 15 },
    { name: 'Tue', 'Hour requests': 18, Signups: 22 },
    { name: 'Wed', 'Hour requests': 25, Signups: 30 },
    { name: 'Thu', 'Hour requests': 35, Signups: 28 },
    { name: 'Fri', 'Hour requests': 42, Signups: 45 },
    { name: 'Sat', 'Hour requests': 55, Signups: 50 },
    { name: 'Sun', 'Hour requests': 68, Signups: 58 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    addToast('success', 'Data Synchronized', 'Retrieved latest transactional metrics from SEC ledger.');
    setTimeout(() => setLoading(false), 400);
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 text-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-gray-500 font-semibold font-sans font-sans">Compiling visual analytics...</p>
      </div>
    );
  }

  return (
    <div id="admin-analytics" className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight leading-none flex items-center gap-2">
            <FileChartLine className="w-6 h-6 text-blue-500" />
            Global Performance Audit
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Inspect platform activity timelines, evaluate active engagement metrics, and trace SEC certified output.
          </p>
        </div>
        <button
          id="refresh-analytics-btn"
          onClick={handleRefresh}
          className="p-2 border border-gray-100 dark:border-slate-850 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-gray-500"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans">
        
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active campus users</p>
            <h3 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white">112 Accounts</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-2xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Platform Retention Ratio</p>
            <h3 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white">92.4%</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-2xl">
            <Star className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Certified Hours Ledger</p>
            <h3 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white">224 Hours</h3>
          </div>
        </div>

      </div>

      {/* Double Column recharts graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Sector share bar chart */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-bold text-gray-950 dark:text-white text-sm">Sector Performance breakdown</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorShare}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:hidden" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="hours" fill="#3b82f6" name="Hours certified" radius={[4, 4, 0, 0]} />
                <Bar dataKey="students" fill="#10b981" name="Volunteers registered" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly activity timeline linechart */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-bold text-gray-950 dark:text-white text-sm">Weekly Activity velocity</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={registrationActivity}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:hidden" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Hour requests" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Signups" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
