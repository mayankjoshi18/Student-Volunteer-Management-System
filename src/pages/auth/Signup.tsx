/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { motion } from 'motion/react';
import { UserPlus, Sparkles, Award, ArrowRight, UserCheck } from 'lucide-react';
import { UserRole } from '../../types';

export default function Signup() {
  const { signup } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('student');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      department: '',
      studentId: '',
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const user = await signup(data.name, data.email, role, data.department, role === 'student' ? data.studentId : undefined);
      navigate(`/${user.role}`);
    } catch (err) {
      // Handled by context toast
    }
  };

  return (
    <div id="signup-page" className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      
      {/* Visual Column */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.25),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5))]" />
        
        <div className="relative z-10 max-w-md space-y-6 text-center lg:text-left">
          <div className="inline-flex bg-blue-600 p-3 rounded-2xl shadow-xl border border-blue-500/30 text-white mb-2">
            <UserPlus className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
            Join the Apex State Volunteering Movement
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            By registering on VolaLink, you will connect with campus coordinators, gain real leadership credits, and build your certified community profile.
          </p>
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Apex Student Engagement Council</span>
            <span>Digital Registry V2</span>
          </div>
        </div>
      </div>

      {/* Form Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full space-y-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-8 rounded-3xl shadow-sm">
          
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" /> Create Your Account
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-sans">
              Sign up today and start logging your social impacts.
            </p>
          </div>

          {/* Role selector tab */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-50 dark:bg-slate-800 rounded-2xl">
            <button
              id="signup-role-btn-student"
              type="button"
              onClick={() => setRole('student')}
              className={`text-xs py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                role === 'student'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              Student Volunteer
            </button>
            <button
              id="signup-role-btn-coordinator"
              type="button"
              onClick={() => setRole('coordinator')}
              className={`text-xs py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                role === 'coordinator'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              Event Coordinator
            </button>
          </div>

          <form id="signup-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label htmlFor="signup-name" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Full Name</label>
              <input
                id="signup-name"
                type="text"
                {...register('name', { required: 'Your name is required' })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                placeholder="Alex Mercer"
              />
              {errors.name && <span className="text-[11px] text-rose-500 font-semibold">{errors.name.message}</span>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="signup-email" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Institutional Email</label>
              <input
                id="signup-email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid institutional email address',
                  },
                })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                placeholder="alex.mercer@university.edu"
              />
              {errors.email && <span className="text-[11px] text-rose-500 font-semibold">{errors.email.message}</span>}
            </div>

            {/* Department */}
            <div className="space-y-1">
              <label htmlFor="signup-dept" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Academic Department</label>
              <input
                id="signup-dept"
                type="text"
                {...register('department', { required: 'Department is required' })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                placeholder="E.g., Computer Science"
              />
              {errors.department && <span className="text-[11px] text-rose-500 font-semibold">{errors.department.message}</span>}
            </div>

            {/* Student ID (Only shown for Student role) */}
            {role === 'student' && (
              <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                <label htmlFor="signup-studentid" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Official Student ID</label>
                <input
                  id="signup-studentid"
                  type="text"
                  {...register('studentId', { required: 'Student ID is required for verification' })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                  placeholder="E.g., CS-2024-0042"
                />
                {errors.studentId && <span className="text-[11px] text-rose-500 font-semibold">{errors.studentId.message}</span>}
              </div>
            )}

            {/* Submit */}
            <button
              id="signup-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md shadow-blue-500/10 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
            >
              {isSubmitting ? 'Registering...' : 'Register Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer links */}
          <div className="pt-6 border-t border-gray-50 dark:border-slate-800 text-center text-xs text-gray-500 dark:text-gray-400 font-sans">
            Already have an institutional account?{' '}
            <Link id="signup-login-link" to="/login" className="text-blue-600 font-bold hover:underline dark:text-blue-400">
              Sign In Here
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
