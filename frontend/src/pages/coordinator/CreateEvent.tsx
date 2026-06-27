/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { mockApi } from '../../services/mockApi';
import { PlusCircle, Calendar, MapPin, Users, Award, Image as ImageIcon, Send } from 'lucide-react';
import { EventCategory } from '../../types';

interface CreateEventFormData {
  title: string;
  category: EventCategory;
  description: string;
  date: string;
  time: string;
  location: string;
  slots: number;
  hours: number;
  image: string;
}

export default function CreateEvent() {
  const { addToast } = useApp();
  const navigate = useNavigate();

  // Preset covers for easy styling
  const categoryCovers: Record<EventCategory, string> = {
    environment: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600',
    education: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
    health: 'https://images.unsplash.com/photo-1536856492749-0e1d17a3eeec?auto=format&fit=crop&q=80&w=600',
    community: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=600',
    'disaster-relief': 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=600',
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventFormData>({
    defaultValues: {
      title: '',
      category: 'environment',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00 AM - 12:00 PM',
      location: '',
      slots: 30,
      hours: 4,
      image: '',
    },
  });

  const selectedCategory = watch('category');

  const onSubmit = async (data: CreateEventFormData) => {
    try {
      // Use category cover if no custom image is supplied
      const finalImage = data.image.trim() || categoryCovers[data.category] || categoryCovers.environment;
      
      const newEventData = {
        ...data,
        slots: Number(data.slots),
        hours: Number(data.hours),
        image: finalImage,
        status: 'upcoming' as const,
      };

      await mockApi.createEvent(newEventData);
      addToast('success', 'Campaign Published!', `Successfully launched "${data.title}" under the ${data.category} sector.`);
      navigate('/coordinator/events');
    } catch (err) {
      addToast('error', 'Publish Failed', 'An error occurred while creating the event.');
    }
  };

  return (
    <div id="coordinator-create-event" className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto max-w-3xl">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight leading-none flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-blue-500" />
          Publish a Volunteering Event
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Create and advertise official community service events, specify volunteer guidelines, and allocate credit hours.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm">
        <form id="create-event-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-sans">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1">
              <label htmlFor="evt-title" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Project Title</label>
              <input
                id="evt-title"
                type="text"
                {...register('title', { required: 'Event title is required' })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500/10 outline-none"
                placeholder="Campus Green Clean-up Drive"
              />
              {errors.title && <span className="text-[10px] text-rose-500 font-bold">{errors.title.message}</span>}
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label htmlFor="evt-category" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Campaign Sector</label>
              <select
                id="evt-category"
                {...register('category')}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500/10 outline-none"
              >
                <option value="environment">Environmental Conservation</option>
                <option value="education">Educational Tutoring</option>
                <option value="health">Health & Medical Support</option>
                <option value="community">Social / Community Care</option>
                <option value="disaster-relief">Disaster Assistance</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label htmlFor="evt-desc" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Guidelines & Guidelines</label>
            <textarea
              id="evt-desc"
              rows={4}
              {...register('description', { required: 'Project description is required' })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500/10 outline-none resize-none"
              placeholder="Detail guidelines, clothing recommendations, meeting spots, and objectives..."
            />
            {errors.description && <span className="text-[10px] text-rose-500 font-bold">{errors.description.message}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date */}
            <div className="space-y-1">
              <label htmlFor="evt-date" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Scheduled Date</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  id="evt-date"
                  type="date"
                  {...register('date', { required: 'Event date is required' })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500/10 outline-none"
                />
              </div>
              {errors.date && <span className="text-[10px] text-rose-500 font-bold">{errors.date.message}</span>}
            </div>

            {/* Time */}
            <div className="space-y-1">
              <label htmlFor="evt-time" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Volunteering Timeframe</label>
              <input
                id="evt-time"
                type="text"
                {...register('time', { required: 'Operating hours are required' })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500/10 outline-none"
                placeholder="E.g., 09:00 AM - 12:00 PM"
              />
              {errors.time && <span className="text-[10px] text-rose-500 font-bold">{errors.time.message}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Venue Location */}
            <div className="sm:col-span-1 space-y-1">
              <label htmlFor="evt-location" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Venue Location</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  id="evt-location"
                  type="text"
                  {...register('location', { required: 'Event location is required' })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500/10 outline-none"
                  placeholder="Main Quadrangle"
                />
              </div>
              {errors.location && <span className="text-[10px] text-rose-500 font-bold">{errors.location.message}</span>}
            </div>

            {/* Total Slots */}
            <div className="space-y-1">
              <label htmlFor="evt-slots" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Roster Capacity (slots)</label>
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  id="evt-slots"
                  type="number"
                  {...register('slots', { required: 'Slots count is required', min: { value: 1, message: 'Must be at least 1 slot' } })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500/10 outline-none"
                />
              </div>
              {errors.slots && <span className="text-[10px] text-rose-500 font-bold">{errors.slots.message}</span>}
            </div>

            {/* Credit Hours */}
            <div className="space-y-1">
              <label htmlFor="evt-hours" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Award Hours Reward</label>
              <div className="relative">
                <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  id="evt-hours"
                  type="number"
                  {...register('hours', { required: 'Award hours are required', min: { value: 1, message: 'Must be at least 1 hour' } })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500/10 outline-none"
                />
              </div>
              {errors.hours && <span className="text-[10px] text-rose-500 font-bold">{errors.hours.message}</span>}
            </div>
          </div>

          {/* Custom Banner Image */}
          <div className="space-y-1">
            <label htmlFor="evt-image" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Custom Banner URL (Optional)</label>
            <div className="relative">
              <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input
                id="evt-image"
                type="text"
                {...register('image')}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500/10 outline-none"
                placeholder="Leave blank to use pre-selected cover image..."
              />
            </div>
            <p className="text-[10px] text-gray-400 font-semibold italic mt-1">
              If left blank, our system will supply an elegant cover matched with your campaign category.
            </p>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end">
            <button
              id="create-event-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/10 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Publishing Event...' : 'Launch Campaign Event'}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
