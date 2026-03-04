import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard   from './pages/AdminDashboard';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'        element={<StudentDashboard />} />
        <Route path='/admin'   element={<AdminDashboard />}  />
        <Route path='*'        element={<Navigate to='/' />}  />
      </Routes>
    </BrowserRouter>
  );
}


export default App;

