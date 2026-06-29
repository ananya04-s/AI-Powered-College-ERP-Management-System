/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Award, 
  CreditCard, 
  Compass, 
  Clock, 
  Bell, 
  ShieldAlert,
  BrainCircuit,
  ClipboardList
} from 'lucide-react';
import { Student, Mark, Fee, Payment } from '../types';

interface ParentPortalProps {
  userEmail: string;
}

export default function ParentPortal({ userEmail }: ParentPortalProps) {
  const [parentData, setParentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParentWardData = async () => {
      try {
        setLoading(true);
        // Load parent mapped profile
        const res = await fetch(`/api/erp/parent/profile?email=parent_1@family.com`); // Fallback core demo parent account
        const data = await res.json();
        setParentData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchParentWardData();
  }, [userEmail]);

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 bg-slate-200 animate-pulse rounded w-1/4" />
        <div className="h-32 bg-slate-200 animate-pulse rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-slate-200 animate-pulse rounded-xl" />
          <div className="h-64 bg-slate-200 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  const { student, marks, fee, payments, results } = parentData || {};

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden shadow-xl">
        <div className="space-y-1 relative z-10">
          <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/15">
            Ward Performance Monitoring Activated
          </span>
          <h2 className="text-lg font-bold font-display tracking-tight text-white mt-1.5">Welcome to parent Advisor Portal</h2>
          <p className="text-xs text-slate-300">Monitor your ward's class attendance logs, marks, and remaining fee balances instantly.</p>
        </div>

        <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80 text-xs shrink-0 font-mono">
          <span className="text-slate-400">STUDENT UNDER REVIEW:</span>
          <h4 className="text-sm font-bold text-amber-400 mt-0.5">{student?.name} ({student?.usn})</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ward Academic progress and performance */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display border-b border-slate-50 pb-3">Ward Grade Report Cards</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider font-mono">Cumulative CGPA</span>
                <div className="flex items-end justify-between z-10">
                  <span className="text-3xl font-extrabold text-slate-900 font-display">{student?.cgpa}</span>
                  <span className="text-emerald-600 font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Distinction</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider font-mono">Aggregate Attendance</span>
                <div className="flex items-end justify-between z-10">
                  <span className={`text-3xl font-extrabold font-mono ${student?.attendancePercentage < 75 ? 'text-red-500' : 'text-emerald-500'}`}>{student?.attendancePercentage}%</span>
                  <span className="text-slate-500 text-xs">Min Target 75%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider font-mono">Recent Subject Test Grids</span>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {marks?.slice(0, 6).map((m: Mark, idx: number) => {
                  const pct = (m.marksObtained / m.maxMarks) * 100;
                  return (
                    <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-mono">
                      <span className="font-bold text-slate-800">{m.subjectId.toUpperCase().replace("SUBJ_", "CS-")} ({m.testType})</span>
                      <span className={`font-bold ${pct >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {m.marksObtained} / {m.maxMarks}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar: Ward advisor contact info, billing */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">Advisor & Mentor Directory</h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100/60 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-extrabold flex items-center justify-center text-xs">
                AV
              </div>
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-slate-800">{student?.advisorName}</h4>
                <p className="text-slate-400 text-[10px]">Head of Mentorship Program</p>
                <span className="text-[10px] text-indigo-600 font-bold block font-mono">+91 9448010001</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">Remittance Overview</h3>
            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/60 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Tuition fees:</span>
                <span className="font-bold font-mono text-slate-800">INR {fee?.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Remitted:</span>
                <span className="font-bold font-mono text-emerald-600">INR {fee?.paidAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-indigo-100 pt-2 font-bold">
                <span className="text-indigo-800">Due Outstanding Balance:</span>
                <span className="font-mono text-red-500">INR {fee?.pendingAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
