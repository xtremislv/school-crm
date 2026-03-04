const router = require('express').Router();
const axios  = require('axios');

// Fall-back sample structures mirroring the old frontend MOCK_* data
const SAMPLE_ATTENDANCE = {
  overall: 87,
  monthly: [
    { month: 'Apr', present: 22, total: 24, pct: 91.7 },
    { month: 'May', present: 20, total: 23, pct: 87 },
    { month: 'Jun', present: 18, total: 22, pct: 81.8 },
    { month: 'Jul', present: 24, total: 26, pct: 92.3 },
    { month: 'Aug', present: 21, total: 25, pct: 84 },
    { month: 'Sep', present: 19, total: 22, pct: 86.4 },
  ],
  subjects: [
    { name: 'Mathematics',       present: 42, total: 48, pct: 87.5 },
    { name: 'Science',           present: 45, total: 50, pct: 90 },
    { name: 'English',           present: 38, total: 46, pct: 82.6 },
    { name: 'Social Studies',    present: 40, total: 44, pct: 90.9 },
    { name: 'Computer Science',  present: 28, total: 30, pct: 93.3 },
    { name: 'Physical Education',present: 20, total: 24, pct: 83.3 },
  ],
  recent: [
    { date: '2025-09-29', day: 'Mon', status: 'present' },
    { date: '2025-09-30', day: 'Tue', status: 'present' },
    { date: '2025-10-01', day: 'Wed', status: 'absent' },
    { date: '2025-10-02', day: 'Thu', status: 'present' },
    { date: '2025-10-03', day: 'Fri', status: 'present' },
    { date: '2025-10-06', day: 'Mon', status: 'present' },
    { date: '2025-10-07', day: 'Tue', status: 'late' },
    { date: '2025-10-08', day: 'Wed', status: 'present' },
    { date: '2025-10-09', day: 'Thu', status: 'absent' },
    { date: '2025-10-10', day: 'Fri', status: 'present' },
  ],
};

const SAMPLE_MARKS = {
  gpa: 8.4,
  rank: 7,
  totalStudents: 42,
  terms: [
    {
      name: 'Term 1',
      subjects: [
        { name: 'Mathematics',       marks: 85, max: 100, grade: 'A' },
        { name: 'Science',           marks: 92, max: 100, grade: 'A+' },
        { name: 'English',           marks: 78, max: 100, grade: 'B+' },
        { name: 'Social Studies',    marks: 88, max: 100, grade: 'A' },
        { name: 'Computer Science',  marks: 95, max: 100, grade: 'A+' },
        { name: 'Physical Education',marks: 80, max: 100, grade: 'A-' },
      ],
      total: 518,
      max: 600,
      percentage: 86.3,
      result: 'PASS',
    },
    {
      name: 'Term 2',
      subjects: [
        { name: 'Mathematics',       marks: 88, max: 100, grade: 'A' },
        { name: 'Science',           marks: 89, max: 100, grade: 'A' },
        { name: 'English',           marks: 82, max: 100, grade: 'A-' },
        { name: 'Social Studies',    marks: 84, max: 100, grade: 'A-' },
        { name: 'Computer Science',  marks: 97, max: 100, grade: 'A+' },
        { name: 'Physical Education',marks: 75, max: 100, grade: 'B+' },
      ],
      total: 515,
      max: 600,
      percentage: 85.8,
      result: 'PASS',
    },
  ],
  progress: [
    { subject: 'Mathematics',      term1: 85, term2: 88 },
    { subject: 'Science',          term1: 92, term2: 89 },
    { subject: 'English',          term1: 78, term2: 82 },
    { subject: 'Social Studies',   term1: 88, term2: 84 },
    { subject: 'Computer Science', term1: 95, term2: 97 },
  ],
};

// Helper: try to read Google Sheets JSON "gviz" response, else fall back
async function fetchGvizJson(url) {
  if (!url) return null;
  try {
    const response = await axios.get(url);
    const raw = response.data.replace(/^.*?({.*}).*$/s, '$1');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// GET /api/sheets/attendance/:studentId
// Returns an object compatible with the frontend MOCK_ATTENDANCE structure.
router.get('/attendance/:studentId', async (req, res) => {
  const sheetUrl = process.env.GSHEET_ATTENDANCE_URL;
  if (!sheetUrl) {
    return res.json(SAMPLE_ATTENDANCE);
  }

  const json = await fetchGvizJson(sheetUrl);
  if (!json) {
    return res.json(SAMPLE_ATTENDANCE);
  }

  try {
    const rows = json.table.rows
      .map(r => ({
        studentId: r.c[0]?.v,
        date:      r.c[1]?.v,
        status:    r.c[2]?.v,
        subject:   r.c[3]?.v,
      }))
      .filter(r => r.studentId === req.params.studentId);

    if (!rows.length) {
      return res.json(SAMPLE_ATTENDANCE);
    }

    // Very simple aggregation: derive overall percentage and recent entries
    const byMonth = {};
    const bySubject = {};

    for (const row of rows) {
      const dateObj = new Date(row.date);
      const monthKey = dateObj.toLocaleString('en-US', { month: 'short' });
      byMonth[monthKey] = byMonth[monthKey] || { month: monthKey, present: 0, total: 0 };
      byMonth[monthKey].total += 1;
      if (row.status === 'P' || row.status === 'present') {
        byMonth[monthKey].present += 1;
      }

      const subjKey = row.subject || 'General';
      bySubject[subjKey] = bySubject[subjKey] || { name: subjKey, present: 0, total: 0 };
      bySubject[subjKey].total += 1;
      if (row.status === 'P' || row.status === 'present') {
        bySubject[subjKey].present += 1;
      }
    }

    const monthly = Object.values(byMonth).map(m => ({
      ...m,
      pct: m.total ? Math.round((m.present / m.total) * 1000) / 10 : 0,
    }));

    const subjects = Object.values(bySubject).map(s => ({
      ...s,
      pct: s.total ? Math.round((s.present / s.total) * 1000) / 10 : 0,
    }));

    const totalPresent = monthly.reduce((sum, m) => sum + m.present, 0);
    const totalDays = monthly.reduce((sum, m) => sum + m.total, 0);
    const overall = totalDays ? Math.round((totalPresent / totalDays) * 1000) / 10 : 0;

    const recent = rows
      .slice(-10)
      .map(r => ({
        date: r.date,
        day: new Date(r.date).toLocaleDateString('en-US', { weekday: 'short' }),
        status: (r.status || '').toLowerCase(),
      }));

    res.json({ overall, monthly, subjects, recent });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process sheet data' });
  }
});

// GET /api/sheets/marks/:studentId
// For now, returns sample marks structured like the old MOCK_MARKS constant.
router.get('/marks/:studentId', async (req, res) => {
  const sheetUrl = process.env.GSHEET_MARKS_URL;
  if (!sheetUrl) {
    return res.json(SAMPLE_MARKS);
  }

  // TODO: parse real marks sheet when structure is finalized.
  // For now we always fall back to the sample structure to keep the
  // frontend fully functional.
  return res.json(SAMPLE_MARKS);
});

module.exports = router;

