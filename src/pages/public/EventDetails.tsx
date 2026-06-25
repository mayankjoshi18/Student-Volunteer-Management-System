/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { mockApi } from '../../services/mockApi';
import { Event, Registration } from '../../types';
import { Calendar, MapPin, Users, Award, ShieldAlert, ArrowLeft, MessageSquare, Clock, ArrowRight } from 'lucide-react';

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, addToast } = useApp();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const eventData = await mockApi.getEventById(id);
        if (eventData) {
          setEvent(eventData);
          const regs = await mockApi.getRegistrationsByEvent(id);
          setRegistrations(regs);
        } else {
          addToast('error', 'Event Not Found', 'The requested event could not be located.');
          navigate('/opportunities');
        }
      } catch (err) {
        addToast('error', 'Error Loading Event', 'Failed to retrieve event details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-500 font-semibold">Loading project details...</p>
      </div>
    );
  }

  if (!event) return null;

  const handleRegister = async () => {
    if (!currentUser) {
      addToast('warning', 'Login Required', 'Please log in as a student to register for events.');
      navigate('/login');
      return;
    }
    if (currentUser.role !== 'student') {
      addToast('error', 'Unauthorized', 'Only Students can register for events.');
      return;
    }

    setIsRegistering(true);
    try {
      await mockApi.registerForEvent(event.id);
      addToast('success', 'Registration Request Submitted!', `You have requested to volunteer for "${event.title}". Approval is managed by ${event.coordinatorName}.`);
      
      // Refresh event details
      const eventData = await mockApi.getEventById(event.id);
      if (eventData) setEvent(eventData);
      const regs = await mockApi.getRegistrationsByEvent(event.id);
      setRegistrations(regs);
    } catch (err: any) {
      addToast('error', 'Registration Failed', err.message || 'Could not complete registration request.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCancelRegistration = async (regId: string) => {
    setIsRegistering(true);
    try {
      await mockApi.cancelRegistration(regId);
      addToast('success', 'Registration Withdrawn', 'Your registration request has been successfully canceled.');
      
      // Refresh event details
      const eventData = await mockApi.getEventById(event.id);
      if (eventData) setEvent(eventData);
      const regs = await mockApi.getRegistrationsByEvent(event.id);
      setRegistrations(regs);
    } catch (err: any) {
      addToast('error', 'Action Failed', err.message || 'Could not withdraw from event.');
    } finally {
      setIsRegistering(false);
    }
  };

  // Find if current student user is already registered
  const userRegistration = registrations.find(r => r.studentId === currentUser?.id);

  // Filter completed feedbacks
  const feedbacks = registrations.filter(r => r.attended && r.feedback);

  const categoryLabels = {
    environment: 'Environmental Conservation',
    education: 'Educational Tutoring',
    health: 'Health & Medical Support',
    community: 'Social / Community Care',
    'disaster-relief': 'Disaster Assistance',
  };

  return (
    <div id="event-details-page" className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Link */}
        <Link
          id="event-details-back-btn"
          to="/opportunities"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Opportunities
        </Link>

        {/* Big Hero card */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="relative h-64 sm:h-96 w-full">
            <img
              id="event-details-hero-img"
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-blue-600 border border-blue-500/30 text-white shadow-sm">
                {categoryLabels[event.category]}
              </span>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">{event.title}</h1>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left Content Column */}
            <div className="md:col-span-8 space-y-6">
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-gray-950 dark:text-white">Project Mission Description</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-sans whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {/* Feedbacks Section */}
              {feedbacks.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-gray-50 dark:border-slate-800/80">
                  <h3 className="text-base font-bold text-gray-950 dark:text-white flex items-center gap-1.5">
                    <MessageSquare className="w-4.5 h-4.5 text-blue-500" />
                    Verified Student Feedback ({feedbacks.length})
                  </h3>
                  <div className="space-y-3">
                    {feedbacks.map((f) => (
                      <div key={f.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-bold text-gray-950 dark:text-white">{f.studentName}</p>
                          <p className="text-gray-400 font-medium">{f.studentDepartment}</p>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 font-sans italic">"{f.feedback}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Meta Column */}
            <div className="md:col-span-4 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl space-y-6 h-fit">
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400">Event Details</h3>

              <div className="space-y-4 text-xs font-sans">
                <div className="flex gap-3">
                  <Calendar className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                  <div>
                    <p className="font-bold">Schedule Date</p>
                    <p className="text-gray-500 dark:text-gray-400 mt-0.5">{event.date}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
                  <div>
                    <p className="font-bold">Hours Window</p>
                    <p className="text-gray-500 dark:text-gray-400 mt-0.5">{event.time}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                  <div>
                    <p className="font-bold">Location Venue</p>
                    <p className="text-gray-500 dark:text-gray-400 mt-0.5">{event.location}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Award className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                  <div>
                    <p className="font-bold">Volunteer Rewards</p>
                    <p className="text-gray-500 dark:text-gray-400 mt-0.5">+{event.hours} Academic Hours</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Users className="w-4.5 h-4.5 text-cyan-500 shrink-0" />
                  <div>
                    <p className="font-bold">Team Capacity</p>
                    <p className="text-gray-500 dark:text-gray-400 mt-0.5">{event.registeredCount} / {event.slots} volunteers</p>
                  </div>
                </div>

                <div className="border-t border-slate-200/50 dark:border-slate-800 pt-4">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">Coordinator Contact</p>
                  <p className="font-bold text-gray-900 dark:text-white text-xs">{event.coordinatorName}</p>
                </div>
              </div>

              {/* Action Decision Area */}
              <div className="pt-2">
                {currentUser?.role === 'coordinator' && currentUser.id === event.coordinatorId ? (
                  <Link
                    id="event-action-coord-edit"
                    to={`/coordinator/events`}
                    className="w-full text-center block py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md text-xs"
                  >
                    Manage Coordinations
                  </Link>
                ) : currentUser?.role === 'admin' ? (
                  <Link
                    id="event-action-admin-monitor"
                    to={`/admin/monitoring`}
                    className="w-full text-center block py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all shadow-md text-xs"
                  >
                    Monitor Registration logs
                  </Link>
                ) : userRegistration ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-100/50 dark:bg-blue-950/20 border border-blue-200/50 rounded-xl text-center">
                      <p className="text-[11px] text-blue-800 dark:text-blue-300 font-bold capitalize flex items-center justify-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5" /> Request {userRegistration.status}
                      </p>
                    </div>
                    {userRegistration.status === 'pending' && (
                      <button
                        id="event-cancel-registration"
                        onClick={() => handleCancelRegistration(userRegistration.id)}
                        disabled={isRegistering}
                        className="w-full text-center block py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold transition-all text-xs border border-red-200 dark:border-red-900/50"
                      >
                        {isRegistering ? 'Processing...' : 'Withdraw Request'}
                      </button>
                    )}
                  </div>
                ) : event.registeredCount >= event.slots ? (
                  <div className="p-3 bg-red-100/40 border border-red-200/50 rounded-xl text-center text-red-700 text-xs font-bold">
                    This Event is Full
                  </div>
                ) : event.status === 'completed' || event.status === 'cancelled' ? (
                  <div className="p-3 bg-gray-100 rounded-xl text-center text-gray-500 text-xs font-bold">
                    Event is Closed
                  </div>
                ) : (
                  <button
                    id="event-details-register-cta"
                    onClick={handleRegister}
                    disabled={isRegistering}
                    className="w-full text-center block py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md shadow-blue-500/10 cursor-pointer text-xs active:scale-[0.98]"
                  >
                    {isRegistering ? 'Registering...' : 'Request Registration'}
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
