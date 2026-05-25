import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import TutorList from './pages/TutorList';
import SetAvailability from './pages/SetAvailability';
import TutorDashboard from './pages/TutorDashboard';
import TutorDetails from './pages/TutorDetails';
import Login from './pages/Login';
import StudentDashboard from "./pages/StudentDashboard.jsx"; // Now being used below
import Booking from "./pages/Booking.jsx"

function App() {
    return (
        <Routes>
            {/* Redirect root to register */}
            <Route path="/" element={<Navigate to="/register" replace />} />

            {/* Public Routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} /> {/* Fixed: Using the imported component */}
            <Route path="/terms" element={<div style={{padding: '40px'}}>Terms & Conditions</div>} />
            <Route path="/privacy" element={<div style={{padding: '40px'}}>Privacy Policy</div>} />

            {/* Tutor Routes */}
            <Route path="/tutors" element={<TutorList />} />
            <Route path="/tutor/:id" element={<TutorDetails />} />
            <Route path="/tutor/dashboard" element={<TutorDashboard />} />

            {/* Availability Route - Kept structured under availability for clarity */}
            <Route path="/availability/:tutorId" element={<SetAvailability />} />
            <Route path="/booking" element={<Booking />} />
            {/* Student Routes */}
            <Route path="/student/dashboard" element={<StudentDashboard/>} ></Route>
            {/* 404 Catch-All Route */}
            <Route path="*" element={<div style={{padding: '40px', textAlign: 'center'}}><h2>404: Page Not Found</h2></div>} />
        </Routes>
    );
}

export default App;