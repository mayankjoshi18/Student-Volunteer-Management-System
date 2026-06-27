/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockApi } from '../../services/mockApi';
import { Event, EventStatus } from '../../types';
import { Trash, Calendar, Users, Award, ShieldAlert, CheckCircle, RefreshCw, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ManageEvents() {
  const { addToast } = useApp();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getEvents();
      setEvents(data);
    } catch (err) {
      addToast('error', 'Sync Failed', 'Could not sync events list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleStatusChange = async (eventId: string, nextStatus: EventStatus) => {
    try {
      await mockApi.updateEvent(eventId, { status: nextStatus });
      addToast('success', 'Status Updated', `Event status set to "${nextStatus}" successfully.`);
      fetchEvents();
    } catch (err) {
      addToast('error', 'Action Failed', 'Could not update event status.');
    }
  };

  const handleDeleteEvent = async (eventId: string, title: string) => {
    try {
      await mockApi.deleteEvent(eventId);
      addToast('success', 'Event Deleted', `"${title}" has been removed from ASU registries.`);
      fetchEvents();
    } catch (err) {
      addToast('error', 'Action Failed', 'Could not delete event.');
    }
  };

  return (
    <div id="coordinator-manage-events" className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight leading-none">
            Manage Campaigns Database
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Monitor and modify active campaigns, alter status timelines, and clear obsolete events.
          </p>
        </div>
        <button
          id="refresh-manage-events"
          onClick={fetchEvents}
          className="p-2 border border-gray-100 dark:border-slate-800/80 hover:bg-gray-150 rounded-xl transition-colors text-gray-500"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500 font-semibold font-sans">Updating registries...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl max-w-md mx-auto text-xs text-gray-400">
          No events created. Launch a campaign to see it listed here.
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              
              <thead className="bg-gray-50 dark:bg-slate-800 text-gray-400 font-extrabold uppercase border-b border-gray-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Event Campaign Title</th>
                  <th className="px-6 py-4">Scheduled Date</th>
                  <th className="px-6 py-4">Roster filling</th>
                  <th className="px-6 py-4">Credit Hours</th>
                  <th className="px-6 py-4">Pipeline Status</th>
                  <th className="px-6 py-4 text-right">Database Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 bg-white dark:bg-slate-900 font-medium text-gray-700 dark:text-gray-200">
                {events.map((e) => (
                  <tr key={e.id} id={`manage-row-${e.id}`} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-all">
                    
                    {/* Title */}
                    <td className="px-6 py-4 font-bold text-gray-950 dark:text-white max-w-xs truncate">
                      <div className="flex items-center gap-2">
                        <span>{e.title}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-bold">{e.date}</td>

                    {/* Roster filled slots */}
                    <td className="px-6 py-4 font-bold">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        {e.registeredCount} / {e.slots}
                      </span>
                    </td>

                    {/* Hours rewarded */}
                    <td className="px-6 py-4 font-black">
                      <span className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        +{e.hours}h
                      </span>
                    </td>

                    {/* Pipeline Status drop selector */}
                    <td className="px-6 py-4">
                      <select
                        id={`status-selector-${e.id}`}
                        value={e.status}
                        onChange={(evt) => handleStatusChange(e.id, evt.target.value as EventStatus)}
                        className={`px-2.5 py-1.5 rounded-xl border text-center font-bold text-[10px] uppercase tracking-wide outline-none bg-white dark:bg-slate-800 ${
                          e.status === 'completed'
                            ? 'border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 bg-emerald-50/50'
                            : e.status === 'ongoing'
                            ? 'border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 bg-blue-50/50'
                            : e.status === 'cancelled'
                            ? 'border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 bg-red-50/50'
                            : 'border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 bg-amber-50/50'
                        }`}
                      >
                        <option value="upcoming">upcoming</option>
                        <option value="ongoing">ongoing</option>
                        <option value="completed">completed</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>

                    {/* Database Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Link
                          id={`manage-view-details-${e.id}`}
                          to={`/event/${e.id}`}
                          className="p-1.5 border border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg text-gray-500"
                          title="View Page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          id={`manage-delete-${e.id}`}
                          onClick={() => handleDeleteEvent(e.id, e.title)}
                          className="p-1.5 border border-red-100 dark:border-red-950/40 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-red-500 cursor-pointer"
                          title="Delete Campaign"
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
