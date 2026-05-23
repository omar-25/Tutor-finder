import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import TutorList from './pages/TutorList';
import SetAvailability from './pages/SetAvailability';
import TutorDashboard from './pages/TutorDashboard';
import TutorDetails from './pages/TutorDetails';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/register" replace />} />
            <Route path="/register" element={<Register />} />
            <Route path="/student/dashboard" element={<div style={{padding:'40px', textAlign:'center'}}><h1>Student Dashboard</h1></div>} />
            <Route path="/tutor/dashboard" element={<TutorDashboard />} />
            <Route path="/login" element={<div style={{padding: '40px'}}>Login Page Placeholder</div>} />
            <Route path="/terms" element={<div style={{padding: '40px'}}>Terms & Conditions</div>} />
            <Route path="/privacy" element={<div style={{padding: '40px'}}>Privacy Policy</div>} />
            <Route path="/tutors" element={<TutorList />} />
            <Route path="/availability/:tutorId" element={<SetAvailability />} />
            <Route path="/tutor/:id" element={<TutorDetails/>} />
        </Routes>
    );
}

export default App;