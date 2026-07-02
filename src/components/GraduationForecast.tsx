/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Award, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Search, 
  Cpu, 
  BookOpen, 
  BookMarked,
  ShieldAlert, 
  ArrowRight,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Student } from '../types';

interface GraduationForecastProps {
  userRole: 'Super Admin' | 'College Admin' | 'Faculty' | 'Student' | 'Parent';
  userEmail?: string;
  studentUsn?: string; // Optional override
}

export default function GraduationForecast({ userRole, userEmail, studentUsn }: GraduationForecastProps) {
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [selectedUsn, setSelectedUsn] = useState<string>('');
  const [forecastData, setForecastData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 1. Load Admin Student Directory if Role is Admin
  useEffect(() => {
    const fetchStudents = async () => {
      if (userRole === 'Super Admin' || userRole === 'College Admin' || userRole === 'Faculty') {
        try {
          const res = await fetch('/api/erp/students');
          const data = await res.json();
          setStudentsList(data);
          
          // Default selection to first student
          if (data.length > 0) {
            setSelectedUsn(data[0].usn);
          }
        } catch (e) {
          console.error("Failed to load students roster", e);
        }
      }
    };
    fetchStudents();
  }, [userRole]);

  // 2. Identify the active target student USN based on Roles
  useEffect(() => {
    const resolveTargetStudent = async () => {
      let usnToFetch = studentUsn;

      if (!usnToFetch) {
        if (userRole === 'Student') {
          // fetch current profile USN from endpoint
          try {
            const res = await fetch(`/api/erp/student/profile?userId=user_std_1`);
            const data = await res.json();
            usnToFetch = data?.student?.usn || '1MS23CS001';
          } catch {
            usnToFetch = '1MS23CS001';
          }
        } else if (userRole === 'Parent') {
          try {
            const res = await fetch(`/api/erp/parent/profile?email=${userEmail || 'parent_1@family.com'}`);
            const data = await res.json();
            usnToFetch = data?.student?.usn || '1MS23CS001';
          } catch {
            usnToFetch = '1MS23CS001';
          }
        }
      }

      if (usnToFetch) {
        setSelectedUsn(usnToFetch);
      }
    };
    
    resolveTargetStudent();
  }, [userRole, userEmail, studentUsn]);

  // 3. Fetch Forecast Analysis from AI backend
  const fetchForecast = async (usn: string) => {
    if (!usn) return;
    try {
      setLoading(true);
      const res = await fetch('/api/ai/graduation-forecaster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentUsn: usn })
      });
      const data = await res.json();
      setForecastData(data);
    } catch (e) {
      console.error("Failed to fetch graduation forecaster analysis", e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (selectedUsn) {
      fetchForecast(selectedUsn);
    }
  }, [selectedUsn]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (selectedUsn) {
      fetchForecast(selectedUsn);
    }
  };

  // Render Status Badge colors
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'On Track':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30';
      case 'At Risk':
        return 'bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30';
      case 'Delayed':
        return 'bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  // Render Gap status elements
  const renderGapIcon = (status: string) => {
    switch (status) {
      case 'Satisfied':
        return <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'In Progress':
        return <Clock className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />;
      case 'Missing':
        return <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />;
    }
  };

  const isAdminView = userRole === 'Super Admin' || userRole === 'College Admin' || userRole === 'Faculty';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase font-mono tracking-wider flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 animate-spin" /> AI Core Enabled
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
            AI Graduation Forecaster & Transcript Auditor
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Intelligent analysis of transcript metrics, prerequisite courses, credit categories, and attendance vectors.
          </p>
        </div>

        <button 
          onClick={handleRefresh}
          disabled={loading || isRefreshing}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs font-semibold cursor-pointer transition-colors self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Audit Snapshots</span>
        </button>
      </div>

      {/* Admin student selection directory panel */}
      {isAdminView && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2.5 w-full md:w-fit">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">Audit Student:</span>
          </div>

          <div className="relative flex-1 w-full">
            <select
              value={selectedUsn}
              onChange={(e) => setSelectedUsn(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 dark:text-slate-200"
            >
              {studentsList.map((st) => (
                <option key={st.usn} value={st.usn}>
                  {st.name} ({st.usn}) — CGPA: {st.cgpa} | Att: {st.attendancePercentage}%
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-6 py-12">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full animate-bounce">
              <Cpu className="w-8 h-8 animate-spin" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Generating Academic Transcript Audit...</h3>
            <p className="text-xs text-slate-400">Gemini model is auditing prerequisite course codes and compiling credit categories.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-28 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
            <div className="h-28 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
            <div className="h-28 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
          </div>
        </div>
      ) : forecastData ? (
        <div className="space-y-6">
          
          {/* Main overview cockpit grids */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Probability Gauge Widget Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider font-mono block">
                  Graduation Forecast
                </span>
                
                <div className="flex items-center gap-5">
                  {/* Styled Circular Progress SVG */}
                  <div className="relative w-20 h-20 shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        className="stroke-slate-100 dark:stroke-slate-800/80 fill-none"
                        strokeWidth="7"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        className={`fill-none transition-all duration-1000 ${
                          forecastData.timelyGraduationProbability >= 90
                            ? 'stroke-emerald-500'
                            : forecastData.timelyGraduationProbability >= 75
                            ? 'stroke-amber-500'
                            : 'stroke-rose-500'
                        }`}
                        strokeWidth="7"
                        strokeDasharray={2 * Math.PI * 34}
                        strokeDashoffset={2 * Math.PI * 34 * (1 - forecastData.timelyGraduationProbability / 100)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-lg font-extrabold text-slate-900 dark:text-white font-mono leading-none">
                        {forecastData.timelyGraduationProbability}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider font-mono inline-block ${getStatusStyle(forecastData.status)}`}>
                      {forecastData.status}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display">
                      {forecastData.timelyGraduationProbability >= 90 ? 'High Likelihood' : forecastData.timelyGraduationProbability >= 75 ? 'Moderate Risk' : 'Critical Credit Delay'}
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      Calculated using completed semesters and current enrollment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800/40 text-[11px] text-slate-500 dark:text-slate-400 leading-normal flex items-start gap-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>GPA Forecast trajectory: <strong className="font-mono text-slate-800 dark:text-slate-200">{forecastData.gpaForecast.toFixed(2)}</strong> by completion term.</span>
              </div>
            </div>

            {/* Total Credits Balance sheet Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider font-mono block">
                  Credit Sheets Balance
                </span>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/40 rounded-xl space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">EARNED (PASSED)</span>
                    <span className="text-lg font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                      {forecastData.creditsEarned}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/40 rounded-xl space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">IN PROGRESS</span>
                    <span className="text-lg font-extrabold font-mono text-amber-500 dark:text-amber-400">
                      {forecastData.creditsInProgress}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/40 rounded-xl space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">REMAINING</span>
                    <span className="text-lg font-extrabold font-mono text-slate-700 dark:text-slate-300">
                      {forecastData.creditsRemaining}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/40 rounded-xl space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">TOTAL REQUIRED</span>
                    <span className="text-lg font-extrabold font-mono text-slate-900 dark:text-white">
                      {forecastData.totalCreditsRequired}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Progress: {Math.round((forecastData.creditsEarned / forecastData.totalCreditsRequired) * 100)}%</span>
                  <span>Goal: {forecastData.totalCreditsRequired} Credits</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                    style={{ width: `${(forecastData.creditsEarned / forecastData.totalCreditsRequired) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Attendance Lock Risk Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider font-mono block">
                  Transit Attendance Risk Audit
                </span>

                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl border ${
                    forecastData.attendanceImpact.status === 'Critical Risk' 
                      ? 'bg-rose-50 text-rose-500 border-rose-100' 
                      : forecastData.attendanceImpact.status === 'Moderate Risk'
                      ? 'bg-amber-50 text-amber-500 border-amber-100'
                      : 'bg-emerald-50 text-emerald-500 border-emerald-100'
                  }`}>
                    <ShieldAlert className="w-5 h-5 shrink-0" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {forecastData.attendanceImpact.status}
                    </h4>
                    <span className="text-[10px] text-slate-400 leading-none">Exam cut-off cutoff is 75%</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                  {forecastData.attendanceImpact.details}
                </p>

                {forecastData.attendanceImpact.atRiskSubjects.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-rose-600 dark:text-rose-400 tracking-wider font-mono block">At-Risk Courses:</span>
                    <div className="flex flex-wrap gap-1">
                      {forecastData.attendanceImpact.atRiskSubjects.map((sub: string, index: number) => (
                        <span key={index} className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 text-[9px] font-semibold font-mono">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-50 dark:border-slate-800/40 italic">
                Verified from biometric academic rosters loggers.
              </div>
            </div>

          </div>

          {/* AI Narrative Section */}
          <div className="bg-gradient-to-br from-indigo-500/5 to-slate-900/5 dark:from-slate-900/50 dark:to-slate-950/30 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 space-y-3 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-display flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-500 shrink-0" /> AI Transcript Narrative Analysis
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {forecastData.transcriptAnalysis}
            </p>
          </div>

          {/* Recharts chart and Credit category gaps side-by-side grids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* GPA Progression chart */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-display flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-500 shrink-0" /> GPA Progression & Projections
                </h3>
                <p className="text-[11px] text-slate-400">
                  Semester GPA trajectory indicating completing requirements.
                </p>
              </div>

              <div className="w-full h-64 text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={forecastData.semesterBySemesterProgression}
                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                    <XAxis 
                      dataKey="semester" 
                      tickFormatter={(sem) => `Sem ${sem}`}
                      stroke="#94a3b8"
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis 
                      domain={[5, 10]} 
                      stroke="#94a3b8"
                      fontSize={10}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#f8fafc',
                        fontSize: '11px'
                      }}
                      formatter={(value: any, name: any, props: any) => [
                        `GPA: ${Number(value).toFixed(2)} (${props.payload.status})`,
                        'Academic Standing'
                      ]}
                      labelFormatter={(label) => `Semester ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="gpa" 
                      stroke="#4f46e5" 
                      strokeWidth={2.5}
                      fillOpacity={1} 
                      fill="url(#gpaGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Interactive Credit Auditor Category Panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-display flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-500 shrink-0" /> Credit Category Audit List
                </h3>
                <p className="text-[11px] text-slate-400 font-sans">
                  Prerequisites mapping based on University Syllabus parameters.
                </p>
              </div>

              <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                {forecastData.gaps.map((gp: any, index: number) => (
                  <div key={index} className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/40 rounded-2xl flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {renderGapIcon(gp.gapStatus)}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex justify-between items-center text-xs">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 font-display leading-tight">{gp.category}</h4>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono tracking-wider ${
                          gp.gapStatus === 'Satisfied' 
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' 
                            : gp.gapStatus === 'In Progress'
                            ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20'
                            : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20'
                        }`}>
                          {gp.gapStatus}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>Required: {gp.requiredCredits} | Earned: {gp.earnedCredits}</span>
                        <span>Gap: {Math.max(0, gp.requiredCredits - gp.earnedCredits)} Credits</span>
                      </div>

                      {/* Micro Progress bar */}
                      <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            gp.gapStatus === 'Satisfied' ? 'bg-emerald-500' : gp.gapStatus === 'In Progress' ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(100, (gp.earnedCredits / gp.requiredCredits) * 100)}%` }}
                        />
                      </div>

                      <p className="text-[10px] text-slate-500 leading-normal italic">
                        "{gp.details}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Remediation Plan & Recommendations Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-display flex items-center gap-2">
              <BookMarked className="w-4.5 h-4.5 text-indigo-500 shrink-0" /> AI-Authored Timely Graduation Remediation Plan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {forecastData.remediationPlan.map((plan: string, index: number) => (
                <div key={index} className="p-3.5 bg-indigo-50/20 dark:bg-indigo-950/10 border border-indigo-100/30 dark:border-indigo-900/20 rounded-2xl flex gap-3 text-xs">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold font-mono flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-700 dark:text-slate-300 leading-normal font-medium">
                      {plan}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/40 text-slate-500">
          No audit metrics compiled. Select another student record or trigger Refresh.
        </div>
      )}
    </div>
  );
}
