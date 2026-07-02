/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Bell, 
  Search, 
  Menu, 
  X, 
  ArrowRight, 
  BookOpen, 
  User, 
  Lock, 
  Smartphone,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Award,
  Sun,
  Moon
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import Chatbot from './components/Chatbot';
import DashboardHome from './components/DashboardHome';
import StudentModule from './components/StudentModule';
import FacultyModule from './components/FacultyModule';
import AdminModule from './components/AdminModule';
import ParentPortal from './components/ParentPortal';
import GraduationForecast from './components/GraduationForecast';
import { UserRole } from './types';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState<UserRole>('Student');

  // OTP Verification flow
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Global navigation state
  const [currentTab, setCurrentTab] = useState('dashboard');
  
  // Mobile sidebar states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Notifications and bulletins
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Global search parameters
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [globalSearchResults, setGlobalSearchResults] = useState<any[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Load announcements
  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/erp/announcements');
      const data = await res.json();
      setAnnouncements(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchAnnouncements();
    }
  }, [isLoggedIn]);

  // Demo Credentials Auto-Fill helpers to make exploration effortless
  const handleAutoFill = (role: UserRole) => {
    setLoginRole(role);
    if (role === 'Super Admin') {
      setLoginEmail('admin@college.edu');
    } else if (role === 'Faculty') {
      setLoginEmail('office@college.edu'); // maps to faculty/admin templates
    } else if (role === 'Student') {
      setLoginEmail('rohan.patil@student.college.edu');
    } else if (role === 'Parent') {
      setLoginEmail('parent_1@family.com');
    }
    setLoginPassword('••••••••');
  };

  // Secure login handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;

    try {
      setLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          role: loginRole,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        // Direct OTP simulation for premium secure authentication feel
        setShowOtpScreen(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // OTP confirmation
  const handleConfirmOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setShowOtpScreen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setLoginEmail('');
    setLoginPassword('');
    setShowOtpScreen(false);
    setCurrentTab('dashboard');
  };

  // Handle Global Search triggers
  const handleGlobalSearch = async (query: string) => {
    setGlobalSearchQuery(query);
    if (query.trim().length < 2) {
      setGlobalSearchResults([]);
      return;
    }

    try {
      // Direct local search across ERP indexes
      const res = await fetch(`/api/erp/students?search=${query}`);
      const stds = await res.json();
      
      const resultsMapped = stds.slice(0, 5).map((s: any) => ({
        title: s.name,
        subtitle: `Student USN: ${s.usn} | Semester ${s.semester}`,
        tab: 'students',
      }));
      setGlobalSearchResults(resultsMapped);
    } catch (e) {
      console.error(e);
    }
  };

  // Renders login/signup screens or the central portal shell
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Dynamic Vector Background accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl" />

        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-slate-900 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl relative z-10">
          {/* Left panel: Promotional Hero */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-indigo-950 p-8 flex flex-col justify-between border-r border-slate-800/60 relative overflow-hidden">
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500 text-slate-950 p-2.5 rounded-xl font-bold font-display tracking-widest text-lg">
                  ATH
                </div>
                <div>
                  <h1 className="text-sm font-bold tracking-tight text-white font-display">ATHENA ERP</h1>
                  <span className="text-[10px] text-amber-400 font-mono font-medium block">UNIVERSITY CORE SUITE</span>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <h2 className="text-xl font-extrabold text-white tracking-tight font-display leading-tight">
                  Premium AI-Assisted University Infrastructure
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enterprise solution facilitating real-time roll-call logging, grading ledgers, placement forecasting, digital libraries, and fee audit management.
                </p>
              </div>
            </div>

            {/* Quick stats on login */}
            <div className="space-y-4 pt-10 border-t border-slate-800/50 relative z-10">
              <span className="text-[10px] uppercase font-bold font-mono tracking-wider text-slate-500 block">System Scale</span>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Materialized Rosters</span>
                  <span className="text-slate-100 font-bold font-mono text-sm">1,000 Students</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Mapped Divisions</span>
                  <span className="text-slate-100 font-bold font-mono text-sm">7 Departments</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Login credentials form */}
          <div className="lg:col-span-7 p-8 bg-slate-900 flex flex-col justify-center">
            {!showOtpScreen ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight font-display">University Portal Authentication</h3>
                  <p className="text-xs text-slate-400 mt-1">Authenticate using your university mapped credentials below</p>
                </div>

                {/* Role selection selectors */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(['Super Admin', 'College Admin', 'Faculty', 'Student', 'Parent'] as UserRole[]).map((r) => (
                    <button
                      id={`role-btn-${r.replace(' ', '-')}`}
                      key={r}
                      onClick={() => handleAutoFill(r)}
                      className={`py-2 px-1 rounded-xl text-[10px] font-bold transition-all border ${
                        loginRole === r 
                          ? 'bg-amber-500 border-amber-500 text-slate-950 font-semibold' 
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {r === 'Super Admin' ? 'S-Admin' : r === 'College Admin' ? 'C-Admin' : r}
                    </button>
                  ))}
                </div>

                {/* Main Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5 text-xs">
                    <label className="text-[10px] font-bold tracking-wider text-slate-400 block uppercase font-mono">ERP Email Address / USN</label>
                    <div className="flex items-center bg-slate-950/50 border border-slate-800 rounded-xl px-3.5 py-3 gap-2">
                      <User className="w-4 h-4 text-slate-500" />
                      <input
                        id="login-email"
                        type="text"
                        placeholder="admin@college.edu or 1MS23CS001"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="bg-transparent focus:outline-none text-slate-100 w-full placeholder-slate-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label className="text-[10px] font-bold tracking-wider text-slate-400 block uppercase font-mono">Security Password</label>
                    <div className="flex items-center bg-slate-950/50 border border-slate-800 rounded-xl px-3.5 py-3 gap-2">
                      <Lock className="w-4 h-4 text-slate-500" />
                      <input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="bg-transparent focus:outline-none text-slate-100 w-full placeholder-slate-600"
                      />
                    </div>
                  </div>

                  <button
                    id="login-submit"
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2"
                  >
                    <span>{loading ? "Decrypting profile..." : "Initiate ERP Session"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Auto-Fill Reminder Alert */}
                <div className="p-3 bg-slate-950/60 rounded-xl border border-dashed border-slate-800 text-[10px] text-slate-500 text-center leading-relaxed">
                  💡 <span className="font-semibold text-amber-400">Pro Tip:</span> Click on any of the role badges above to automatically load live demo account credentials for instant access.
                </div>
              </div>
            ) : (
              /* OTP verification simulator */
              <form onSubmit={handleConfirmOtp} className="space-y-6">
                <div className="space-y-2">
                  <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl w-fit border border-indigo-500/20">
                    <Smartphone className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight font-display">OTP Code Verification</h3>
                  <p className="text-xs text-slate-400">A secure one-time passcode has been bypassed for immediate simulation entry.</p>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Verification Code (Auto-Filled)</label>
                  <input
                    id="otp-code"
                    type="text"
                    placeholder="99420"
                    value={otpCode || '99420'}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 text-slate-100 placeholder-slate-600 px-3.5 py-3 text-center text-lg tracking-widest font-bold rounded-xl focus:outline-none"
                  />
                </div>

                <button
                  id="otp-confirm"
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Verify Code & Enter Portal
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Unified Central ERP shell layout for logged-in users
  return (
    <div className="min-h-screen bg-slate-50/30 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row font-sans transition-colors duration-200">
      {/* Sidebar navigation */}
      <div className="hidden md:block">
        <Sidebar 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
          userRole={currentUser?.role} 
          userName={currentUser?.name}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Container Shell */}
      <div className="flex-1 min-h-screen flex flex-col overflow-hidden bg-slate-50/30 dark:bg-slate-950 transition-colors duration-200">
        {/* Header toolbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between px-6 z-20 transition-colors duration-200">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar toggle trigger */}
            <button 
              id="mobile-sidebar-toggle"
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Bar input */}
            <div className="relative">
              <div className="bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-2 w-64">
                <Search className="w-4 h-4 text-slate-400" />
                <input 
                  id="global-search"
                  type="text" 
                  placeholder="Global search USNs or names..." 
                  value={globalSearchQuery}
                  onChange={(e) => handleGlobalSearch(e.target.value)}
                  className="bg-transparent focus:outline-none text-xs text-slate-700 dark:text-slate-200 w-full"
                />
              </div>

              {/* Search dropdown results */}
              {globalSearchQuery && (
                <div id="search-dropdown" className="absolute left-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-2xl p-2.5 space-y-2 z-50">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono block mb-1.5">Rosters Search Results</span>
                  {globalSearchResults.map((res, i) => (
                    <button
                      id={`search-result-${i}`}
                      key={i}
                      onClick={() => {
                        setCurrentTab(res.tab);
                        setGlobalSearchQuery('');
                      }}
                      className="w-full text-left p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800 cursor-pointer"
                    >
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{res.title}</h4>
                      <p className="text-[10px] text-slate-400">{res.subtitle}</p>
                    </button>
                  ))}
                  {globalSearchResults.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-2">No matching ward USN found.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Notifications & Theme panel */}
          <div className="flex items-center gap-3">
            {/* Global Theme Switcher */}
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors"
              title={theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
            >
              {theme === 'light' ? (
                <Moon className="w-4.5 h-4.5" />
              ) : (
                <Sun className="w-4.5 h-4.5 text-amber-400" />
              )}
            </button>

            <div className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer">
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
              <Bell className="w-4.5 h-4.5" />
            </div>

            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-extrabold flex items-center justify-center text-xs font-display border border-indigo-100/30">
                {currentUser?.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{currentUser?.name}</h4>
                <span className="text-[9px] text-amber-600 font-bold tracking-wider uppercase font-mono">{currentUser?.role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content body with responsive sizing */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto z-10">
          {currentTab === 'dashboard' ? (
            <DashboardHome 
              userRole={currentUser?.role} 
              userName={currentUser?.name}
              userContext={currentUser}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
            />
          ) : currentTab === 'announcements' ? (
            /* Unified bulletin log list */
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-display">Academic Bulletins & Notifications</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Live operational news and schedules</p>
              </div>

              <div className="space-y-4">
                {announcements.map((ann, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 p-6 shadow-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-mono font-bold text-amber-600 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/15">
                        {ann.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{ann.date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-display">{ann.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{ann.content}</p>
                    <div className="flex justify-between items-center pt-3 border-t border-slate-50 dark:border-slate-800/50 text-[10px] text-slate-400 font-mono">
                      <span>Posted by: {ann.createdBy}</span>
                      <span>Audience: {ann.targetAudience}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : currentTab === 'graduation_forecast' ? (
            <GraduationForecast userRole={currentUser?.role || 'Student'} userEmail={currentUser?.email} />
          ) : currentUser?.role === 'Student' ? (
            <StudentModule userEmail={currentUser?.email} activeSubTab={currentTab} />
          ) : currentUser?.role === 'Faculty' ? (
            <FacultyModule userEmail={currentUser?.email} activeSubTab={currentTab} />
          ) : currentUser?.role === 'Parent' ? (
            <ParentPortal userEmail={currentUser?.email} />
          ) : (
            /* Admin & Super Admin Core Modules mapping */
            <AdminModule />
          )}
        </main>
      </div>

      {/* Mobile sidebar popup portal overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-slate-950/40 z-50 md:hidden flex">
          <div className="w-68 min-h-screen bg-slate-900 shadow-2xl flex flex-col justify-between">
            <Sidebar 
              currentTab={currentTab} 
              setCurrentTab={(tab) => {
                setCurrentTab(tab);
                setIsMobileSidebarOpen(false);
              }} 
              userRole={currentUser?.role} 
              userName={currentUser?.name}
              onLogout={handleLogout}
            />
          </div>
          <button 
            id="mobile-sidebar-close"
            onClick={() => setIsMobileSidebarOpen(false)} 
            className="flex-1 p-4 text-white self-start justify-end flex"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Floating AI ERP coordinator coordination chat assistant bubble */}
      <Chatbot userRole={currentUser?.role} userContext={currentUser} />
    </div>
  );
}
