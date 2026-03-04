import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// ============================================================
// INSTITUTE CONFIGURATION — Edit this to customize for any school
// ============================================================
const INSTITUTE_CONFIG = {
  name: "Greenfield Academy",
  tagline: "Nurturing Minds, Building Futures",
  logo: "🏛️",
  primaryColor: "#1a3a5c",
  accentColor: "#e8a020",
  googleSheetAttendanceURL: "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:json&sheet=Attendance",
  googleSheetMarksURL: "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:json&sheet=Marks",
  mongoAPIBase: "https://your-backend-api.com/api", // Replace with your hosted backend
  academicYear: "2025–2026",
  terms: ["Term 1", "Term 2", "Term 3"],
  subjects: ["Mathematics", "Science", "English", "Social Studies", "Computer Science", "Physical Education"],
};

// ============================================================
// MOCK DATA (Replace with real API calls)
// ============================================================
// const MOCK_STUDENTS = [
//   { id: "GFA2024001", name: "Arjun Sharma", class: "10-A", rollNo: 12, email: "arjun@student.greenfield.edu", password: "student123", avatar: "AS" },
//   { id: "GFA2024002", name: "Priya Verma", class: "10-A", rollNo: 15, email: "priya@student.greenfield.edu", password: "student123", avatar: "PV" },
//   { id: "GFA2024003", name: "Rohan Mehta", class: "10-B", rollNo: 8, email: "rohan@student.greenfield.edu", password: "student123", avatar: "RM" },
// ];

// const MOCK_ATTENDANCE = {
//   GFA2024001: {
//     overall: 87,
//     monthly: [
//       { month: "Apr", present: 22, total: 24, pct: 91.7 },
//       { month: "May", present: 20, total: 23, pct: 87 },
//       { month: "Jun", present: 18, total: 22, pct: 81.8 },
//       { month: "Jul", present: 24, total: 26, pct: 92.3 },
//       { month: "Aug", present: 21, total: 25, pct: 84 },
//       { month: "Sep", present: 19, total: 22, pct: 86.4 },
//     ],
//     subjects: [
//       { name: "Mathematics", present: 42, total: 48, pct: 87.5 },
//       { name: "Science", present: 45, total: 50, pct: 90 },
//       { name: "English", present: 38, total: 46, pct: 82.6 },
//       { name: "Social Studies", present: 40, total: 44, pct: 90.9 },
//       { name: "Computer Science", present: 28, total: 30, pct: 93.3 },
//       { name: "Physical Education", present: 20, total: 24, pct: 83.3 },
//     ],
//     recent: [
//       { date: "2025-09-29", day: "Mon", status: "present" },
//       { date: "2025-09-30", day: "Tue", status: "present" },
//       { date: "2025-10-01", day: "Wed", status: "absent" },
//       { date: "2025-10-02", day: "Thu", status: "present" },
//       { date: "2025-10-03", day: "Fri", status: "present" },
//       { date: "2025-10-06", day: "Mon", status: "present" },
//       { date: "2025-10-07", day: "Tue", status: "late" },
//       { date: "2025-10-08", day: "Wed", status: "present" },
//       { date: "2025-10-09", day: "Thu", status: "absent" },
//       { date: "2025-10-10", day: "Fri", status: "present" },
//     ],
//   },
// };

// const MOCK_MARKS = {
//   GFA2024001: {
//     gpa: 8.4,
//     rank: 7,
//     totalStudents: 42,
//     terms: [
//       {
//         name: "Term 1",
//         subjects: [
//           { name: "Mathematics", marks: 85, max: 100, grade: "A" },
//           { name: "Science", marks: 92, max: 100, grade: "A+" },
//           { name: "English", marks: 78, max: 100, grade: "B+" },
//           { name: "Social Studies", marks: 88, max: 100, grade: "A" },
//           { name: "Computer Science", marks: 95, max: 100, grade: "A+" },
//           { name: "Physical Education", marks: 80, max: 100, grade: "A-" },
//         ],
//         total: 518,
//         max: 600,
//         percentage: 86.3,
//         result: "PASS",
//       },
//       {
//         name: "Term 2",
//         subjects: [
//           { name: "Mathematics", marks: 88, max: 100, grade: "A" },
//           { name: "Science", marks: 89, max: 100, grade: "A" },
//           { name: "English", marks: 82, max: 100, grade: "A-" },
//           { name: "Social Studies", marks: 84, max: 100, grade: "A-" },
//           { name: "Computer Science", marks: 97, max: 100, grade: "A+" },
//           { name: "Physical Education", marks: 75, max: 100, grade: "B+" },
//         ],
//         total: 515,
//         max: 600,
//         percentage: 85.8,
//         result: "PASS",
//       },
//     ],
//     progress: [
//       { subject: "Mathematics", term1: 85, term2: 88 },
//       { subject: "Science", term1: 92, term2: 89 },
//       { subject: "English", term1: 78, term2: 82 },
//       { subject: "Social Studies", term1: 88, term2: 84 },
//       { subject: "Computer Science", term1: 95, term2: 97 },
//     ],
//   },
// };

const MOCK_NOTICES = [
  { id: 1, title: "Annual Sports Day", date: "Oct 25, 2025", type: "event", desc: "Annual Sports Day will be held on Oct 25. All students must participate." },
  { id: 2, title: "Term 2 Exam Schedule", date: "Nov 3, 2025", type: "exam", desc: "Term 2 examinations begin from November 3rd. Detailed timetable attached." },
  { id: 3, title: "Parent-Teacher Meeting", date: "Oct 18, 2025", type: "meeting", desc: "PTM scheduled for Oct 18. Parents are requested to attend." },
  { id: 4, title: "Library Books Due", date: "Oct 15, 2025", type: "reminder", desc: "All borrowed library books must be returned by Oct 15, 2025." },
];


// API helpers for attendance & marks
import { getAttendance, getMarks } from '../services/api';

// export default function StudentDashboard() {
// // Inside your component:
//   const [studentData, setStudentData] = useState(null);
//   const [attendance,  setAttendance]  = useState(null);
//   const [marks,       setMarks]       = useState(null);
//   const [loading,     setLoading]     = useState(true);


//   useEffect(() => {
//     const studentId = localStorage.getItem('studentId');
//     Promise.all([
//       getStudent(studentId),
//       getAttendance(studentId),
//       getMarks(studentId),
//     ]).then(([s, a, m]) => {
//       setStudentData(s.data);
//       setAttendance(a.data);
//       setMarks(m.data);
//       setLoading(false);
//     }).catch(console.error);
//   }, []);
//   if (loading) return <div>Loading...</div>;

//   return (
//     <div>
//       <h1>Student Dashboard</h1>
//       <p>{studentData?.name}</p>
//     </div>
//   );
// }

// ============================================================
// STYLES
// ============================================================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --primary: #1a3a5c;
    --primary-light: #2a5080;
    --accent: #e8a020;
    --accent-light: #ffc94a;
    --bg: #f0f4f8;
    --card: #ffffff;
    --text: #1a2332;
    --text-muted: #6b7a8d;
    --border: #e2e8f0;
    --success: #22c55e;
    --danger: #ef4444;
    --warning: #f59e0b;
    --info: #3b82f6;
    --sidebar-w: 260px;
    --radius: 14px;
    --shadow: 0 4px 24px rgba(26,58,92,0.08);
    --shadow-lg: 0 8px 40px rgba(26,58,92,0.14);
  }

  html, body, #root { height: 100%; font-family: 'Sora', sans-serif; background: var(--bg); color: var(--text); }

  /* AUTH */
  .auth-wrap { min-height: 100vh; display: flex; }
  .auth-left { flex: 1; background: linear-gradient(135deg, var(--primary) 0%, #0d2340 100%); display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 60px; position: relative; overflow: hidden; }
  .auth-left::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 30% 70%, rgba(232,160,32,0.15) 0%, transparent 60%); }
  .auth-orb { position: absolute; border-radius: 50%; filter: blur(60px); }
  .auth-orb-1 { width: 300px; height: 300px; background: rgba(232,160,32,0.1); top: -100px; right: -100px; }
  .auth-orb-2 { width: 200px; height: 200px; background: rgba(42,80,128,0.4); bottom: -50px; left: -50px; }
  .auth-brand { position: relative; z-index: 1; text-align: center; color: white; }
  .auth-brand-logo { font-size: 72px; margin-bottom: 20px; filter: drop-shadow(0 0 20px rgba(232,160,32,0.4)); }
  .auth-brand-name { font-size: 32px; font-weight: 800; letter-spacing: -0.5px; }
  .auth-brand-tagline { font-size: 14px; opacity: 0.6; margin-top: 8px; font-weight: 300; letter-spacing: 0.5px; }
  .auth-brand-divider { width: 50px; height: 3px; background: var(--accent); border-radius: 3px; margin: 24px auto; }
  .auth-features { margin-top: 48px; display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 300px; }
  .auth-feature { display: flex; align-items: center; gap: 14px; color: white; font-size: 14px; opacity: 0.8; }
  .auth-feature-icon { width: 36px; height: 36px; background: rgba(232,160,32,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }

  .auth-right { flex: 1; display: flex; align-items: center; justify-content: center; padding: 60px; }
  .auth-card { width: 100%; max-width: 420px; }
  .auth-title { font-size: 28px; font-weight: 700; color: var(--primary); margin-bottom: 8px; }
  .auth-subtitle { font-size: 14px; color: var(--text-muted); margin-bottom: 36px; }
  .auth-tabs { display: flex; gap: 0; background: var(--bg); border-radius: 10px; padding: 4px; margin-bottom: 28px; }
  .auth-tab { flex: 1; padding: 10px; text-align: center; font-size: 14px; font-weight: 600; border-radius: 8px; cursor: pointer; transition: all 0.2s; color: var(--text-muted); border: none; background: transparent; }
  .auth-tab.active { background: white; color: var(--primary); box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  .auth-form { display: flex; flex-direction: column; gap: 16px; }
  .form-group label { display: block; font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 6px; }
  .form-group input { width: 100%; padding: 12px 16px; border: 2px solid var(--border); border-radius: 10px; font-size: 14px; font-family: 'Sora', sans-serif; transition: border-color 0.2s, box-shadow 0.2s; outline: none; background: white; color: var(--text); }
  .form-group input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(26,58,92,0.08); }
  .form-group input::placeholder { color: #b0bbc8; }
  .auth-btn { width: 100%; padding: 14px; background: var(--primary); color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: 'Sora', sans-serif; letter-spacing: 0.3px; }
  .auth-btn:hover { background: var(--primary-light); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,58,92,0.3); }
  .auth-btn:active { transform: translateY(0); }
  .auth-divider { display: flex; align-items: center; gap: 12px; color: var(--text-muted); font-size: 13px; margin: 4px 0; }
  .auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .demo-credentials { background: linear-gradient(135deg, #f0f7ff, #e8f4fd); border: 1px solid #bee3f8; border-radius: 10px; padding: 14px 16px; margin-top: 8px; }
  .demo-credentials p { font-size: 12px; color: #2b6cb0; font-weight: 600; margin-bottom: 6px; }
  .demo-credentials code { font-family: 'DM Mono', monospace; font-size: 12px; color: #2b6cb0; display: block; opacity: 0.8; }
  .auth-error { background: #fff5f5; border: 1px solid #fed7d7; color: #c53030; padding: 10px 14px; border-radius: 8px; font-size: 13px; }

  /* DASHBOARD LAYOUT */
  .dashboard { display: flex; min-height: 100vh; }

  /* SIDEBAR */
  .sidebar { width: var(--sidebar-w); background: var(--primary); position: fixed; top: 0; left: 0; height: 100vh; display: flex; flex-direction: column; z-index: 100; transition: transform 0.3s; }
  .sidebar-header { padding: 28px 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .sidebar-logo { display: flex; align-items: center; gap: 12px; }
  .sidebar-logo-icon { font-size: 28px; }
  .sidebar-logo-text { color: white; font-size: 16px; font-weight: 700; line-height: 1.2; }
  .sidebar-logo-sub { font-size: 11px; opacity: 0.5; font-weight: 400; }
  .sidebar-nav { flex: 1; padding: 20px 12px; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; }
  .nav-section-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.3); letter-spacing: 1.5px; text-transform: uppercase; padding: 12px 12px 6px; margin-top: 8px; }
  .nav-item { display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 10px; cursor: pointer; transition: all 0.2s; color: rgba(255,255,255,0.6); font-size: 14px; font-weight: 500; border: none; background: transparent; width: 100%; text-align: left; }
  .nav-item:hover { background: rgba(255,255,255,0.08); color: white; }
  .nav-item.active { background: var(--accent); color: var(--primary); font-weight: 700; box-shadow: 0 4px 12px rgba(232,160,32,0.4); }
  .nav-item-icon { font-size: 18px; width: 22px; text-align: center; }
  .nav-badge { margin-left: auto; background: var(--accent); color: var(--primary); font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 20px; }
  .nav-item.active .nav-badge { background: var(--primary); color: var(--accent); }
  .sidebar-footer { padding: 20px 16px; border-top: 1px solid rgba(255,255,255,0.08); }
  .sidebar-user { display: flex; align-items: center; gap: 12px; padding: 10px; border-radius: 10px; }
  .sidebar-avatar { width: 38px; height: 38px; background: var(--accent); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; color: var(--primary); flex-shrink: 0; }
  .sidebar-user-info { flex: 1; min-width: 0; }
  .sidebar-user-name { color: white; font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sidebar-user-id { color: rgba(255,255,255,0.4); font-size: 11px; font-family: 'DM Mono', monospace; }
  .sidebar-logout { background: none; border: none; color: rgba(255,255,255,0.4); cursor: pointer; font-size: 18px; padding: 4px; transition: color 0.2s; }
  .sidebar-logout:hover { color: #ef4444; }

  /* MAIN CONTENT */
  .main-content { margin-left: var(--sidebar-w); flex: 1; min-height: 100vh; display: flex; flex-direction: column; }
  .topbar { background: white; border-bottom: 1px solid var(--border); padding: 16px 32px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
  .topbar-left { display: flex; flex-direction: column; }
  .topbar-greeting { font-size: 20px; font-weight: 700; color: var(--primary); }
  .topbar-date { font-size: 13px; color: var(--text-muted); margin-top: 2px; }
  .topbar-right { display: flex; align-items: center; gap: 12px; }
  .topbar-badge { background: linear-gradient(135deg, var(--accent), #f59e0b); color: white; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; }
  .topbar-notif { width: 38px; height: 38px; border-radius: 10px; background: var(--bg); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; position: relative; transition: background 0.2s; }
  .topbar-notif:hover { background: var(--border); }
  .notif-dot { position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; border: 2px solid white; }

  .page-content { padding: 32px; flex: 1; }

  /* STAT CARDS */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 28px; }
  .stat-card { background: white; border-radius: var(--radius); padding: 22px 24px; box-shadow: var(--shadow); position: relative; overflow: hidden; border: 1px solid var(--border); transition: transform 0.2s, box-shadow 0.2s; }
  .stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
  .stat-card-accent { position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: var(--radius) var(--radius) 0 0; }
  .stat-card-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 14px; }
  .stat-card-value { font-size: 30px; font-weight: 800; color: var(--text); line-height: 1; }
  .stat-card-label { font-size: 12px; color: var(--text-muted); margin-top: 4px; font-weight: 500; }
  .stat-card-change { display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; margin-top: 10px; }

  /* CARDS */
  .card { background: white; border-radius: var(--radius); padding: 24px; box-shadow: var(--shadow); border: 1px solid var(--border); }
  .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .card-title { font-size: 16px; font-weight: 700; color: var(--primary); }
  .card-subtitle { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
  .card-badge { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; }

  /* GRID LAYOUTS */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .grid-3 { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 20px; }

  /* ATTENDANCE CHART */
  .attendance-bar-chart { display: flex; align-items: flex-end; gap: 12px; height: 120px; padding: 0 4px; }
  .bar-group { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .bar-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; }
  .bar { width: 100%; border-radius: 6px 6px 0 0; transition: all 0.4s; cursor: pointer; position: relative; min-height: 4px; }
  .bar:hover { filter: brightness(1.1); }
  .bar-label { font-size: 11px; color: var(--text-muted); font-weight: 600; }
  .bar-pct { font-size: 10px; color: var(--text-muted); }

  /* SUBJECT ATTENDANCE */
  .subject-list { display: flex; flex-direction: column; gap: 12px; }
  .subject-row { display: flex; align-items: center; gap: 12px; }
  .subject-name { font-size: 13px; font-weight: 600; color: var(--text); width: 150px; flex-shrink: 0; }
  .subject-bar-bg { flex: 1; height: 8px; background: var(--bg); border-radius: 4px; overflow: hidden; }
  .subject-bar-fill { height: 100%; border-radius: 4px; transition: width 0.6s; }
  .subject-pct { font-size: 12px; font-weight: 700; width: 42px; text-align: right; font-family: 'DM Mono', monospace; }

  /* RECENT ATTENDANCE */
  .attendance-days { display: flex; gap: 8px; flex-wrap: wrap; }
  .day-chip { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 8px; border-radius: 10px; min-width: 52px; }
  .day-chip-label { font-size: 10px; font-weight: 700; }
  .day-chip-date { font-size: 10px; opacity: 0.7; }
  .day-chip.present { background: #f0fdf4; color: #16a34a; }
  .day-chip.absent { background: #fff5f5; color: #dc2626; }
  .day-chip.late { background: #fffbeb; color: #d97706; }
  .day-chip-dot { width: 8px; height: 8px; border-radius: 50%; }
  .day-chip.present .day-chip-dot { background: #22c55e; }
  .day-chip.absent .day-chip-dot { background: #ef4444; }
  .day-chip.late .day-chip-dot { background: #f59e0b; }

  /* MARKS TABLE */
  .marks-table { width: 100%; border-collapse: collapse; }
  .marks-table th { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.8px; padding: 10px 12px; text-align: left; background: var(--bg); }
  .marks-table td { padding: 12px 12px; font-size: 14px; border-bottom: 1px solid var(--border); }
  .marks-table tr:last-child td { border-bottom: none; }
  .marks-table tr:hover td { background: #fafbfc; }
  .grade-badge { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 22px; border-radius: 6px; font-size: 11px; font-weight: 800; }
  .grade-A-plus { background: #dcfce7; color: #16a34a; }
  .grade-A { background: #dbeafe; color: #1d4ed8; }
  .grade-A-minus { background: #ede9fe; color: #7c3aed; }
  .grade-B-plus { background: #fef9c3; color: #a16207; }
  .grade-B { background: #ffedd5; color: #c2410c; }
  .grade-C { background: #fee2e2; color: #dc2626; }

  /* PROGRESS COMPARE */
  .progress-compare { display: flex; flex-direction: column; gap: 14px; }
  .pc-row { }
  .pc-label { font-size: 12px; font-weight: 600; color: var(--text-muted); margin-bottom: 6px; }
  .pc-bars { display: flex; gap: 6px; }
  .pc-bar-wrap { flex: 1; }
  .pc-bar-bg { height: 10px; background: var(--bg); border-radius: 5px; overflow: hidden; margin-bottom: 3px; }
  .pc-bar-fill { height: 100%; border-radius: 5px; }
  .pc-bar-info { font-size: 10px; color: var(--text-muted); font-family: 'DM Mono', monospace; }

  /* MARKSHEET CARD */
  .marksheet-header { display: flex; align-items: center; justify-content: space-between; background: linear-gradient(135deg, var(--primary) 0%, #0d2340 100%); color: white; padding: 20px 24px; border-radius: var(--radius) var(--radius) 0 0; margin: -24px -24px 20px; }
  .marksheet-info { font-size: 13px; opacity: 0.7; }
  .marksheet-pct { font-size: 36px; font-weight: 800; }
  .marksheet-result { display: inline-block; background: var(--accent); color: var(--primary); font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 20px; margin-top: 4px; }

  /* TERM SELECTOR */
  .term-selector { display: flex; gap: 8px; margin-bottom: 20px; }
  .term-btn { padding: 8px 16px; border-radius: 8px; border: 2px solid var(--border); background: white; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: 'Sora', sans-serif; color: var(--text-muted); }
  .term-btn.active { border-color: var(--primary); background: var(--primary); color: white; }

  /* NOTICES */
  .notice-list { display: flex; flex-direction: column; gap: 12px; }
  .notice-item { padding: 14px 16px; border-radius: 10px; border-left: 4px solid; display: flex; gap: 14px; }
  .notice-item.event { background: #eff6ff; border-color: #3b82f6; }
  .notice-item.exam { background: #fff7ed; border-color: #f97316; }
  .notice-item.meeting { background: #f0fdf4; border-color: #22c55e; }
  .notice-item.reminder { background: #faf5ff; border-color: #a855f7; }
  .notice-icon { font-size: 20px; }
  .notice-title { font-size: 14px; font-weight: 700; color: var(--text); }
  .notice-desc { font-size: 12px; color: var(--text-muted); margin-top: 3px; line-height: 1.5; }
  .notice-date { font-size: 11px; font-family: 'DM Mono', monospace; margin-top: 5px; opacity: 0.6; }

  /* PROFILE */
  .profile-hero { background: linear-gradient(135deg, var(--primary) 0%, #0d2340 100%); border-radius: var(--radius); padding: 32px; color: white; margin-bottom: 20px; display: flex; align-items: center; gap: 28px; }
  .profile-avatar-lg { width: 80px; height: 80px; background: var(--accent); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; color: var(--primary); flex-shrink: 0; }
  .profile-name { font-size: 26px; font-weight: 800; }
  .profile-meta { font-size: 13px; opacity: 0.7; margin-top: 6px; display: flex; flex-wrap: wrap; gap: 16px; }
  .profile-meta-item { display: flex; align-items: center; gap: 6px; }
  .profile-details { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .profile-field { background: white; border: 1px solid var(--border); border-radius: 10px; padding: 16px 18px; }
  .profile-field-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; }
  .profile-field-value { font-size: 15px; font-weight: 600; color: var(--primary); }

  /* SHIMMER */
  @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  .shimmer { background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%); background-size: 800px 100%; animation: shimmer 1.5s infinite; border-radius: 6px; }

  /* RESPONSIVE */
  @media (max-width: 1100px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
    .profile-details { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 768px) {
    :root { --sidebar-w: 0px; }
    .sidebar { transform: translateX(-100%); }
    .main-content { margin-left: 0; }
    .page-content { padding: 20px 16px; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
  }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  /* PAGE TRANSITIONS */
  .page-enter { animation: pageIn 0.25s ease-out; }
  @keyframes pageIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  .tag { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px; }
  .tag-success { background: #dcfce7; color: #16a34a; }
  .tag-danger { background: #fee2e2; color: #dc2626; }
  .tag-warning { background: #fef9c3; color: #a16207; }
  .tag-info { background: #dbeafe; color: #1d4ed8; }

  .divider { height: 1px; background: var(--border); margin: 16px 0; }

  .gsheet-banner { background: linear-gradient(135deg, #e8f5e9, #f1f8e9); border: 1px solid #a5d6a7; border-radius: 10px; padding: 12px 16px; display: flex; align-items: center; gap: 12px; font-size: 13px; color: #2e7d32; margin-bottom: 20px; }
  .gsheet-banner strong { font-weight: 700; }

  .empty-state { text-align: center; padding: 40px 20px; color: var(--text-muted); }
  .empty-state-icon { font-size: 48px; margin-bottom: 12px; }
  .empty-state-text { font-size: 14px; }
`;

// ============================================================
// UTILITIES
// ============================================================
function getGradeClass(grade) {
  const map = { "A+": "grade-A-plus", A: "grade-A", "A-": "grade-A-minus", "B+": "grade-B-plus", B: "grade-B", C: "grade-C" };
  return map[grade] || "grade-C";
}

function getAttendanceColor(pct) {
  if (pct >= 90) return "#22c55e";
  if (pct >= 75) return "#f59e0b";
  return "#ef4444";
}

function formatDate() {
  return new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

const NOTICE_ICONS = { event: "🎉", exam: "📝", meeting: "👨‍👩‍👦", reminder: "🔔" };

// ============================================================
// AUTH SCREENS
// ============================================================
import { login, register } from '../services/api';
function AuthScreen({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", id: "", class: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // const handleLogin = () => {
  //   setError("");
  //   if (!loginData.email || !loginData.password) { setError("Please fill in all fields."); return; }
  //   setLoading(true);
  //   setTimeout(() => {
  //     const student = MOCK_STUDENTS.find(s => s.email === loginData.email && s.password === loginData.password);
  //     setLoading(false);
  //     if (student) onLogin(student);
  //     else setError("Invalid email or password. Please try again.");
  //   }, 1000);
  // };
  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await login({ email: loginData.email, password: loginData.password, role: 'student' });
      localStorage.setItem('token',     res.data.token);
      localStorage.setItem('studentId', res.data.user._id);
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };


  const handleSignup = async () => {
    setError("");

    if (!signupData.name || !signupData.id || !signupData.class || !signupData.email || !signupData.password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (signupData.password !== signupData.confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await register({
        studentId: signupData.id,
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        class: signupData.class,
        rollNo: 0,
      });

      alert("Account created! Please login.");
      setTab("login");
      setLoginData({ email: signupData.email, password: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-left">
        <div className="auth-orb auth-orb-1"></div>
        <div className="auth-orb auth-orb-2"></div>
        <div className="auth-brand">
          <div className="auth-brand-logo">{INSTITUTE_CONFIG.logo}</div>
          <div className="auth-brand-name">{INSTITUTE_CONFIG.name}</div>
          <div className="auth-brand-tagline">{INSTITUTE_CONFIG.tagline}</div>
          <div className="auth-brand-divider"></div>
        </div>
        <div className="auth-features">
          {[["📊", "Real-time Academic Dashboard"], ["📅", "Attendance Tracking"], ["📋", "Digital Marksheets"], ["🔔", "Notice & Announcements"]].map(([icon, text]) => (
            <div className="auth-feature" key={text}>
              <div className="auth-feature-icon">{icon}</div>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-title">Welcome Back 👋</div>
          <div className="auth-subtitle">Sign in to your student portal to access your academic records</div>
          <div className="auth-tabs">
            <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setError(""); }}>Login</button>
            <button className={`auth-tab ${tab === "signup" ? "active" : ""}`} onClick={() => { setTab("signup"); setError(""); }}>Register</button>
          </div>

          {tab === "login" ? (
            <div className="auth-form">
              <div className="form-group">
                <label>Student Email</label>
                <input type="email" placeholder="you@student.school.edu" value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} onKeyDown={e => e.key === "Enter" && handleLogin()} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="Enter your password" value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} onKeyDown={e => e.key === "Enter" && handleLogin()} />
              </div>
              {error && <div className="auth-error">⚠️ {error}</div>}
              <button className="auth-btn" onClick={handleLogin} disabled={loading}>{loading ? "Signing in..." : "Sign In →"}</button>
              <div className="auth-divider">New here?</div>
              <div className="demo-credentials">
                <p>Create an account first using the <strong>Register</strong> tab above, then sign in with your email and password.</p>
              </div>
            </div>
          ) : (
            <div className="auth-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" placeholder="Your full name" value={signupData.name} onChange={e => setSignupData({ ...signupData, name: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label>Student ID *</label>
                  <input type="text" placeholder="e.g. GFA2024001" value={signupData.id} onChange={e => setSignupData({ ...signupData, id: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Class *</label>
                  <input type="text" placeholder="e.g. 10-A" value={signupData.class} onChange={e => setSignupData({ ...signupData, class: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>School Email *</label>
                <input type="email" placeholder="you@student.school.edu" value={signupData.email} onChange={e => setSignupData({ ...signupData, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Password *</label>
                <input type="password" placeholder="Create a strong password" value={signupData.password} onChange={e => setSignupData({ ...signupData, password: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Confirm Password *</label>
                <input type="password" placeholder="Repeat your password" value={signupData.confirm} onChange={e => setSignupData({ ...signupData, confirm: e.target.value })} />
              </div>
              {error && <div className="auth-error">⚠️ {error}</div>}
              <button className="auth-btn" onClick={handleSignup} disabled={loading}>{loading ? "Creating account..." : "Create Account →"}</button>
            </div>
          )}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)", textAlign: "center" }}>
            <Link to="/admin" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
              Staff or Admin? Sign in here →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD PAGES
// ============================================================
function OverviewPage({ student, attendance, marks }) {
  if (!attendance || !marks) {
    return (
      <div className="page-enter">
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          <div className="empty-state-text">Loading your academic overview...</div>
        </div>
      </div>
    );
  }

  const att = attendance;
  const latestTerm = marks.terms[marks.terms.length - 1];

  return (
    <div className="page-enter">
      <div className="stats-grid">
        {[
          { label: "Attendance", value: `${att.overall}%`, icon: "📅", color: getAttendanceColor(att.overall), change: "+2.3% this month", up: true, bg: "#f0fdf4" },
          { label: "GPA / 10", value: marks.gpa, icon: "⭐", color: "#3b82f6", change: "Rank #" + marks.rank + " / " + marks.totalStudents, up: true, bg: "#eff6ff" },
          { label: "Last Term %", value: `${latestTerm.percentage}%`, icon: "📊", color: "#a855f7", change: latestTerm.name, up: true, bg: "#faf5ff" },
          { label: "Notices", value: MOCK_NOTICES.length, icon: "🔔", color: "#f59e0b", change: "2 new this week", up: false, bg: "#fffbeb" },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-card-accent" style={{ background: s.color }}></div>
            <div className="stat-card-icon" style={{ background: s.bg, fontSize: 22 }}>{s.icon}</div>
            <div className="stat-card-value">{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
            <div className="stat-card-change" style={{ color: s.color }}>
              <span>{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Monthly Attendance</div>
              <div className="card-subtitle">{INSTITUTE_CONFIG.academicYear}</div>
            </div>
            <span className="tag tag-success">Overall {att.overall}%</span>
          </div>
          <div className="attendance-bar-chart">
            {att.monthly.map(m => (
              <div className="bar-group" key={m.month}>
                <div className="bar-wrap">
                  <div className="bar" style={{ height: `${m.pct}%`, background: getAttendanceColor(m.pct), opacity: 0.85 }} title={`${m.pct}%`}></div>
                </div>
                <div className="bar-label">{m.month}</div>
                <div className="bar-pct">{Math.round(m.pct)}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Subject-wise Attendance</div>
              <div className="card-subtitle">Current academic year</div>
            </div>
          </div>
          <div className="subject-list">
            {att.subjects.slice(0, 5).map(s => (
              <div className="subject-row" key={s.name}>
                <div className="subject-name">{s.name}</div>
                <div className="subject-bar-bg">
                  <div className="subject-bar-fill" style={{ width: `${s.pct}%`, background: getAttendanceColor(s.pct) }}></div>
                </div>
                <div className="subject-pct" style={{ color: getAttendanceColor(s.pct) }}>{s.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Attendance</div>
            <div style={{ display: "flex", gap: 10 }}>
              <span className="tag tag-success">P Present</span>
              <span className="tag tag-danger">A Absent</span>
              <span className="tag tag-warning">L Late</span>
            </div>
          </div>
          <div className="attendance-days">
            {att.recent.map(d => (
              <div className={`day-chip ${d.status}`} key={d.date}>
                <div className="day-chip-dot"></div>
                <div className="day-chip-label">{d.day}</div>
                <div className="day-chip-date">{d.date.slice(5)}</div>
                <div className="day-chip-label" style={{ textTransform: "capitalize" }}>{d.status[0].toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Latest Notices</div>
            <span className="tag tag-info">{MOCK_NOTICES.length} Active</span>
          </div>
          <div className="notice-list">
            {MOCK_NOTICES.slice(0, 3).map(n => (
              <div className={`notice-item ${n.type}`} key={n.id}>
                <div className="notice-icon">{NOTICE_ICONS[n.type]}</div>
                <div>
                  <div className="notice-title">{n.title}</div>
                  <div className="notice-date">{n.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendancePage({ attendance }) {
  const att = attendance;
  if (!att) {
    return (
      <div className="page-enter">
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <div className="empty-state-text">Attendance data is not available yet.</div>
        </div>
      </div>
    );
  }
  return (
    <div className="page-enter">
      <div className="gsheet-banner">
        <span>📊</span>
        <div><strong>Live Data Source:</strong> This attendance data is pulled from Google Sheets. Teachers update it directly — no technical knowledge required.</div>
      </div>
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        {[
          { label: "Overall Attendance", value: `${att.overall}%`, icon: "📅", color: getAttendanceColor(att.overall) },
          { label: "Days Present (YTD)", value: att.monthly.reduce((a, b) => a + b.present, 0), icon: "✅", color: "#22c55e" },
          { label: "Days Absent (YTD)", value: att.monthly.reduce((a, b) => a + (b.total - b.present), 0), icon: "❌", color: "#ef4444" },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-card-accent" style={{ background: s.color }}></div>
            <div className="stat-card-icon" style={{ background: s.color + "20", fontSize: 22 }}>{s.icon}</div>
            <div className="stat-card-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div className="card-title">Monthly Breakdown</div>
          <span className="tag tag-info">{INSTITUTE_CONFIG.academicYear}</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="marks-table">
            <thead>
              <tr><th>Month</th><th>Days Present</th><th>Total Working Days</th><th>Days Absent</th><th>Attendance %</th><th>Status</th></tr>
            </thead>
            <tbody>
              {att.monthly.map(m => (
                <tr key={m.month}>
                  <td style={{ fontWeight: 700 }}>{m.month}</td>
                  <td style={{ color: "#16a34a", fontWeight: 700 }}>{m.present}</td>
                  <td>{m.total}</td>
                  <td style={{ color: "#dc2626" }}>{m.total - m.present}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 8, background: "var(--bg)", borderRadius: 4, overflow: "hidden", width: 80 }}>
                        <div style={{ height: "100%", width: `${m.pct}%`, background: getAttendanceColor(m.pct), borderRadius: 4 }}></div>
                      </div>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 700, color: getAttendanceColor(m.pct) }}>{m.pct}%</span>
                    </div>
                  </td>
                  <td><span className={`tag ${m.pct >= 75 ? "tag-success" : "tag-danger"}`}>{m.pct >= 75 ? "✓ Good" : "⚠ Low"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Subject-wise Attendance Detail</div>
        </div>
        <table className="marks-table">
          <thead>
            <tr><th>Subject</th><th>Present</th><th>Total Classes</th><th>Attendance</th><th>Status</th></tr>
          </thead>
          <tbody>
            {att.subjects.map(s => (
              <tr key={s.name}>
                <td style={{ fontWeight: 600 }}>{s.name}</td>
                <td>{s.present}</td>
                <td>{s.total}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 8, background: "var(--bg)", borderRadius: 4, overflow: "hidden", width: 100 }}>
                      <div style={{ height: "100%", width: `${s.pct}%`, background: getAttendanceColor(s.pct), borderRadius: 4 }}></div>
                    </div>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 700, color: getAttendanceColor(s.pct) }}>{s.pct}%</span>
                  </div>
                </td>
                <td><span className={`tag ${s.pct >= 75 ? "tag-success" : "tag-danger"}`}>{s.pct >= 75 ? "✓ Regular" : "⚠ Short"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MarksPage({ student, marks }) {
  if (!marks) {
    return (
      <div className="page-enter">
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <div className="empty-state-text">Marks data is not available yet.</div>
        </div>
      </div>
    );
  }

  const [selectedTerm, setSelectedTerm] = useState(0);
  const term = marks.terms[selectedTerm];

  return (
    <div className="page-enter">
      <div className="gsheet-banner">
        <span>📋</span>
        <div><strong>Live Data Source:</strong> Marks are updated by teachers in Google Sheets and reflect here automatically. No IT support needed.</div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 20 }}>
        {[
          { label: "GPA", value: marks.gpa + " / 10", color: "#3b82f6" },
          { label: "Class Rank", value: `#${marks.rank}`, color: "#a855f7" },
          { label: "Last Term %", value: term.percentage + "%", color: "#22c55e" },
          { label: "Result", value: term.result, color: "#22c55e" },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-card-accent" style={{ background: s.color }}></div>
            <div className="stat-card-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="term-selector">
        {marks.terms.map((t, i) => (
          <button key={t.name} className={`term-btn ${selectedTerm === i ? "active" : ""}`} onClick={() => setSelectedTerm(i)}>{t.name}</button>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="marksheet-header">
          <div>
            <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 4 }}>MARKSHEET — {INSTITUTE_CONFIG.name}</div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{term.name} Report Card</div>
            <div className="marksheet-info">Class: {student.class} | Roll No: {student.rollNo} | Year: {INSTITUTE_CONFIG.academicYear}</div>
            <div className="marksheet-result">{term.result}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 4 }}>TOTAL SCORE</div>
            <div className="marksheet-pct">{term.total}/{term.max}</div>
            <div style={{ fontSize: 14, opacity: 0.7, marginTop: 4 }}>{term.percentage}%</div>
          </div>
        </div>
        <table className="marks-table">
          <thead>
            <tr><th>#</th><th>Subject</th><th>Marks Obtained</th><th>Max Marks</th><th>Percentage</th><th>Grade</th></tr>
          </thead>
          <tbody>
            {term.subjects.map((s, i) => (
              <tr key={s.name}>
                <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{i + 1}</td>
                <td style={{ fontWeight: 600 }}>{s.name}</td>
                <td style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 16, color: getAttendanceColor((s.marks / s.max) * 100) }}>{s.marks}</td>
                <td style={{ color: "var(--text-muted)" }}>{s.max}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 60, height: 6, background: "var(--bg)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(s.marks / s.max) * 100}%`, background: getAttendanceColor((s.marks / s.max) * 100), borderRadius: 3 }}></div>
                    </div>
                    <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace" }}>{Math.round((s.marks / s.max) * 100)}%</span>
                  </div>
                </td>
                <td><span className={`grade-badge ${getGradeClass(s.grade)}`}>{s.grade}</span></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: "#fafbfc" }}>
              <td colSpan={2} style={{ fontWeight: 800, fontSize: 14, padding: "14px 12px" }}>TOTAL</td>
              <td style={{ fontWeight: 800, fontSize: 16, fontFamily: "'DM Mono', monospace" }}>{term.total}</td>
              <td style={{ fontWeight: 700 }}>{term.max}</td>
              <td style={{ fontWeight: 700 }}>{term.percentage}%</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Term-wise Progress Comparison</div>
          <div style={{ display: "flex", gap: 12 }}>
            <span className="tag" style={{ background: "#dbeafe", color: "#1d4ed8" }}>■ Term 1</span>
            <span className="tag" style={{ background: "#dcfce7", color: "#16a34a" }}>■ Term 2</span>
          </div>
        </div>
        <div className="progress-compare">
          {marks.progress.map(p => (
            <div className="pc-row" key={p.subject}>
              <div className="pc-label">{p.subject}</div>
              <div className="pc-bars">
                <div className="pc-bar-wrap">
                  <div className="pc-bar-bg">
                    <div className="pc-bar-fill" style={{ width: `${p.term1}%`, background: "#3b82f6" }}></div>
                  </div>
                  <div className="pc-bar-info">Term 1: {p.term1}/100</div>
                </div>
                <div className="pc-bar-wrap">
                  <div className="pc-bar-bg">
                    <div className="pc-bar-fill" style={{ width: `${p.term2}%`, background: "#22c55e" }}></div>
                  </div>
                  <div className="pc-bar-info">Term 2: {p.term2}/100</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NoticesPage() {
  return (
    <div className="page-enter">
      <div className="notice-list">
        {MOCK_NOTICES.map(n => (
          <div className={`notice-item ${n.type}`} key={n.id} style={{ padding: "18px 20px" }}>
            <div className="notice-icon" style={{ fontSize: 28 }}>{NOTICE_ICONS[n.type]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div className="notice-title" style={{ fontSize: 16 }}>{n.title}</div>
                <span className="tag tag-info" style={{ flexShrink: 0 }}>{n.type}</span>
              </div>
              <div className="notice-desc">{n.desc}</div>
              <div className="notice-date">📅 {n.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfilePage({ student, attendance, marks }) {
  const att = attendance;
  const marksData = marks;

  if (!att || !marksData) {
    return (
      <div className="page-enter">
        <div className="empty-state">
          <div className="empty-state-icon">👤</div>
          <div className="empty-state-text">Loading your profile summary...</div>
        </div>
      </div>
    );
  }
  return (
    <div className="page-enter">
      <div className="profile-hero">
        <div className="profile-avatar-lg">{student.avatar}</div>
        <div>
          <div className="profile-name">{student.name}</div>
          <div className="profile-meta">
            <span className="profile-meta-item">🏫 {INSTITUTE_CONFIG.name}</span>
            <span className="profile-meta-item">📚 Class {student.class}</span>
            <span className="profile-meta-item">🎓 Roll No. {student.rollNo}</span>
            <span className="profile-meta-item">📅 {INSTITUTE_CONFIG.academicYear}</span>
          </div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 4 }}>STUDENT ID</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 700 }}>{student.id}</div>
        </div>
      </div>
      <div className="profile-details" style={{ marginBottom: 20 }}>
        {[
          { label: "Full Name", value: student.name },
          { label: "Student ID", value: student.id },
          { label: "Class", value: student.class },
          { label: "Roll Number", value: student.rollNo },
          { label: "Email", value: student.email },
          { label: "Academic Year", value: INSTITUTE_CONFIG.academicYear },
          { label: "Attendance", value: att.overall + "%" },
          { label: "GPA", value: marksData.gpa + " / 10" },
          { label: "Class Rank", value: "#" + marksData.rank + " of " + marksData.totalStudents },
        ].map(f => (
          <div className="profile-field" key={f.label}>
            <div className="profile-field-label">{f.label}</div>
            <div className="profile-field-value">{f.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MAIN DASHBOARD
// ============================================================
const NAV = [
  { id: "overview", label: "Overview", icon: "🏠" },
  { id: "attendance", label: "Attendance", icon: "📅" },
  { id: "marks", label: "Marksheets", icon: "📊" },
  { id: "notices", label: "Notices", icon: "🔔", badge: MOCK_NOTICES.length },
  { id: "profile", label: "My Profile", icon: "👤" },
];

function Dashboard({ student, attendance, marks, loading, onLogout }) {
  const [page, setPage] = useState("overview");

  const PAGE_TITLES = {
    overview: "Dashboard Overview",
    attendance: "Attendance Records",
    marks: "Marks & Report Cards",
    notices: "Notices & Announcements",
    profile: "Student Profile",
  };

  const renderPage = () => {
    if (loading) {
      return (
        <div className="page-enter">
          <div className="empty-state">
            <div className="empty-state-icon">⏳</div>
            <div className="empty-state-text">Loading your data from the server...</div>
          </div>
        </div>
      );
    }

    switch (page) {
      case "overview":
        return (
          <OverviewPage
            student={student}
            attendance={attendance}
            marks={marks}
          />
        );
      case "attendance":
        return <AttendancePage attendance={attendance} />;
      case "marks":
        return <MarksPage student={student} marks={marks} />;
      case "notices":
        return <NoticesPage />;
      case "profile":
        return (
          <ProfilePage
            student={student}
            attendance={attendance}
            marks={marks}
          />
        );
      default:
        return (
          <OverviewPage
            student={student}
            attendance={attendance}
            marks={marks}
          />
        );
    }
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">{INSTITUTE_CONFIG.logo}</div>
            <div>
              <div className="sidebar-logo-text">{INSTITUTE_CONFIG.name}</div>
              <div className="sidebar-logo-sub">Student Portal</div>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-label">Main Menu</div>
          {NAV.map(item => (
            <button key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => setPage(item.id)}>
              <span className="nav-item-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </button>
          ))}
          <div className="nav-section-label">Quick Links</div>
          <button className="nav-item" onClick={() => alert("Google Sheets link would open here")}>
            <span className="nav-item-icon">📋</span>
            <span>Attendance Sheet</span>
          </button>
          <button className="nav-item" onClick={() => alert("Google Sheets link would open here")}>
            <span className="nav-item-icon">📝</span>
            <span>Marks Sheet</span>
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{student.avatar}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{student.name}</div>
              <div className="sidebar-user-id">{student.id}</div>
            </div>
            <button className="sidebar-logout" onClick={onLogout} title="Sign Out">⏻</button>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="topbar">
          <div className="topbar-left">
            <div className="topbar-greeting">{PAGE_TITLES[page]}</div>
            <div className="topbar-date">{formatDate()}</div>
          </div>
          <div className="topbar-right">
            <div className="topbar-badge">Class {student.class}</div>
            <button className="topbar-notif">🔔<span className="notif-dot"></span></button>
            <div className="sidebar-avatar" style={{ width: 38, height: 38 }}>{student.avatar}</div>
          </div>
        </div>
        <div className="page-content">{renderPage()}</div>
      </div>
    </div>
  );
}

// ============================================================
// APP ROOT
// ============================================================
export default function App() {
  const [student,     setStudent]     = useState(null);
  const [attendance,  setAttendance]  = useState(null);
  const [marks,       setMarks]       = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  const handleLogin = (s) => setStudent(s);
  const handleLogout = () => {
    setStudent(null);
    setAttendance(null);
    setMarks(null);
    localStorage.removeItem('studentId');
    localStorage.removeItem('token');
  };

  // Whenever a student is present (or studentId is stored), load attendance & marks
  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      setLoadingData(false);
      return;
    }

    setLoadingData(true);
    Promise.all([
      getAttendance(studentId),
      getMarks(studentId),
    ])
      .then(([a, m]) => {
        setAttendance(a.data);
        setMarks(m.data);
      })
      .catch((err) => {
        console.error('Failed to load student data', err);
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, [student]);

  const isLoggedIn = !!student;

  return (
    <>
      <style>{styles}</style>
      {isLoggedIn ? (
        <Dashboard
          student={student}
          attendance={attendance}
          marks={marks}
          loading={loadingData}
          onLogout={handleLogout}
        />
      ) : (
        <AuthScreen onLogin={handleLogin} />
      )}
    </>
  );
}
