import { useState, useMemo } from "react";

// ============================================================
// INSTITUTE CONFIG — Customize for any school
// ============================================================
const CONFIG = {
  name: "Greenfield Academy",
  tagline: "Admin Control Center",
  logo: "🏛️",
  academicYear: "2025–2026",
  googleSheetURL: "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID",
  mongoAPIBase: "https://your-backend.com/api",
};

const SUBJECTS = ["Mathematics", "Science", "English", "Social Studies", "Computer Science", "Physical Education"];
const CLASSES = ["8-A", "8-B", "9-A", "9-B", "10-A", "10-B", "11-A", "11-B", "12-A", "12-B"];

// ============================================================
// MOCK DATA
// ============================================================
const STUDENTS = [
  { id: "GFA001", name: "Arjun Sharma",    class: "10-A", roll: 12, gender: "M", email: "arjun@greenfield.edu",   phone: "9876543210", attendance: 87, gpa: 8.4, status: "active",   guardian: "Rakesh Sharma" },
  { id: "GFA002", name: "Priya Verma",     class: "10-A", roll: 15, gender: "F", email: "priya@greenfield.edu",   phone: "9876543211", attendance: 93, gpa: 9.1, status: "active",   guardian: "Sunita Verma" },
  { id: "GFA003", name: "Rohan Mehta",     class: "10-B", roll: 8,  gender: "M", email: "rohan@greenfield.edu",   phone: "9876543212", attendance: 71, gpa: 7.2, status: "warning",  guardian: "Anil Mehta" },
  { id: "GFA004", name: "Sneha Patel",     class: "9-A",  roll: 3,  gender: "F", email: "sneha@greenfield.edu",   phone: "9876543213", attendance: 96, gpa: 9.6, status: "active",   guardian: "Vijay Patel" },
  { id: "GFA005", name: "Karan Singh",     class: "9-A",  roll: 19, gender: "M", email: "karan@greenfield.edu",   phone: "9876543214", attendance: 65, gpa: 6.8, status: "critical", guardian: "Harpreet Singh" },
  { id: "GFA006", name: "Aisha Khan",      class: "11-A", roll: 7,  gender: "F", email: "aisha@greenfield.edu",   phone: "9876543215", attendance: 89, gpa: 8.9, status: "active",   guardian: "Imran Khan" },
  { id: "GFA007", name: "Dev Gupta",       class: "11-B", roll: 22, gender: "M", email: "dev@greenfield.edu",     phone: "9876543216", attendance: 78, gpa: 7.8, status: "active",   guardian: "Suresh Gupta" },
  { id: "GFA008", name: "Riya Nair",       class: "12-A", roll: 5,  gender: "F", email: "riya@greenfield.edu",    phone: "9876543217", attendance: 91, gpa: 9.3, status: "active",   guardian: "Mohan Nair" },
  { id: "GFA009", name: "Yash Joshi",      class: "12-B", roll: 11, gender: "M", email: "yash@greenfield.edu",    phone: "9876543218", attendance: 82, gpa: 8.1, status: "active",   guardian: "Dinesh Joshi" },
  { id: "GFA010", name: "Pooja Mishra",    class: "8-A",  roll: 2,  gender: "F", email: "pooja@greenfield.edu",   phone: "9876543219", attendance: 95, gpa: 9.4, status: "active",   guardian: "Ramesh Mishra" },
  { id: "GFA011", name: "Ayaan Sheikh",    class: "8-B",  roll: 14, gender: "M", email: "ayaan@greenfield.edu",   phone: "9876543220", attendance: 73, gpa: 7.0, status: "warning",  guardian: "Zafar Sheikh" },
  { id: "GFA012", name: "Meera Iyer",      class: "9-B",  roll: 9,  gender: "F", email: "meera@greenfield.edu",   phone: "9876543221", attendance: 98, gpa: 9.8, status: "active",   guardian: "Subramaniam Iyer" },
];

// import { useState, useEffect } from 'react';
// import { getStudent, getAttendance, getMarks } from '../services/api';


// // Inside your component:
// const [studentData, setStudentData] = useState(null);
// const [attendance,  setAttendance]  = useState(null);
// const [marks,       setMarks]       = useState(null);
// const [loading,     setLoading]     = useState(true);


// useEffect(() => {
//   const studentId = localStorage.getItem('studentId');
//   Promise.all([
//     getStudent(studentId),
//     getAttendance(studentId),
//     getMarks(studentId),
//   ]).then(([s, a, m]) => {
//     setStudentData(s.data);
//     setAttendance(a.data);
//     setMarks(m.data);
//     setLoading(false);
//   }).catch(console.error);
// }, []);


const CLASS_STATS = CLASSES.map(cls => {
  const s = STUDENTS.filter(st => st.class === cls);
  const avg_att = s.length ? Math.round(s.reduce((a, b) => a + b.attendance, 0) / s.length) : 0;
  const avg_gpa = s.length ? (s.reduce((a, b) => a + b.gpa, 0) / s.length).toFixed(1) : 0;
  return { class: cls, count: s.length, avg_att, avg_gpa, critical: s.filter(x => x.status === "critical").length, warning: s.filter(x => x.status === "warning").length };
}).filter(c => c.count > 0);

const SUBJECT_SCHOOL_STATS = SUBJECTS.map((sub, i) => ({
  subject: sub,
  avg: [82, 88, 79, 85, 91, 76][i],
  highest: [98, 99, 96, 97, 100, 95][i],
  lowest: [45, 52, 41, 50, 60, 38][i],
  passRate: [94, 97, 88, 95, 99, 85][i],
  classes: CLASSES.slice(0, 5).map(c => ({ class: c, avg: Math.floor(70 + Math.random() * 28) })),
}));

const MONTHLY_ATTENDANCE = [
  { month: "Apr", school: 91, boys: 89, girls: 93 },
  { month: "May", school: 88, boys: 86, girls: 90 },
  { month: "Jun", school: 84, boys: 82, girls: 86 },
  { month: "Jul", school: 92, boys: 91, girls: 93 },
  { month: "Aug", school: 87, boys: 85, girls: 89 },
  { month: "Sep", school: 89, boys: 87, girls: 91 },
];

const EVENTS = [
  { id: 1, title: "Annual Sports Day",        date: "2025-10-25", type: "event",    audience: "All",    status: "upcoming", desc: "Annual inter-house sports competition. All students must participate.", author: "Principal", postedOn: "2025-10-01" },
  { id: 2, title: "Term 2 Exam Schedule",     date: "2025-11-03", type: "exam",     audience: "9,10,11,12", status: "upcoming", desc: "Term 2 examinations begin Nov 3. Timetable below.", author: "Exam Cell", postedOn: "2025-10-05" },
  { id: 3, title: "Parent-Teacher Meeting",   date: "2025-10-18", type: "meeting",  audience: "All",    status: "completed", desc: "PTM for all classes. Parents must attend.", author: "Admin", postedOn: "2025-09-28" },
  { id: 4, title: "Library Books Due",        date: "2025-10-15", type: "reminder", audience: "All",    status: "completed", desc: "All borrowed books must be returned by Oct 15.", author: "Librarian", postedOn: "2025-10-01" },
  { id: 5, title: "Science Exhibition",       date: "2025-11-15", type: "event",    audience: "9,10",   status: "upcoming", desc: "Inter-school science exhibition. Participants register by Oct 30.", author: "Science Dept", postedOn: "2025-10-08" },
];

const TEACHERS = [
  { id: "T01", name: "Mrs. Kavitha Rao",  subject: "Mathematics",      classes: ["9-A","10-A","10-B"], email: "kavitha@greenfield.edu", phone: "9900001111" },
  { id: "T02", name: "Mr. Suresh Nanda",  subject: "Science",           classes: ["8-A","9-A","9-B"],   email: "suresh@greenfield.edu",  phone: "9900001112" },
  { id: "T03", name: "Ms. Preethi Iyer",  subject: "English",           classes: ["10-A","11-A","12-A"],email: "preethi@greenfield.edu", phone: "9900001113" },
  { id: "T04", name: "Mr. Ajay Malhotra", subject: "Social Studies",    classes: ["8-B","9-B","10-B"],  email: "ajay@greenfield.edu",    phone: "9900001114" },
  { id: "T05", name: "Ms. Deepa Singh",   subject: "Computer Science",  classes: ["11-A","11-B","12-B"],email: "deepa@greenfield.edu",   phone: "9900001115" },
];

// ============================================================
// STYLES
// ============================================================
const S = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#0f1923;--ink2:#374151;--muted:#8896a8;
  --bg:#f3f5f8;--card:#ffffff;--border:#e5e9ef;
  --navy:#0f2942;--navy2:#1a3d5c;--navy3:#245080;
  --gold:#d4911a;--gold2:#f0a928;--gold-light:#fff3dc;
  --green:#16a34a;--green-bg:#f0fdf4;
  --red:#dc2626;--red-bg:#fff5f5;
  --amber:#d97706;--amber-bg:#fffbeb;
  --blue:#2563eb;--blue-bg:#eff6ff;
  --purple:#7c3aed;--purple-bg:#f5f3ff;
  --sidebar:260px;--topbar:64px;
  --r:12px;--r-sm:8px;
  --sh:0 2px 12px rgba(15,25,35,0.06);--sh-lg:0 8px 32px rgba(15,25,35,0.12);
}
html,body,#root{height:100%;font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--ink)}

/* SCROLLBAR */
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}

/* LAYOUT */
.layout{display:flex;min-height:100vh}

/* SIDEBAR */
.sb{width:var(--sidebar);background:var(--navy);position:fixed;top:0;left:0;height:100vh;display:flex;flex-direction:column;z-index:200;overflow:hidden}
.sb::before{content:'';position:absolute;bottom:-80px;right:-80px;width:220px;height:220px;background:radial-gradient(circle,rgba(212,145,26,0.12) 0%,transparent 70%);pointer-events:none}
.sb-head{padding:24px 20px 18px;border-bottom:1px solid rgba(255,255,255,0.07)}
.sb-logo{display:flex;align-items:center;gap:11px}
.sb-logo-icon{font-size:26px}
.sb-logo-name{color:#fff;font-size:15px;font-weight:800;letter-spacing:-0.3px;line-height:1.2}
.sb-logo-sub{color:rgba(255,255,255,0.35);font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:1px}
.sb-admin-badge{margin:14px 20px 0;background:rgba(212,145,26,0.15);border:1px solid rgba(212,145,26,0.3);border-radius:8px;padding:8px 12px;display:flex;align-items:center;gap:8px}
.sb-admin-dot{width:7px;height:7px;background:var(--gold2);border-radius:50%;box-shadow:0 0 6px var(--gold2);flex-shrink:0}
.sb-admin-text{color:var(--gold2);font-size:11px;font-weight:700;letter-spacing:0.3px}
.sb-nav{flex:1;padding:16px 12px;overflow-y:auto;display:flex;flex-direction:column;gap:2px}
.sb-section{font-size:10px;font-weight:700;color:rgba(255,255,255,0.25);letter-spacing:1.5px;text-transform:uppercase;padding:12px 10px 5px;margin-top:8px}
.nb{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:9px;cursor:pointer;transition:all .18s;color:rgba(255,255,255,0.55);font-size:13px;font-weight:500;border:none;background:transparent;width:100%;text-align:left}
.nb:hover{background:rgba(255,255,255,0.07);color:#fff}
.nb.on{background:linear-gradient(135deg,var(--gold),var(--gold2));color:var(--navy);font-weight:700;box-shadow:0 4px 14px rgba(212,145,26,0.35)}
.nb-icon{font-size:16px;width:20px;text-align:center;flex-shrink:0}
.nb-badge{margin-left:auto;background:rgba(255,255,255,0.15);color:#fff;font-size:10px;font-weight:800;padding:2px 7px;border-radius:20px;min-width:20px;text-align:center}
.nb.on .nb-badge{background:rgba(15,41,66,0.3);color:var(--navy)}
.sb-foot{padding:16px;border-top:1px solid rgba(255,255,255,0.07)}
.sb-user{display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;cursor:pointer;transition:background .18s}
.sb-user:hover{background:rgba(255,255,255,0.06)}
.sb-av{width:36px;height:36px;background:linear-gradient(135deg,var(--gold),#e8a020);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:var(--navy);flex-shrink:0}
.sb-uname{color:#fff;font-size:13px;font-weight:600}
.sb-urole{color:rgba(255,255,255,0.35);font-size:11px}
.sb-logout{background:none;border:none;color:rgba(255,255,255,0.3);cursor:pointer;font-size:16px;padding:4px;margin-left:auto;transition:color .15s}
.sb-logout:hover{color:#ef4444}

/* MAIN */
.main{margin-left:var(--sidebar);flex:1;display:flex;flex-direction:column;min-height:100vh}
.topbar{height:var(--topbar);background:white;border-bottom:1px solid var(--border);padding:0 28px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
.topbar-left h1{font-size:18px;font-weight:800;color:var(--ink);letter-spacing:-0.3px}
.topbar-left p{font-size:12px;color:var(--muted);margin-top:1px}
.topbar-right{display:flex;align-items:center;gap:10px}
.tb-btn{height:36px;padding:0 14px;border-radius:8px;border:1.5px solid var(--border);background:white;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;font-family:'Plus Jakarta Sans',sans-serif;color:var(--ink2);display:flex;align-items:center;gap:6px}
.tb-btn:hover{border-color:var(--navy2);color:var(--navy)}
.tb-btn-primary{background:var(--navy);color:white;border-color:var(--navy)}
.tb-btn-primary:hover{background:var(--navy2);color:white}
.tb-notif{width:36px;height:36px;border-radius:8px;border:1.5px solid var(--border);background:white;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;position:relative;transition:all .15s}
.tb-notif:hover{border-color:var(--navy2)}
.notif-dot{position:absolute;top:5px;right:5px;width:7px;height:7px;background:#ef4444;border-radius:50%;border:2px solid white}
.page{padding:24px 28px;flex:1}

/* PAGE ANIM */
.penter{animation:pIn .22s ease-out}
@keyframes pIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}

/* STAT CARDS */
.sg4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:22px}
.sg3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:22px}
.sc{background:white;border-radius:var(--r);padding:20px 22px;border:1px solid var(--border);box-shadow:var(--sh);position:relative;overflow:hidden;transition:transform .2s,box-shadow .2s}
.sc:hover{transform:translateY(-2px);box-shadow:var(--sh-lg)}
.sc-stripe{position:absolute;top:0;left:0;right:0;height:3px;border-radius:var(--r) var(--r) 0 0}
.sc-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.sc-icon{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px}
.sc-val{font-size:28px;font-weight:800;color:var(--ink);letter-spacing:-0.5px}
.sc-label{font-size:12px;color:var(--muted);font-weight:500;margin-top:3px}
.sc-meta{font-size:12px;font-weight:600;margin-top:8px}

/* CARDS */
.card{background:white;border-radius:var(--r);padding:22px;border:1px solid var(--border);box-shadow:var(--sh);margin-bottom:18px}
.card-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.card-title{font-size:15px;font-weight:800;color:var(--ink)}
.card-sub{font-size:12px;color:var(--muted);margin-top:2px}

/* GRIDS */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.g31{display:grid;grid-template-columns:2fr 1fr;gap:18px}
.g13{display:grid;grid-template-columns:1fr 2fr;gap:18px}

/* TABLES */
.tbl{width:100%;border-collapse:collapse}
.tbl th{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.8px;padding:9px 12px;text-align:left;background:#f8f9fb;border-bottom:1px solid var(--border)}
.tbl th:first-child{border-radius:8px 0 0 0}
.tbl th:last-child{border-radius:0 8px 0 0}
.tbl td{padding:11px 12px;font-size:13px;border-bottom:1px solid #f3f5f8;vertical-align:middle}
.tbl tr:last-child td{border-bottom:none}
.tbl tbody tr{transition:background .12s;cursor:pointer}
.tbl tbody tr:hover td{background:#f9fafb}

/* TAGS & BADGES */
.tag{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;padding:3px 9px;border-radius:6px}
.t-green{background:var(--green-bg);color:var(--green)}
.t-red{background:var(--red-bg);color:var(--red)}
.t-amber{background:var(--amber-bg);color:var(--amber)}
.t-blue{background:var(--blue-bg);color:var(--blue)}
.t-purple{background:var(--purple-bg);color:var(--purple)}
.t-navy{background:#e8f0f8;color:var(--navy2)}
.t-gold{background:var(--gold-light);color:var(--gold)}

/* PILLS */
.pill{display:inline-flex;align-items:center;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;gap:4px}
.pill-active{background:var(--green-bg);color:var(--green)}
.pill-warning{background:var(--amber-bg);color:var(--amber)}
.pill-critical{background:var(--red-bg);color:var(--red)}

/* AVATAR */
.av{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:white;flex-shrink:0}

/* SEARCH & FILTER */
.toolbar{display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap}
.search-box{display:flex;align-items:center;gap:8px;background:white;border:1.5px solid var(--border);border-radius:9px;padding:8px 14px;flex:1;max-width:340px;transition:border-color .15s}
.search-box:focus-within{border-color:var(--navy2)}
.search-box input{border:none;outline:none;font-size:13px;font-family:'Plus Jakarta Sans',sans-serif;color:var(--ink);width:100%;background:transparent}
.search-box input::placeholder{color:var(--muted)}
.filter-select{height:38px;padding:0 12px;border:1.5px solid var(--border);border-radius:9px;font-size:13px;font-family:'Plus Jakarta Sans',sans-serif;color:var(--ink2);background:white;cursor:pointer;outline:none;transition:border-color .15s}
.filter-select:focus{border-color:var(--navy2)}

/* BARS */
.bar-bg{height:8px;background:var(--bg);border-radius:4px;overflow:hidden}
.bar-fill{height:100%;border-radius:4px;transition:width .5s}

/* MINI CHART */
.mchart{display:flex;align-items:flex-end;gap:6px;height:80px;padding:0 2px}
.mc-bar-g{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px}
.mc-bar-w{flex:1;width:100%;display:flex;align-items:flex-end}
.mc-bar{width:100%;border-radius:4px 4px 0 0;min-height:3px;transition:height .4s}
.mc-label{font-size:10px;color:var(--muted);font-weight:600}

/* DONUT PLACEHOLDER */
.donut-wrap{display:flex;align-items:center;gap:20px}
.donut-chart{width:90px;height:90px;border-radius:50%;flex-shrink:0;position:relative}
.donut-legend{display:flex;flex-direction:column;gap:8px;flex:1}
.dl-item{display:flex;align-items:center;gap:8px;font-size:12px}
.dl-dot{width:10px;height:10px;border-radius:3px;flex-shrink:0}
.dl-label{color:var(--muted);flex:1}
.dl-val{font-weight:700;color:var(--ink)}

/* NOTICE CARD */
.notice-card{padding:14px 16px;border-radius:10px;border-left:4px solid;margin-bottom:10px;display:flex;gap:12px;align-items:flex-start}
.nc-event{background:#eff6ff;border-color:var(--blue)}
.nc-exam{background:#fff7ed;border-color:#f97316}
.nc-meeting{background:var(--green-bg);border-color:var(--green)}
.nc-reminder{background:var(--purple-bg);border-color:var(--purple)}
.nc-icon{font-size:20px;flex-shrink:0;margin-top:2px}
.nc-title{font-size:14px;font-weight:700;color:var(--ink)}
.nc-meta{font-size:12px;color:var(--muted);margin-top:3px}
.nc-desc{font-size:12px;color:var(--ink2);margin-top:5px;line-height:1.5}

/* MODAL */
.overlay{position:fixed;inset:0;background:rgba(15,25,35,0.5);z-index:999;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(3px);animation:fadeIn .15s}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.modal{background:white;border-radius:16px;padding:28px;width:100%;max-width:600px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 64px rgba(15,25,35,0.2);animation:slideUp .2s ease-out}
@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.modal-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px}
.modal-title{font-size:20px;font-weight:800;color:var(--ink)}
.modal-close{width:32px;height:32px;border-radius:8px;border:1px solid var(--border);background:white;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--muted);transition:all .15s;flex-shrink:0}
.modal-close:hover{background:var(--red-bg);color:var(--red);border-color:var(--red)}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
.fg{display:flex;flex-direction:column;gap:6px;margin-bottom:14px}
.fg label{font-size:12px;font-weight:700;color:var(--ink2)}
.fg input,.fg select,.fg textarea{padding:10px 14px;border:1.5px solid var(--border);border-radius:9px;font-size:13px;font-family:'Plus Jakarta Sans',sans-serif;color:var(--ink);outline:none;transition:border-color .15s;background:white}
.fg input:focus,.fg select:focus,.fg textarea:focus{border-color:var(--navy2);box-shadow:0 0 0 3px rgba(26,61,92,0.08)}
.fg textarea{resize:vertical;min-height:80px}
.modal-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:20px;padding-top:18px;border-top:1px solid var(--border)}
.btn{height:38px;padding:0 18px;border-radius:9px;border:1.5px solid var(--border);font-size:13px;font-weight:700;cursor:pointer;transition:all .15s;font-family:'Plus Jakarta Sans',sans-serif;color:var(--ink2);background:white;display:inline-flex;align-items:center;gap:6px}
.btn:hover{border-color:var(--navy2);color:var(--navy)}
.btn-primary{background:var(--navy);color:white;border-color:var(--navy)}
.btn-primary:hover{background:var(--navy2);color:white}
.btn-danger{background:var(--red-bg);color:var(--red);border-color:var(--red)}
.btn-danger:hover{background:var(--red);color:white}
.btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:white;border:none;box-shadow:0 4px 12px rgba(212,145,26,0.3)}
.btn-gold:hover{box-shadow:0 6px 18px rgba(212,145,26,0.4);transform:translateY(-1px)}

/* STUDENT DETAIL */
.stu-hero{background:linear-gradient(135deg,var(--navy) 0%,#071828 100%);border-radius:var(--r);padding:28px;color:white;margin-bottom:18px;display:flex;align-items:center;gap:22px}
.stu-av-lg{width:72px;height:72px;border-radius:16px;background:linear-gradient(135deg,var(--gold),var(--gold2));display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:800;color:var(--navy);flex-shrink:0}
.stu-name{font-size:22px;font-weight:800}
.stu-meta{display:flex;flex-wrap:wrap;gap:14px;font-size:12px;opacity:.65;margin-top:6px}
.stu-meta span{display:flex;align-items:center;gap:5px}

/* PROGRESS RING placeholder */
.pring{width:70px;height:70px;border-radius:50%;background:conic-gradient(var(--green) 0%,var(--bg) 0%);display:flex;align-items:center;justify-content:center;position:relative}

/* CLASS ROW */
.class-row{display:flex;align-items:center;padding:12px 16px;border-radius:10px;border:1px solid var(--border);background:white;gap:14px;margin-bottom:8px;transition:all .18s;cursor:pointer}
.class-row:hover{border-color:var(--navy2);box-shadow:var(--sh)}
.class-tag{width:56px;height:32px;background:var(--navy);color:white;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;flex-shrink:0}

/* MONO */
.mono{font-family:'JetBrains Mono',monospace}

/* DIVIDER */
.divider{height:1px;background:var(--border);margin:14px 0}

/* ALERT BANNER */
.alert-banner{background:linear-gradient(135deg,#fff3cd,#fffbe6);border:1px solid #ffd666;border-radius:10px;padding:12px 16px;display:flex;align-items:center;gap:10px;font-size:13px;color:#7c4f00;margin-bottom:18px}

/* RESPONSIVE */
@media(max-width:1100px){
  .sg4{grid-template-columns:repeat(2,1fr)}
  .g2,.g31,.g13{grid-template-columns:1fr}
}
@media(max-width:768px){
  :root{--sidebar:0px}
  .sb{transform:translateX(-100%)}
  .main{margin-left:0}
  .page{padding:16px}
}

/* EMPTY STATE */
.empty{text-align:center;padding:40px;color:var(--muted)}
.empty-icon{font-size:44px;margin-bottom:10px}
.empty-text{font-size:14px}

/* TOOLTIP on hover */
[title]{cursor:default}

/* SECTION LABEL */
.sec-label{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px}
`;

// ============================================================
// HELPERS
// ============================================================
const attColor = p => p >= 90 ? "var(--green)" : p >= 75 ? "var(--amber)" : "var(--red)";
const attTag   = p => p >= 90 ? "t-green" : p >= 75 ? "t-amber" : "t-red";
const gpaColor = g => g >= 9 ? "var(--green)" : g >= 7 ? "var(--blue)" : "var(--red)";
const initials = n => n.split(" ").map(w => w[0]).join("").slice(0,2);
const avatarColors = ["#2563eb","#16a34a","#7c3aed","#dc2626","#d97706","#0891b2","#e11d48","#059669"];
const avColor = id => avatarColors[parseInt(id.replace(/\D/g,"")) % avatarColors.length];
const NOTICE_ICONS = { event:"🎉", exam:"📝", meeting:"👪", reminder:"🔔" };

function PctBar({ pct, color }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <div className="bar-bg" style={{ flex:1, minWidth:60 }}>
        <div className="bar-fill" style={{ width:`${pct}%`, background: color || attColor(pct) }}></div>
      </div>
      <span className="mono" style={{ fontSize:12, fontWeight:700, color: color || attColor(pct), width:38 }}>{pct}%</span>
    </div>
  );
}

function StatusPill({ status }) {
  const map = { active:["pill-active","✓ Active"], warning:["pill-warning","⚠ Warning"], critical:["pill-critical","✗ Critical"] };
  const [cls, label] = map[status] || ["pill-active","Active"];
  return <span className={`pill ${cls}`}>{label}</span>;
}

// ============================================================
// OVERVIEW PAGE
// ============================================================
function OverviewPage({ onNavigate }) {
  const totalStudents = STUDENTS.length;
  const avgAtt = Math.round(STUDENTS.reduce((a,b)=>a+b.attendance,0)/totalStudents);
  const avgGpa = (STUDENTS.reduce((a,b)=>a+b.gpa,0)/totalStudents).toFixed(1);
  const criticalCount = STUDENTS.filter(s=>s.status==="critical").length;
  const warningCount = STUDENTS.filter(s=>s.status==="warning").length;

  return (
    <div className="penter">
      <div className="alert-banner">
        <span>⚠️</span>
        <div><strong>{criticalCount} students</strong> have attendance below 70% — requires immediate parent notification.</div>
        <button className="btn btn-gold" style={{marginLeft:"auto",height:30,padding:"0 14px",fontSize:12}} onClick={()=>onNavigate("students")}>View Students</button>
      </div>

      <div className="sg4">
        {[
          { label:"Total Students",  val:totalStudents, icon:"👨‍🎓", color:"var(--blue)",   bg:"var(--blue-bg)",   meta:`${CLASSES.length} active classes` },
          { label:"School Avg Att.", val:avgAtt+"%",    icon:"📅", color:attColor(avgAtt), bg:attColor(avgAtt)+"18", meta:"This academic year" },
          { label:"Average GPA",     val:avgGpa+"/10",  icon:"⭐", color:"var(--purple)",  bg:"var(--purple-bg)", meta:"School-wide average" },
          { label:"Needs Attention", val:criticalCount+warningCount, icon:"🚨", color:"var(--red)", bg:"var(--red-bg)", meta:`${criticalCount} critical, ${warningCount} warning` },
        ].map(s=>(
          <div className="sc" key={s.label} onClick={()=>onNavigate("students")} style={{cursor:"pointer"}}>
            <div className="sc-stripe" style={{background:s.color}}></div>
            <div className="sc-head">
              <div className="sc-icon" style={{background:s.bg,fontSize:20}}>{s.icon}</div>
              <span className="tag t-navy" style={{fontSize:10}}>LIVE</span>
            </div>
            <div className="sc-val">{s.val}</div>
            <div className="sc-label">{s.label}</div>
            <div className="sc-meta" style={{color:s.color}}>{s.meta}</div>
          </div>
        ))}
      </div>

      <div className="g2" style={{marginBottom:18}}>
        {/* Monthly Attendance Chart */}
        <div className="card" style={{marginBottom:0}}>
          <div className="card-head">
            <div>
              <div className="card-title">Monthly Attendance Trend</div>
              <div className="card-sub">School-wide, {CONFIG.academicYear}</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <span className="tag t-navy">■ Overall</span>
              <span className="tag t-blue">■ Boys</span>
              <span className="tag t-green">■ Girls</span>
            </div>
          </div>
          <div className="mchart">
            {MONTHLY_ATTENDANCE.map(m=>(
              <div className="mc-bar-g" key={m.month}>
                <div className="mc-bar-w" style={{gap:3,display:"flex",alignItems:"flex-end"}}>
                  <div className="mc-bar" style={{height:`${m.school}%`,background:"var(--navy)",borderRadius:"4px 4px 0 0",flex:1}} title={`Overall ${m.school}%`}></div>
                  <div className="mc-bar" style={{height:`${m.boys}%`,background:"var(--blue)",borderRadius:"4px 4px 0 0",flex:1}} title={`Boys ${m.boys}%`}></div>
                  <div className="mc-bar" style={{height:`${m.girls}%`,background:"var(--green)",borderRadius:"4px 4px 0 0",flex:1}} title={`Girls ${m.girls}%`}></div>
                </div>
                <div className="mc-label">{m.month}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:12}}>
            {MONTHLY_ATTENDANCE.map(m=>(
              <span key={m.month} className="mono" style={{fontSize:10,color:attColor(m.school),fontWeight:700}}>{m.school}%</span>
            ))}
          </div>
        </div>

        {/* Class Overview */}
        <div className="card" style={{marginBottom:0}}>
          <div className="card-head">
            <div className="card-title">Class Performance Snapshot</div>
            <button className="btn" style={{height:30,fontSize:12}} onClick={()=>onNavigate("classes")}>View All →</button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {CLASS_STATS.slice(0,5).map(c=>(
              <div key={c.class} style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:44,height:26,background:"var(--navy)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:11,fontWeight:800,flexShrink:0}}>{c.class}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:12,color:"var(--muted)"}}>Att. {c.avg_att}%</span>
                    <span style={{fontSize:12,fontWeight:700,color:gpaColor(c.avg_gpa)}}>GPA {c.avg_gpa}</span>
                  </div>
                  <PctBar pct={c.avg_att} />
                </div>
                {c.critical>0&&<span className="pill pill-critical" style={{fontSize:10}}>⚠ {c.critical}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="g2" style={{marginBottom:0}}>
        {/* Top Performers */}
        <div className="card" style={{marginBottom:0}}>
          <div className="card-head">
            <div className="card-title">Top Performers</div>
            <span className="tag t-gold">By GPA</span>
          </div>
          <table className="tbl">
            <thead><tr><th>#</th><th>Student</th><th>Class</th><th>GPA</th><th>Att.</th></tr></thead>
            <tbody>
              {[...STUDENTS].sort((a,b)=>b.gpa-a.gpa).slice(0,5).map((s,i)=>(
                <tr key={s.id}>
                  <td><span style={{fontWeight:800,color:i<3?"var(--gold)":"var(--muted)",fontSize:13}}>{i+1}</span></td>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div className="av" style={{background:avColor(s.id)}}>{initials(s.name)}</div>
                      <span style={{fontWeight:600,fontSize:13}}>{s.name}</span>
                    </div>
                  </td>
                  <td><span className="tag t-navy">{s.class}</span></td>
                  <td><span className="mono" style={{fontWeight:700,color:gpaColor(s.gpa)}}>{s.gpa}</span></td>
                  <td><span className="mono" style={{fontWeight:700,color:attColor(s.attendance),fontSize:12}}>{s.attendance}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Needs Attention */}
        <div className="card" style={{marginBottom:0}}>
          <div className="card-head">
            <div className="card-title">Needs Attention</div>
            <span className="tag t-red">Low Attendance</span>
          </div>
          <table className="tbl">
            <thead><tr><th>Student</th><th>Class</th><th>Att.</th><th>Status</th></tr></thead>
            <tbody>
              {[...STUDENTS].filter(s=>s.status!=="active").map(s=>(
                <tr key={s.id}>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div className="av" style={{background:avColor(s.id)}}>{initials(s.name)}</div>
                      <div>
                        <div style={{fontWeight:600,fontSize:13}}>{s.name}</div>
                        <div style={{fontSize:11,color:"var(--muted)"}}>{s.guardian}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="tag t-navy">{s.class}</span></td>
                  <td><span className="mono" style={{fontWeight:700,color:attColor(s.attendance)}}>{s.attendance}%</span></td>
                  <td><StatusPill status={s.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// STUDENTS PAGE
// ============================================================
function StudentsPage() {
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newStudent, setNewStudent] = useState({ name:"", id:"", class:"", roll:"", email:"", phone:"", guardian:"" });

  const filtered = useMemo(() => STUDENTS.filter(s =>
    (filterClass === "All" || s.class === filterClass) &&
    (filterStatus === "All" || s.status === filterStatus) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()))
  ), [search, filterClass, filterStatus]);

  return (
    <div className="penter">
      <div className="toolbar">
        <div className="search-box">
          <span>🔍</span>
          <input placeholder="Search by name, ID or email..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={filterClass} onChange={e=>setFilterClass(e.target.value)}>
          <option>All</option>
          {CLASSES.map(c=><option key={c}>{c}</option>)}
        </select>
        <select className="filter-select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option>All</option>
          <option value="active">Active</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
        </select>
        <button className="btn btn-primary" onClick={()=>setShowAdd(true)}>＋ Add Student</button>
        <button className="btn" onClick={()=>alert("Would export to CSV/Excel")}>⬇ Export</button>
        <span style={{marginLeft:"auto",fontSize:13,color:"var(--muted)",fontWeight:600}}>{filtered.length} records</span>
      </div>

      <div className="card" style={{padding:0,overflow:"hidden"}}>
        <table className="tbl">
          <thead>
            <tr><th>Student</th><th>ID</th><th>Class</th><th>Attendance</th><th>GPA</th><th>Guardian</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(s=>(
              <tr key={s.id} onClick={()=>setSelected(s)}>
                <td>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <div className="av" style={{background:avColor(s.id)}}>{initials(s.name)}</div>
                    <div>
                      <div style={{fontWeight:700,fontSize:13}}>{s.name}</div>
                      <div style={{fontSize:11,color:"var(--muted)"}}>{s.email}</div>
                    </div>
                  </div>
                </td>
                <td><span className="mono" style={{fontSize:12,color:"var(--muted)"}}>{s.id}</span></td>
                <td><span className="tag t-navy">{s.class}</span></td>
                <td style={{minWidth:140}}><PctBar pct={s.attendance}/></td>
                <td><span className="mono" style={{fontWeight:800,color:gpaColor(s.gpa)}}>{s.gpa}</span></td>
                <td style={{fontSize:12,color:"var(--muted)"}}>{s.guardian}</td>
                <td><StatusPill status={s.status}/></td>
                <td onClick={e=>e.stopPropagation()}>
                  <div style={{display:"flex",gap:6}}>
                    <button className="btn" style={{height:28,padding:"0 10px",fontSize:11}} onClick={()=>setSelected(s)}>View</button>
                    <button className="btn" style={{height:28,padding:"0 10px",fontSize:11}} onClick={()=>alert("Send notification to guardian: "+s.guardian)}>📧</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length===0&&<tr><td colSpan={8}><div className="empty"><div className="empty-icon">🔍</div><div className="empty-text">No students match your filters</div></div></td></tr>}
          </tbody>
        </table>
      </div>

      {/* Student Detail Modal */}
      {selected && (
        <div className="overlay" onClick={()=>setSelected(null)}>
          <div className="modal" style={{maxWidth:660}} onClick={e=>e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-title">Student Profile</div>
              <button className="modal-close" onClick={()=>setSelected(null)}>✕</button>
            </div>
            <div className="stu-hero">
              <div className="stu-av-lg">{initials(selected.name)}</div>
              <div style={{flex:1}}>
                <div className="stu-name">{selected.name}</div>
                <div className="stu-meta">
                  <span>🎓 Class {selected.class}</span>
                  <span>📋 Roll {selected.roll}</span>
                  <span>🆔 {selected.id}</span>
                  <span>⚧ {selected.gender==="M"?"Male":"Female"}</span>
                </div>
              </div>
              <StatusPill status={selected.status}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:18}}>
              {[
                ["📧 Email", selected.email],
                ["📞 Phone", selected.phone],
                ["👨 Guardian", selected.guardian],
                ["📅 Attendance", selected.attendance+"%"],
                ["⭐ GPA", selected.gpa+" / 10"],
                ["📚 Academic Year", CONFIG.academicYear],
              ].map(([k,v])=>(
                <div key={k} style={{background:"var(--bg)",borderRadius:10,padding:"12px 14px"}}>
                  <div style={{fontSize:11,color:"var(--muted)",fontWeight:700,marginBottom:4}}>{k}</div>
                  <div style={{fontSize:14,fontWeight:700,color:"var(--ink)"}}>{v}</div>
                </div>
              ))}
            </div>
            <div className="sec-label">Subject-wise Marks (Last Term)</div>
            <table className="tbl">
              <thead><tr><th>Subject</th><th>Score</th><th>Grade</th><th>Progress</th></tr></thead>
              <tbody>
                {SUBJECTS.map((sub,i)=>{
                  const score = [85,92,78,88,95,80][i];
                  const grade = ["A","A+","B+","A","A+","A-"][i];
                  return(
                    <tr key={sub}>
                      <td style={{fontWeight:600,fontSize:13}}>{sub}</td>
                      <td><span className="mono" style={{fontWeight:800,color:attColor(score)}}>{score}/100</span></td>
                      <td><span className="tag t-blue">{grade}</span></td>
                      <td style={{minWidth:120}}><PctBar pct={score} color={attColor(score)}/></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={()=>{alert("Notification sent to "+selected.guardian);setSelected(null)}}>📧 Notify Guardian</button>
              <button className="btn btn-primary" onClick={()=>setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAdd && (
        <div className="overlay" onClick={()=>setShowAdd(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <div className="modal-title">Add New Student</div>
                <div style={{fontSize:13,color:"var(--muted)",marginTop:3}}>Student record will be saved to MongoDB</div>
              </div>
              <button className="modal-close" onClick={()=>setShowAdd(false)}>✕</button>
            </div>
            <div className="form-row">
              <div className="fg"><label>Full Name *</label><input placeholder="Student's full name" value={newStudent.name} onChange={e=>setNewStudent({...newStudent,name:e.target.value})}/></div>
              <div className="fg"><label>Student ID *</label><input placeholder="e.g. GFA2024013" value={newStudent.id} onChange={e=>setNewStudent({...newStudent,id:e.target.value})}/></div>
            </div>
            <div className="form-row">
              <div className="fg"><label>Class *</label>
                <select value={newStudent.class} onChange={e=>setNewStudent({...newStudent,class:e.target.value})}>
                  <option value="">Select class</option>
                  {CLASSES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="fg"><label>Roll Number *</label><input type="number" placeholder="Roll no." value={newStudent.roll} onChange={e=>setNewStudent({...newStudent,roll:e.target.value})}/></div>
            </div>
            <div className="form-row">
              <div className="fg"><label>School Email *</label><input type="email" placeholder="student@school.edu" value={newStudent.email} onChange={e=>setNewStudent({...newStudent,email:e.target.value})}/></div>
              <div className="fg"><label>Phone</label><input placeholder="Contact number" value={newStudent.phone} onChange={e=>setNewStudent({...newStudent,phone:e.target.value})}/></div>
            </div>
            <div className="fg"><label>Guardian Name *</label><input placeholder="Parent/Guardian full name" value={newStudent.guardian} onChange={e=>setNewStudent({...newStudent,guardian:e.target.value})}/></div>
            <div className="modal-actions">
              <button className="btn" onClick={()=>setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>{alert("Student added! (Would POST to MongoDB API)");setShowAdd(false);setNewStudent({name:"",id:"",class:"",roll:"",email:"",phone:"",guardian:""})}}>✓ Save Student</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// CLASSES PAGE
// ============================================================
function ClassesPage() {
  const [selectedClass, setSelectedClass] = useState(null);
  const classStudents = selectedClass ? STUDENTS.filter(s=>s.class===selectedClass) : [];

  return (
    <div className="penter">
      {!selectedClass ? (
        <>
          <div className="sg3">
            {[
              { label:"Total Classes", val:CLASS_STATS.length, icon:"🏫", color:"var(--blue)", bg:"var(--blue-bg)" },
              { label:"Avg School Attendance", val:Math.round(CLASS_STATS.reduce((a,b)=>a+b.avg_att,0)/CLASS_STATS.length)+"%", icon:"📅", color:"var(--green)", bg:"var(--green-bg)" },
              { label:"Classes Needing Attention", val:CLASS_STATS.filter(c=>c.avg_att<80).length, icon:"⚠️", color:"var(--amber)", bg:"var(--amber-bg)" },
            ].map(s=>(
              <div className="sc" key={s.label}>
                <div className="sc-stripe" style={{background:s.color}}></div>
                <div className="sc-icon" style={{background:s.bg,fontSize:20}}>{s.icon}</div>
                <div className="sc-val">{s.val}</div>
                <div className="sc-label">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="g2">
            <div>
              {CLASS_STATS.map(c=>(
                <div className="class-row" key={c.class} onClick={()=>setSelectedClass(c.class)}>
                  <div className="class-tag">{c.class}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <span style={{fontSize:13,fontWeight:700}}>{c.count} Students</span>
                      <span style={{fontSize:12,color:"var(--muted)"}}>GPA avg: <strong style={{color:gpaColor(c.avg_gpa)}}>{c.avg_gpa}</strong></span>
                    </div>
                    <PctBar pct={c.avg_att}/>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    {c.critical>0&&<span className="pill pill-critical" style={{fontSize:10}}>{c.critical} critical</span>}
                    {c.warning>0&&<span className="pill pill-warning" style={{fontSize:10}}>{c.warning} warning</span>}
                  </div>
                  <span style={{color:"var(--muted)",fontSize:18}}>›</span>
                </div>
              ))}
            </div>
            <div className="card" style={{marginBottom:0}}>
              <div className="card-head"><div className="card-title">Class Attendance Comparison</div></div>
              <div className="mchart" style={{height:120}}>
                {CLASS_STATS.map(c=>(
                  <div className="mc-bar-g" key={c.class}>
                    <div className="mc-bar-w">
                      <div className="mc-bar" style={{height:`${c.avg_att}%`,background:attColor(c.avg_att),width:"100%"}} title={`${c.class}: ${c.avg_att}%`}></div>
                    </div>
                    <div className="mc-label" style={{fontSize:9}}>{c.class}</div>
                  </div>
                ))}
              </div>
              <div className="divider"/>
              <div className="sec-label">GPA Comparison</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {CLASS_STATS.map(c=>(
                  <div key={c.class} style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{width:36,fontSize:11,fontWeight:700,color:"var(--muted)"}}>{c.class}</span>
                    <div className="bar-bg" style={{flex:1}}>
                      <div className="bar-fill" style={{width:`${(c.avg_gpa/10)*100}%`,background:gpaColor(c.avg_gpa)}}></div>
                    </div>
                    <span className="mono" style={{fontSize:12,fontWeight:700,color:gpaColor(c.avg_gpa),width:32}}>{c.avg_gpa}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
            <button className="btn" onClick={()=>setSelectedClass(null)}>← Back</button>
            <h2 style={{fontSize:20,fontWeight:800}}>Class {selectedClass}</h2>
            <span className="tag t-navy">{classStudents.length} Students</span>
          </div>
          <div className="sg4">
            {[
              { label:"Students", val:classStudents.length, icon:"👨‍🎓", color:"var(--blue)", bg:"var(--blue-bg)" },
              { label:"Avg Attendance", val:Math.round(classStudents.reduce((a,b)=>a+b.attendance,0)/classStudents.length)+"%", icon:"📅", color:"var(--green)", bg:"var(--green-bg)" },
              { label:"Avg GPA", val:(classStudents.reduce((a,b)=>a+b.gpa,0)/classStudents.length).toFixed(1), icon:"⭐", color:"var(--purple)", bg:"var(--purple-bg)" },
              { label:"At Risk", val:classStudents.filter(s=>s.status!=="active").length, icon:"⚠️", color:"var(--red)", bg:"var(--red-bg)" },
            ].map(s=>(
              <div className="sc" key={s.label}>
                <div className="sc-stripe" style={{background:s.color}}></div>
                <div className="sc-icon" style={{background:s.bg}}>{s.icon}</div>
                <div className="sc-val">{s.val}</div>
                <div className="sc-label">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-head"><div className="card-title">Students in Class {selectedClass}</div></div>
            <table className="tbl">
              <thead><tr><th>#</th><th>Student</th><th>Roll</th><th>Attendance</th><th>GPA</th><th>Status</th></tr></thead>
              <tbody>
                {classStudents.map((s,i)=>(
                  <tr key={s.id}>
                    <td style={{color:"var(--muted)",fontSize:12}}>{i+1}</td>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div className="av" style={{background:avColor(s.id)}}>{initials(s.name)}</div>
                        <div>
                          <div style={{fontWeight:700,fontSize:13}}>{s.name}</div>
                          <div style={{fontSize:11,color:"var(--muted)"}}>{s.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{color:"var(--muted)",fontSize:13}}>{s.roll}</td>
                    <td style={{minWidth:140}}><PctBar pct={s.attendance}/></td>
                    <td><span className="mono" style={{fontWeight:800,color:gpaColor(s.gpa)}}>{s.gpa}</span></td>
                    <td><StatusPill status={s.status}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card">
            <div className="card-head">
              <div className="card-title">Subject-wise Class Average</div>
              <span className="tag t-navy">Class {selectedClass}</span>
            </div>
            {SUBJECTS.map((sub,i)=>{
              const avg = [75,82,70,80,88,72][i];
              return(
                <div key={sub} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                  <span style={{width:160,fontSize:13,fontWeight:600}}>{sub}</span>
                  <PctBar pct={avg} color={attColor(avg)}/>
                  <span className="tag" style={{background:attColor(avg)+"18",color:attColor(avg)}}>{avg >= 90?"A+":avg>=80?"A":avg>=70?"B+":"B"}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// ANALYTICS PAGE
// ============================================================
function AnalyticsPage() {
  const [view, setView] = useState("school");
  const [selClass, setSelClass] = useState("10-A");
  const [selSubject, setSelSubject] = useState("All");

  return (
    <div className="penter">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,flexWrap:"wrap"}}>
        {["school","class","subject"].map(v=>(
          <button key={v} className={`btn ${view===v?"btn-primary":""}`} onClick={()=>setView(v)} style={{textTransform:"capitalize"}}>{v==="school"?"🏫 School-wide":v==="class"?"📚 By Class":"📖 By Subject"}</button>
        ))}
        {view==="class"&&(
          <select className="filter-select" value={selClass} onChange={e=>setSelClass(e.target.value)}>
            {CLASSES.map(c=><option key={c}>{c}</option>)}
          </select>
        )}
        {view==="subject"&&(
          <select className="filter-select" value={selSubject} onChange={e=>setSelSubject(e.target.value)}>
            <option>All</option>
            {SUBJECTS.map(s=><option key={s}>{s}</option>)}
          </select>
        )}
      </div>

      {view==="school"&&(
        <>
          <div className="sg4">
            {[
              { label:"School Avg Attendance", val:Math.round(STUDENTS.reduce((a,b)=>a+b.attendance,0)/STUDENTS.length)+"%", icon:"📅", color:"var(--green)" },
              { label:"School Avg GPA", val:(STUDENTS.reduce((a,b)=>a+b.gpa,0)/STUDENTS.length).toFixed(1)+"/10", icon:"⭐", color:"var(--purple)" },
              { label:"Students > 90% Att.", val:STUDENTS.filter(s=>s.attendance>=90).length, icon:"✅", color:"var(--green)" },
              { label:"Students < 75% Att.", val:STUDENTS.filter(s=>s.attendance<75).length, icon:"🚨", color:"var(--red)" },
            ].map(s=>(
              <div className="sc" key={s.label}>
                <div className="sc-stripe" style={{background:s.color}}></div>
                <div className="sc-val" style={{color:s.color}}>{s.val}</div>
                <div className="sc-label">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-head"><div className="card-title">Subject-wise School Performance</div><span className="tag t-navy">All Classes</span></div>
            <table className="tbl">
              <thead><tr><th>Subject</th><th>School Avg</th><th>Highest</th><th>Lowest</th><th>Pass Rate</th><th>Performance</th></tr></thead>
              <tbody>
                {SUBJECT_SCHOOL_STATS.map(s=>(
                  <tr key={s.subject}>
                    <td style={{fontWeight:700}}>{s.subject}</td>
                    <td><span className="mono" style={{fontWeight:800,color:attColor(s.avg)}}>{s.avg}</span></td>
                    <td><span className="mono" style={{color:"var(--green)",fontWeight:700}}>{s.highest}</span></td>
                    <td><span className="mono" style={{color:"var(--red)",fontWeight:700}}>{s.lowest}</span></td>
                    <td><span className="tag t-green">{s.passRate}%</span></td>
                    <td style={{minWidth:160}}><PctBar pct={s.avg} color={attColor(s.avg)}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="g2">
            <div className="card" style={{marginBottom:0}}>
              <div className="card-head"><div className="card-title">Attendance Distribution</div></div>
              {[{label:"≥ 90% (Excellent)",count:STUDENTS.filter(s=>s.attendance>=90).length,color:"var(--green)"},
                {label:"75–89% (Good)",count:STUDENTS.filter(s=>s.attendance>=75&&s.attendance<90).length,color:"var(--amber)"},
                {label:"< 75% (At Risk)",count:STUDENTS.filter(s=>s.attendance<75).length,color:"var(--red)"},
              ].map(d=>(
                <div key={d.label} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                  <div style={{width:12,height:12,borderRadius:3,background:d.color,flexShrink:0}}></div>
                  <span style={{flex:1,fontSize:13,fontWeight:600}}>{d.label}</span>
                  <span className="mono" style={{fontWeight:800,color:d.color}}>{d.count}</span>
                  <div className="bar-bg" style={{width:100}}>
                    <div className="bar-fill" style={{width:`${(d.count/STUDENTS.length)*100}%`,background:d.color}}></div>
                  </div>
                  <span style={{fontSize:12,color:"var(--muted)",width:34}}>{Math.round((d.count/STUDENTS.length)*100)}%</span>
                </div>
              ))}
            </div>
            <div className="card" style={{marginBottom:0}}>
              <div className="card-head"><div className="card-title">Gender Breakdown</div></div>
              {[{g:"Male",count:STUDENTS.filter(s=>s.gender==="M").length,color:"var(--blue)"},
                {g:"Female",count:STUDENTS.filter(s=>s.gender==="F").length,color:"var(--purple)"},
              ].map(d=>(
                <div key={d.g} style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                  <span style={{fontSize:20}}>{d.g==="Male"?"👦":"👧"}</span>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span style={{fontSize:13,fontWeight:700}}>{d.g}</span>
                      <span className="mono" style={{fontWeight:700,color:d.color}}>{d.count} students</span>
                    </div>
                    <div className="bar-bg">
                      <div className="bar-fill" style={{width:`${(d.count/STUDENTS.length)*100}%`,background:d.color}}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {view==="class"&&(
        <>
          <div className="card">
            <div className="card-head">
              <div><div className="card-title">Class {selClass} — Detailed Analytics</div><div className="card-sub">{STUDENTS.filter(s=>s.class===selClass).length} students enrolled</div></div>
            </div>
            <div className="sec-label" style={{marginBottom:12}}>Subject Performance in Class {selClass}</div>
            <table className="tbl">
              <thead><tr><th>Subject</th><th>Class Avg</th><th>vs School Avg</th><th>Performance Bar</th></tr></thead>
              <tbody>
                {SUBJECTS.map((sub,i)=>{
                  const classAvg = [78,85,74,82,90,70][i];
                  const schoolAvg = SUBJECT_SCHOOL_STATS[i].avg;
                  const diff = classAvg - schoolAvg;
                  return(
                    <tr key={sub}>
                      <td style={{fontWeight:700}}>{sub}</td>
                      <td><span className="mono" style={{fontWeight:800,color:attColor(classAvg)}}>{classAvg}</span></td>
                      <td><span className={`tag ${diff>=0?"t-green":"t-red"}`}>{diff>=0?"+":""}{diff} vs school</span></td>
                      <td style={{minWidth:180}}><PctBar pct={classAvg} color={attColor(classAvg)}/></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="card">
            <div className="card-head"><div className="card-title">Individual Student Performance — Class {selClass}</div></div>
            <table className="tbl">
              <thead><tr><th>Rank</th><th>Student</th><th>Att.</th><th>GPA</th><th>Status</th></tr></thead>
              <tbody>
                {[...STUDENTS.filter(s=>s.class===selClass)].sort((a,b)=>b.gpa-a.gpa).map((s,i)=>(
                  <tr key={s.id}>
                    <td><span style={{fontWeight:800,color:i<3?"var(--gold)":"var(--muted)"}}>{i+1}</span></td>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div className="av" style={{background:avColor(s.id)}}>{initials(s.name)}</div>
                        <span style={{fontWeight:600,fontSize:13}}>{s.name}</span>
                      </div>
                    </td>
                    <td><PctBar pct={s.attendance}/></td>
                    <td><span className="mono" style={{fontWeight:800,color:gpaColor(s.gpa)}}>{s.gpa}/10</span></td>
                    <td><StatusPill status={s.status}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {view==="subject"&&(
        <>
          <div className="card">
            <div className="card-head">
              <div className="card-title">{selSubject==="All"?"All Subjects":"Subject: "+selSubject} — Class-wise Breakdown</div>
            </div>
            <table className="tbl">
              <thead><tr><th>Class</th><th>{selSubject==="All"?"Best Subject Avg":"Class Avg"}</th><th>Students</th><th>Performance</th></tr></thead>
              <tbody>
                {CLASS_STATS.map(c=>{
                  const avg = selSubject==="All" ? 80 : Math.floor(68+Math.random()*28);
                  return(
                    <tr key={c.class}>
                      <td><span className="tag t-navy">{c.class}</span></td>
                      <td><span className="mono" style={{fontWeight:800,color:attColor(avg)}}>{avg}</span></td>
                      <td style={{color:"var(--muted)",fontSize:12}}>{c.count}</td>
                      <td style={{minWidth:180}}><PctBar pct={avg} color={attColor(avg)}/></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// EVENTS/NOTICES PAGE
// ============================================================
function EventsPage() {
  const [events, setEvents] = useState(EVENTS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:"", date:"", type:"event", audience:"All", desc:"" });
  const [filter, setFilter] = useState("all");

  const filtered = filter==="all" ? events : events.filter(e=>e.status===filter||e.type===filter);

  const handlePost = () => {
    if(!form.title||!form.date||!form.desc){alert("Please fill all required fields.");return;}
    const newE = { ...form, id:Date.now(), status:"upcoming", author:"Admin", postedOn:new Date().toISOString().slice(0,10) };
    setEvents([newE,...events]);
    setShowForm(false);
    setForm({title:"",date:"",type:"event",audience:"All",desc:""});
    alert("Notice posted successfully! All eligible students will be notified.");
  };

  return (
    <div className="penter">
      <div className="toolbar">
        <div style={{display:"flex",gap:8,flexWrap:"wrap",flex:1}}>
          {[["all","All"],["upcoming","Upcoming"],["completed","Completed"],["event","Events"],["exam","Exams"],["meeting","Meetings"],["reminder","Reminders"]].map(([v,l])=>(
            <button key={v} className={`btn ${filter===v?"btn-primary":""}`} style={{height:34,fontSize:12}} onClick={()=>setFilter(v)}>{l}</button>
          ))}
        </div>
        <button className="btn btn-gold" onClick={()=>setShowForm(true)}>✚ Post Notice</button>
      </div>

      <div className="g2">
        <div>
          {filtered.map(e=>(
            <div className={`notice-card nc-${e.type}`} key={e.id}>
              <div className="nc-icon">{NOTICE_ICONS[e.type]}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
                  <div className="nc-title">{e.title}</div>
                  <div style={{display:"flex",gap:6,flexShrink:0}}>
                    <span className={`tag ${e.status==="upcoming"?"t-blue":"t-green"}`}>{e.status}</span>
                    <span className="tag t-navy">{e.type}</span>
                  </div>
                </div>
                <div className="nc-desc">{e.desc}</div>
                <div className="nc-meta">📅 {e.date} · 👥 {e.audience} · By {e.author} · Posted {e.postedOn}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
                <button className="btn" style={{height:28,padding:"0 10px",fontSize:11}} onClick={()=>alert("Edit notice: "+e.title)}>✏️</button>
                <button className="btn btn-danger" style={{height:28,padding:"0 10px",fontSize:11}} onClick={()=>setEvents(events.filter(x=>x.id!==e.id))}>🗑</button>
              </div>
            </div>
          ))}
          {filtered.length===0&&<div className="empty"><div className="empty-icon">📭</div><div className="empty-text">No notices found</div></div>}
        </div>
        <div>
          <div className="card">
            <div className="card-head"><div className="card-title">Notice Statistics</div></div>
            {[["event","Events",events.filter(e=>e.type==="event").length,"var(--blue)"],
              ["exam","Exams",events.filter(e=>e.type==="exam").length,"var(--amber)"],
              ["meeting","Meetings",events.filter(e=>e.type==="meeting").length,"var(--green)"],
              ["reminder","Reminders",events.filter(e=>e.type==="reminder").length,"var(--purple)"],
            ].map(([t,l,c,col])=>(
              <div key={t} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                <span style={{fontSize:18}}>{NOTICE_ICONS[t]}</span>
                <span style={{flex:1,fontSize:13,fontWeight:600}}>{l}</span>
                <span className="mono" style={{fontWeight:800,color:col}}>{c}</span>
              </div>
            ))}
            <div className="divider"/>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:12,color:"var(--muted)"}}>Upcoming</span>
              <span className="tag t-blue">{events.filter(e=>e.status==="upcoming").length}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
              <span style={{fontSize:12,color:"var(--muted)"}}>Completed</span>
              <span className="tag t-green">{events.filter(e=>e.status==="completed").length}</span>
            </div>
          </div>
          <div className="card" style={{background:"linear-gradient(135deg,var(--navy),#071828)",color:"white",border:"none"}}>
            <div style={{fontSize:14,fontWeight:800,marginBottom:8}}>📢 Quick Broadcast</div>
            <p style={{fontSize:12,opacity:.65,lineHeight:1.6,marginBottom:14}}>Send an immediate notification to all students or specific classes via email.</p>
            <button className="btn btn-gold" style={{width:"100%"}} onClick={()=>alert("Broadcast panel: Compose & send bulk notification to all students")}>Send Broadcast →</button>
          </div>
        </div>
      </div>

      {showForm&&(
        <div className="overlay" onClick={()=>setShowForm(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-head">
              <div><div className="modal-title">Post New Notice / Event</div><div style={{fontSize:13,color:"var(--muted)",marginTop:3}}>Will be visible to students in their portal</div></div>
              <button className="modal-close" onClick={()=>setShowForm(false)}>✕</button>
            </div>
            <div className="fg"><label>Title *</label><input placeholder="Notice title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
            <div className="form-row">
              <div className="fg"><label>Date *</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
              <div className="fg"><label>Type *</label>
                <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                  <option value="event">Event</option><option value="exam">Exam</option>
                  <option value="meeting">Meeting</option><option value="reminder">Reminder</option>
                </select>
              </div>
            </div>
            <div className="fg"><label>Audience</label>
              <select value={form.audience} onChange={e=>setForm({...form,audience:e.target.value})}>
                <option>All</option>
                {CLASSES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="fg"><label>Description *</label><textarea placeholder="Detailed description..." value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})}/></div>
            <div className="modal-actions">
              <button className="btn" onClick={()=>setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handlePost}>✓ Post Notice</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// TEACHERS PAGE
// ============================================================
function TeachersPage() {
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div className="penter">
      <div className="toolbar">
        <div className="search-box"><span>🔍</span><input placeholder="Search teachers..."/></div>
        <button className="btn btn-primary" onClick={()=>setShowAdd(true)}>＋ Add Teacher</button>
        <button className="btn" onClick={()=>alert("Export teacher records")}>⬇ Export</button>
      </div>
      <div className="card" style={{padding:0,overflow:"hidden"}}>
        <table className="tbl">
          <thead><tr><th>Teacher</th><th>ID</th><th>Subject</th><th>Classes</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead>
          <tbody>
            {TEACHERS.map(t=>(
              <tr key={t.id}>
                <td>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <div className="av" style={{background:avColor(t.id)}}>{initials(t.name)}</div>
                    <span style={{fontWeight:700,fontSize:13}}>{t.name}</span>
                  </div>
                </td>
                <td><span className="mono" style={{fontSize:12,color:"var(--muted)"}}>{t.id}</span></td>
                <td><span className="tag t-purple">{t.subject}</span></td>
                <td>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                    {t.classes.map(c=><span key={c} className="tag t-navy" style={{fontSize:10}}>{c}</span>)}
                  </div>
                </td>
                <td style={{fontSize:12,color:"var(--muted)"}}>{t.email}</td>
                <td style={{fontSize:12,color:"var(--muted)"}}>{t.phone}</td>
                <td>
                  <div style={{display:"flex",gap:6}}>
                    <button className="btn" style={{height:28,padding:"0 10px",fontSize:11}}>✏️ Edit</button>
                    <button className="btn" style={{height:28,padding:"0 10px",fontSize:11}} onClick={()=>alert("Send message to "+t.name)}>📧</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAdd&&(
        <div className="overlay" onClick={()=>setShowAdd(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-title">Add New Teacher</div>
              <button className="modal-close" onClick={()=>setShowAdd(false)}>✕</button>
            </div>
            <div className="form-row">
              <div className="fg"><label>Full Name *</label><input placeholder="Teacher's full name"/></div>
              <div className="fg"><label>Employee ID *</label><input placeholder="e.g. T06"/></div>
            </div>
            <div className="form-row">
              <div className="fg"><label>Subject *</label>
                <select><option>Select subject</option>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select>
              </div>
              <div className="fg"><label>Email *</label><input type="email" placeholder="teacher@school.edu"/></div>
            </div>
            <div className="fg"><label>Phone</label><input placeholder="Contact number"/></div>
            <div className="modal-actions">
              <button className="btn" onClick={()=>setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>{alert("Teacher added!");setShowAdd(false)}}>✓ Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SETTINGS PAGE
// ============================================================
function SettingsPage() {
  const [cfg, setCfg] = useState({ ...CONFIG });
  return (
    <div className="penter">
      <div className="g2">
        <div>
          <div className="card">
            <div className="card-head"><div className="card-title">🏫 Institute Configuration</div></div>
            <div className="fg"><label>Institute Name</label><input value={cfg.name} onChange={e=>setCfg({...cfg,name:e.target.value})}/></div>
            <div className="fg"><label>Tagline</label><input value={cfg.tagline} onChange={e=>setCfg({...cfg,tagline:e.target.value})}/></div>
            <div className="fg"><label>Academic Year</label><input value={cfg.academicYear} onChange={e=>setCfg({...cfg,academicYear:e.target.value})}/></div>
            <button className="btn btn-primary" onClick={()=>alert("Settings saved!")}>✓ Save Changes</button>
          </div>
          <div className="card">
            <div className="card-head"><div className="card-title">🔗 Google Sheets Integration</div></div>
            <div style={{background:"var(--green-bg)",border:"1px solid #a7f3d0",borderRadius:9,padding:"12px 14px",marginBottom:16,fontSize:13,color:"#065f46",lineHeight:1.6}}>
              ✅ Non-technical staff can maintain attendance & marks directly in Google Sheets. The portal auto-reads from the published CSV URL below.
            </div>
            <div className="fg"><label>Attendance Sheet URL</label><input placeholder="https://docs.google.com/spreadsheets/d/..." value={cfg.googleSheetURL} onChange={e=>setCfg({...cfg,googleSheetURL:e.target.value})}/></div>
            <div className="fg"><label>Marks Sheet URL</label><input placeholder="https://docs.google.com/spreadsheets/d/..."/></div>
            <button className="btn" onClick={()=>alert("Connection tested: ✓ Sheet accessible")}>🔍 Test Connection</button>
          </div>
        </div>
        <div>
          <div className="card">
            <div className="card-head"><div className="card-title">🗄️ Database (MongoDB)</div></div>
            <div className="fg"><label>API Base URL</label><input value={cfg.mongoAPIBase} onChange={e=>setCfg({...cfg,mongoAPIBase:e.target.value})}/></div>
            <div className="fg"><label>Connection String</label><input type="password" placeholder="mongodb+srv://..."/></div>
            <button className="btn" onClick={()=>alert("DB connection test: ✓ Connected")}>🔌 Test Connection</button>
          </div>
          <div className="card">
            <div className="card-head"><div className="card-title">🔔 Notification Settings</div></div>
            {[["Email notifications for low attendance","✅"],["SMS alerts for critical cases","✅"],["Weekly report digest","✅"],["Auto-notify at < 75% attendance","⚠️"]].map(([l,i])=>(
              <div key={l} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                <span style={{fontSize:13,fontWeight:600}}>{l}</span>
                <span style={{fontSize:18,cursor:"pointer"}}>{i}</span>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-head"><div className="card-title">📋 Google Sheets Setup Guide</div></div>
            <div style={{fontSize:12,color:"var(--ink2)",lineHeight:1.8}}>
              <div style={{marginBottom:8}}><strong>Sheet 1 — Attendance:</strong></div>
              <div style={{fontFamily:"monospace",background:"var(--bg)",padding:"8px 12px",borderRadius:8,fontSize:11,color:"var(--navy2)",marginBottom:12}}>StudentID | Date | Status (P/A/L) | Subject</div>
              <div style={{marginBottom:8}}><strong>Sheet 2 — Marks:</strong></div>
              <div style={{fontFamily:"monospace",background:"var(--bg)",padding:"8px 12px",borderRadius:8,fontSize:11,color:"var(--navy2)"}}>StudentID | Subject | Term | Marks | MaxMarks</div>
              <div style={{marginTop:12,color:"var(--muted)"}}>File → Share → Publish to Web → CSV format → Paste URL above.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// NAV CONFIG
// ============================================================
const NAV = [
  { id:"overview",   label:"Dashboard",   icon:"🏠", section:"main" },
  { id:"students",   label:"Students",    icon:"👨‍🎓", section:"main", badge:STUDENTS.filter(s=>s.status==="critical").length },
  { id:"classes",    label:"Classes",     icon:"🏫", section:"main" },
  { id:"analytics",  label:"Analytics",   icon:"📊", section:"main" },
  { id:"events",     label:"Notices",     icon:"📢", section:"main", badge:EVENTS.filter(e=>e.status==="upcoming").length },
  { id:"teachers",   label:"Teachers",    icon:"👩‍🏫", section:"staff" },
  { id:"settings",   label:"Settings",    icon:"⚙️",  section:"system" },
];

const PAGE_TITLES = {
  overview:  { title:"Admin Dashboard",      sub:"School overview & quick actions" },
  students:  { title:"Student Records",      sub:"Manage all student data & attendance" },
  classes:   { title:"Class Management",     sub:"Monitor individual classes" },
  analytics: { title:"Analytics & Reports",  sub:"Deep-dive into academic performance" },
  events:    { title:"Notices & Events",     sub:"Post and manage school announcements" },
  teachers:  { title:"Teacher Management",   sub:"Staff records and class assignments" },
  settings:  { title:"Settings",             sub:"Configure institute, integrations & alerts" },
};

// ============================================================
// AUTH
// ============================================================
function AdminAuth({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = () => {
    setErr("");
    if(!email||!pass){setErr("Please fill all fields.");return;}
    setLoading(true);
    setTimeout(()=>{
      setLoading(false);
      if((email==="admin@greenfield.edu"||email==="admin")&&pass==="admin123")
        onLogin({ name:"Dr. Ramesh Kumar", role:"Principal", email:"admin@greenfield.edu" });
      else setErr("Invalid admin credentials.");
    },900);
  };

  return (
    <div style={{minHeight:"100vh",background:"var(--navy)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 20% 50%, rgba(212,145,26,0.08) 0%,transparent 50%),radial-gradient(circle at 80% 20%, rgba(37,99,235,0.08) 0%,transparent 50%)",pointerEvents:"none"}}></div>
      <div style={{width:"100%",maxWidth:420,position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontSize:56,marginBottom:14}}>{CONFIG.logo}</div>
          <div style={{fontSize:26,fontWeight:800,color:"white",letterSpacing:-0.5}}>{CONFIG.name}</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginTop:6,textTransform:"uppercase",letterSpacing:1.5,fontWeight:600}}>Admin Control Center</div>
          <div style={{width:40,height:3,background:"var(--gold)",borderRadius:2,margin:"16px auto 0"}}></div>
        </div>
        <div style={{background:"white",borderRadius:16,padding:32,boxShadow:"0 24px 64px rgba(0,0,0,0.3)"}}>
          <div style={{fontSize:18,fontWeight:800,color:"var(--ink)",marginBottom:4}}>Administrator Login</div>
          <div style={{fontSize:13,color:"var(--muted)",marginBottom:24}}>Restricted access — authorized personnel only</div>
          <div className="fg"><label>Admin Email</label><input type="email" placeholder="admin@school.edu" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/></div>
          <div className="fg"><label>Password</label><input type="password" placeholder="Admin password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/></div>
          {err&&<div style={{background:"var(--red-bg)",border:"1px solid #fecaca",color:"var(--red)",padding:"10px 14px",borderRadius:9,fontSize:13,marginBottom:14}}>⚠️ {err}</div>}
          <button className="btn btn-gold" style={{width:"100%",height:44,fontSize:15,marginTop:4}} onClick={handle} disabled={loading}>{loading?"Authenticating...":"Sign In to Admin →"}</button>
          <div style={{marginTop:18,background:"#f0f4f8",borderRadius:9,padding:"12px 14px",fontSize:12,color:"var(--ink2)"}}>
            <strong>Demo:</strong> admin@greenfield.edu / admin123
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN ADMIN DASHBOARD
// ============================================================
function AdminDashboard({ admin, onLogout }) {
  const [page, setPage] = useState("overview");
  const { title, sub } = PAGE_TITLES[page];
  const sections = [...new Set(NAV.map(n=>n.section))];

  const renderPage = () => {
    switch(page) {
      case "overview":  return <OverviewPage onNavigate={setPage}/>;
      case "students":  return <StudentsPage/>;
      case "classes":   return <ClassesPage/>;
      case "analytics": return <AnalyticsPage/>;
      case "events":    return <EventsPage/>;
      case "teachers":  return <TeachersPage/>;
      case "settings":  return <SettingsPage/>;
      default:          return <OverviewPage onNavigate={setPage}/>;
    }
  };

  return (
    <div className="layout">
      <div className="sb">
        <div className="sb-head">
          <div className="sb-logo">
            <div className="sb-logo-icon">{CONFIG.logo}</div>
            <div>
              <div className="sb-logo-name">{CONFIG.name}</div>
              <div className="sb-logo-sub">Admin Portal</div>
            </div>
          </div>
          <div className="sb-admin-badge" style={{marginTop:12}}>
            <div className="sb-admin-dot"></div>
            <div className="sb-admin-text">Admin Access</div>
          </div>
        </div>
        <nav className="sb-nav">
          {sections.map(sec=>(
            <div key={sec}>
              <div className="sb-section">{sec}</div>
              {NAV.filter(n=>n.section===sec).map(n=>(
                <button key={n.id} className={`nb ${page===n.id?"on":""}`} onClick={()=>setPage(n.id)}>
                  <span className="nb-icon">{n.icon}</span>
                  <span>{n.label}</span>
                  {n.badge>0&&<span className="nb-badge">{n.badge}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="sb-foot">
          <div className="sb-user">
            <div className="sb-av">RK</div>
            <div>
              <div className="sb-uname">{admin.name}</div>
              <div className="sb-urole">{admin.role}</div>
            </div>
            <button className="sb-logout" onClick={onLogout} title="Logout">⏻</button>
          </div>
        </div>
      </div>

      <div className="main">
        <div className="topbar">
          <div className="topbar-left">
            <h1>{title}</h1>
            <p>{sub}</p>
          </div>
          <div className="topbar-right">
            <span style={{fontSize:13,color:"var(--muted)",fontWeight:600}}>{CONFIG.academicYear}</span>
            <button className="tb-btn" onClick={()=>alert("Opening Google Sheets...")}>📋 Google Sheets</button>
            <button className="tb-btn tb-btn-primary" onClick={()=>setPage("events")}>✚ Post Notice</button>
            <button className="tb-notif"><span style={{fontSize:16}}>🔔</span><span className="notif-dot"></span></button>
          </div>
        </div>
        <div className="page">{renderPage()}</div>
      </div>
    </div>
  );
}

// ============================================================
// APP ROOT
// ============================================================
export default function App() {
  const [admin, setAdmin] = useState(null);
  return (
    <>
      <style>{S}</style>
      {admin ? <AdminDashboard admin={admin} onLogout={()=>setAdmin(null)}/> : <AdminAuth onLogin={setAdmin}/>}
    </>
  );
}
