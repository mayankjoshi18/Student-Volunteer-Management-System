/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockApi } from '../../services/mockApi';
import { Registration } from '../../types';
import { Calendar, ShieldAlert, XCircle, Heart, CheckCircle2, ChevronRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RegisteredEvents() {
  const { currentUser, addToast } = useApp();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await mockApi.getRegistrationsByStudent(currentUser.id);
      // Filter out events that are not attended yet (upcoming/pending ones)
      setRegistrations(data.filter(r => !r.attended));
    } catch (err) {
      addToast('error', 'Error Syncing Registrations', 'Failed to reload registered logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [currentUser]);

  const handleWithdraw = async (regId: string) => {
    try {
      await mockApi.cancelRegistration(regId);
      addToast('success', 'Withdrawn Successfully', 'Your request has been canceled and slots freed.');
      fetchRegistrations();
    } catch (err: any) {
      addToast('error', 'Action Failed', err.message || 'Could not cancel registration.');
    }
  };

  return (
    <div id="student-registered-events" className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight leading-none">
            Registered Social Activities
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Track your approval states, event schedules, and cancel upcoming volunteering commitments.
          </p>
        </div>
        <button
          id="refresh-regs-btn"
          onClick={fetchRegistrations}
          className="p-2 border border-gray-100 dark:border-slate-850 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-gray-500"
          title="Refresh List"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500 font-semibold">Updating rosters...</p>
        </div>
      ) : registrations.length === 0 ? (
        <div className="p-12 sm:p-20 border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-center rounded-3xl space-y-4 max-w-xl mx-auto">
          <Heart className="w-12 h-12 text-blue-100 dark:text-blue-900/40 mx-auto" />
          <h3 className="font-bold text-gray-950 dark:text-white text-base">No Registrations Found</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
            You are not currently signed up for any upcoming events. Explore active projects to join our campus volunteering community!
          </p>
          <Link
            id="registered-browse-cta"
            to="/student/events"
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            Explore Opportunities
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {registrations.map((reg) => (
            <div
              key={reg.id}
              id={`reg-card-${reg.id}`}
              className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all gap-5"
            >
              <div className="space-y-3 font-sans">
                <div className="flex justify-between items-start gap-4">
                  {/* Status Indicator */}
                  {reg.status === 'approved' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 dark:text-emerald-300 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full uppercase tracking-wide">
                      <CheckCircle2 className="w-3 h-3" /> Approved Volunteer
                    </span>
                  ) : reg.status === 'declined' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-100 dark:text-rose-300 dark:bg-rose-950/20 px-2 py-0.5 rounded-full uppercase tracking-wide">
                      <XCircle className="w-3 h-3" /> Declined
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 dark:text-amber-300 dark:bg-amber-950/20 px-2 py-0.5 rounded-full uppercase tracking-wide">
                      <ShieldAlert className="w-3 h-3" /> Pending Verification
                    </span>
                  )}
                  <span className="text-[10px] text-gray-400 font-bold">Registered: {reg.registeredAt.split('T')[0]}</span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-gray-950 dark:text-white leading-tight line-clamp-1">{reg.eventTitle}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" /> Date Venue: {reg.eventDate}
                  </p>
                </div>
              </div>

              {/* Action area */}
              <div className="pt-4 border-t border-gray-50 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <Link
                  id={`reg-view-details-${reg.id}`}
                  to={`/event/${reg.eventId}`}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 px-3 py-2 rounded-xl transition-all"
                >
                  View Details <ChevronRight className="w-4 h-4" />
                </Link>
                {reg.status === 'pending' && (
                  <button
                    id={`reg-withdraw-btn-${reg.id}`}
                    onClick={() => handleWithdraw(reg.id)}
                    className="px-3.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 rounded-xl transition-all border border-red-100 dark:border-red-950"
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
