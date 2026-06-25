/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useForm } from 'react-hook-form';
import { useApp } from '../../context/AppContext';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  role: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const { addToast } = useApp();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    addToast(
      'success',
      'Message Sent!',
      `Thank you, ${data.name}. We have received your query and will reply within 24 hours.`
    );
    reset();
  };

  return (
    <div id="contact-page" className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-200 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Get in Touch with Our Office
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-sans">
            Have questions about volunteering hours, verification issues, or hosting an event? Drop us a message!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-slate-900 text-white p-8 rounded-3xl space-y-8 relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.15),transparent)]" />
            
            <div className="relative z-10 space-y-2">
              <h2 className="text-xl font-bold tracking-tight">Contact Information</h2>
              <p className="text-xs text-slate-400">Reach our Student Social Engagement desk during active working hours.</p>
            </div>

            <div className="relative z-10 space-y-6 text-sm">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-slate-800 rounded-xl text-blue-400 shrink-0 border border-slate-700/50">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">General Support Email</p>
                  <p className="text-xs text-slate-300 mt-0.5">volunteer-affairs@university.edu</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-slate-800 rounded-xl text-blue-400 shrink-0 border border-slate-700/50">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Administrative Office Line</p>
                  <p className="text-xs text-slate-300 mt-0.5">+1 (555) 482-1290</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-slate-800 rounded-xl text-blue-400 shrink-0 border border-slate-700/50">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Physical Location</p>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Student Union Building, Wing B, Room 204<br />
                    Central Campus, Apex State University
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-slate-800 rounded-xl text-blue-400 shrink-0 border border-slate-700/50">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Operating Hours</p>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Monday - Friday: 09:00 AM - 05:00 PM<br />
                    Closed on Weekends and Academic Holidays
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 p-5 rounded-2xl bg-slate-800 border border-slate-700/50">
              <p className="text-xs text-slate-300 leading-relaxed font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                Looking to partner as an NGO?
              </p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Please mention "External Partnership" in the subject line to route your query to the Coordinator relations team.
              </p>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-8 rounded-3xl shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-gray-950 dark:text-white tracking-tight">Send Us a Direct Message</h2>
            
            <form id="contact-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="name" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    {...register('name', { required: 'Full name is required' })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    placeholder="Alex Mercer"
                  />
                  {errors.name && <span className="text-[11px] text-rose-500 font-semibold">{errors.name.message}</span>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs font-semibold text-gray-500 dark:text-gray-400">University Email Address</label>
                  <input
                    id="email"
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    placeholder="alex@university.edu"
                  />
                  {errors.email && <span className="text-[11px] text-rose-500 font-semibold">{errors.email.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="role" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Your Campus Role</label>
                  <select
                    id="role"
                    {...register('role')}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  >
                    <option value="student">Student Volunteer</option>
                    <option value="coordinator">Event Coordinator</option>
                    <option value="community-partner">Community / NGO Partner</option>
                    <option value="other">Other / Guest</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="subject" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Subject Inquiry</label>
                  <input
                    id="subject"
                    type="text"
                    {...register('subject', { required: 'Subject is required' })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    placeholder="E.g., Missing Certificate Inquiry"
                  />
                  {errors.subject && <span className="text-[11px] text-rose-500 font-semibold">{errors.subject.message}</span>}
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="message" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Detailed Message</label>
                <textarea
                  id="message"
                  rows={5}
                  {...register('message', { required: 'Message body cannot be empty' })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                  placeholder="Describe your issue or partnership inquiry in detail..."
                />
                {errors.message && <span className="text-[11px] text-rose-500 font-semibold">{errors.message.message}</span>}
              </div>

              <button
                id="contact-form-submit"
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/25 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
