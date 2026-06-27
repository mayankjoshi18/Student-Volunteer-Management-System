/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockApi } from '../../services/mockApi';
import { Event } from '../../types';
import EventCard from '../../components/EventCard';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { Search, Filter, BookOpen, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Opportunities() {
  const { currentUser, addToast } = useApp();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');

  // Trigger loading events on filter changes
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await mockApi.getEvents({ search, category, status });
        setEvents(data);
      } catch (error) {
        addToast('error', 'Error Fetching Events', 'Failed to retrieve opportunities list.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [search, category, status]);

  const handleQuickRegister = async (eventId: string, eventTitle: string) => {
    if (!currentUser) {
      addToast('warning', 'Login Required', 'Please sign in to register for volunteering opportunities.');
      return;
    }
    if (currentUser.role !== 'student') {
      addToast('error', 'Action Restricted', 'Only users logged in as Students can register for events.');
      return;
    }

    try {
      await mockApi.registerForEvent(eventId);
      addToast('success', 'Registered Successfully!', `You have requested to join "${eventTitle}". Check your Student Dashboard for approval updates.`);
      
      // Reload events to sync capacities
      const data = await mockApi.getEvents({ search, category, status });
      setEvents(data);
    } catch (error: any) {
      addToast('error', 'Registration Failed', error.message || 'Could not complete registration request.');
    }
  };

  return (
    <div id="opportunities-page" className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-200 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
              Volunteer Opportunities
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-sans max-w-2xl">
              Browse, filter, and register for active community development drives, educational workshops, ecological initiatives, and disaster management programs.
            </p>
          </div>
          {currentUser && currentUser.role === 'student' && (
            <Link
              id="my-registrations-badge-link"
              to="/student/registered"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-blue-700 bg-blue-100/50 hover:bg-blue-100 border border-blue-200 dark:text-blue-300 dark:bg-blue-950/30 dark:border-blue-900/50 transition-colors w-fit"
            >
              My Registered Events <ArrowUpRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-4 rounded-3xl shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Search Bar */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
              id="opportunity-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
              placeholder="Search by keyword, location, or coordinator..."
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3 flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 shrink-0 hidden sm:inline" />
            <select
              id="opportunity-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/10 outline-none"
            >
              <option value="all">All Categories</option>
              <option value="environment">Environmental Conservation</option>
              <option value="education">Educational Tutoring</option>
              <option value="health">Health & Medical Support</option>
              <option value="community">Social / Community Care</option>
              <option value="disaster-relief">Disaster Assistance</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="md:col-span-3">
            <select
              id="opportunity-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/10 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="upcoming">Upcoming (Register Now)</option>
              <option value="ongoing">Ongoing (Active Now)</option>
              <option value="completed">Completed Events</option>
            </select>
          </div>

          {/* Clear Button */}
          <div className="md:col-span-1 text-center">
            <button
              id="clear-filters-btn"
              onClick={() => {
                setSearch('');
                setCategory('all');
                setStatus('all');
              }}
              className="text-xs font-bold text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Clear
            </button>
          </div>

        </div>

        {/* Dynamic List State Grid */}
        {loading ? (
          <LoadingSkeleton type="card" count={3} />
        ) : events.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-center p-12 sm:p-20 rounded-3xl space-y-4">
            <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto" />
            <h3 className="text-lg font-bold text-gray-950 dark:text-white">No Opportunities Found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              We couldn't find any events matching your selected search query or category. Adjust your filters or browse all upcoming items instead.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
              // Custom registration check for students to style the button
              const isFull = event.registeredCount >= event.slots;
              const isClosed = event.status === 'completed' || event.status === 'cancelled';

              const renderButton = () => {
                if (isClosed) {
                  return (
                    <span className="px-3.5 py-1.5 text-xs font-semibold text-gray-400 bg-gray-100 dark:bg-slate-800 rounded-lg cursor-not-allowed">
                      Event Finished
                    </span>
                  );
                }
                if (isFull) {
                  return (
                    <span className="px-3.5 py-1.5 text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg cursor-not-allowed">
                      Fully Booked
                    </span>
                  );
                }

                return (
                  <button
                    id={`quick-reg-btn-${event.id}`}
                    onClick={() => handleQuickRegister(event.id, event.title)}
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    Register
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
    </div>
  );
}
