/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockApi } from '../../services/mockApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FileDown, FileBarChart, PieChart, TrendingUp, RefreshCw, Layers } from 'lucide-react';

export default function Reports() {
  const { addToast } = useApp();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadReportStats = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getCoordinatorAnalytics();
      setStats(data);
    } catch (err) {
      addToast('error', 'Sync Failed', 'Could not sync reports metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportStats();
  }, []);

  const handleExport = (type: string) => {
    addToast('success', 'Report Exported', `Institutional ${type} data exported to spreadsheet format.`);
  };

  if (loading || !stats) {
    return (
      <div className="flex-1 p-8 text-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-gray-500 font-semibold font-sans">Compiling reports...</p>
      </div>
    );
  }

  // Prep sector contribution data
  const sectorData = [
    { name: 'Environment', hours: 45, students: 28 },
    { name: 'Education', hours: 62, students: 34 },
    { name: 'Health', hours: 38, students: 19 },
    { name: 'Community', hours: 55, students: 25 },
    { name: 'Relief', hours: 24, students: 12 },
  ];

  return (
    <div id="coordinator-reports" className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
      
      {/* Header */}
      <div className="flex justify-between items-start gap-4 flex-col sm:flex-row">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight leading-none flex items-center gap-2">
            <FileBarChart className="w-6 h-6 text-blue-500" />
            Institutional Reports & Auditing
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Audit campus community-service statistics, export CSV registries, and inspect volunteer engagement trends.
          </p>
        </div>
        <div className="flex items-center gap-2 font-sans shrink-0">
          <button
            id="export-csv-btn"
            onClick={() => handleExport('CSV')}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 transition-colors shadow-sm cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-emerald-500" /> Export CSV
          </button>
          <button
            id="refresh-reports-btn"
            onClick={loadReportStats}
            className="p-2 border border-gray-100 dark:border-slate-850 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-gray-500"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row Metrics summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Service Hours Audited</p>
            <h3 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white">224 Hours</h3>
            <p className="text-[10px] text-emerald-500 font-bold mt-1">✓ Logged & Authenticated</p>
          </div>
          <div className="w-11 h-11 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl flex items-center justify-center shrink-0 text-emerald-500">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Average Roster Attendance</p>
            <h3 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white">84.2%</h3>
            <p className="text-[10px] text-blue-500 font-bold mt-1">Across all departments</p>
          </div>
          <div className="w-11 h-11 bg-blue-50 dark:bg-blue-950/20 rounded-xl flex items-center justify-center shrink-0 text-blue-500">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Issued Security Credentials</p>
            <h3 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white">18 Certificates</h3>
            <p className="text-[10px] text-indigo-500 font-bold mt-1">Secured by SEC signature</p>
          </div>
          <div className="w-11 h-11 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl flex items-center justify-center shrink-0 text-indigo-500">
            <PieChart className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recharts chart representation */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-gray-950 dark:text-white">Participation by Social Sector</h3>
          <p className="text-xs text-gray-400 mt-1">Auditing total hours verified and distinct student enrollments per sector.</p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectorData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:hidden" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="hours" fill="#3b82f6" name="Total Hours verified" radius={[4, 4, 0, 0]} maxBarSize={35} />
              <Bar dataKey="students" fill="#10b981" name="Volunteers registered" radius={[4, 4, 0, 0]} maxBarSize={35} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
