/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Menu, X, Sun, Moon, LogOut, User as UserIcon, ShieldAlert, Award, Calendar, HelpCircle, Briefcase, ChevronDown } from 'lucide-react';
import { UserRole } from '../types';

export default function Navbar() {
  const { currentUser, login, logout, theme, toggleTheme } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleRoleSwitch = async (role: UserRole) => {
    let mockEmail = '';
    if (role === 'student') mockEmail = 'alex.mercer@university.edu';
    else if (role === 'coordinator') mockEmail = 'sarah.jenkins@university.edu';
    else if (role === 'admin') mockEmail = 'arthur.harrison@university.edu';
    
    await login(mockEmail, role);
    setUserDropdownOpen(false);
    navigate(`/${role}`);
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: <Calendar className="w-4 h-4" /> },
    { to: '/opportunities', label: 'Opportunities', icon: <Briefcase className="w-4 h-4" /> },
    { to: '/about', label: 'About', icon: <HelpCircle className="w-4 h-4" /> },
    { to: '/contact', label: 'Contact', icon: <UserIcon className="w-4 h-4" /> },
  ];

  return (
    <nav id="app-navbar" className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 border-b border-gray-100 dark:border-slate-800 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link id="navbar-logo-link" to="/" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xl tracking-tight">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-xl">
                <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="hidden sm:inline-block font-extrabold text-gray-900 dark:text-white text-lg">
                Vola<span className="text-blue-600 dark:text-blue-400">Link</span>
              </span>
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex ml-10 space-x-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  id={`navlink-desktop-${link.label.toLowerCase()}`}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/60 hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              id="navbar-theme-toggle"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {currentUser ? (
              <div className="relative">
                {/* User Dropdown Button */}
                <button
                  id="navbar-user-dropdown-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <img
                    id="navbar-avatar"
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-blue-100 dark:border-blue-900/50"
                    referrerPolicy="no-referrer"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">{currentUser.name}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 capitalize font-medium">{currentUser.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div id="navbar-dropdown-backdrop" className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                    <div id="navbar-dropdown-menu" className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/80 shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-gray-50 dark:border-slate-700/50">
                        <p className="text-xs text-gray-400 dark:text-gray-500">Logged in as</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{currentUser.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser.email}</p>
                      </div>

                      {/* Role Switcher Section */}
                      <div className="px-4 py-2 border-b border-gray-50 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-800/50">
                        <p className="text-[10px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-blue-500" /> Quick Role Switcher
                        </p>
                        <div className="mt-1.5 grid grid-cols-3 gap-1">
                          {(['student', 'coordinator', 'admin'] as UserRole[]).map((r) => (
                            <button
                              key={r}
                              id={`role-switch-btn-${r}`}
                              onClick={() => handleRoleSwitch(r)}
                              className={`text-[10px] font-semibold py-1 px-1.5 rounded-lg border text-center capitalize transition-all ${
                                currentUser.role === r
                                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                                  : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600'
                              }`}
                            >
                              {r === 'coordinator' ? 'Coord' : r}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Link to appropriate Dashboard */}
                      <div className="p-1">
                        <Link
                          id="navbar-dropdown-dashboard"
                          to={`/${currentUser.role}`}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <Award className="w-4 h-4 text-blue-500" />
                          My Dashboard
                        </Link>
                      </div>

                      <div className="p-1 border-t border-gray-50 dark:border-slate-700/50">
                        <button
                          id="navbar-dropdown-logout"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  id="navbar-login-link"
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  id="navbar-signup-link"
                  to="/signup"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl shadow-md shadow-blue-500/10 transition-all active:scale-[0.98]"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              id="navbar-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="navbar-mobile-drawer" className="md:hidden border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in fade-in duration-150">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              id={`navlink-mobile-${link.label.toLowerCase()}`}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/60'
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
          {!currentUser && (
            <div className="pt-4 border-t border-gray-100 dark:border-slate-800/80 flex flex-col gap-2">
              <Link
                id="navbar-mobile-login"
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/60 font-semibold"
              >
                Log In
              </Link>
              <Link
                id="navbar-mobile-signup"
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-md shadow-blue-500/10"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
