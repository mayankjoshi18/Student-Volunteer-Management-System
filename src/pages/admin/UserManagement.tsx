/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockApi } from '../../services/mockApi';
import { User, UserRole } from '../../types';
import { Shield, ShieldAlert, CheckCircle, Ban, RefreshCw } from 'lucide-react';

export default function UserManagement() {
  const { addToast, currentUser } = useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Keep track of mock suspended status locally
  const [suspendedMap, setSuspendedMap] = useState<Record<string, boolean>>({});

  const fetchUsersList = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getUsers();
      setUsers(data);
    } catch (err) {
      addToast('error', 'Sync Failed', 'Could not sync campus users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersList();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole, name: string) => {
    if (userId === currentUser?.id) {
      addToast('warning', 'Action Forbidden', 'You cannot alter your own admin role settings.');
      return;
    }
    try {
      await mockApi.updateUserRole(userId, newRole);
      addToast('success', 'Role Updated', `Changed credentials for ${name} to "${newRole}".`);
      fetchUsersList();
    } catch (err) {
      addToast('error', 'Action Failed', 'Could not save credentials modifications.');
    }
  };

  const handleToggleSuspend = (userId: string, name: string) => {
    if (userId === currentUser?.id) {
      addToast('warning', 'Action Forbidden', 'You cannot suspend your own administrative account.');
      return;
    }
    const currentlySuspended = suspendedMap[userId] || false;
    setSuspendedMap(prev => ({ ...prev, [userId]: !currentlySuspended }));
    addToast(
      currentlySuspended ? 'success' : 'warning',
      currentlySuspended ? 'Account Restored' : 'Account Suspended',
      `Successfully ${currentlySuspended ? 'restored' : 'suspended'} access for ${name}.`
    );
  };

  return (
    <div id="admin-user-management" className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight leading-none flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-500" />
            Institutional User Directory
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Configure system authorization. Alter credentials, view departments, and suspend disruptive accounts.
          </p>
        </div>
        <button
          id="refresh-users-btn"
          onClick={fetchUsersList}
          className="p-2 border border-gray-100 dark:border-slate-850 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-gray-500"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500 font-semibold font-sans">Updating user registries...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              
              <thead className="bg-gray-50 dark:bg-slate-800 text-gray-400 font-extrabold uppercase border-b border-gray-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">User Portrait & Name</th>
                  <th className="px-6 py-4">Institutional Email</th>
                  <th className="px-6 py-4">Academic Department</th>
                  <th className="px-6 py-4">Verification State</th>
                  <th className="px-6 py-4">System Credentials</th>
                  <th className="px-6 py-4 text-right">Directory Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 bg-white dark:bg-slate-900 font-medium text-gray-700 dark:text-gray-200">
                {users.map((u) => {
                  const isSuspended = suspendedMap[u.id] || false;

                  return (
                    <tr key={u.id} id={`user-row-${u.id}`} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-all">
                      
                      {/* Avatar + Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-full border border-gray-100 dark:border-slate-850"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-extrabold text-gray-950 dark:text-white">{u.name}</p>
                            {u.studentId && <p className="text-[10px] text-gray-400 font-semibold">ID: {u.studentId}</p>}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-semibold">{u.email}</td>

                      {/* Department */}
                      <td className="px-6 py-4 font-bold text-gray-500 dark:text-gray-400">{u.department || 'N/A'}</td>

                      {/* Suspension state */}
                      <td className="px-6 py-4">
                        {isSuspended ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-950/20 px-2 py-0.5 rounded-full uppercase">
                            Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full uppercase">
                            Active
                          </span>
                        )}
                      </td>

                      {/* Credentials selector */}
                      <td className="px-6 py-4">
                        <select
                          id={`user-role-select-${u.id}`}
                          value={u.role}
                          onChange={(evt) => handleRoleChange(u.id, evt.target.value as UserRole, u.name)}
                          className="px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-slate-800 text-[10px] uppercase font-bold outline-none bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500/10 text-gray-800 dark:text-gray-200"
                        >
                          <option value="student">student</option>
                          <option value="coordinator">coordinator</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          id={`toggle-suspend-${u.id}`}
                          onClick={() => handleToggleSuspend(u.id, u.name)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            isSuspended
                              ? 'bg-emerald-50 hover:bg-emerald-150 text-emerald-600 border-emerald-100'
                              : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-100'
                          }`}
                          title={isSuspended ? 'Restore Access' : 'Suspend user'}
                        >
                          {isSuspended ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        </div>
      )}

    </div>
  );
}
