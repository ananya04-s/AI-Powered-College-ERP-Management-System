/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  CreditCard, 
  Library, 
  Bus, 
  Home, 
  Briefcase, 
  Calendar, 
  Download, 
  FileText, 
  Plus, 
  CheckCircle, 
  Clock, 
  Search, 
  MapPin, 
  AlertTriangle,
  Award,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  ShieldAlert
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Student, Mark, Fee, Payment, SemesterResult, LibraryBook, LeaveRequest, BusRoute } from '../types';

interface StudentModuleProps {
  userEmail: string;
  activeSubTab: string;
}

export default function StudentModule({ userEmail, activeSubTab }: StudentModuleProps) {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // AI Prediction results
  const [aiPredictions, setAiPredictions] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Sub module specific states
  const [leaveType, setLeaveType] = useState('Sick Leave');
  const [leaveStart, setLeaveStart] = useState('');
  const [leaveEnd, setLeaveEnd] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [leavesList, setLeavesList] = useState<LeaveRequest[]>([]);
  
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const [bookSearch, setBookSearch] = useState('');
  const [allBooks, setAllBooks] = useState<LibraryBook[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<any[]>([]);

  // Simulation parameters for GPS tracking
  const [gpsLocation, setGpsLocation] = useState({ lat: 12.9716, lng: 77.5946, speed: 45, nextStop: "Main Gate Gate" });

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/erp/student/profile?userId=user_std_1&usn=1MS23CS001`); // fetch core demo student fallback
        const data = await res.json();
        setProfileData(data);
        
        // Load leaves
        const leavesRes = await fetch('/api/erp/leaves');
        const leavesData = await leavesRes.json();
        setLeavesList(leavesData.filter((l: any) => l.requesterId === data.student?.usn));

        // Load Books
        const booksRes = await fetch('/api/erp/library/books');
        const booksData = await booksRes.json();
        setAllBooks(booksData);
        setBorrowedBooks(data.libraryIssues || []);
      } catch (e) {
        console.error("Failed to load student profile", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentProfile();
  }, [userEmail]);

  // Handle active sub tabs overrides
  const [currentView, setCurrentView] = useState(activeSubTab || 'profile');

  useEffect(() => {
    if (activeSubTab) {
      setCurrentView(activeSubTab);
    }
  }, [activeSubTab]);

  // AI Insights Trigger
  const triggerAiPredictions = async () => {
    if (!profileData?.student) return;
    try {
      setAiLoading(true);
      const res = await fetch(`/api/ai/predictions?studentUsn=${profileData.student.usn}`);
      const predictions = await res.json();
      setAiPredictions(predictions);
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (profileData?.student) {
      triggerAiPredictions();
    }
  }, [profileData]);

  // Online Fee Payment simulation
  const handlePayFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) return;
    try {
      const res = await fetch('/api/erp/payments/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentUsn: profileData.student.usn,
          amount: paymentAmount,
          paymentMethod,
        }),
      });
      const result = await res.json();
      if (result.success) {
        // Refresh profile fee status
        const updatedProfile = { ...profileData };
        updatedProfile.fee.paidAmount += parseFloat(paymentAmount);
        updatedProfile.fee.pendingAmount = Math.max(0, updatedProfile.fee.totalAmount - updatedProfile.fee.paidAmount);
        updatedProfile.payments.unshift(result.payment);
        updatedProfile.student.feeStatus = updatedProfile.fee.pendingAmount === 0 ? "Paid" : "Partial";
        setProfileData(updatedProfile);
        setPaymentAmount('');
        alert(`Payment successful! Receipt generated: ${result.payment.receiptNumber}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit Leave Request
  const handleSubmitLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveStart || !leaveEnd || !leaveReason) return;
    try {
      const res = await fetch('/api/erp/leave/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterId: profileData.student.usn,
          requesterRole: 'Student',
          leaveType,
          startDate: leaveStart,
          endDate: leaveEnd,
          reason: leaveReason,
        }),
      });
      const newLeave = await res.json();
      setLeavesList((prev) => [newLeave, ...prev]);
      setLeaveReason('');
      setLeaveStart('');
      setLeaveEnd('');
      alert("Leave application logged and forwarded to advisor.");
    } catch (e) {
      console.error(e);
    }
  };

  // Digital Book Borrow
  const handleBorrowBook = async (bookId: string) => {
    try {
      const res = await fetch('/api/erp/library/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId,
          studentUsn: profileData.student.usn,
        }),
      });
      const result = await res.json();
      if (result.success) {
        alert("Book checkout simulated! Digital Copy loaded to your profile.");
        // Reload Library Books
        const bRes = await fetch('/api/erp/library/books');
        const bData = await bRes.json();
        setAllBooks(bData);
        // Add to borrowed
        const borrowedMatch = bData.find((b: any) => b.id === bookId);
        setBorrowedBooks((prev) => [
          {
            id: result.issued.id,
            bookTitle: borrowedMatch?.title || "Book",
            bookAuthor: borrowedMatch?.author || "Author",
            issueDate: result.issued.issueDate,
            dueDate: result.issued.dueDate,
            status: "Issued",
          },
          ...prev,
        ]);
      } else {
        alert(result.error || "Failed to issue book");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // PDF Download helpers using jsPDF
  const downloadMarksheetPdf = () => {
    if (!profileData) return;
    const { student, marks, results } = profileData;
    const doc = new jsPDF();

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(20);
    doc.text("ATHENA UNIVERSITY", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("Helvetica", "normal");
    doc.text("UNIVERSITY OF ADVANCED TECHNOLOGY & ENTERPRISE STUDIES", 105, 26, { align: "center" });
    doc.text("OFFICIAL ACADEMIC EVALUATION REPORT", 105, 31, { align: "center" });

    doc.setDrawColor(200, 200, 200);
    doc.line(15, 36, 195, 36);

    // Profile Metadata block
    doc.setFontSize(10);
    doc.text(`Student Name: ${student.name}`, 15, 44);
    doc.text(`USN (UID): ${student.usn}`, 15, 50);
    doc.text(`Semester: ${student.semester}`, 15, 56);
    doc.text(`Department: Computer Science & Eng.`, 15, 62);

    doc.text(`CGPA Aggregate: ${student.cgpa}`, 140, 44);
    doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, 140, 50);
    doc.text(`Evaluation Status: PASS`, 140, 56);

    doc.line(15, 68, 195, 68);

    // Marks Table
    doc.setFont("Helvetica", "bold");
    doc.text("Subject Code", 15, 76);
    doc.text("Assessment Category", 55, 76);
    doc.text("Marks Scored", 120, 76);
    doc.text("Max Marks", 155, 76);
    doc.setFont("Helvetica", "normal");

    let y = 84;
    marks.slice(0, 10).forEach((m: Mark) => {
      doc.text(m.subjectId.toUpperCase().replace("SUBJ_", "CS-"), 15, y);
      doc.text(m.testType, 55, y);
      doc.text(String(m.marksObtained), 120, y);
      doc.text(String(m.maxMarks), 155, y);
      y += 8;
    });

    doc.line(15, y + 4, 195, y + 4);
    
    doc.setFont("Helvetica", "bold");
    doc.text("Official Coordinator Seal & Verification", 105, y + 15, { align: "center" });
    doc.text("ATHENA ACADEMIC CONTROLLER", 105, y + 22, { align: "center" });

    doc.save(`Marksheet_${student.usn}.pdf`);
  };

  const downloadReceiptPdf = (pm: Payment) => {
    if (!profileData) return;
    const { student } = profileData;
    const doc = new jsPDF();

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("ATHENA UNIVERSITY", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("Helvetica", "normal");
    doc.text("TUITION FEE OFFICIAL RECEIPT", 105, 26, { align: "center" });

    doc.line(15, 32, 195, 32);

    doc.text(`Receipt Reference No: ${pm.receiptNumber}`, 15, 42);
    doc.text(`Transaction ID: ${pm.transactionRef}`, 15, 48);
    doc.text(`Date of Remittance: ${pm.paymentDate}`, 15, 54);

    doc.line(15, 60, 195, 60);

    doc.text(`Payer student Name: ${student.name}`, 15, 70);
    doc.text(`University USN: ${student.usn}`, 15, 76);
    doc.text(`Remitted Amount: INR ${pm.amountPaid.toLocaleString()}/-`, 15, 82);
    doc.text(`Remittance Pathway: ${pm.paymentMethod}`, 15, 88);

    doc.setFont("Helvetica", "bold");
    doc.text("Payment Status: SUCCESS - COMPLETE", 15, 98);
    doc.setFont("Helvetica", "normal");

    doc.line(15, 105, 195, 105);
    doc.text("This is an electronically generated and certified payment receipt.", 105, 115, { align: "center" });

    doc.save(`FeeReceipt_${pm.receiptNumber}.pdf`);
  };

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

  const { student, marks, fee, payments, results, libraryIssues } = profileData;

  const renderContent = () => {
    switch (currentView) {
      case 'student_profile':
      case 'profile':
        return (
          <div className="space-y-8">
            {/* Quick Stats Dashboard and AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Detailed Student Bio Card */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-display font-extrabold text-base">
                    {student.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight font-display">{student.name}</h3>
                    <p className="text-xs text-slate-400 font-mono font-semibold uppercase">{student.usn}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400 font-medium">Semester / Phase</span>
                    <span className="text-slate-800 font-semibold font-mono">SEMESTER {student.semester}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400 font-medium">Academic Mentor</span>
                    <span className="text-slate-800 font-semibold">{student.advisorName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400 font-medium">Emergency Parent contact</span>
                    <span className="text-slate-800 font-semibold font-mono">{student.parentPhone}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400 font-medium">Registered Route</span>
                    <span className="text-slate-800 font-semibold">{student.busRouteId ? "Route 3 (Assigned)" : "None"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400 font-medium">Hostel block</span>
                    <span className="text-slate-800 font-semibold">{student.roomId ? "Aryabhata A-12" : "None"}</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Metrics */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl flex flex-col justify-between border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Aggregate attendance</span>
                  <div className="space-y-1">
                    <h4 className={`text-2xl font-bold font-mono ${student.attendancePercentage < 75 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {student.attendancePercentage}%
                    </h4>
                    <span className="text-[10px] text-slate-500 block font-medium">75% Min Limit</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl flex flex-col justify-between border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">CGPA Cumulative</span>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-bold font-mono text-slate-900">{student.cgpa}</h4>
                    <span className="text-[10px] text-indigo-600 block font-medium flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> First Class Distinction
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl flex flex-col justify-between border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Fees Status</span>
                  <div className="space-y-1">
                    <h4 className={`text-lg font-bold ${student.feeStatus === 'Paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {student.feeStatus}
                    </h4>
                    <span className="text-[10px] text-slate-500 block font-mono">Due: April 2026</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl flex flex-col justify-between border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Placement State</span>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-indigo-600">{student.placementStatus}</h4>
                    <span className="text-[10px] text-slate-500 block">Shortlisted</span>
                  </div>
                </div>
              </div>

              {/* AI Predictions & Insights Card */}
              <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center gap-2 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/15 w-fit">
                    <BrainCircuit className="w-3.5 h-3.5 animate-spin" /> Athena Academic Prognosis
                  </div>

                  {aiPredictions ? (
                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-400">Career Placement Probability:</span>
                          <span className="font-bold text-emerald-400">{aiPredictions.placementProbability}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${aiPredictions.placementProbability}%` }} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">At Academic Risk:</span>
                        <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                          aiPredictions.dropoutRisk === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {aiPredictions.dropoutRisk} Risk
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-normal line-clamp-3 italic">
                        "{aiPredictions.riskReason}"
                      </p>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs">Triggering core prediction engines...</p>
                  )}
                </div>

                <button 
                  onClick={triggerAiPredictions} 
                  className="mt-4 w-full text-center py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl cursor-pointer transition-colors relative z-10"
                >
                  Recalculate AI Analytics
                </button>
              </div>
            </div>

            {/* Timetable / Schedule Grid */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display mb-4">Exam Hall ticket Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-100/80 rounded-xl space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-indigo-600 font-mono tracking-wider">Theory Exam</span>
                  <h4 className="text-xs font-bold text-slate-800">Neural Networks & Deep Learning (22AM61)</h4>
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>Date: July 12, 2026</span>
                    <span>Time: 09:30 AM</span>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100/80 rounded-xl space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-indigo-600 font-mono tracking-wider">Theory Exam</span>
                  <h4 className="text-xs font-bold text-slate-800">Natural Language Processing (22AM62)</h4>
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>Date: July 15, 2026</span>
                    <span>Time: 09:30 AM</span>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100/80 rounded-xl space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-indigo-600 font-mono tracking-wider">Practical Exam</span>
                  <h4 className="text-xs font-bold text-slate-800">Deep Learning Lab (22AM63)</h4>
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>Date: July 18, 2026</span>
                    <span>Time: 14:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'student_marks':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">University Evaluation Records</h3>
                <p className="text-xs text-slate-500">Internal assessment trackers & SGPA calculations</p>
              </div>
              <button 
                onClick={downloadMarksheetPdf}
                className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/15"
              >
                <Download className="w-4 h-4" /> Download Certified Transcript
              </button>
            </div>

            {/* Marks details grid */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                    <th className="p-4">Subject Reference</th>
                    <th className="p-4">Evaluation Type</th>
                    <th className="p-4 text-center">Marks Obtained</th>
                    <th className="p-4 text-center">Max Marks</th>
                    <th className="p-4 text-center">Performance Indicator</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-slate-100 text-slate-700">
                  {marks.map((m: Mark, idx: number) => {
                    const pct = (m.marksObtained / m.maxMarks) * 100;
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-4 font-semibold text-slate-800">
                          {m.subjectId.toUpperCase().replace("SUBJ_", "CS-")}
                        </td>
                        <td className="p-4">{m.testType}</td>
                        <td className="p-4 text-center font-bold font-mono text-slate-900">{m.marksObtained}</td>
                        <td className="p-4 text-center font-mono text-slate-400">{m.maxMarks}</td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full font-semibold font-mono text-[9px] ${
                            pct >= 85 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : pct >= 65 ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-red-50 text-red-600 border border-red-100'
                          }`}>
                            {pct >= 85 ? 'DISTINCTION' : pct >= 65 ? 'FIRST CLASS' : 'PASS'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'student_fees':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Fee ledger summary and online simulation */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">Remittance Ledger Summary</h3>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase font-mono tracking-wider block">Aggregate Tuition Fee</span>
                    <span className="text-base font-bold text-slate-800 font-mono">INR {fee?.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase font-mono tracking-wider block">Total Remitted</span>
                    <span className="text-base font-bold text-emerald-600 font-mono">INR {fee?.paidAmount.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase font-mono tracking-wider block">Pending Balance</span>
                    <span className="text-base font-bold text-red-500 font-mono">INR {fee?.pendingAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Online UPI Gateway simulator */}
                {fee?.pendingAmount > 0 ? (
                  <form onSubmit={handlePayFee} className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-4">
                    <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider block">Instant Fee Remittance Simulator</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">PAYMENT METHOD</label>
                        <select 
                          value={paymentMethod} 
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs"
                        >
                          <option value="UPI">UPI Gateway (GPAY/PHONEPE)</option>
                          <option value="Card">Visa / MasterCard Credit</option>
                          <option value="NetBanking">Secure Internet Banking</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">REMITTANCE AMOUNT (INR)</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 30000"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          max={fee.pendingAmount}
                          className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                    <button type="submit" className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl cursor-pointer transition-colors w-full">
                      Proceed to Secure Gateway
                    </button>
                  </form>
                ) : (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center text-xs text-emerald-700 font-medium">
                    Excellent! All outstanding academic balances are complete.
                  </div>
                )}
              </div>

              {/* Transactions logs and receipt PDF downloads */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">Remittance Log History</h3>
                <div className="space-y-3.5">
                  {payments.map((p: Payment, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">INR {p.amountPaid.toLocaleString()}</h4>
                          <span className="text-[10px] text-slate-400 font-mono block">REF: {p.transactionRef} | {p.paymentDate}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => downloadReceiptPdf(p)}
                        className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 hover:text-slate-900 rounded-lg transition-colors flex items-center gap-1 text-[10px] font-bold"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF Receipt
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">Academic Scholarship Status</h4>
                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-2 text-xs">
                  <span className="font-bold text-indigo-700">Dean's List Merit Scholarship</span>
                  <p className="text-slate-500 leading-normal text-[11px]">Approved 15% aggregate discount applied to overall tuition fee structure based on CGPA above 8.5.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'student_library':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Book search and issue catalog */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">Central Library Stack Search</h3>
                <div className="flex gap-2.5">
                  <div className="flex-1 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100 flex items-center gap-2">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search title, author, category or ISBN..." 
                      value={bookSearch}
                      onChange={(e) => setBookSearch(e.target.value)}
                      className="w-full bg-transparent focus:outline-none text-xs text-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {allBooks
                    .filter(b => b.title.toLowerCase().includes(bookSearch.toLowerCase()) || b.author.toLowerCase().includes(bookSearch.toLowerCase()))
                    .map((book: LibraryBook, i: number) => (
                      <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col justify-between space-y-3">
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-indigo-600 font-mono tracking-wider">{book.category}</span>
                          <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight">{book.title}</h4>
                          <p className="text-[11px] text-slate-400 italic">by {book.author}</p>
                        </div>
                        <div className="flex items-center justify-between z-10">
                          <span className="text-[10px] text-slate-400 font-mono">Rack: {book.rackLocation}</span>
                          <button 
                            onClick={() => handleBorrowBook(book.id)}
                            disabled={book.availableCopies === 0}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              book.availableCopies > 0 
                                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950' 
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            {book.availableCopies > 0 ? "Borrow Digital" : "Out of Stack"}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Currently borrowed list */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">My Borrows Ledger</h3>
                <div className="flex flex-col gap-3">
                  {borrowedBooks.map((b, i) => (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{b.bookTitle}</h4>
                      <p className="text-[10px] text-slate-400">by {b.bookAuthor}</p>
                      <div className="flex justify-between text-[10px] font-mono font-medium text-slate-500">
                        <span>Issued: {b.issueDate}</span>
                        <span className="text-red-500">Due: {b.dueDate}</span>
                      </div>
                    </div>
                  ))}
                  {borrowedBooks.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">No currently active library checkouts.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'student_transport':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* GPS simulation map box */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">Live Transit GPS Tracker (Simulated)</h3>
              
              <div className="relative w-full h-80 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center text-center p-6 space-y-4">
                {/* Simulated GPS moving map overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                <div className="absolute w-24 h-24 bg-indigo-500/10 rounded-full blur-xl animate-ping" />
                
                <div className="relative z-10 space-y-2">
                  <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 w-fit mx-auto animate-bounce">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-100">TRANSIT GPS VECTOR IN PROGRESS</h4>
                  <p className="text-xs text-slate-400 font-mono">COORDS: {gpsLocation.lat.toFixed(4)}° N, {gpsLocation.lng.toFixed(4)}° E | SPEED: {gpsLocation.speed} km/h</p>
                </div>

                <div className="w-full bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 z-10 text-xs flex justify-between font-mono max-w-md">
                  <span className="text-slate-400">NEXT SCHEDULED STOP:</span>
                  <span className="text-amber-400 font-bold">{gpsLocation.nextStop}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">Assigned Bus Details</h3>
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400">Route Code:</span>
                    <span className="text-slate-800 font-bold font-mono">R-12</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400">Driver Name:</span>
                    <span className="text-slate-800 font-semibold">Suresh Gowda</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400">Contact Number:</span>
                    <span className="text-indigo-600 font-semibold font-mono">+91 9845012341</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400">Vehicle Number:</span>
                    <span className="text-slate-800 font-bold font-mono">KA-03-FA-2041</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'leaves':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">Apply for Leave of Absence</h3>
              
              <form onSubmit={handleSubmitLeave} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">LEAVE CLASSIFICATION</label>
                    <select 
                      value={leaveType} 
                      onChange={(e) => setLeaveType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg"
                    >
                      <option value="Sick Leave">Medical / Sick Leave</option>
                      <option value="Duty Leave">Duty / On-Duty Absence</option>
                      <option value="Casual Leave">Casual Family Leave</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">START DATE</label>
                    <input 
                      type="date" 
                      value={leaveStart}
                      onChange={(e) => setLeaveStart(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">END DATE</label>
                    <input 
                      type="date" 
                      value={leaveEnd}
                      onChange={(e) => setLeaveEnd(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">EXPLANATORY STATEMENT</label>
                  <textarea 
                    rows={3} 
                    placeholder="Provide explicit reasons for your leaves authorization..."
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button type="submit" className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors w-full">
                  Forward Request to Faculty Advisor
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">My Leaves History</h3>
              <div className="flex flex-col gap-3.5">
                {leavesList.map((lv, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{lv.leaveType}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                        lv.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : lv.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {lv.status}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-tight italic">"{lv.reason}"</p>
                    <div className="text-[10px] font-mono text-slate-400">
                      Dates: {lv.startDate} to {lv.endDate}
                    </div>
                  </div>
                ))}
                {leavesList.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4">No logged leaves records.</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'student_placement':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Active Placements status and Eligible Drives */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">Eligible Campus Recruitment Drives</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-600 font-mono tracking-wider">Software & AI</span>
                      <h4 className="text-xs font-bold text-slate-800">Google India SWE Recruitment</h4>
                      <div className="flex gap-4 text-[11px] text-slate-500 font-mono">
                        <span>CTC Package: 32 LPA</span>
                        <span>Date: August 15, 2026</span>
                      </div>
                    </div>
                    <button className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all">
                      Apply Now
                    </button>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-600 font-mono tracking-wider">AI Systems & Computing</span>
                      <h4 className="text-xs font-bold text-slate-800">Microsoft SWE & AI Intern</h4>
                      <div className="flex gap-4 text-[11px] text-slate-500 font-mono">
                        <span>CTC Package: 28 LPA</span>
                        <span>Date: August 20, 2026</span>
                      </div>
                    </div>
                    <button className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">Resume Tracker</h3>
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-xs space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-indigo-700">Student_Resume_Latest.pdf</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded uppercase">VERIFIED</span>
                </div>
                <p className="text-[11px] text-slate-500">Your resume is processed and synced to all company recruitment panels for coming August drives.</p>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="text-xs text-slate-500">Active view logs loading...</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950 font-display">Student Central Services</h2>
          <p className="text-xs text-slate-500">Configure profiles, attendance, marksheets and payment simulation</p>
        </div>
      </div>

      {renderContent()}
    </div>
  );
}
