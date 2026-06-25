/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Award, ArrowRight, ShieldCheck, Heart, Sparkles, Flame, CheckCircle, HelpCircle, Briefcase, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Home() {
  const { currentUser } = useApp();

  const stats = [
    { value: '1,450+', label: 'Registered Volunteers', icon: <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" /> },
    { value: '4,820+', label: 'Volunteering Hours Logged', icon: <Flame className="w-5 h-5 text-amber-500" /> },
    { value: '120+', label: 'Successful Events Conducted', icon: <CheckCircle className="w-5 h-5 text-emerald-500" /> },
    { value: '45+', label: 'Local Community Partners', icon: <Heart className="w-5 h-5 text-rose-500" /> },
  ];

  const valueProps = [
    {
      title: 'Real-Time Logging',
      description: 'Easily register for university social events and track your volunteer hours with immediate digital check-ins.',
      icon: <Flame className="w-6 h-6 text-amber-500" />,
    },
    {
      title: 'Official Certificates',
      description: 'Download verifiable digital certificates with unique credential codes directly upon project completion.',
      icon: <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    },
    {
      title: 'Gamified Incentives',
      description: 'Earn rank points, view student leaderboards, and showcase your civic contributions to potential employers.',
      icon: <Sparkles className="w-6 h-6 text-indigo-500" />,
    },
    {
      title: 'Multi-Role Synergy',
      description: 'Collaborate effortlessly across students, event coordinators, and university administration workspaces.',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
    },
  ];

  return (
    <div id="home-page" className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-slate-50 dark:from-slate-900/40 dark:via-slate-950 dark:to-slate-950 py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        {/* Ambient background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-400/10 dark:bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/50 border border-blue-200/50 dark:border-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-bold uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" /> Apex State Volunteer Network
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto"
          >
            Empowering Students.<br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-blue-300">
              Transforming Communities.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            Connect with campus volunteering opportunities, log your service hours, earn prestigious reward badges, and download verifiable achievement certificates in one unified SaaS ecosystem.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
          >
            <Link
              id="hero-primary-cta"
              to="/opportunities"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all cursor-pointer group active:scale-[0.98]"
            >
              Browse Events <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            {currentUser ? (
              <Link
                id="hero-secondary-cta"
                to={`/${currentUser.role}`}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-md transition-all active:scale-[0.98]"
              >
                Go to My Dashboard
              </Link>
            ) : (
              <Link
                id="hero-secondary-cta-login"
                to="/login"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-md transition-all active:scale-[0.98]"
              >
                Sign In Portal
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-slate-900 border-y border-gray-100 dark:border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-6 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800"
              >
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-gray-50 dark:border-slate-700">
                  {stat.icon}
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-950 dark:text-white leading-none">
                    {stat.value}
                  </h3>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 leading-normal">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Value Proposition Grid */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Designed for Modern Campus Communities
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            A comprehensive, digital-first operational system empowering social causes and student initiatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {valueProps.map((prop, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-500/20 dark:hover:border-blue-500/30 transition-all duration-300 space-y-5"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 flex items-center justify-center">
                {prop.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white leading-tight">
                {prop.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Roles Workspace Selection CTA */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-900/50 dark:to-indigo-950/50 text-white rounded-[2.5rem] p-8 sm:p-16 max-w-7xl mx-auto mx-4 sm:mx-6 lg:mx-8 mb-20 shadow-2xl relative overflow-hidden">
        {/* Decorator */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.1),transparent)]" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-8 sm:gap-12">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Ready to create positive campus impact?
            </h2>
            <p className="text-sm sm:text-base text-blue-100 max-w-xl leading-relaxed">
              Whether you are a student seeking volunteering opportunities, an event organizer, or a university administrator, VolaLink provides tailored tools for your workflow.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col sm:flex-row gap-4 w-full">
            <Link
              id="cta-roles-student"
              to="/signup"
              className="flex-1 text-center py-4 px-6 rounded-2xl bg-white text-blue-700 font-bold hover:bg-blue-50 transition-all shadow-lg text-sm"
            >
              Volunteer as Student
            </Link>
            <Link
              id="cta-roles-coordinator"
              to="/login"
              className="flex-1 text-center py-4 px-6 rounded-2xl bg-transparent border border-white/40 text-white font-bold hover:bg-white/10 transition-all text-sm"
            >
              Organize Events
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
