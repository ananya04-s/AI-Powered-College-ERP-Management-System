/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Calendar, 
  CreditCard, 
  Library, 
  Bus, 
  Home, 
  Briefcase, 
  FileSpreadsheet, 
  Bell, 
  LogOut, 
  ShieldAlert,
  ClipboardList,
  Compass,
  GraduationCap
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole: UserRole;
  userName: string;
  onLogout: () => void;
}

export default function Sidebar({ currentTab, setCurrentTab, userRole, userName, onLogout }: SidebarProps) {
  const getNavItems = () => {
    const common = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'announcements', label: 'Announcements', icon: Bell },
    ];

    const roleSpecific: Record<UserRole, { id: string; label: string; icon: any }[]> = {
      'Super Admin': [
        { id: 'students', label: 'Manage Students', icon: Users },
        { id: 'faculty', label: 'Manage Faculty', icon: ClipboardList },
        { id: 'academics', label: 'Academics & Courses', icon: BookOpen },
        { id: 'graduation_forecast', label: 'Graduation Forecast', icon: GraduationCap },
        { id: 'fees', label: 'Fee Collections', icon: CreditCard },
        { id: 'library', label: 'Central Library', icon: Library },
        { id: 'hostel', label: 'Hostel Rooms', icon: Home },
        { id: 'transport', label: 'Transport Hub', icon: Bus },
        { id: 'placement', label: 'Placement Cell', icon: Briefcase },
        { id: 'leaves', label: 'Leave Approvals', icon: FileSpreadsheet },
      ],
      'College Admin': [
        { id: 'students', label: 'Manage Students', icon: Users },
        { id: 'graduation_forecast', label: 'Graduation Forecast', icon: GraduationCap },
        { id: 'fees', label: 'Fee Collections', icon: CreditCard },
        { id: 'library', label: 'Central Library', icon: Library },
        { id: 'hostel', label: 'Hostel Rooms', icon: Home },
        { id: 'transport', label: 'Transport Hub', icon: Bus },
      ],
      'Faculty': [
        { id: 'attendance_marking', label: 'Mark Attendance', icon: ClipboardList },
        { id: 'marks_entry', label: 'Upload Grades', icon: FileSpreadsheet },
        { id: 'my_schedule', label: 'Class Timetable', icon: Calendar },
        { id: 'leaves', label: 'Apply Leave', icon: FileSpreadsheet },
      ],
      'Student': [
        { id: 'student_profile', label: 'Academic Profile', icon: Users },
        { id: 'graduation_forecast', label: 'Graduation Forecast', icon: GraduationCap },
        { id: 'student_marks', label: 'My Grades', icon: FileSpreadsheet },
        { id: 'student_library', label: 'Central Library', icon: Library },
        { id: 'student_fees', label: 'My Fee Receipts', icon: CreditCard },
        { id: 'student_transport', label: 'My Bus Route', icon: Bus },
        { id: 'student_placement', label: 'Placement Hub', icon: Briefcase },
        { id: 'leaves', label: 'Submit Leave', icon: FileSpreadsheet },
      ],
      'Parent': [
        { id: 'parent_performance', label: 'Ward Analytics', icon: Compass },
        { id: 'graduation_forecast', label: 'Graduation Forecast', icon: GraduationCap },
        { id: 'parent_attendance', label: 'Attendance Logs', icon: ClipboardList },
        { id: 'parent_fees', label: 'Ward Fee Status', icon: CreditCard },
      ]
    };

    return [...common, ...(roleSpecific[userRole] || [])];
  };

  const navItems = getNavItems();

  return (
    <div id="erp-sidebar" className="w-68 min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between border-r border-slate-800 shrink-0">
      <div>
        {/* University Header Branding */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-amber-500 text-slate-900 p-2 rounded-lg font-bold text-lg font-display tracking-wider">
            ATH
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight font-display text-white">ATHENA UNIVERSITY</h1>
            <p className="text-[10px] text-amber-400 font-medium font-mono">ERP ENTERPRISE PRO</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="px-4 py-6 flex flex-col gap-1.5">
          <span className="text-[10px] uppercase font-semibold text-slate-500 px-3 tracking-wider mb-2">Navigation Menu</span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                id={`nav-${item.id}`}
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 text-left ${
                  isActive 
                    ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/10 font-semibold' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-100'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* User Card & Logout Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-amber-400 font-display">
            {userName.substring(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-semibold text-slate-200 truncate">{userName}</h4>
            <span className="text-[10px] font-medium text-amber-400 block font-mono uppercase">{userRole}</span>
          </div>
        </div>
        
        <button
          id="btn-logout"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit ERP Session</span>
        </button>
      </div>
    </div>
  );
}
