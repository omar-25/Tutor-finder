import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import TutorSearch from './pages/TutorSearch';

const DashboardMock = ({ title }) => (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>{title} Dashboard</h1>
      <p>Welcome! You successfully registered and were redirected.</p>
    </div>
);

function App() {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/search" replace />} />
        <Route path="/search" element={<TutorSearch />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student/dashboard" element={<DashboardMock title="Student" />} />
        <Route path="/tutor/dashboard" element={<DashboardMock title="Tutor" />} />
        <Route path="/login" element={<div style={{padding: '40px'}}>Login Page Placeholder</div>} />
        <Route path="/terms" element={<div style={{padding: '40px'}}>Terms & Conditions Placeholder</div>} />
        <Route path="/privacy" element={<div style={{padding: '40px'}}>Privacy Policy Placeholder</div>} />
      </Routes>
  );
}

export default App;
