/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Super Admin' | 'College Admin' | 'Faculty' | 'Student' | 'Parent';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  lastLogin?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headOfDept: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  durationYears: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  courseId: string;
  semester: number;
  credits: number;
  facultyId: string;
}

export interface Student {
  usn: string; // University Seat Number (unique)
  userId: string;
  name: string;
  email: string;
  phone: string;
  departmentId: string;
  courseId: string;
  semester: number;
  attendancePercentage: number;
  cgpa: number;
  feeStatus: 'Paid' | 'Partial' | 'Unpaid';
  placementStatus: 'Placed' | 'Eligible' | 'Not Placed' | 'In Process';
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  advisorName: string;
  roomId?: string; // Hostel room
  busRouteId?: string; // Transport route
}

export interface Faculty {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  departmentId: string;
  designation: string;
  qualification: string;
  subjects: string[]; // Subject IDs
  joinDate: string;
}

export interface Attendance {
  id: string;
  studentUsn: string;
  subjectId: string;
  date: string;
  status: 'Present' | 'Absent';
  markedByFacultyId: string;
}

export interface Mark {
  id: string;
  studentUsn: string;
  subjectId: string;
  testType: 'Internal 1' | 'Internal 2' | 'Internal 3' | 'Semester Exam';
  marksObtained: number;
  maxMarks: number;
}

export interface Fee {
  id: string;
  studentUsn: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  academicYear: string;
}

export interface Payment {
  id: string;
  studentUsn: string;
  feeId: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
  transactionRef: string;
  receiptNumber: string;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  rackLocation: string;
}

export interface IssuedBook {
  id: string;
  bookId: string;
  studentUsn: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  fineAmount: number;
  status: 'Issued' | 'Returned' | 'Overdue';
}

export interface HostelRoom {
  id: string;
  blockName: string;
  roomNumber: string;
  capacity: number;
  occupiedCount: number;
  feePerSemester: number;
}

export interface BusRoute {
  id: string;
  routeNo: string;
  routeName: string;
  driverName: string;
  driverPhone: string;
  vehicleNo: string;
  stops: string[];
}

export interface PlacementProfile {
  id: string;
  studentUsn: string;
  resumeUrl?: string;
  eligible: boolean;
  appliedCount: number;
  offersCount: number;
  status: 'Placed' | 'Eligible' | 'Not Placed' | 'In Process';
}

export interface CompanyDrive {
  id: string;
  name: string;
  sector: string;
  packageLpa: number;
  driveDate: string;
  eligibilityCgpa: number;
  vacancies: number;
  description: string;
}

export interface Notification {
  id: string;
  recipientId: string; // User ID or 'All'
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  isRead: boolean;
  createdAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  facultyId: string;
  dueDate: string;
  maxMarks: number;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentUsn: string;
  submissionDate: string;
  fileUrl?: string;
  marksObtained?: number;
  feedback?: string;
  status: 'Submitted' | 'Graded' | 'Pending';
}

export interface SemesterResult {
  id: string;
  studentUsn: string;
  semester: number;
  cgpa: number;
  sgpa: number;
  resultStatus: 'Pass' | 'Fail';
  publishDate: string;
}

export interface LeaveRequest {
  id: string;
  requesterId: string;
  requesterRole: 'Faculty' | 'Student';
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetAudience: 'All' | 'Faculty' | 'Student' | 'Parent';
  createdBy: string;
  date: string;
  category: string;
}
