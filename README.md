# Athena College ERP Management System

Athena is a premium, enterprise-level **AI-Powered College ERP Management System** designed to streamline academic operations, financial audits, student progress forecasting, and library logistics on a unified full-stack architecture.

---

## 🛠️ Tech Stack & Architecture

Athena is designed with a modern, high-performance distributed architecture:

- **Frontend Core**: React 19, TypeScript, Tailwind CSS, Recharts (visual data analytics), jsPDF (encrypted grade sheet/receipt downloads).
- **Backend Core**: Express, Node.js, TSX (runtime), Esbuild (production bundle compilation).
- **AI Modules**: Gemini 3.5 Flash Model integration leveraging programmatic database contexts for real-time forecasting.
- **Data Persistence**: Local-first relational JSON engine on Node.js to enable instantaneous, configuration-free, single-click deployments.

---

## 🚀 Key Features & Role Portals

### 1. Super Admin & College Admin Dashboard
- ** Roster Audits**: Core registry logs managing students, departments, and course schemas.
- ** Advisor Directory**: Assignment details for faculty, experience joined metrics, and contact pathways.
- ** Database Security Hub**: Complete AES-256 encrypted database snapshot backup logging with geographic replication summaries.

### 2. Faculty Portal
- ** Roll-Call Registry**: Instant daily student attendance logs compiled directly into aggregate averages.
- ** Grade Locker**: Direct assessment entry forms to lock and publish results to ward profiles.
- ** Bulletin Publisher**: Post academic advisories, exam timetables, or alerts instantly to targeted groups.

### 3. Student Portal
- ** Academic Profile**: Real-time CGPA indexes, aggregate attendance gauges, and academic alerts.
- ** Digital Transcripts**: Generate certified mark sheets as high-contrast print-ready PDFs using jsPDF.
- ** Fee Ledger**: Simulated secure payment gateway to settle balances and generate formal transaction receipts.
- ** Central Library Catalog**: Real-time stack search and borrow mechanism with digital checkout capabilities.
- ** live Transit Tracking**: Real-time simulated GPS tracking map showing assigned vehicle coordinates and stops.

### 4. Parent Portal
- ** Ward Analytics**: Direct visual metrics tracking ward CGPA against class averages.
- ** Attendance Monitors**: Verification logs and early-alert warning indicators.
- ** Advisor Directory**: Direct contact pipelines with assigned faculty mentors.

### 5. AI Coordinator ("Athena")
- ** Conversational Chat**: Answer structural queries, retrieve student ranks, or look up schedules.
- ** Placement Forecasts**: Deep learning probability analysis predicting career placements based on core merit scores.
- ** Risk Prognosis**: Automatically alert and summarize student dropout risk parameters based on attendance and grade trends.

---

## 💾 Relational Database Schema

Athena utilizes a structured relational database model comprising:

1. `users`: Master credential directory (role-based profiles).
2. `students`: Enrolled profiles, mentors, fee statuses, and campus routes.
3. `faculty`: Designated department chairs, qualifications, and subject codes.
4. `departments` & `courses`: Mapped operational faculties.
5. `subjects`: Curriculums, credits, and faculty ownership.
6. `attendance`: Roll-call histories.
7. `marks` & `results`: Term grades and SGPA indices.
8. `fees` & `payments`: Billing ledgers and UPI transaction refs.
9. `library_books` & `issued_books`: Central catalog issues and borrowing registries.
10. `hostel_rooms` & `bus_routes`: Campus facilities mapping.
11. `leave_requests`: Leave authorizations.
12. `announcements`: Global bulletin logs.

---

## ⚙️ Installation & Development Setup

1. **Install Base Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Secrets**: Ensure your `.env` contains:
   ```env
   GEMINI_API_KEY="YOUR_GEMINI_KEY"
   ```

3. **Launch Local Server**:
   ```bash
   npm run dev
   ```
   *Note: Server boots on port `3000` automatically mapping to reverse proxies.*

4. **Production Compilation**:
   ```bash
   npm run build
   ```

---

## 🌐 Deployment & Security

Deploy directly via Cloud Run containers. Database records are compiled in an optimized static buffer which automatically scales to scale-to-zero limits with zero third-party database dependency bottlenecks, keeping query operations at sub-millisecond rates.

---

## 📄 License

SPDX-License-Identifier: Apache-2.0
