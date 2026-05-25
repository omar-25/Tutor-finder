import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TutorDashboard.css';

const TutorDashboard = () => {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [tutorId, setTutorId] = useState(localStorage.getItem('tutorId'));
    const [availability, setAvailability] = useState([]);
    const [tutorProfile, setTutorProfile] = useState(null);
    const [formData, setFormData] = useState({ hourlyRate: '', bio: '', subjects: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pendingBookings, setPendingBookings] = useState([]);
    const [allBookings, setAllBookings] = useState([]);
    const [showAllBookings, setShowAllBookings] = useState(false);

    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName');

    useEffect(() => {
        if (tutorId) {
            loadTutorProfile();
            loadAvailability();
            loadBookings();
        }
    }, [tutorId]);

    const loadBookings = async () => {
        try {
            // Get all tutor bookings
            const response = await fetch(
                `http://localhost:8080/api/bookings/tutor/${tutorId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setAllBookings(data);

                // Filter pending bookings
                const pending = data.filter(
                    booking => booking.status === 'PENDING'
                );
                setPendingBookings(pending);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAcceptBooking = async (bookingId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/bookings/${bookingId}/accept`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error();
            }

            setSuccess('✅ Booking accepted successfully');
            await loadBookings(); // Refresh the list
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to accept booking');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleRejectBooking = async (bookingId) => {
        const reason = prompt('Please provide a reason for rejection:');
        if (!reason) return;

        try {
            const response = await fetch(
                `http://localhost:8080/api/bookings/${bookingId}/reject?reason=${encodeURIComponent(reason)}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error();
            }

            setSuccess('❌ Booking rejected');
            await loadBookings(); // Refresh the list
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to reject booking');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleCompleteBooking = async (bookingId) => {
        if (!window.confirm('Mark this session as completed?')) return;

        try {
            const response = await fetch(
                `http://localhost:8080/api/bookings/${bookingId}/complete`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error();
            }

            setSuccess('✅ Session marked as completed');
            await loadBookings();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to complete booking');
            setTimeout(() => setError(''), 3000);
        }
    };

    const loadTutorProfile = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/tutors/${tutorId}`);
            if (response.ok) {
                const data = await response.json();
                setTutorProfile(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const loadAvailability = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/availability/tutor/${tutorId}`);
            if (response.ok) {
                const data = await response.json();
                setAvailability(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const body = {
            hourlyRate: parseFloat(formData.hourlyRate),
            bio: formData.bio,
            subjects: formData.subjects.split(',').map(s => s.trim()),
            userId: localStorage.getItem('userId')
        };

        try {
            const response = await fetch('http://localhost:8080/api/tutors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error('Failed to create profile');

            const data = await response.json();
            setTutorId(data.tutorId);
            localStorage.setItem('tutorId', data.tutorId);
            setSuccess('✨ Profile created successfully!');
            setShowForm(false);
            loadTutorProfile();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Something went wrong. Please try again.');
            setTimeout(() => setError(''), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAvailability = async (availabilityId) => {
        if (window.confirm('Are you sure you want to remove this availability slot?')) {
            try {
                await fetch(`http://localhost:8080/api/availability/${availabilityId}`, {
                    method: 'DELETE',
                });
                setAvailability(prev => prev.filter(a => a.availabilityId !== availabilityId));
                setSuccess('🗑️ Availability slot removed');
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError('Failed to delete availability');
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    const formatTime = (time) => {
        if (!time) return '';
        return time.substring(0, 5);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const getStatusBadge = (status) => {
        const badges = {
            'PENDING': 'badge-pending',
            'ACCEPTED': 'badge-accepted',
            'REJECTED': 'badge-rejected',
            'CANCELLED': 'badge-cancelled',
            'COMPLETED': 'badge-completed'
        };
        return badges[status] || 'badge-pending';
    };

    return (
        <div className="dashboard-container">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-content">
                    <div className="welcome-badge">
                        <span className="wave-emoji">👋</span>
                        <span>Welcome back!</span>
                    </div>
                    <h1 className="hero-title">
                        Hello, <span className="highlight">{name}</span>
                    </h1>
                    <p className="hero-subtitle">{email}</p>
                </div>
                <div className="hero-stats">
                    {tutorId && (
                        <>
                            <div className="stat-card">
                                <div className="stat-number">{availability.length}</div>
                                <div className="stat-label">Active Slots</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">{pendingBookings.length}</div>
                                <div className="stat-label">Pending Requests</div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Notifications */}
            {success && (
                <div className="notification success">
                    <span className="notification-icon">✅</span>
                    <span>{success}</span>
                </div>
            )}
            {error && (
                <div className="notification error">
                    <span className="notification-icon">⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            {/* Main Content */}
            <div className="dashboard-grid">
                {/* Profile Card */}
                <div className="card profile-card">
                    <div className="card-header">
                        <div className="card-icon">📋</div>
                        <h2>Tutor Profile</h2>
                    </div>

                    {!showForm && !tutorId && (
                        <div className="card-content">
                            <p className="card-description">
                                Become a tutor and start sharing your knowledge with students.
                            </p>
                            <button className="btn-primary" onClick={() => setShowForm(true)}>
                                <span>+</span> Create Tutor Profile
                            </button>
                        </div>
                    )}

                    {tutorId && !showForm && tutorProfile && (
                        <div className="card-content">
                            <div className="profile-details">
                                <div className="detail-item">
                                    <span className="detail-label">💰 HOURLY RATE</span>
                                    <span className="detail-value">${tutorProfile.hourlyRate}/hr</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">📚 SUBJECTS</span>
                                    <div className="subjects-list">
                                        {tutorProfile.subjects?.map((subject, idx) => (
                                            <span key={idx} className="subject-badge">{subject}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">📝 BIO</span>
                                    <p className="detail-value bio-text">{tutorProfile.bio}</p>
                                </div>
                            </div>
                            <button className="btn-primary" onClick={() => navigate(`/availability/${tutorId}`)}>
                                <span>+</span> Add Availability
                            </button>
                        </div>
                    )}

                    {showForm && (
                        <form onSubmit={handleCreateProfile} className="profile-form">
                            <div className="form-group">
                                <label htmlFor="hourlyRate">Hourly Rate ($)</label>
                                <input
                                    id="hourlyRate"
                                    type="number"
                                    placeholder="e.g., 50"
                                    value={formData.hourlyRate}
                                    onChange={e => setFormData({...formData, hourlyRate: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="bio">Bio</label>
                                <textarea
                                    id="bio"
                                    rows="4"
                                    placeholder="Tell students about your teaching experience, qualifications, and approach..."
                                    value={formData.bio}
                                    onChange={e => setFormData({...formData, bio: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="subjects">Subjects (comma separated)</label>
                                <input
                                    id="subjects"
                                    type="text"
                                    placeholder="e.g., Mathematics, Physics, Programming"
                                    value={formData.subjects}
                                    onChange={e => setFormData({...formData, subjects: e.target.value})}
                                    required
                                />
                                <small className="input-hint">Separate multiple subjects with commas</small>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-primary" disabled={isLoading}>
                                    {isLoading ? 'Creating...' : 'Save Profile'}
                                </button>
                                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Availability Card */}
                <div className="card availability-card">
                    <div className="card-header">
                        <div className="card-icon">🗓️</div>
                        <h2>Availability Schedule</h2>
                    </div>

                    <div className="card-content">
                        {!tutorId && (
                            <div className="message-box">
                                <p>Create your tutor profile first to manage availability</p>
                            </div>
                        )}

                        {tutorId && availability.length === 0 && (
                            <div className="message-box">
                                <p>No availability slots yet</p>
                                <button className="btn-outline" onClick={() => navigate(`/availability/${tutorId}`)}>
                                    Add Your First Slot
                                </button>
                            </div>
                        )}

                        {availability.length > 0 && (
                            <div className="availability-list">
                                {availability.map(slot => (
                                    <div key={slot.availabilityId} className="availability-slot">
                                        <div className="slot-info">
                                            <div className="slot-day">{slot.dayOfTheWeek}</div>
                                            <div className="slot-time">
                                                <span className="time-icon">⏰</span>
                                                <span>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                                            </div>
                                            <div className="slot-subject">{slot.subject}</div>
                                        </div>
                                        <button
                                            className="delete-slot"
                                            onClick={() => handleDeleteAvailability(slot.availabilityId)}
                                            aria-label="Delete availability"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Pending Bookings Card */}
                <div className="card booking-card">
                    <div className="card-header">
                        <div className="card-icon">📨</div>
                        <h2>Pending Booking Requests</h2>
                        <span className="pending-count">{pendingBookings.length}</span>
                    </div>

                    <div className="card-content">
                        {pendingBookings.length === 0 && (
                            <div className="message-box">
                                <p>No pending booking requests</p>
                            </div>
                        )}

                        {pendingBookings.map(booking => (
                            <div key={booking.id} className="booking-request">
                                <div className="booking-info">
                                    <p><strong>Subject:</strong> {booking.subject}</p>
                                    <p><strong>Student:</strong> {booking.studentId}</p>
                                    <p><strong>Date:</strong> {new Date(booking.startTime).toLocaleDateString()}</p>
                                    <p><strong>Time:</strong> {new Date(booking.startTime).toLocaleTimeString()}</p>
                                    <p><strong>Duration:</strong> {Math.round((new Date(booking.endTime) - new Date(booking.startTime)) / 60000)} min</p>
                                    {booking.notes && <p><strong>Notes:</strong> {booking.notes}</p>}
                                </div>

                                <div className="booking-actions">
                                    <button
                                        className="btn-accept"
                                        onClick={() => handleAcceptBooking(booking.id)}
                                    >
                                        ✓ Accept
                                    </button>
                                    <button
                                        className="btn-reject"
                                        onClick={() => handleRejectBooking(booking.id)}
                                    >
                                        ✗ Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Browse Tutors Card */}
                <div className="card browse-card">
                    <div className="card-header">
                        <div className="card-icon">👥</div>
                        <h2>Explore Community</h2>
                    </div>

                    <div className="card-content">
                        <p className="card-description">
                            Connect with other tutors, share insights, and grow your teaching network.
                        </p>
                        <button className="btn-primary" onClick={() => navigate('/tutors')}>
                            Browse All Tutors
                        </button>
                        <button className="btn-logout" onClick={handleLogout}>
                            🚪 Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorDashboard;