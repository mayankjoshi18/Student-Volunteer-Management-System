/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockApi } from '../../services/mockApi';
import { Registration } from '../../types';
import { ClipboardCheck, CheckCircle2, XCircle, Save, RefreshCw } from 'lucide-react';

export default function AttendanceManagement() {
  const { addToast } = useApp();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states mapping registration ID to present/hours values
  const [presentMap, setPresentMap] = useState<Record<string, boolean>>({});
  const [hoursMap, setHoursMap] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchApprovedRegistrations = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getRegistrations();
      // Filter for approved student registration logs
      const approvedOnly = data.filter((r) => r.status === 'approved');
      setRegistrations(approvedOnly);

      // Seed mapping states
      const initialPresents: Record<string, boolean> = {};
      const initialHours: Record<string, number> = {};
      approvedOnly.forEach((r) => {
        initialPresents[r.id] = r.attended;
        initialHours[r.id] = r.hoursApproved || 4; // default pre-filled
      });
      setPresentMap(initialPresents);
      setHoursMap(initialHours);
    } catch (err) {
      addToast('error', 'Sync Failed', 'Could not sync attendance database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedRegistrations();
  }, []);

  const handleTogglePresent = (id: string) => {
    setPresentMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleHoursChange = (id: string, val: string) => {
    const hoursNum = Number(val) || 0;
    setHoursMap((prev) => ({ ...prev, [id]: hoursNum }));
  };

  const handleSaveAttendance = async (reg: Registration) => {
    setSavingId(reg.id);
    const isPresent = presentMap[reg.id] || false;
    const hoursApp = hoursMap[reg.id] || 0;

    try {
      await mockApi.updateAttendance(reg.id, isPresent, hoursApp, reg.feedback || '');
      addToast(
        'success',
        'Attendance Saved',
        `Updated attendance logs for ${reg.studentName} (+${hoursApp} hours logged).`
      );
      fetchApprovedRegistrations();
    } catch (err: any) {
      addToast('error', 'Action Failed', err.message || 'Could not save attendance log.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div id="coordinator-attendance" className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight leading-none flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-blue-500" />
            Attendance & Service Hours Log
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Confirm student participation, mark presence status, and approve certified credit hours for finished events.
          </p>
        </div>
        <button
          id="refresh-attendance-btn"
          onClick={fetchApprovedRegistrations}
          className="p-2 border border-gray-100 dark:border-slate-850 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-gray-500"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500 font-semibold font-sans">Updating attendance rosters...</p>
        </div>
      ) : registrations.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl max-w-md mx-auto text-xs text-gray-400">
          No approved registrations are available to mark attendance. Use the registrations board first.
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              
              <thead className="bg-gray-50 dark:bg-slate-800 text-gray-400 font-extrabold uppercase border-b border-gray-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Student Volunteer</th>
                  <th className="px-6 py-4">Campaign Event Project</th>
                  <th className="px-6 py-4">Mark Attendance</th>
                  <th className="px-6 py-4">Credit Hours Approved</th>
                  <th className="px-6 py-4">Roster Logs</th>
                  <th className="px-6 py-4 text-right">Commit Changes</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 bg-white dark:bg-slate-900 font-medium text-gray-700 dark:text-gray-200">
                {registrations.map((r) => {
                  const isPresent = presentMap[r.id] || false;
                  const hoursApp = hoursMap[r.id] || 0;
                  const isSaving = savingId === r.id;

                  return (
                    <tr key={r.id} id={`attendance-row-${r.id}`} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-all">
                      
                      {/* Student details */}
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-gray-950 dark:text-white">{r.studentName}</p>
                          <p className="text-[10px] text-gray-400 font-semibold">ID: {r.studentId} • {r.department}</p>
                        </div>
                      </td>

                      {/* Event project */}
                      <td className="px-6 py-4 max-w-xs truncate font-bold text-gray-900 dark:text-white">
                        {r.eventTitle}
                      </td>

                      {/* Attendance checkbox check */}
                      <td className="px-6 py-4">
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            id={`attendance-checkbox-${r.id}`}
                            type="checkbox"
                            checked={isPresent}
                            onChange={() => handleTogglePresent(r.id)}
                            className="w-4.5 h-4.5 rounded text-blue-600 border-gray-300 dark:border-slate-700 focus:ring-blue-500/20"
                          />
                          <span className={`text-[10px] font-bold ${isPresent ? 'text-emerald-600' : 'text-gray-400'}`}>
                            {isPresent ? 'Present' : 'Absent'}
                          </span>
                        </label>
                      </td>

                      {/* Numeric Hours input */}
                      <td className="px-6 py-4">
                        <input
                          id={`attendance-hours-input-${r.id}`}
                          type="number"
                          value={hoursApp}
                          onChange={(evt) => handleHoursChange(r.id, evt.target.value)}
                          className="w-20 px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-center font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/10 outline-none"
                          min={0}
                        />
                      </td>

                      {/* Log Status */}
                      <td className="px-6 py-4">
                        {r.attended ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600">
                            <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED LOGGED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-500">
                            <XCircle className="w-3.5 h-3.5" /> UNVERIFIED
                          </span>
                        )}
                      </td>

                      {/* Commit Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          id={`attendance-save-btn-${r.id}`}
                          onClick={() => handleSaveAttendance(r)}
                          disabled={isSaving}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] shadow-sm cursor-pointer disabled:opacity-50"
                        >
                          <Save className="w-3.5 h-3.5" />
                          {isSaving ? 'Saving...' : 'Save Log'}
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        </div>
      )}

    </div>
  );
}
