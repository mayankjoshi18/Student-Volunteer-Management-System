/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockApi } from '../../services/mockApi';
import { Registration } from '../../types';
import { Check, X, ShieldAlert, CheckCircle, RefreshCw, XCircle } from 'lucide-react';

export default function ManageRegistrations() {
  const { addToast } = useApp();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getRegistrations();
      setRegistrations(data);
    } catch (err) {
      addToast('error', 'Sync Failed', 'Could not sync registrations log.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleUpdateStatus = async (id: string, nextStatus: 'approved' | 'declined', studentName: string) => {
    try {
      await mockApi.updateRegistrationStatus(id, nextStatus);
      addToast(
        nextStatus === 'approved' ? 'success' : 'warning',
        'Roster Updated',
        `Successfully marked registration for ${studentName} as ${nextStatus}.`
      );
      fetchRegistrations();
    } catch (err: any) {
      addToast('error', 'Action Failed', err.message || 'Could not update registration status.');
    }
  };

  return (
    <div id="coordinator-manage-registrations" className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight leading-none">
            Volunteer Registrations Board
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Verify academic volunteer submissions, manage roster capacities, and process pending applications.
          </p>
        </div>
        <button
          id="refresh-regs-board"
          onClick={fetchRegistrations}
          className="p-2 border border-gray-100 dark:border-slate-850 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-gray-500"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500 font-semibold font-sans">Updating applicant registers...</p>
        </div>
      ) : registrations.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl max-w-md mx-auto text-xs text-gray-400">
          No active student registrations logged in our system.
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              
              <thead className="bg-gray-50 dark:bg-slate-800 text-gray-400 font-extrabold uppercase border-b border-gray-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Student Volunteer</th>
                  <th className="px-6 py-4">Department Affiliation</th>
                  <th className="px-6 py-4">Target Campaign Event</th>
                  <th className="px-6 py-4">Applied Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Roster Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 bg-white dark:bg-slate-900 font-medium text-gray-700 dark:text-gray-200">
                {registrations.map((r) => (
                  <tr key={r.id} id={`reg-row-${r.id}`} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-all">
                    
                    {/* Student Info */}
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className="font-bold text-gray-950 dark:text-white">{r.studentName}</p>
                        <p className="text-[10px] text-gray-400 font-semibold">ID: {r.studentId}</p>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-bold">{r.department}</td>

                    {/* Event Title */}
                    <td className="px-6 py-4 max-w-xs truncate font-bold text-gray-900 dark:text-white" title={r.eventTitle}>
                      {r.eventTitle}
                    </td>

                    {/* Reg Date */}
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-semibold">{r.registeredAt.split('T')[0]}</td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      {r.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-100">
                          Approved
                        </span>
                      ) : r.status === 'declined' ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-950/20 px-2 py-0.5 rounded-full border border-rose-100">
                          Declined
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/20 px-2 py-0.5 rounded-full border border-amber-100">
                          Pending Verification
                        </span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4 text-right">
                      {r.status === 'pending' ? (
                        <div className="flex gap-2 justify-end">
                          <button
                            id={`reg-btn-approve-${r.id}`}
                            onClick={() => handleUpdateStatus(r.id, 'approved', r.studentName)}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg cursor-pointer transition-colors border border-emerald-100"
                            title="Approve Sign-up"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`reg-btn-decline-${r.id}`}
                            onClick={() => handleUpdateStatus(r.id, 'declined', r.studentName)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg cursor-pointer transition-colors border border-rose-100"
                            title="Decline Sign-up"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-semibold italic">Processed</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      )}

    </div>
  );
}
