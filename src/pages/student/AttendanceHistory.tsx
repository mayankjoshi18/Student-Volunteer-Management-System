/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockApi } from '../../services/mockApi';
import { Registration } from '../../types';
import { CheckCircle2, MessageSquare, Star, ArrowUpRight, Award, PenLine } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AttendanceHistory() {
  const { currentUser, addToast } = useApp();
  const [history, setHistory] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Feedback active state
  const [activeRegId, setActiveRegId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const fetchHistory = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await mockApi.getRegistrationsByStudent(currentUser.id);
      // Filter for attended and approved logs (historical contributions)
      setHistory(data.filter(r => r.attended && r.status === 'approved'));
    } catch (err) {
      addToast('error', 'Error Syncing Attendance', 'Could not sync attendance database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [currentUser]);

  const handleFeedbackSubmit = async (reg: Registration) => {
    if (!feedbackText.trim()) {
      addToast('warning', 'Empty Comment', 'Please enter a brief feedback comment before submitting.');
      return;
    }
    setSubmittingFeedback(true);
    try {
      await mockApi.updateAttendance(reg.id, true, reg.hoursApproved, feedbackText);
      addToast('success', 'Feedback Registered', `Thank you! Your feedback for "${reg.eventTitle}" has been saved.`);
      setActiveRegId(null);
      setFeedbackText('');
      fetchHistory();
    } catch (err) {
      addToast('error', 'Action Failed', 'Could not record feedback logs.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <div id="student-attendance-history" className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight leading-none">
          Attendance Records & Feedback
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Review your verified attendance history and provide coordinators with critical feedback on finished projects.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500 font-semibold">Syncing attendance rosters...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl max-w-xl mx-auto space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-100 dark:text-emerald-950/40 mx-auto" />
          <h3 className="font-bold text-gray-950 dark:text-white text-base">No Attendance Logged</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
            You do not have any verified attendance records yet. Attend your upcoming registered events to log official volunteer hours!
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              
              <thead className="bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-gray-400 font-extrabold uppercase border-b border-gray-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Event Volunteer Project</th>
                  <th className="px-6 py-4">Completed Date</th>
                  <th className="px-6 py-4">Hours Rewarded</th>
                  <th className="px-6 py-4">Attendance Status</th>
                  <th className="px-6 py-4">Feedback Left</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 bg-white dark:bg-slate-900 font-medium text-gray-700 dark:text-gray-200">
                {history.map((reg) => (
                  <tr key={reg.id} id={`attendance-row-${reg.id}`} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-all">
                    
                    {/* Title & Link */}
                    <td className="px-6 py-4 max-w-sm">
                      <div className="space-y-0.5">
                        <Link
                          id={`attendance-event-link-${reg.id}`}
                          to={`/event/${reg.eventId}`}
                          className="font-bold text-gray-900 dark:text-white hover:text-blue-600 transition-colors flex items-center gap-1 w-fit"
                        >
                          {reg.eventTitle} <ArrowUpRight className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                        </Link>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-bold">{reg.eventDate}</td>

                    {/* Hours */}
                    <td className="px-6 py-4 font-black text-gray-950 dark:text-white">
                      <span className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        +{reg.hoursApproved} Hrs
                      </span>
                    </td>

                    {/* Attendance indicator */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 font-bold text-[10px] text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/20 px-2.5 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                        Present
                      </span>
                    </td>

                    {/* Feedback Form / Display */}
                    <td className="px-6 py-4">
                      {reg.feedback ? (
                        <div className="max-w-[200px] text-gray-500 dark:text-gray-400 leading-normal italic truncate" title={reg.feedback}>
                          "{reg.feedback}"
                        </div>
                      ) : activeRegId === reg.id ? (
                        <div className="flex flex-col gap-2 p-1 min-w-[200px] animate-in fade-in duration-150">
                          <textarea
                            id={`feedback-input-${reg.id}`}
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 bg-transparent rounded-lg text-xs outline-none focus:border-blue-500 font-sans leading-normal"
                            placeholder="How was the drive?..."
                            rows={2}
                          />
                          <div className="flex gap-1.5 justify-end">
                            <button
                              id={`feedback-cancel-${reg.id}`}
                              onClick={() => {
                                setActiveRegId(null);
                                setFeedbackText('');
                              }}
                              className="px-2.5 py-1 rounded-lg text-[10px] bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold transition-all"
                            >
                              Cancel
                            </button>
                            <button
                              id={`feedback-submit-${reg.id}`}
                              onClick={() => handleFeedbackSubmit(reg)}
                              disabled={submittingFeedback}
                              className="px-2.5 py-1 rounded-lg text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50"
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          id={`feedback-trigger-${reg.id}`}
                          onClick={() => {
                            setActiveRegId(reg.id);
                            setFeedbackText('');
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 text-[10px] font-bold text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
                        >
                          <PenLine className="w-3.5 h-3.5 text-blue-500 shrink-0" /> Comment
                        </button>
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
