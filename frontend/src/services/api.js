import axios from 'axios';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});


// Attach JWT token to every request automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


// Auth
export const login    = (data)         => api.post('/auth/login', data);
export const register = (data)         => api.post('/auth/register', data);


// Students
export const getStudents    = ()       => api.get('/students');
export const getStudent     = (id)     => api.get(`/students/${id}`);
export const addStudent     = (data)   => api.post('/students', data);
export const updateStudent  = (id, d)  => api.put(`/students/${id}`, d);
export const deleteStudent  = (id)     => api.delete(`/students/${id}`);


// Sheets (attendance + marks via backend proxy)
export const getAttendance  = (id)     => api.get(`/sheets/attendance/${id}`);
export const getMarks       = (id)     => api.get(`/sheets/marks/${id}`);


// Notices
export const getNotices     = ()       => api.get('/notices');
export const addNotice      = (data)   => api.post('/notices', data);
export const deleteNotice   = (id)     => api.delete(`/notices/${id}`);


export default api;
