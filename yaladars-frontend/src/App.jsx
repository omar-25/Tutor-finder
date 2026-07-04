import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage      from './pages/LandingPage';
import Register         from './pages/Register';
import Login            from './pages/Login';
import TutorList        from './pages/TutorList';
import TutorDetails     from './pages/TutorDetails';
import Booking          from './pages/Booking';
import StudentDashboard from './pages/StudentDashboard';
import TutorDashboard   from './pages/TutorDashboard';
import SetAvailability  from './pages/SetAvailability';

/* ──────────────────────────────────────────────
   Route guards
──────────────────────────────────────────────── */

/** Redirect to login if not authenticated */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

/** Redirect to own dashboard if already logged in */
const PublicOnlyRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('userRole');
  if (token) {
    return <Navigate to={role === 'TUTOR' ? '/tutor/dashboard' : '/student/dashboard'} replace />;
  }
  return children;
};

/** Only allow specific role through */
const RoleRoute = ({ children, role }) => {
  const token    = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  if (!token) return <Navigate to="/login" replace />;
  if (userRole !== role) return <Navigate to="/" replace />;
  return children;
};

/* ──────────────────────────────────────────────
   App
──────────────────────────────────────────────── */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public ── */}
        <Route path="/"         element={<LandingPage />} />
        <Route path="/tutors"   element={<TutorList />} />
        <Route path="/tutor/:id" element={<TutorDetails />} />

        {/* ── Auth (redirect if already logged in) ── */}
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
        <Route path="/login"    element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />

        {/* ── Student flow ── */}
        <Route path="/student/dashboard" element={
          <RoleRoute role="STUDENT"><StudentDashboard /></RoleRoute>
        } />
        <Route path="/booking" element={
          <PrivateRoute><Booking /></PrivateRoute>
        } />

        {/* ── Tutor flow ── */}
        <Route path="/tutor/dashboard" element={
          <RoleRoute role="TUTOR"><TutorDashboard /></RoleRoute>
        } />
        <Route path="/availability/:tutorId" element={
          <RoleRoute role="TUTOR"><SetAvailability /></RoleRoute>
        } />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;