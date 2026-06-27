/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, Sparkles, Award, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { UserRole } from '../../types';

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  const presets = {
    student: { email: 'alex.mercer@university.edu', name: 'Alex Mercer (Student)' },
    coordinator: { email: 'sarah.jenkins@university.edu', name: 'Dr. Sarah Jenkins (Coordinator)' },
    admin: { email: 'arthur.harrison@university.edu', name: 'Arthur Harrison (Admin)' },
  };

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: presets.student.email,
      password: 'password123',
    },
  });

  const handleApplyPreset = (role: UserRole) => {
    setSelectedRole(role);
    setValue('email', presets[role].email);
  };

  const onSubmit = async (data: any) => {
    try {
      const user = await login(data.email, data.password, selectedRole);
      navigate(`/${user.role}`);
    } catch (err) {
      // Error handled by context toast
    }
  };

  return (
    <div id="login-page" className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      
      {/* Visual Column */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.25),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5))]" />
        
        {/* Abstract pattern visual */}
        <div className="relative z-10 max-w-md space-y-6 text-center lg:text-left">
          <div className="inline-flex bg-blue-600 p-3 rounded-2xl shadow-xl border border-blue-500/30 text-white mb-2">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
            Apex State Student Volunteer Registry
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            "Volunteering is the ultimate exercise in democracy. You vote in elections once a year, but when you volunteer, you vote every day about the kind of community you want to live in."
          </p>
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Official Student Affairs Portal</span>
            <span>Est. 2024</span>
          </div>
        </div>
      </div>

      {/* Form Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-8 rounded-3xl shadow-sm">
          
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" /> Sign In to Your Space
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-sans">
              Access your events database, log hours, or approve certificates.
            </p>
          </div>

          {/* Role Presets tabs */}
          <div className="space-y-1.5 p-1 bg-gray-50 dark:bg-slate-800 rounded-2xl">
            <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase text-center py-1 flex items-center justify-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-500" /> Select Role to Login
            </p>
            <div className="grid grid-cols-3 gap-1">
              {(['student', 'coordinator', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  id={`login-preset-btn-${r}`}
                  type="button"
                  onClick={() => handleApplyPreset(r)}
                  className={`text-xs py-2 px-1 rounded-xl capitalize font-bold transition-all cursor-pointer ${
                    selectedRole === r
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                      : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 text-[11px] text-blue-800 dark:text-blue-300 font-sans leading-relaxed text-center">
            Currently applying preset configuration for <span className="font-bold">{presets[selectedRole].name}</span>
          </div>

          <form id="login-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="login-email" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Institutional Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  id="login-email"
                  type="email"
                  {...register('email', { required: 'Institutional email is required' })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                  placeholder="alex.mercer@university.edu"
                />
              </div>
              {errors.email && <span className="text-[11px] text-rose-500 font-semibold">{errors.email.message}</span>}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label htmlFor="login-password" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Password</label>
                <Link
                  id="login-forgot-link"
                  to="/forgot-password"
                  className="text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                  placeholder="••••••••••••"
                />
                <button
                  id="login-toggle-pw-visibility"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              {errors.password && <span className="text-[11px] text-rose-500 font-semibold">{errors.password.message}</span>}
            </div>

            {/* Submit Button */}
            <button
              id="login-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md shadow-blue-500/10 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
            >
              {isSubmitting ? 'Verifying Account...' : 'Sign In Now'}
              <LogIn className="w-4 h-4 shrink-0" />
            </button>
          </form>

          {/* Footer links */}
          <div className="pt-6 border-t border-gray-50 dark:border-slate-800 text-center text-xs text-gray-500 dark:text-gray-400 font-sans">
            Don't have an institutional account?{' '}
            <Link id="login-signup-link" to="/signup" className="text-blue-600 font-bold hover:underline dark:text-blue-400">
              Sign Up Here
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
