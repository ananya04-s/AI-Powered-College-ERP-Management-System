/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  ClipboardList, 
  FileSpreadsheet, 
  ArrowRight, 
  Sparkles, 
  Search,
  Check,
  X,
  FileText,
  CalendarDays,
  UserCheck
} from 'lucide-react';
import { Faculty, Student, Subject } from '../types';

interface FacultyModuleProps {
  userEmail: string;
  activeSubTab: string;
}

export default function FacultyModule({ userEmail, activeSubTab }: FacultyModuleProps) {
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Sub tab navigation overrides
  const [currentView, setCurrentView] = useState(activeSubTab || 'attendance_marking');

  // Attendance states
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceState, setAttendanceState] = useState<Record<string, 'Present' | 'Absent'>>({});

  // Marks states
  const [testType, setTestType] = useState<'Internal 1' | 'Internal 2' | 'Internal 3' | 'Semester Exam'>('Internal 1');
  const [marksState, setMarksState] = useState<Record<string, number>>({});

  // Bulletin States
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState('Academics');
  const [annAudience, setAnnAudience] = useState<'All' | 'Faculty' | 'Student' | 'Parent'>('Student');

  // AI Summary reports
  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (activeSubTab) {
      setCurrentView(activeSubTab);
    }
  }, [activeSubTab]);

  useEffect(() => {
    const fetchFacultyMetadata = async () => {
      try {
        setLoading(true);
        // Load all faculty to find our target logged in faculty
        const facRes = await fetch('/api/erp/faculty');
        const facData = await facRes.json();
        
        // Let's assume Dr. Alice Vance is logged in (fac_1 or fallback)
        const currentFac = facData.find((f: any) => f.email === userEmail) || facData[0];
        setFaculty(currentFac);

        // Load students
        const stdRes = await fetch('/api/erp/students');
        const stdData = await stdRes.json();
        setStudents(stdData);

        // Load subjects
        const subjRes = await fetch('/api/erp/subjects');
        const subjData = await subjRes.json();
        const facSubjs = subjData.filter((s: any) => s.facultyId === currentFac?.id);
        setSubjects(facSubjs);
        if (facSubjs.length > 0) {
          setSelectedSubject(facSubjs[0].id);
        }

        // Prepopulate default attendance state (all Present)
        const initialAttendance: Record<string, 'Present' | 'Absent'> = {};
        stdData.forEach((s: Student) => {
          initialAttendance[s.usn] = 'Present';
        });
        setAttendanceState(initialAttendance);

        // Prepopulate default marks (randomized)
        const initialMarks: Record<string, number> = {};
        stdData.forEach((s: Student) => {
          initialMarks[s.usn] = Math.floor(Math.random() * 10) + 28;
        });
        setMarksState(initialMarks);
      } catch (e) {
        console.error("Failed to fetch faculty metadata", e);
      } finally {
        setLoading(false);
      }
    };
    fetchFacultyMetadata();
  }, [userEmail]);

  // Submit Daily roll call
  const handleMarkAttendanceSubmit = async () => {
    if (!selectedSubject) return;
    try {
      const attList = Object.keys(attendanceState).map(usn => ({
        usn,
        status: attendanceState[usn],
      }));

      const res = await fetch('/api/erp/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectId: selectedSubject,
          date: attendanceDate,
          attendanceList: attList,
          facultyId: faculty?.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Daily attendance sheets recorded and computed in core averages!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit Marks
  const handleUploadMarksSubmit = async () => {
    if (!selectedSubject) return;
    try {
      const marksList = Object.keys(marksState).map(usn => ({
        usn,
        marksObtained: marksState[usn],
      }));

      const res = await fetch('/api/erp/marks/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectId: selectedSubject,
          testType,
          marksList,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Internal Assessment grades locked and verified on student dashboards!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Publish Announcement
  const handlePublishAnn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;
    try {
      const res = await fetch('/api/erp/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: annTitle,
          content: annContent,
          targetAudience: annAudience,
          createdBy: faculty?.name,
          category: annCategory,
        }),
      });
      const data = await res.json();
      if (data) {
        setAnnTitle('');
        setAnnContent('');
        alert("Bulletin post published successfully!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Generate AI Performance Summary
  const handleGenerateAiReportSummary = async () => {
    try {
      setAiLoading(true);
      const reportMetadata = {
        subject: selectedSubject,
        avgGrades: "82%",
        lowPerformers: "4 Students below 65%",
        attendanceCompliance: "94% Attendance compliance in CSE-AM61",
      };

      const res = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: "Subject Progress Audit",
          contentData: reportMetadata,
        }),
      });
      const data = await res.json();
      setAiSummary(data.summary);
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 bg-slate-200 animate-pulse rounded w-1/4" />
        <div className="h-40 bg-slate-200 animate-pulse rounded-xl" />
        <div className="h-64 bg-slate-200 animate-pulse rounded-xl" />
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'attendance_marking':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">Daily Subject Roll-Call Registry</h3>
                  <p className="text-xs text-slate-500">Record hourly attendance grids for mapped semesters</p>
                </div>
                <div className="flex gap-3 text-xs">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-1">SELECT SUBJECT</label>
                    <select 
                      value={selectedSubject} 
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg"
                    >
                      {subjects.map((sub, i) => (
                        <option key={i} value={sub.id}>{sub.name} ({sub.code})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-1">MARKING DATE</label>
                    <input 
                      type="date" 
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Attendance roster list */}
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                {students.map((student, idx) => {
                  const status = attendanceState[student.usn] || 'Present';
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/50 rounded-xl border border-slate-100/60 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800">{student.name}</h4>
                          <span className="text-[10px] text-slate-400 font-mono uppercase">{student.usn}</span>
                        </div>
                      </div>

                      {/* Present/Absent slider switch */}
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => setAttendanceState((prev) => ({ ...prev, [student.usn]: 'Present' }))}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            status === 'Present' 
                              ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm' 
                              : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                          }`}
                        >
                          Present
                        </button>
                        <button 
                          onClick={() => setAttendanceState((prev) => ({ ...prev, [student.usn]: 'Absent' }))}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            status === 'Absent' 
                              ? 'bg-red-500 text-white font-semibold shadow-sm' 
                              : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button 
                onClick={handleMarkAttendanceSubmit}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors mt-4"
              >
                Publish Roll-Call Log & Compute Averages
              </button>
            </div>
          </div>
        );

      case 'marks_entry':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">Lock Grades & Assessments</h3>
                  <p className="text-xs text-slate-500">Record Internal Assessment evaluations or Semester-end reports</p>
                </div>
                <div className="flex gap-3 text-xs">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-1">SELECT SUBJECT</label>
                    <select 
                      value={selectedSubject} 
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg"
                    >
                      {subjects.map((sub, i) => (
                        <option key={i} value={sub.id}>{sub.name} ({sub.code})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-1">EVALUATION CATEGORY</label>
                    <select 
                      value={testType} 
                      onChange={(e: any) => setTestType(e.target.value)}
                      className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg"
                    >
                      <option value="Internal 1">Internal Test-1 (Max 40)</option>
                      <option value="Internal 2">Internal Test-2 (Max 40)</option>
                      <option value="Internal 3">Internal Test-3 (Max 40)</option>
                      <option value="Semester Exam">Semester End Exam (Max 100)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Roster fields marks */}
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                {students.map((student, idx) => {
                  const score = marksState[student.usn] || 0;
                  return (
                    <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100/60 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold font-mono">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800">{student.name}</h4>
                          <span className="text-[10px] text-slate-400 font-mono uppercase">{student.usn}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <input 
                          type="number" 
                          max={testType === 'Semester Exam' ? 100 : 40}
                          value={score}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setMarksState((prev) => ({ ...prev, [student.usn]: val }));
                          }}
                          className="w-20 bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-center font-bold font-mono text-slate-800"
                        />
                        <span className="text-slate-400 text-[10px] font-mono">/ {testType === 'Semester Exam' ? 100 : 40}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button 
                onClick={handleUploadMarksSubmit}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors mt-4"
              >
                Lock Assessment Grades & Notify Registries
              </button>
            </div>
          </div>
        );

      case 'my_schedule':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Timetables */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">Faculty Subject Assignment & Reports</h3>
                
                <div className="space-y-3.5">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider font-mono">Section A - BE 6th Sem</span>
                      <h4 className="text-xs font-bold text-slate-800">Neural Networks & Deep Learning (22AM61)</h4>
                      <p className="text-[10px] text-slate-400 mt-1 font-mono">Lecture Time: Monday/Wednesday 10:30 AM</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                      Active Lecture
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider font-mono">Section B - BE 6th Sem</span>
                      <h4 className="text-xs font-bold text-slate-800">Natural Language Processing (22AM62)</h4>
                      <p className="text-[10px] text-slate-400 mt-1 font-mono">Lecture Time: Tuesday/Thursday 11:30 AM</p>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                      Active Lab
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Assistant Progress insights */}
            <div className="space-y-6">
              <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/15 w-fit">
                  <Sparkles className="w-3.5 h-3.5" /> Subject Audit Summary Generator
                </div>
                <h3 className="text-xs text-slate-400 font-medium">Use Athena AI to draft an immediate operational progress audit analysis based on locked classroom results:</h3>

                {aiSummary ? (
                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs leading-relaxed text-slate-300">
                    {aiSummary}
                  </div>
                ) : null}

                <button 
                  onClick={handleGenerateAiReportSummary}
                  disabled={aiLoading}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  {aiLoading ? "Generating report summary..." : "Draft AI Audit Analysis"}
                </button>
              </div>
            </div>
          </div>
        );

      case 'leaves':
        return (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">Faculty Bulletin Publisher</h3>
            <p className="text-xs text-slate-500">Publish immediate circular guidelines or test announcements directly to target ward / advisor dashboards</p>

            <form onSubmit={handlePublishAnn} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 block mb-1">BULLETIN CATEGORY</label>
                  <select 
                    value={annCategory} 
                    onChange={(e) => setAnnCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg"
                  >
                    <option value="Academics">Academic Notice</option>
                    <option value="Placements">Recruitment Notification</option>
                    <option value="General">General Campus Announcement</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 block mb-1">TARGET AUDIENCE</label>
                  <select 
                    value={annAudience} 
                    onChange={(e: any) => setAnnAudience(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg"
                  >
                    <option value="Student">Students Only</option>
                    <option value="Parent">Parents Only</option>
                    <option value="Faculty">Faculty Colleagues Only</option>
                    <option value="All">Global (All Users)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 block mb-1">BULLETIN TITLE</label>
                  <input 
                    type="text" 
                    placeholder="e.g. IA-2 Retest Schedule"
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-500 block mb-1">BULLETIN DESCRIPTION</label>
                <textarea 
                  rows={4} 
                  placeholder="Draft detailed description contents..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button type="submit" className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors w-full">
                Publish Bulletin Notification
              </button>
            </form>
          </div>
        );

      default:
        return <div className="text-xs text-slate-500">Section details loading...</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Faculty Info Dashboard */}
      <div className="p-6 bg-slate-55 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-display font-extrabold text-sm">
            {faculty?.name.substring(4, 6).toUpperCase()}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">{faculty?.name}</h2>
            <span className="text-[10px] text-slate-400 font-mono block uppercase">{faculty?.designation} | {faculty?.qualification}</span>
          </div>
        </div>

        <div className="flex gap-4 text-xs font-mono">
          <div className="text-center bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
            <span className="text-[9px] text-slate-400 block uppercase">Mapped Cohorts</span>
            <span className="font-bold text-slate-800">Section A & B</span>
          </div>
          <div className="text-center bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
            <span className="text-[9px] text-slate-400 block uppercase">Department</span>
            <span className="font-bold text-indigo-600">CSE & AIML</span>
          </div>
        </div>
      </div>

      {renderContent()}
    </div>
  );
}
