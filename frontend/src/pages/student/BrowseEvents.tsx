/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockApi } from '../../services/mockApi';
import { Event, Registration } from '../../types';
import EventCard from '../../components/EventCard';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { Search, Filter, HelpCircle } from 'lucide-react';

export default function StudentBrowseEvents() {
  const { currentUser, addToast } = useApp();
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const eventsData = await mockApi.getEvents({ search, category });
        setEvents(eventsData);

        const regsData = await mockApi.getRegistrationsByStudent(currentUser.id);
        setRegistrations(regsData);
      } catch (err) {
        addToast('error', 'Error Syncing Events', 'Failed to retrieve academic event schedules.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search, category, currentUser]);

  const handleRegister = async (eventId: string, eventTitle: string) => {
    if (!currentUser) return;
    try {
      await mockApi.registerForEvent(eventId);
      addToast('success', 'Request Sent', `Your registration request for "${eventTitle}" has been submitted.`);
      
      // Sync local registration state
      const regsData = await mockApi.getRegistrationsByStudent(currentUser.id);
      setRegistrations(regsData);
      const eventsData = await mockApi.getEvents({ search, category });
      setEvents(eventsData);
    } catch (err: any) {
      addToast('error', 'Registration Failed', err.message || 'Could not complete registration request.');
    }
  };

  const handleWithdraw = async (regId: string) => {
    try {
      await mockApi.cancelRegistration(regId);
      addToast('success', 'Withdrawn', 'You have successfully withdrawn from this event.');
      
      // Sync state
      const regsData = await mockApi.getRegistrationsByStudent(currentUser!.id);
      setRegistrations(regsData);
      const eventsData = await mockApi.getEvents({ search, category });
      setEvents(eventsData);
    } catch (err: any) {
      addToast('error', 'Action Failed', err.message || 'Could not withdraw from event.');
    }
  };

  return (
    <div id="student-browse-events" className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight leading-none">
          Browse Volunteering Opportunities
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Find and register for active social programs, tutoring, blood camps, and environment initiatives.
        </p>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="student-events-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 text-xs rounded-xl focus:ring-2 focus:ring-blue-500/10 outline-none"
            placeholder="Search events, venues..."
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            id="student-events-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 text-xs rounded-xl focus:ring-2 focus:ring-blue-500/10 outline-none"
          >
            <option value="all">All Categories</option>
            <option value="environment">Environmental</option>
            <option value="education">Tutoring / Mentorship</option>
            <option value="health">Health Awareness</option>
            <option value="community">Community Outreach</option>
            <option value="disaster-relief">Emergency Relief</option>
          </select>
        </div>
      </div>

      {/* List States */}
      {loading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : events.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl text-xs text-gray-400 space-y-2">
          <HelpCircle className="w-8 h-8 mx-auto text-gray-300" />
          <p className="font-bold text-gray-950 dark:text-white">No active matches found</p>
          <p>Try modifying your search or browse other departments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const userReg = registrations.find((r) => r.eventId === event.id);
            const isFull = event.registeredCount >= event.slots;
            const isClosed = event.status === 'completed' || event.status === 'cancelled';

            const renderButton = () => {
              if (isClosed) {
                return (
                  <span className="px-3.5 py-1.5 text-xs font-semibold text-gray-400 bg-gray-100 dark:bg-slate-850 rounded-lg cursor-not-allowed">
                    Drive Ended
                  </span>
                );
              }
              if (userReg) {
                if (userReg.status === 'pending') {
                  return (
                    <button
                      id={`withdraw-browse-btn-${event.id}`}
                      onClick={() => handleWithdraw(userReg.id)}
                      className="px-3.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 border border-red-100 dark:border-red-950 rounded-xl transition-all"
                    >
                      Pending (Withdraw)
                    </button>
                  );
                }
                return (
                  <span className="px-3.5 py-1.5 text-xs font-extrabold text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/30 rounded-lg flex items-center gap-1">
                    ✓ Request Approved
                  </span>
                );
              }
              if (isFull) {
                return (
                  <span className="px-3.5 py-1.5 text-xs font-semibold text-gray-400 bg-gray-100 dark:bg-slate-850 rounded-lg cursor-not-allowed">
                    Capacity Full
                  </span>
                );
              }

              return (
                <button
                  id={`browse-reg-btn-${event.id}`}
                  onClick={() => handleRegister(event.id, event.title)}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  Register Now
                </button>
              );
            };

            return (
              <EventCard
                key={event.id}
                event={event}
                actionButton={renderButton()}
              />
            );
          })}
        </div>
      )}

    </div>
  );
}
