/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useForm } from 'react-hook-form';
import { useApp } from '../../context/AppContext';
import { Settings, Save, User as UserIcon } from 'lucide-react';

export default function ProfileSettings() {
  const { currentUser, setCurrentUser, addToast } = useApp();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: currentUser?.name || '',
      department: currentUser?.department || '',
      studentId: currentUser?.studentId || '',
      bio: currentUser?.bio || '',
    },
  });

  const onSubmit = async (data: any) => {
    if (!currentUser) return;
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    const updatedUser = {
      ...currentUser,
      ...data,
    };
    
    setCurrentUser(updatedUser);
    addToast('success', 'Profile Updated', 'Your student volunteer registration has been saved.');
  };

  return (
    <div id="student-profile-settings" className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto max-w-2xl">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight leading-none flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-500" />
          Student Profile Settings
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Modify your academic details, bios, and preferences.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm">
        <form id="student-settings-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-sans">
          
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 mb-4">
            <img
              src={currentUser?.avatar}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="font-extrabold text-sm text-gray-950 dark:text-white">{currentUser?.name}</h3>
              <p className="text-[10px] text-gray-400 capitalize font-bold mt-0.5">{currentUser?.role} Registration</p>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="settings-name" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Full Registration Name</label>
            <input
              id="settings-name"
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500/10 outline-none"
            />
            {errors.name && <span className="text-[10px] text-rose-500 font-bold">{errors.name.message}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="settings-dept" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Academic Department</label>
              <input
                id="settings-dept"
                type="text"
                {...register('department', { required: 'Department is required' })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500/10 outline-none"
              />
              {errors.department && <span className="text-[10px] text-rose-500 font-bold">{errors.department.message}</span>}
            </div>

            <div className="space-y-1">
              <label htmlFor="settings-sid" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Student ID Code</label>
              <input
                id="settings-sid"
                type="text"
                {...register('studentId', { required: 'Student ID is required' })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500/10 outline-none"
              />
              {errors.studentId && <span className="text-[10px] text-rose-500 font-bold">{errors.studentId.message}</span>}
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="settings-bio" className="text-xs font-semibold text-gray-500 dark:text-gray-400">Biography / Short Bio</label>
            <textarea
              id="settings-bio"
              rows={4}
              {...register('bio')}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500/10 outline-none resize-none"
              placeholder="Tell coordinators about yourself..."
            />
          </div>

          <button
            id="settings-save-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/10 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving changes...' : 'Save Profile Changes'}
          </button>

        </form>
      </div>

    </div>
  );
}
