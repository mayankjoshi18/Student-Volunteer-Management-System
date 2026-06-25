/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockApi } from '../../services/mockApi';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Clock, Calendar, ShieldCheck, Award, Flame, ArrowRight, Star, TrendingUp } from 'lucide-react';

export default function StudentOverview() {
  const { currentUser, addToast } = useApp();
  const [analytics, setAnalytics] = useState<any>(null);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const stats = await mockApi.getStudentAnalytics(currentUser.id);
        setAnalytics(stats);

        // Get student's registrations
        const regs = await mockApi.getRegistrationsByStudent(currentUser.id);
        const upcomingRegs = regs.filter(r => r.status === 'approved' && !r.attended);
        setUpcoming(upcomingRegs.slice(0, 2));

        // Get leaderboard
        const board = await mockApi.getLeaderboard();
        setLeaderboard(board.slice(0, 3));
      } catch (err) {
        addToast('error', 'Failed to Load Overview', 'Could not sync dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  if (loading || !analytics) {
    return (
      <div className="flex-1 p-8 text-center py-20">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500 font-semibold">Generating student dashboard analytics...</p>
      </div>
    );
  }

  // Prep Chart Data
  const chartData = Object.entries(analytics.categoryHours)
    .map(([key, value]) => ({
      name: key.replace('-', ' ').toUpperCase(),
      value: value as number,
    }))
    .filter((d) => d.value > 0);

  const COLORS = ['#10b981', '#6366f1', '#f43f5e', '#f59e0b', '#06b6d4'];

  // Points target progress
  const pointsTarget = 1000;
  const pointsPercent = Math.min(100, Math.round((currentUser!.points / pointsTarget) * 100));

  return (
    <div id="student-overview" className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto bg-slate-50 dark:bg-slate-950">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight leading-none">
            Welcome back, {currentUser?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 font-sans">
            Ready to log new achievements? Check your dashboard summary below.
          </p>
        </div>
        <Link
          id="student-browse-btn-banner"
          to="/student/events"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/15 cursor-pointer active:scale-[0.98] transition-all"
        >
          Explore Volunteer Events <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Modern Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-min font-sans">
        
        {/* Hours Logged (Bento Cell) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[160px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Service Hours</span>
            <div className="p-2 bg-emerald-100/70 dark:bg-emerald-950/40 rounded-xl">
              <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none">{analytics.totalHours} Hrs</p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +3 hours this week
            </p>
          </div>
        </div>

        {/* Completed drives (Bento Cell) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[160px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Drives</span>
            <div className="p-2 bg-indigo-100/70 dark:bg-indigo-950/40 rounded-xl">
              <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none">{analytics.totalEvents} Events</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-2">Across multiple departments</p>
          </div>
        </div>

        {/* Pending Approval (Bento Cell) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[160px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Approvals</span>
            <div className="p-2 bg-amber-100/70 dark:bg-amber-950/40 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none">{analytics.pendingRegistrations} Requests</p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold mt-2">Awaiting coordinator action</p>
          </div>
        </div>

        {/* Milestone Target Badges (Premium Gradient Bento Cell) */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between lg:row-span-2 min-h-[160px]">
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl font-black font-mono leading-none select-none">
            {pointsPercent}%
          </div>
          
          <div className="relative z-10 space-y-1">
            <h3 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5 text-white">
              <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
              Honorary Status
            </h3>
            <p className="text-[11px] text-blue-100 font-medium leading-relaxed font-sans">
              Log {pointsTarget - currentUser!.points} more points to unlock the Bronze Academic Shield badge!
            </p>
          </div>

          <div className="relative z-10 mt-4 space-y-1">
            <div className="flex justify-between items-center text-[10px] text-blue-200 font-bold">
              <span>Tier: General</span>
              <span>1,000 PTS</span>
            </div>
            <div className="w-full bg-black/15 h-2 rounded-full overflow-hidden border border-white/5">
              <div className="bg-gradient-to-r from-amber-400 to-amber-300 h-full rounded-full" style={{ width: `${pointsPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Hour Breakdown Pie Chart (Bento Cell - spans 2 columns on large screens) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 lg:col-span-2 space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-800 dark:text-white text-sm">Hour Distribution by Sector</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Shows how your academic service credits are divided.</p>
          </div>

          {chartData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-7 h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} Hours`, 'Sector contribution']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="md:col-span-5 space-y-1.5 text-xs font-sans font-bold">
                {chartData.map((d, index) => (
                  <div key={d.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 capitalize">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      {d.name.toLowerCase()}
                    </span>
                    <span className="text-gray-950 dark:text-white font-mono text-[11px]">{d.value}h</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-gray-400">
              Register and log hours to generate your distribution breakdown.
            </div>
          )}
        </div>

        {/* Level points (Bento Cell) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[160px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Honor Points</span>
            <div className="p-2 bg-blue-100/70 dark:bg-blue-950/40 rounded-xl">
              <Flame className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none">{currentUser?.points} PTS</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-2">Ranked in top {currentUser?.role === 'student' ? '12%' : '5%'} of campus</p>
          </div>
        </div>

        {/* Upcoming commitments (Bento Cell - spans 3 columns on large screens) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-sm">Upcoming Registered Events</h3>
            <Link to="/student/registered" className="text-blue-600 hover:underline text-xs font-bold">View All</Link>
          </div>
          
          {upcoming.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {upcoming.map((u) => (
                <div key={u.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between gap-3 shadow-sm">
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 rounded-full text-[9px] font-bold uppercase tracking-wider">Approved</span>
                    <h4 className="font-bold text-xs text-gray-950 dark:text-white mt-1.5 truncate">{u.eventTitle}</h4>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1 font-semibold">
                      <Calendar className="w-3 h-3 text-slate-400" /> {u.eventDate}
                    </p>
                  </div>
                  <Link
                    id={`view-event-commitment-${u.id}`}
                    to={`/event/${u.eventId}`}
                    className="w-full text-center py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
                  >
                    View Venue details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center text-xs text-slate-400">
              No upcoming approved schedules. Join campaigns from the browse tab!
            </div>
          )}
        </div>

        {/* Student Leaderboard Spotlights (Bento Cell - spans 1 column on large screens) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 space-y-4">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-sm flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            Top Volunteers
          </h3>

          <div className="space-y-3 font-sans">
            {leaderboard.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-4 text-center font-extrabold text-[10px] ${
                    item.rank === 1 ? 'text-amber-500 font-black' : item.rank === 2 ? 'text-slate-400' : 'text-amber-800'
                  }`}>
                    {item.rank}
                  </span>
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-150 dark:border-slate-800 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-gray-900 dark:text-white truncate leading-tight">{item.name}</p>
                    <p className="text-[9px] text-gray-400 truncate leading-none mt-0.5">{item.department}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-900 dark:text-white bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md shrink-0">
                  {item.hoursLogged}h
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
