/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Event } from '../types';
import { Calendar, MapPin, Users, Award, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EventCardProps {
  key?: React.Key | string;
  event: Event;
  actionButton?: React.ReactNode;
}

export default function EventCard({ event, actionButton }: EventCardProps) {
  const categoryStyles = {
    environment: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50',
    education: 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/50',
    health: 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/50',
    community: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/50',
    'disaster-relief': 'bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-900/50',
  };

  const percentFull = Math.min(100, Math.round((event.registeredCount / event.slots) * 100));

  return (
    <div id={`event-card-${event.id}`} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group h-full">
      {/* Event Image & Badges */}
      <div className="relative h-48 w-full overflow-hidden shrink-0">
        <img
          id={`event-card-img-${event.id}`}
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md ${categoryStyles[event.category]}`}>
            {event.category.replace('-', ' ')}
          </span>
        </div>
        <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1 border border-white/10 shadow-sm">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>+{event.hours} Hrs</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Date & Location Metas */}
          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-gray-500 dark:text-gray-400 font-semibold font-sans">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              {event.date}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate max-w-[150px]">{event.location}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-lg line-clamp-1 leading-snug">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Slot indicator / Progress bar */}
          <div className="pt-2">
            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 font-bold mb-1">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                {event.registeredCount} / {event.slots} Slots
              </span>
              <span>{percentFull}% Full</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  percentFull >= 90
                    ? 'bg-rose-500'
                    : percentFull >= 60
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${percentFull}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-6 pt-4 border-t border-gray-50 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <Link
            id={`event-card-details-btn-${event.id}`}
            to={`/event/${event.id}`}
            className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-xl transition-all"
          >
            <Eye className="w-3.5 h-3.5" /> View Details
          </Link>
          {actionButton ? (
            actionButton
          ) : (
            <Link
              id={`event-card-register-btn-${event.id}`}
              to={`/event/${event.id}`}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl shadow-md shadow-blue-500/10 transition-all cursor-pointer"
            >
              Learn More
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
