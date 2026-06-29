/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  Database, 
  CheckCircle, 
  Trash2, 
  Edit, 
  Plus, 
  Search, 
  ShieldCheck, 
  Sparkles,
  ClipboardList,
  Cpu
} from 'lucide-react';
import { Student, Faculty, Department } from '../types';

export default function AdminModule() {
  const [students, setStudents] = useState<Student[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const [studentSearch, setStudentSearch] = useState('');
  const [facultySearch, setFacultySearch] = useState('');

  // Active sub tab
  const [activeTab, setActiveTab] = useState<'students' | 'faculty' | 'db_backup'>('students');

  // DB Backup status
  const [backupLogs, setBackupLogs] = useState<{ timestamp: string; size: string; status: string }[]>([]);
  const [isBackingUp, setIsBackingUp] = useState(false);

  // Load datasets
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const sRes = await fetch('/api/erp/students');
      const sData = await sRes.json();
      setStudents(sData);

      const fRes = await fetch('/api/erp/faculty');
      const fData = await fRes.json();
      setFaculty(fData);

      const dRes = await fetch('/api/erp/departments');
      const dData = await dRes.json();
      setDepartments(dData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Trigger Database Backup Simulation
  const triggerDbBackup = async () => {
    try {
      setIsBackingUp(true);
      const res = await fetch('/api/erp/admin/backup', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setBackupLogs((prev) => [
          {
            timestamp: new Date().toLocaleString(),
            size: `${(data.sizeBytes / 1024).toFixed(2)} KB`,
            status: "SUCCESS",
          },
          ...prev,
        ]);
        alert("Encrypted university database snapshot pushed to secured Cloud Storage successfully!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsBackingUp(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 bg-slate-200 animate-pulse rounded w-1/4" />
        <div className="h-32 bg-slate-200 animate-pulse rounded-xl" />
        <div className="h-64 bg-slate-200 animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-950 font-display">University Operations & Core Registries</h2>
          <p className="text-xs text-slate-500">Manage enrolled student rosters, advisor directories, courses, and security backups</p>
        </div>

        {/* Local Admin navigation switches */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/50 self-start text-xs font-semibold">
          <button 
            onClick={() => setActiveTab('students')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${activeTab === 'students' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Rosters
          </button>
          <button 
            onClick={() => setActiveTab('faculty')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${activeTab === 'faculty' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Advisors
          </button>
          <button 
            onClick={() => setActiveTab('db_backup')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${activeTab === 'db_backup' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Security Core
          </button>
        </div>
      </div>

      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex gap-2.5 max-w-md">
            <div className="flex-1 bg-white px-3 py-2 rounded-xl border border-slate-200 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search USN, name or department..." 
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-xs text-slate-700"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  <th className="p-4">USN (UID)</th>
                  <th className="p-4">FullName</th>
                  <th className="p-4">Department & Phase</th>
                  <th className="p-4">Merit GPA</th>
                  <th className="p-4">Attendance</th>
                  <th className="p-4 text-center">Remittance status</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-100 text-slate-700">
                {students
                  .filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.usn.toLowerCase().includes(studentSearch.toLowerCase()))
                  .slice(0, 15) // Paginated slice for super clean presentation
                  .map((s: Student, i: number) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold font-mono text-slate-950 uppercase">{s.usn}</td>
                      <td className="p-4 font-semibold text-slate-800">{s.name}</td>
                      <td className="p-4">CSE / Semester {s.semester}</td>
                      <td className="p-4 font-semibold text-slate-900 font-mono">{s.cgpa}</td>
                      <td className="p-4 font-mono font-semibold text-emerald-600">{s.attendancePercentage}%</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          s.feeStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {s.feeStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'faculty' && (
        <div className="space-y-4">
          <div className="flex gap-2.5 max-w-md">
            <div className="flex-1 bg-white px-3 py-2 rounded-xl border border-slate-200 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search faculty advisor names..." 
                value={facultySearch}
                onChange={(e) => setFacultySearch(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-xs text-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faculty
              .filter(f => f.name.toLowerCase().includes(facultySearch.toLowerCase()))
              .slice(0, 10)
              .map((fac, idx) => (
                <div key={idx} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-start gap-4 hover:shadow-md transition-all">
                  <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-display font-bold text-sm">
                    {fac.name.substring(4, 6).toUpperCase()}
                  </div>
                  <div className="space-y-1 text-xs">
                    <h4 className="font-bold text-slate-800 font-display">{fac.name}</h4>
                    <span className="text-[10px] text-indigo-600 font-bold block uppercase">{fac.designation}</span>
                    <p className="text-slate-400 text-[10px]">Email: {fac.email}</p>
                    <span className="text-[10px] text-slate-500 block">Experience joined: {fac.joinDate}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {activeTab === 'db_backup' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">System Backup & Security Audit</h3>
            <p className="text-xs text-slate-500 leading-normal">
              ERP architecture compiles real-time tables including student records, grades ledger, fee remittances, and digital library checkouts.
            </p>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4 text-xs">
              <span className="text-[10px] uppercase font-bold text-indigo-600 font-mono tracking-wider block">Security Credentials</span>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[10px]">ENCRYPTION STANDARD</span>
                  <span className="text-slate-800 font-bold font-mono">AES-256 BIT KEY GCM</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[10px]">BACKUP REPLICAS</span>
                  <span className="text-slate-800 font-bold font-mono">3 GEOGRAPHIC CORES</span>
                </div>
              </div>
            </div>

            <button 
              onClick={triggerDbBackup}
              disabled={isBackingUp}
              className="py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all w-full cursor-pointer flex items-center justify-center gap-2"
            >
              <Database className="w-4 h-4" /> {isBackingUp ? "Packing relational tables..." : "Pushed Encrypted DB snapshot"}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4 text-xs">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">Backup Logs History</h4>
            <div className="space-y-3">
              {backupLogs.map((log, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-slate-800 font-semibold">{log.status}</span>
                    <span className="text-slate-400">{log.size}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">{log.timestamp}</span>
                </div>
              ))}
              {backupLogs.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">No logged snapshots.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
