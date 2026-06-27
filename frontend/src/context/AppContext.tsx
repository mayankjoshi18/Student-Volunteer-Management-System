/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, ToastMessage } from '../types';
import { api } from '../services/api';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isLoading: boolean;
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, description?: string) => void;
  removeToast: (id: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  login: (email: string, password: string, role: UserRole) => Promise<User>;
  signup: (name: string, email: string, password: string, role: UserRole, department: string, studentId?: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshCurrentUser: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const refreshCurrentUser = async () => {
    try {
      const data = await api.getProfile();
      localStorage.setItem('vms_current_user', JSON.stringify(data.user));
      setCurrentUserState(data.user);
    } catch (error) {
      console.error('Failed to sync/refresh active profile with backend:', error);
    }
  };

  useEffect(() => {
    // Initial load: restore session from storage
    const userStr = localStorage.getItem('vms_current_user');
    const token = localStorage.getItem('vms_token');
    
    if (userStr && token) {
      setCurrentUserState(JSON.parse(userStr));
      refreshCurrentUser(); // Sync user profile fields with backend
    }
    setIsLoading(false);

    // Initial theme setup
    const savedTheme = localStorage.getItem('vms_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const setCurrentUser = (user: User | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem('vms_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vms_current_user');
      localStorage.removeItem('vms_token');
    }
  };

  const addToast = (type: ToastMessage['type'], title: string, description?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('vms_theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    addToast('info', `${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode Active`, 'UI theme updated successfully.');
  };

  const login = async (email: string, password: string, role: UserRole): Promise<User> => {
    setIsLoading(true);
    try {
      const data = await api.login({ email, role, password });
      const { user, token } = data;
      localStorage.setItem('vms_token', token);
      localStorage.setItem('vms_current_user', JSON.stringify(user));
      setCurrentUserState(user);
      addToast('success', 'Logged In Successfully', `Welcome back, ${user.name}!`);
      return user;
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message || 'An error occurred during login.';
      addToast('error', 'Login Failed', errorMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    department: string,
    studentId?: string
  ): Promise<User> => {
    setIsLoading(true);
    try {
      const data = await api.register({
        name,
        email,
        role,
        department,
        studentId,
        password,
      });
      const { user, token } = data;
      localStorage.setItem('vms_token', token);
      localStorage.setItem('vms_current_user', JSON.stringify(user));
      setCurrentUserState(user);
      addToast('success', 'Account Created Successfully', `Welcome to the network, ${name}!`);
      return user;
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message || 'An error occurred during sign up.';
      addToast('error', 'Signup Failed', errorMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.logout();
    } catch (error) {
      console.warn('Backend logout call skipped/failed:', error);
    } finally {
      localStorage.removeItem('vms_token');
      localStorage.removeItem('vms_current_user');
      setCurrentUserState(null);
      addToast('success', 'Logged Out', 'You have been securely logged out.');
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isLoading,
        toasts,
        addToast,
        removeToast,
        theme,
        toggleTheme,
        login,
        signup,
        logout,
        refreshCurrentUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
