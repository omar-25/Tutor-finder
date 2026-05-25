import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Booking from './Booking';
import './StudentDashboard.css';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        studentId: ''
    });
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [studentBookings, setStudentBookings] = useState([]);

    const [dashboardData, setDashboardData] = useState({
        enrolledCourses: [],
        upcomingSessions: [],
        recentAchievements: [],
        recommendedCourses: []
    });
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userEmail = localStorage.getItem('userEmail');
                const userId = localStorage.getItem('userId');
                const token = localStorage.getItem('token');

                if (!userEmail || !token) {
                    navigate('/login');
                    return;
                }

                setUser({
                    firstName: localStorage.getItem('userFirstName') || '',
                    lastName: localStorage.getItem('userLastName') || '',
                    email: userEmail,
                    phoneNumber: localStorage.getItem('userPhone') || '',
                    studentId: userId
                });

                setFormData({
                    firstName: localStorage.getItem('userFirstName') || '',
                    lastName: localStorage.getItem('userLastName') || '',
                    email: userEmail,
                    phoneNumber: localStorage.getItem('userPhone') || '',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });

                if (userId) {
                    await loadStudentBookings(userId);
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);
    const loadStudentBookings = async (studentId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/bookings/student/${studentId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setStudentBookings(data);

                const upcoming = data.filter(b => b.status === 'ACCEPTED');
                const completed = data.filter(b => b.status === 'COMPLETED');

                const courseMap = new Map();
                data.forEach(b => {
                    if (!courseMap.has(b.subject)) {
                        courseMap.set(b.subject, {
                            id: b.id,
                            title: b.subject,
                            tutor: b.tutorId,
                            progress: b.status === 'COMPLETED' ? 100 : 50,
                            nextSession: upcoming.find(u => u.subject === b.subject)
                                ? new Date(upcoming.find(u => u.subject === b.subject).startTime).toLocaleString()
                                : null,
                            image: '📚'
                        });
                    }
                });

                setDashboardData(prev => ({
                    ...prev,
                    upcomingSessions: upcoming.map(b => ({
                        id: b.id,
                        course: b.subject,
                        time: new Date(b.startTime).toLocaleString(),
                        tutor: b.tutorId,
                        duration: `${Math.round((new Date(b.endTime) - new Date(b.startTime)) / 60000)} minutes`,
                        bookingId: b.id
                    })),
                    enrolledCourses: Array.from(courseMap.values()),
                    recentAchievements: completed.length > 0 ? [{
                        id: 1,
                        title: 'Session Completed',
                        description: `Completed ${completed.length} session(s)`,
                        icon: '🎯',
                        date: new Date(completed[completed.length - 1].createdAt).toLocaleDateString()
                    }] : []
                }));
            }
        } catch (error) {
            console.error('Error loading bookings:', error);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Replace with actual API call
            setUser({
                ...user,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber
            });

            setShowEditProfile(false);
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Error updating profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        if (formData.newPassword.length < 8) {
            alert('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);

        try {
            alert('Password changed successfully!');
            setFormData({
                ...formData,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setShowProfileModal(false);
        } catch (error) {
            alert('Error changing password');
        } finally {
            setIsLoading(false);
        }
    };
    const handleCancelFromDashboard = async (bookingId) => {
        if (!window.confirm('Cancel this session?')) return;
        try {
            const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}/cancel`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.ok) {
                await loadStudentBookings(localStorage.getItem('userId'));
                alert('Session cancelled successfully');
            }
        } catch (error) {
            alert('Failed to cancel session');
        }
    };

    const StatCard = ({ icon, title, value, color }) => (
        <div className="stat-card">
            <div className={`stat-icon ${color}`}>{icon}</div>
            <div className="stat-info">
                <h3>{value}</h3>
                <p>{title}</p>
            </div>
        </div>
    );

    const CourseCard = ({ course }) => (
        <div className="course-card">
            <div className="course-icon">{course.image}</div>
            <div className="course-info">
                <h4>{course.title}</h4>
                <p className="course-tutor">{course.tutor}</p>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                </div>
                <p className="course-progress-text">{course.progress}% Complete</p>
                {course.nextSession && <p className="next-session">Next: {course.nextSession}</p>}
            </div>
        </div>
    );

    if (isLoading && !user.firstName) {
        return (
            <div className="dashboard-loading">
                <div className="spinner-large"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="student-dashboard">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">
                        <span className="logo-icon">📚</span>
                        <span className="logo-text">EduConnect</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <span className="nav-icon">📊</span>
                        <span>Overview</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
                        onClick={() => setActiveTab('courses')}
                    >
                        <span className="nav-icon">📚</span>
                        <span>My Courses</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bookings')}
                    >
                        <span className="nav-icon">📅</span>
                        <span>Book a Session</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'sessions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sessions')}
                    >
                        <span className="nav-icon">🎥</span>
                        <span>Sessions</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'achievements' ? 'active' : ''}`}
                        onClick={() => setActiveTab('achievements')}
                    >
                        <span className="nav-icon">🏆</span>
                        <span>Achievements</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'recommended' ? 'active' : ''}`}
                        onClick={() => setActiveTab('recommended')}
                    >
                        <span className="nav-icon">✨</span>
                        <span>Recommended</span>
                    </button>
                    <button
                        className="nav-item"
                        onClick={() => navigate('/tutors')}
                    >
                        <span className="nav-icon">🔍</span>
                        <span>Find Tutors</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button className="nav-item" onClick={() => setShowProfileModal(true)}>
                        <span className="nav-icon">👤</span>
                        <span>Profile</span>
                    </button>
                    <button className="nav-item logout" onClick={handleLogout}>
                        <span className="nav-icon">🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Header */}
                <header className="dashboard-header">
                    <div className="header-welcome">
                        <h1>Welcome back, {user.firstName}! 👋</h1>
                        <p>Ready to continue your learning journey?</p>
                    </div>
                    <div className="header-actions">
                        <button
                            className="btn-find-tutor"
                            onClick={() => navigate('/tutors')}
                        >
                            🔍 Find a Tutor
                        </button>
                        <button className="btn-icon" onClick={() => setShowProfileModal(true)}>
                            <span className="notification-icon">🔔</span>
                        </button>
                        <div className="user-avatar" onClick={() => setShowEditProfile(true)}>
                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </div>
                    </div>
                </header>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <>
                        {/* Stats Grid */}
                        <div className="stats-grid">
                            <StatCard icon="📚" title="Subjects Booked" value={dashboardData.enrolledCourses.length} color="green" />
                            <StatCard icon="🎯" title="Completed Sessions" value={studentBookings.filter(b => b.status === 'COMPLETED').length} color="blue" />
                            <StatCard icon="📅" title="Upcoming Sessions" value={studentBookings.filter(b => b.status === 'ACCEPTED').length} color="yellow" />
                            <StatCard icon="⏳" title="Pending Requests" value={studentBookings.filter(b => b.status === 'PENDING').length} color="purple" />
                        </div>

                        {/* Upcoming Sessions */}
                        <div className="dashboard-section">
                            <div className="section-header">
                                <h2>📅 Upcoming Sessions</h2>
                                <Link to="/student/sessions" className="view-all">View All →</Link>
                            </div>
                            <div className="sessions-list">
                                {dashboardData.upcomingSessions.length === 0 ? (
                                    <p>No upcoming sessions. Book one now!</p>
                                ) : (
                                    dashboardData.upcomingSessions.map(session => (
                                        <div key={session.id} className="session-card">
                                            <div className="session-info">
                                                <h4>{session.course}</h4>
                                                <p className="session-time">⏰ {session.time}</p>
                                                <p className="session-duration">⏱️ {session.duration}</p>
                                            </div>
                                            <div style={{display:'flex', gap:'8px'}}>
                                                <button className="btn-join">Join Session →</button>
                                                <button
                                                    className="btn-cancel"
                                                    onClick={() => handleCancelFromDashboard(session.bookingId)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* My Courses Preview */}
                        <div className="dashboard-section">
                            <div className="section-header">
                                <h2>📖 My Courses</h2>
                                <button onClick={() => setActiveTab('courses')} className="view-all">View All →</button>
                            </div>
                            <div className="courses-grid">
                                {dashboardData.enrolledCourses.map(course => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        </div>

                        {/* Recent Achievements */}
                        <div className="dashboard-section">
                            <div className="section-header">
                                <h2>🏆 Recent Achievements</h2>
                                <button onClick={() => setActiveTab('achievements')} className="view-all">View All →</button>
                            </div>
                            <div className="achievements-grid">
                                {dashboardData.recentAchievements.map(achievement => (
                                    <div key={achievement.id} className="achievement-card">
                                        <div className="achievement-icon">{achievement.icon}</div>
                                        <div className="achievement-info">
                                            <h4>{achievement.title}</h4>
                                            <p>{achievement.description}</p>
                                            <span className="achievement-date">{achievement.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Courses Tab */}
                {activeTab === 'courses' && (
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2>📚 All My Courses</h2>
                            <button className="btn-browse">Browse More Courses +</button>
                        </div>
                        <div className="courses-grid-full">
                            {dashboardData.enrolledCourses.map(course => (
                                <div key={course.id} className="course-card-full">
                                    <div className="course-header">
                                        <span className="course-icon-large">{course.image}</span>
                                        <h3>{course.title}</h3>
                                    </div>
                                    <p className="course-tutor-full">Tutor: {course.tutor}</p>
                                    <div className="progress-section">
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                                        </div>
                                        <span className="progress-percent">{course.progress}% Complete</span>
                                    </div>
                                    <div className="course-actions">
                                        <button className="btn-continue">Continue Learning →</button>
                                        <button className="btn-session">Schedule Session</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Bookings Tab */}
                {activeTab === 'bookings' && (
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2>📅 My Bookings</h2>
                            <button
                                className="btn-browse-tutors"
                                onClick={() => navigate('/tutors')}
                            >
                                Find New Tutors →
                            </button>
                        </div>
                        <div className="bookings-embedded">
                            <Booking />
                        </div>
                    </div>
                )}

                {/* Sessions Tab */}
                {activeTab === 'sessions' && (
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2>🎥 Upcoming Sessions</h2>
                            <button className="btn-schedule" onClick={() => navigate('/tutors')}>Schedule New Session +</button>
                        </div>
                        <div className="sessions-list-full">
                            {dashboardData.upcomingSessions.map(session => (
                                <div key={session.id} className="session-card-full">
                                    <div className="session-details">
                                        <div className="session-icon">🎥</div>
                                        <div className="session-info-full">
                                            <h3>{session.course}</h3>
                                            <p>with {session.tutor}</p>
                                            <div className="session-meta">
                                                <span>📅 {session.time}</span>
                                                <span>⏱️ {session.duration}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="session-actions">
                                        <button className="btn-join-full">Join Now</button>
                                        <button className="btn-reschedule">Reschedule</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Achievements Tab */}
                {activeTab === 'achievements' && (
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2>🏆 All Achievements</h2>
                            <p className="achievement-score">Total: 450 XP</p>
                        </div>
                        <div className="achievements-grid-full">
                            {[...dashboardData.recentAchievements,
                                { id: 3, title: 'Early Bird', description: 'Completed morning sessions for 5 days', icon: '🌅', date: '1 week ago' },
                                { id: 4, title: 'Homework Hero', description: 'Submitted 10 assignments on time', icon: '📝', date: '2 weeks ago' }
                            ].map(achievement => (
                                <div key={achievement.id} className="achievement-card-full">
                                    <div className="achievement-icon-large">{achievement.icon}</div>
                                    <div className="achievement-info-full">
                                        <h3>{achievement.title}</h3>
                                        <p>{achievement.description}</p>
                                        <span className="achievement-date">{achievement.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recommended Tab */}
                {activeTab === 'recommended' && (
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2>✨ Recommended For You</h2>
                            <p>Based on your learning interests</p>
                        </div>
                        <div className="recommended-grid">
                            {dashboardData.recommendedCourses.map(course => (
                                <div key={course.id} className="recommended-card">
                                    <div className="recommended-icon">{course.image}</div>
                                    <h3>{course.title}</h3>
                                    <p>{course.tutor}</p>
                                    <div className="rating">
                                        <span>⭐ {course.rating}</span>
                                        <span className="price">{course.price}</span>
                                    </div>
                                    <button className="btn-enroll">Enroll Now →</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Profile Modal */}
            {showProfileModal && (
                <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Profile Settings</h2>
                            <button className="modal-close" onClick={() => setShowProfileModal(false)}>✕</button>
                        </div>
                        <div className="modal-tabs">
                            <button className={`modal-tab ${!showEditProfile ? 'active' : ''}`} onClick={() => setShowEditProfile(false)}>
                                View Profile
                            </button>
                            <button className={`modal-tab ${showEditProfile ? 'active' : ''}`} onClick={() => setShowEditProfile(true)}>
                                Edit Profile
                            </button>
                        </div>

                        {!showEditProfile ? (
                            <div className="profile-view">
                                <div className="profile-avatar-large">
                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                </div>
                                <h3>{user.firstName} {user.lastName}</h3>
                                <p className="profile-email">📧 {user.email}</p>
                                <p className="profile-phone">📱 {user.phoneNumber}</p>
                                <p className="profile-role">🎓 Student</p>
                                <button className="btn-change-password" onClick={() => setShowEditProfile(true)}>
                                    Change Password
                                </button>
                            </div>
                        ) : (
                            <div className="profile-edit">
                                <form onSubmit={handleProfileUpdate}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>First Name</label>
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Last Name</label>
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="email" value={formData.email} disabled />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="tel"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                        />
                                    </div>

                                    <h4 className="password-section-title">Change Password</h4>
                                    <div className="form-group">
                                        <label>Current Password</label>
                                        <input
                                            type="password"
                                            value={formData.currentPassword}
                                            onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>New Password</label>
                                        <input
                                            type="password"
                                            value={formData.newPassword}
                                            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                                            placeholder="At least 8 characters"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                            placeholder="Confirm your new password"
                                        />
                                    </div>

                                    <div className="modal-actions">
                                        <button type="button" className="btn-cancel" onClick={() => setShowProfileModal(false)}>Cancel</button>
                                        <button type="submit" className="btn-save" disabled={isLoading}>
                                            {isLoading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;