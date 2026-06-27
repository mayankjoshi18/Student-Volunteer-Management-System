/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Heart, Compass, ShieldCheck, Award, Sparkles, BookOpen } from 'lucide-react';

export default function About() {
  const values = [
    {
      title: 'Compassion & Service',
      description: 'We believe active empathy is the foundation of community healing. Every volunteer hour connects student energy directly with genuine human needs.',
      icon: <Heart className="w-6 h-6 text-rose-500" />,
    },
    {
      title: 'Student Leadership',
      description: 'We provide opportunities for students to organize, manage, and coordinate major events, building vital project management and interpersonal leadership skills.',
      icon: <Compass className="w-6 h-6 text-blue-500" />,
    },
    {
      title: 'Integrity & Verification',
      description: 'Transparency is core to our operations. Every volunteering log is verified by coordinators and backed by unique, digitally verifiable certificate codes.',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
    },
    {
      title: 'Academic Excellence',
      description: 'Integrative social learning combines academic excellence with community service, building well-rounded, responsible global citizens.',
      icon: <BookOpen className="w-6 h-6 text-indigo-500" />,
    },
  ];

  return (
    <div id="about-page" className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-200">
      
      {/* Narrative Intro */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs font-bold uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" /> Our Vision & Mission
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight"
          >
            Connecting Campus Talent with Community Gaps
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-sm sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-sans max-w-3xl mx-auto"
          >
            VolaLink was initiated in 2024 by the Student Affairs Council at Apex State University to replace old physical logbooks with an efficient, transparent, and rewarding digital credentialing dashboard. Today, it operates as the official nexus of university-sanctioned social development, volunteer hour tracking, and academic community credits.
          </motion.p>
        </div>
      </section>

      {/* Grid of Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-16">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Our Core Values
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Four core values guide every event we organize and every hour we log.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((val, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex gap-5 items-start"
            >
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 shrink-0 border border-gray-50 dark:border-slate-700">
                {val.icon}
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-gray-950 dark:text-white leading-tight">{val.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-sans">{val.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Program Stats banner */}
      <section className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 py-16 sm:py-20 text-center px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <Award className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-serif">
            "We make a living by what we get, but we make a life by what we give."
          </h2>
          <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 font-bold font-sans">
            — Winston Churchill
          </p>
        </div>
      </section>

    </div>
  );
}
