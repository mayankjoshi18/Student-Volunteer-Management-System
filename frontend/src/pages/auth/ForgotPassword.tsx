/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { HelpCircle, Mail, ArrowLeft, KeyRound } from 'lucide-react';

export default function ForgotPassword() {
  const { addToast } = useApp();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '' } });

  const onSubmit = async (data: { email: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    addToast(
      'success',
      'Recovery Email Sent',
      `Check the inbox of ${data.email} for password reset instructions.`
    );
    reset();
  };

  return (
    <div id="forgot-password-page" className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-8 rounded-3xl shadow-sm space-y-6">
        
        <div className="text-center space-y-2">
          <div className="inline-flex bg-blue-100 dark:bg-blue-900/40 p-3 rounded-2xl text-blue-600 dark:text-blue-400 mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-gray-950 dark:text-white tracking-tight">Recover Password</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-sans leading-relaxed">
            Enter your verified institutional email and we will send you instructions to securely reset your credentials.
          </p>
        </div>

        <form id="forgot-pw-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="recover-email" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Institutional Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input
                id="recover-email"
                type="email"
                {...register('email', { required: 'Institutional email is required' })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                placeholder="alex.mercer@university.edu"
              />
            </div>
            {errors.email && <span className="text-[11px] text-rose-500 font-semibold">{errors.email.message}</span>}
          </div>

          <button
            id="forgot-pw-submit"
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md shadow-blue-500/10 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
          >
            {isSubmitting ? 'Sending instructions...' : 'Request Password Reset'}
          </button>
        </form>

        <div className="pt-4 border-t border-gray-50 dark:border-slate-800 text-center">
          <Link
            id="forgot-back-to-login"
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
