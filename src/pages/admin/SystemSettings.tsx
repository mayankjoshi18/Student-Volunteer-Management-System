/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useApp } from '../../context/AppContext';
import { mockApi } from '../../services/mockApi';
import { Settings, Save, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function SystemSettings() {
  const { addToast } = useApp();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      uniName: 'Apex State University',
      regMode: 'open',
      credentialModel: 'sec_signed',
    },
  });

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setSubmitting(false);
    addToast('success', 'System Config Saved', 'Apex State global university credentials updated successfully.');
  };

  const handleResetDatabase = () => {
    if (window.confirm('WARNING: This will wipe all current registrations, newly created events, and feedback comments, and restore VolaLink to factory default states. Proceed?')) {
      mockApi.resetDatabase();
      addToast('success', 'Database Re-seeded', 'Restored default users, events, and hours rosters. Reloading system...', 2500);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div id="admin-settings" className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto max-w-2xl">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight leading-none flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-500" />
          Platform Configuration settings
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Modify campus registry boundaries, registration scopes, and perform emergency system restores.
        </p>
      </div>

      <div className="space-y-8 font-sans">
        
        {/* Core Settings Card */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm">
          <form id="system-settings-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="space-y-1">
              <label htmlFor="sys-uniname" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Institutional Brand Title</label>
              <input
                id="sys-uniname"
                type="text"
                {...register('uniName', { required: 'Institutional name is required' })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500/10 outline-none font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Registration Mode */}
              <div className="space-y-1">
                <label htmlFor="sys-regmode" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Student Sign-Up Scope</label>
                <select
                  id="sys-regmode"
                  {...register('regMode')}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500/10 outline-none"
                >
                  <option value="open">Open (All students can sign up)</option>
                  <option value="restricted">Restricted (Institutional domains only)</option>
                  <option value="manual">Manual Verification Required</option>
                </select>
              </div>

              {/* Credentialing model */}
              <div className="space-y-1">
                <label htmlFor="sys-credmodel" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Digital Credentials Model</label>
                <select
                  id="sys-credmodel"
                  {...register('credentialModel')}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500/10 outline-none"
                >
                  <option value="sec_signed">SEC Cryptographically Certified</option>
                  <option value="standard_pdf">Standard PDF Downloadable</option>
                </select>
              </div>
            </div>

            {/* Save trigger */}
            <div className="pt-2">
              <button
                id="sys-save-config-btn"
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/10 disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {submitting ? 'Updating settings...' : 'Save System configuration'}
              </button>
            </div>

          </form>
        </div>

        {/* Emergency System Restore */}
        <div className="bg-red-50/20 dark:bg-red-950/10 border border-red-100 dark:border-red-950 p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="flex gap-3 items-start">
            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-extrabold text-sm text-red-800 dark:text-red-400">Emergency System Database Re-seed</h3>
              <p className="text-xs text-red-700 dark:text-red-300/80 leading-relaxed mt-1">
                Clears all current mock transactions, custom feedback, and registration statuses. This re-seeds VolaLink to the original default Student, Coordinator, and Administrative credentials.
              </p>
            </div>
          </div>
          
          <button
            id="sys-reset-db-btn"
            onClick={handleResetDatabase}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/15 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Reset & Re-Seed Database
          </button>
        </div>

      </div>

    </div>
  );
}
