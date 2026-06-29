/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Activity, 
  AlertTriangle,
  Clock,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  CalendarDays,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';
import { UserRole } from '../types';

interface DashboardHomeProps {
  userRole: UserRole;
  userName: string;
  userContext: any;
  onNavigateToTab: (tab: string) => void;
}

export default function DashboardHome({ userRole, userName, userContext, onNavigateToTab }: DashboardHomeProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch('/api/erp/stats');
        const statsData = await statsRes.json();
        setStats(statsData);

        const annRes = await fetch(`/api/erp/announcements?target=${userRole}`);
        const annData = await annRes.json();
        setAnnouncements(annData.slice(0, 3));
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userRole]);

  // Elegant static dataset in case backend is slow
  const mockDeptData = [
    { name: 'Computer Science', code: 'CSE', studentCount: 380, avgCgpa: 8.4, avgAttendance: 84 },
    { name: 'AI & Machine Learning', code: 'AIML', studentCount: 160, avgCgpa: 8.6, avgAttendance: 88 },
    { name: 'Information Science', code: 'ISE', studentCount: 150, avgCgpa: 8.1, avgAttendance: 82 },
    { name: 'Electronics', code: 'ECE', studentCount: 180, avgCgpa: 7.9, avgAttendance: 80 },
    { name: 'Mechanical', code: 'ME', studentCount: 80, avgCgpa: 7.2, avgAttendance: 76 },
    { name: 'Civil', code: 'CIV', studentCount: 50, avgCgpa: 7.0, avgAttendance: 74 },
  ];

  const placementSalaryData = [
    { range: '4 - 8 LPA', count: 180, color: '#F59E0B' },
    { range: '8 - 15 LPA', count: 95, color: '#3B82F6' },
    { range: '15 - 25 LPA', count: 42, color: '#10B981' },
    { range: '25+ LPA', count: 14, color: '#8B5CF6' },
  ];

  const studentPerformanceTrend = [
    { sem: 'Sem 1', gpa: 7.6, classAvg: 7.2 },
    { sem: 'Sem 2', gpa: 8.0, classAvg: 7.4 },
    { sem: 'Sem 3', gpa: 8.3, classAvg: 7.5 },
    { sem: 'Sem 4', gpa: 8.5, classAvg: 7.6 },
  ];

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-12 bg-slate-800 animate-pulse rounded-lg w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-800 animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-96 bg-slate-800 animate-pulse rounded-xl" />
          <div className="h-96 bg-slate-800 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  const totals = stats?.totals || { students: 1000, faculty: 50, departments: 7, placementPercentage: 74.5 };
  const deptList = stats?.departments || mockDeptData;
  const recentActs = stats?.recentActivities || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Premium Hero Banner Bento Block */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 p-6 md:p-8 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-xl">
        {/* Abstract Bento Grid background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-b from-amber-500/5 to-transparent rounded-full blur-3xl" />
        
        <div className="space-y-3 relative z-10">
          <div className="flex items-center gap-2 text-amber-400 text-[10px] font-mono font-semibold uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-full w-fit border border-amber-500/15 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> AI Coordinator Services Active
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight text-white">
            Welcome, <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">{userName || "ERP Session"}</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Athena automated student analytics and operations database is live. Track grade logs, placement records, digital collections, and attendance histories.
          </p>
        </div>
        
        {/* Integrity Gauge */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60 flex items-center gap-4 shrink-0 relative z-10 shadow-inner">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center border border-emerald-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider font-mono">System Status</span>
            <h4 className="text-xs font-bold text-emerald-400 font-mono tracking-wide">ONLINE & SECURE</h4>
            <p className="text-[9px] text-slate-500">Auto-synchronized just now</p>
          </div>
        </div>
      </div>

      {/* 2. Unified 12-Column Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Bento Cell 1: Academics Stats (col-span-3) */}
        <div className="md:col-span-6 lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group min-h-[140px]">
          <div className="absolute right-[-10px] bottom-[-10px] text-slate-100 font-extrabold text-8xl font-display opacity-20 select-none pointer-events-none group-hover:scale-110 transition-transform duration-300">
            1K
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Academics</span>
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1 mt-4 z-10 relative">
            <h3 className="text-3xl font-bold font-display text-slate-900 tracking-tight">{totals.students}</h3>
            <p className="text-[10px] text-slate-400 font-mono font-medium">120 Materialized Logs</p>
          </div>
        </div>

        {/* Bento Cell 2: Departments Stats (col-span-3) */}
        <div className="md:col-span-6 lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group min-h-[140px]">
          <div className="absolute right-[-10px] bottom-[-10px] text-slate-100 font-extrabold text-8xl font-display opacity-20 select-none pointer-events-none group-hover:scale-110 transition-transform duration-300">
            07
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Departments</span>
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1 mt-4 z-10 relative">
            <h3 className="text-3xl font-bold font-display text-slate-900 tracking-tight">{totals.departments}</h3>
            <p className="text-[10px] text-amber-600 font-mono font-medium">Core Divisions Active</p>
          </div>
        </div>

        {/* Bento Cell 3: Active Faculty Stats (col-span-3) */}
        <div className="md:col-span-6 lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group min-h-[140px]">
          <div className="absolute right-[-10px] bottom-[-10px] text-slate-100 font-extrabold text-8xl font-display opacity-20 select-none pointer-events-none group-hover:scale-110 transition-transform duration-300">
            50
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Faculty</span>
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1 mt-4 z-10 relative">
            <h3 className="text-3xl font-bold font-display text-slate-900 tracking-tight">{totals.faculty}</h3>
            <p className="text-[10px] text-slate-400 font-mono font-medium">Permanent Advisors</p>
          </div>
        </div>

        {/* Bento Cell 4: Placement Drive Stats (col-span-3) */}
        <div className="md:col-span-6 lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group min-h-[140px]">
          <div className="absolute right-[-10px] bottom-[-10px] text-slate-100 font-extrabold text-8xl font-display opacity-20 select-none pointer-events-none group-hover:scale-110 transition-transform duration-300">
            74%
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Placements</span>
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1 mt-4 z-10 relative">
            <h3 className="text-3xl font-bold font-display text-slate-900 tracking-tight">{totals.placementPercentage}%</h3>
            <p className="text-[10px] text-emerald-600 font-mono font-medium">Batch Placement Ratio</p>
          </div>
        </div>

        {/* Bento Cell 5: Academic Performance Chart Card (col-span-8) */}
        <div className="md:col-span-12 lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-200/50 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[380px]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">Academic Performance Analytics</h3>
              <p className="text-xs text-slate-500">Student grade distribution logs & semester metrics</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full font-bold font-mono border border-indigo-100/50">
              <TrendingUp className="w-3.5 h-3.5" /> MULTI-COHORT AVERAGE
            </div>
          </div>

          <div className="h-72 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studentPerformanceTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClass" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.08}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="sem" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis domain={[4, 10]} stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, background: '#0F172A', color: '#fff', borderRadius: '8px', border: 'none', shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                <Area type="monotone" dataKey="gpa" stroke="#6366F1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGpa)" name="Target Student" />
                <Area type="monotone" dataKey="classAvg" stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="3 3" fillOpacity={1} fill="url(#colorClass)" name="Batch Class Average" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bento Cell 6: Quick Operations Panel (col-span-4) */}
        <div className="md:col-span-12 lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-200/50 transition-all duration-300 flex flex-col justify-between min-h-[380px]">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display mb-1">Quick Operations</h3>
            <p className="text-xs text-slate-500 mb-6">Common workspace tools & fast action routers</p>
          </div>
          
          <div className="flex flex-col gap-3 flex-1 justify-center">
            {userRole === 'Super Admin' || userRole === 'College Admin' ? (
              <>
                <button id="quick-audit-students" onClick={() => onNavigateToTab('students')} className="w-full py-3.5 px-4 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 text-xs font-bold text-left transition-all border border-slate-100 hover:border-indigo-100 flex items-center justify-between group/btn cursor-pointer">
                  <span>Audit Enrolled Student Records</span> 
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover/btn:translate-x-1 transition-transform" />
                </button>
                <button id="quick-manage-fees" onClick={() => onNavigateToTab('fees')} className="w-full py-3.5 px-4 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800 text-xs font-bold text-left transition-all border border-slate-100 hover:border-amber-100 flex items-center justify-between group/btn cursor-pointer">
                  <span>Manage Collection Records</span> 
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover/btn:translate-x-1 transition-transform" />
                </button>
                <button id="quick-publish-bulletin" onClick={() => onNavigateToTab('announcements')} className="w-full py-3.5 px-4 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-bold text-left transition-all border border-slate-100 hover:border-emerald-100 flex items-center justify-between group/btn cursor-pointer">
                  <span>Publish University Bulletin</span> 
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </>
            ) : userRole === 'Faculty' ? (
              <>
                <button id="quick-attendance" onClick={() => onNavigateToTab('attendance_marking')} className="w-full py-3.5 px-4 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 text-xs font-bold text-left transition-all border border-slate-100 hover:border-indigo-100 flex items-center justify-between group/btn cursor-pointer">
                  <span>Subject Roll-Call Register</span> 
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover/btn:translate-x-1 transition-transform" />
                </button>
                <button id="quick-upload-grades" onClick={() => onNavigateToTab('marks_entry')} className="w-full py-3.5 px-4 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800 text-xs font-bold text-left transition-all border border-slate-100 hover:border-amber-100 flex items-center justify-between group/btn cursor-pointer">
                  <span>Upload Internal Assessments</span> 
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </>
            ) : (
              <>
                <button id="quick-grades" onClick={() => onNavigateToTab('student_marks')} className="w-full py-3.5 px-4 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 text-xs font-bold text-left transition-all border border-slate-100 hover:border-indigo-100 flex items-center justify-between group/btn cursor-pointer">
                  <span>Check Grade Report Cards</span> 
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover/btn:translate-x-1 transition-transform" />
                </button>
                <button id="quick-fees" onClick={() => onNavigateToTab('student_fees')} className="w-full py-3.5 px-4 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800 text-xs font-bold text-left transition-all border border-slate-100 hover:border-amber-100 flex items-center justify-between group/btn cursor-pointer">
                  <span>Pay Online Fee Balances</span> 
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </>
            )}
          </div>

          <div className="text-[10px] text-slate-400 text-center font-mono mt-4 pt-3 border-t border-slate-50">
            Athena Multi-Channel Middleware Active
          </div>
        </div>

        {/* Bento Cell 7: Department Status Audit (col-span-12) */}
        <div className="md:col-span-12 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-200/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">Department Status Audit</h3>
              <p className="text-xs text-slate-500">Core engineering divisions and metrics summary</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {deptList.slice(0, 3).map((d: any, i: number) => (
              <div key={i} className="p-5 bg-slate-50/70 hover:bg-indigo-50/10 rounded-xl border border-slate-100/80 hover:border-indigo-100/80 transition-all duration-200 space-y-3 relative overflow-hidden group/dept">
                <div className="absolute right-2 bottom-[-15px] text-slate-200/50 font-black text-6xl font-display opacity-30 select-none pointer-events-none group-hover/dept:translate-y-[-5px] transition-transform">
                  {d.code}
                </div>
                
                <h4 className="text-xs font-bold text-slate-800 tracking-tight leading-relaxed">{d.name}</h4>
                
                <div className="space-y-0.5 z-10 relative">
                  <span className="text-[9px] text-slate-400 block font-mono font-bold tracking-wider">ENROLLED STUDENTS</span>
                  <span className="text-xl font-black text-slate-900 font-display">{d.studentCount || 120}</span>
                </div>
                
                <div className="flex items-center justify-between text-[10px] font-mono font-bold z-10 relative pt-2 border-t border-slate-100/50">
                  <span className="text-amber-600">AVG GPA: {d.avgCgpa || "8.1"}</span>
                  <span className="text-emerald-600">ATTN: {d.avgAttendance || "82"}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bento Cell 8: Announcements Bulletin Widget (col-span-6) */}
        <div className="md:col-span-12 lg:col-span-6 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-200/50 transition-all duration-300 flex flex-col justify-between min-h-[360px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">Active Bulletin</h3>
                <p className="text-xs text-slate-400">Published university notices and alerts</p>
              </div>
              <button onClick={() => onNavigateToTab('announcements')} className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer transition-colors font-mono">
                VIEW ALL <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              {announcements.map((ann, i) => (
                <div key={i} className="p-3.5 bg-slate-50 hover:bg-indigo-50/15 rounded-xl border border-slate-100 hover:border-indigo-100/50 transition-all duration-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase font-mono font-bold text-amber-600 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/15">{ann.category}</span>
                    <span className="text-[9px] text-slate-400 font-mono">{ann.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{ann.title}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bento Cell 9: Activity Logs timeline (col-span-6) */}
        <div className="md:col-span-12 lg:col-span-6 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-200/50 transition-all duration-300 flex flex-col justify-between min-h-[360px]">
          <div className="space-y-4 w-full">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">Activity Audits</h3>
              <p className="text-xs text-slate-400">Live system database write logs & operation events</p>
            </div>
            
            <div className="flex flex-col gap-3">
              {recentActs.map((act: any, i: number) => (
                <div key={i} className="flex gap-3 items-start p-2.5 bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1.5 shadow-sm" />
                  <div className="space-y-0.5 flex-1">
                    <p className="font-medium text-xs text-slate-700 leading-normal">{act.text}</p>
                    <span className="text-[9px] text-slate-400 font-mono font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {act.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
