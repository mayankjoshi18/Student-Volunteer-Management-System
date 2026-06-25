/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockApi } from '../../services/mockApi';
import { Event } from '../../types';
import { Layers, RefreshCw, Trash, Calendar, Users, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EventMonitoring() {
  const { addToast } = useApp();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllEvents = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getEvents();
      setEvents(data);
    } catch (err) {
      addToast('error', 'Sync Failed', 'Could not sync platform campaigns.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const handleDeleteEvent = async (id: string, title: string) => {
    try {
      await mockApi.deleteEvent(id);
      addToast('success', 'Event Removed', `Campaign "${title}" was permanently purged from the system.`);
      fetchAllEvents();
    } catch (err) {
      addToast('error', 'Action Failed', 'Could not delete campaign.');
    }
  };

  return (
    <div id="admin-event-monitoring" className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight leading-none flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-500" />
            Global Campaign Monitor
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Monitor sitewide volunteering campaigns. Verify descriptions, evaluate compliance, and remove outdated folders.
          </p>
        </div>
        <button
          id="refresh-monitor-btn"
          onClick={fetchAllEvents}
          className="p-2 border border-gray-100 dark:border-slate-850 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-gray-500"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500 font-semibold font-sans">Updating event directory...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl max-w-md mx-auto text-xs text-gray-400">
          No active events exist across ASU databases.
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              
              <thead className="bg-gray-50 dark:bg-slate-800 text-gray-400 font-extrabold uppercase border-b border-gray-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Campaign Event Project</th>
                  <th className="px-6 py-4">Scheduled Date</th>
                  <th className="px-6 py-4">Host Venue</th>
                  <th className="px-6 py-4">Enrolled Ratio</th>
                  <th className="px-6 py-4">Status Badging</th>
                  <th className="px-6 py-4 text-right">Emergency Purge</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 bg-white dark:bg-slate-900 font-medium text-gray-700 dark:text-gray-200">
                {events.map((e) => (
                  <tr key={e.id} id={`monitor-row-${e.id}`} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-all">
                    
                    {/* Title */}
                    <td className="px-6 py-4 font-bold text-gray-950 dark:text-white max-w-xs truncate">
                      {e.title}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-bold">{e.date}</td>

                    {/* Location */}
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-semibold">{e.location}</td>

                    {/* Roster ratio */}
                    <td className="px-6 py-4 font-bold">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        {e.registeredCount} / {e.slots}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      {e.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/20 px-2.5 py-0.5 rounded-full border border-emerald-100 uppercase">
                          Completed
                        </span>
                      ) : e.status === 'ongoing' ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/20 px-2.5 py-0.5 rounded-full border border-blue-100 uppercase">
                          Ongoing
                        </span>
                      ) : e.status === 'cancelled' ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-950/20 px-2.5 py-0.5 rounded-full border border-rose-100 uppercase">
                          Cancelled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/20 px-2.5 py-0.5 rounded-full border border-amber-100 uppercase">
                          Upcoming
                        </span>
                      )}
                    </td>

                    {/* Emergency actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Link
                          id={`monitor-view-${e.id}`}
                          to={`/event/${e.id}`}
                          className="p-1.5 border border-gray-100 dark:border-slate-800 hover:bg-gray-50 rounded-lg text-gray-500"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          id={`monitor-delete-${e.id}`}
                          onClick={() => handleDeleteEvent(e.id, e.title)}
                          className="p-1.5 border border-red-100 dark:border-red-950/40 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer transition-colors"
                          title="Purge Campaign"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
