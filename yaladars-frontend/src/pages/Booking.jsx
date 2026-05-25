import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Booking.css';

const Booking = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const tutorFromState = location.state?.tutor;
    const preferredSlot = location.state?.preferredSlot;

    // Get student ID from localStorage
    const studentId = localStorage.getItem('userId') || localStorage.getItem('studentId');

    const [formData, setFormData] = useState({
        tutorId: tutorFromState?.id || '',
        tutorName: tutorFromState?.name || '',
        studentId: studentId || '',
        subject: '',
        date: '',
        time: '',
        duration: 60,
        notes: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('new');

    useEffect(() => {
        if (!studentId) {
            console.error('No student ID found. Please login again.');
            return;
        }

        if (studentId) {
            fetchMyBookings();
        }
    }, [studentId]);

    const fetchMyBookings = async () => {
        if (!studentId) return;

        try {
            const response = await fetch(`http://localhost:8080/api/bookings/student/${studentId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setBookings(data);
            } else {
                console.error('Failed to fetch bookings:', response.status);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.tutorId) newErrors.tutorId = 'Please select a tutor';
        if (!formData.subject) newErrors.subject = 'Subject is required';
        if (!formData.date) newErrors.date = 'Date is required';
        if (!formData.time) newErrors.time = 'Time is required';

        if (formData.date) {
            const selectedDate = new Date(formData.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                newErrors.date = 'Cannot book a session in the past';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const studentId = localStorage.getItem('userId');

        if (!studentId) {
            setErrors({ submit: 'Student ID not found. Please log in again.' });
            return;
        }

        setIsLoading(true);
        setErrors(prev => ({ ...prev, submit: '' }));

        try {
            const startDateTime = new Date(`${formData.date}T${formData.time}`);
            const endDateTime = new Date(startDateTime.getTime() + formData.duration * 60000);

            const bookingData = {
                tutorId: formData.tutorId,
                studentId: studentId,  // ← use directly from localStorage
                subject: formData.subject,
                startTime: startDateTime.toISOString(),
                endTime: endDateTime.toISOString(),
                totalAmount: 0,
                notes: formData.notes
            };

            console.log('Sending booking data:', bookingData);

            const response = await fetch('http://localhost:8080/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(bookingData)
            });

            const data = await response.json();
            console.log('Response:', response.status, data);

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Booking failed');
            }

            setFormData({
                ...formData,
                subject: '',
                date: '',
                time: '',
                duration: 60,
                notes: ''
            });
            setActiveTab('my');
            await fetchMyBookings();
            alert('Booking request sent successfully!');
        } catch (error) {
            console.error('Booking error:', error);
            setErrors(prev => ({ ...prev, submit: error.message }));
        } finally {
            setIsLoading(false);
        }
    };
    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        try {
            const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                await fetchMyBookings();
                alert('Booking cancelled successfully');
            } else {
                const error = await response.json();
                alert('Failed to cancel: ' + (error.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Cancel error:', error);
            alert('Failed to cancel booking');
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'PENDING': { class: 'status-pending', text: 'Pending' },
            'ACCEPTED': { class: 'status-accepted', text: 'Confirmed' },
            'REJECTED': { class: 'status-rejected', text: 'Rejected' },
            'CANCELLED': { class: 'status-cancelled', text: 'Cancelled' },
            'COMPLETED': { class: 'status-completed', text: 'Completed' }
        };
        const config = statusConfig[status] || statusConfig.PENDING;
        return <span className={`status-badge ${config.class}`}>{config.text}</span>;
    };

    return (
        <div className="booking-container">
            <div className="booking-decoration">
                <div className="decoration-circle circle-1"></div>
                <div className="decoration-circle circle-2"></div>
                <div className="decoration-circle circle-3"></div>
            </div>

            <div className="booking-card">
                <div className="booking-header">
                    <div className="booking-icon">📅</div>
                    <h1 className="booking-title">Book a Session</h1>
                    <p className="booking-subtitle">Schedule your learning journey</p>
                </div>

                <div className="booking-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'new' ? 'active' : ''}`}
                        onClick={() => setActiveTab('new')}
                    >
                        ✨ New Booking
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`}
                        onClick={() => setActiveTab('my')}
                    >
                        📋 My Bookings ({bookings.length})
                    </button>
                </div>

                {activeTab === 'new' ? (
                    <form onSubmit={handleSubmit} className="booking-form">
                        <div className="form-group">
                            <label className="form-label">
                                <span className="label-icon">👨‍🏫</span>
                                Tutor <span className="required">*</span>
                            </label>
                            {tutorFromState ? (
                                <div className="selected-tutor">
                                    <span className="tutor-icon">👨‍🏫</span>
                                    <div>
                                        <strong>{formData.tutorName}</strong>
                                        <p>ID: {formData.tutorId}</p>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <input
                                        type="text"
                                        name="tutorId"
                                        value={formData.tutorId}
                                        onChange={handleChange}
                                        className={`form-input ${errors.tutorId ? 'input-error' : ''}`}
                                        placeholder="Enter Tutor ID"
                                    />
                                    <button
                                        type="button"
                                        className="btn-find-tutor-small"
                                        onClick={() => navigate('/tutors')}
                                    >
                                        Find a Tutor →
                                    </button>
                                </div>
                            )}
                            {errors.tutorId && <span className="error-message">{errors.tutorId}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <span className="label-icon">📖</span>
                                Subject/Topic <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className={`form-input ${errors.subject ? 'input-error' : ''}`}
                                placeholder="e.g., Mathematics, Programming, English"
                            />
                            {errors.subject && <span className="error-message">{errors.subject}</span>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    <span className="label-icon">📅</span>
                                    Date <span className="required">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className={`form-input ${errors.date ? 'input-error' : ''}`}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                                {errors.date && <span className="error-message">{errors.date}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <span className="label-icon">⏰</span>
                                    Time <span className="required">*</span>
                                </label>
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className={`form-input ${errors.time ? 'input-error' : ''}`}
                                />
                                {errors.time && <span className="error-message">{errors.time}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <span className="label-icon">⏱️</span>
                                    Duration
                                </label>
                                <select
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="form-input"
                                >
                                    <option value={30}>30 minutes</option>
                                    <option value={60}>1 hour</option>
                                    <option value={90}>1.5 hours</option>
                                    <option value={120}>2 hours</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <span className="label-icon">📝</span>
                                Notes (Optional)
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="form-textarea"
                                placeholder="Any specific topics or requirements for this session..."
                                rows="3"
                            />
                        </div>

                        {errors.submit && <div className="submit-error">{errors.submit}</div>}

                        <button type="submit" className="booking-button" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    Booking...
                                </>
                            ) : (
                                <>
                                    <span>✨</span>
                                    Request Session
                                    <span>→</span>
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="my-bookings">
                        {bookings.length === 0 ? (
                            <div className="no-bookings">
                                <div className="no-bookings-icon">📅</div>
                                <h3>No Bookings Yet</h3>
                                <p>You haven't booked any sessions yet. Create your first booking!</p>
                                <button
                                    className="btn-create-booking"
                                    onClick={() => setActiveTab('new')}
                                >
                                    + Create a Booking
                                </button>
                            </div>
                        ) : (
                            <div className="bookings-list">
                                {bookings.map(booking => (
                                    <div key={booking.id} className="booking-item">
                                        <div className="booking-item-header">
                                            <h3>{booking.subject}</h3>
                                            {getStatusBadge(booking.status)}
                                        </div>
                                        <div className="booking-item-details">
                                            <div className="detail">
                                                <span className="detail-icon">👨‍🏫</span>
                                                <span>Tutor ID: {booking.tutorId}</span>
                                            </div>
                                            <div className="detail">
                                                <span className="detail-icon">📅</span>
                                                {/* FIXED: Use startTime instead of scheduledTime */}
                                                <span>{new Date(booking.startTime).toLocaleDateString()}</span>
                                            </div>
                                            <div className="detail">
                                                <span className="detail-icon">⏰</span>
                                                {/* FIXED: Use startTime instead of scheduledTime */}
                                                <span>{new Date(booking.startTime).toLocaleTimeString()}</span>
                                            </div>
                                            <div className="detail">
                                                <span className="detail-icon">⏱️</span>
                                                <span>
                                                    {Math.round((new Date(booking.endTime) - new Date(booking.startTime)) / 60000)} minutes
                                                </span>
                                            </div>
                                            {booking.notes && (
                                                <div className="detail notes">
                                                    <span className="detail-icon">📝</span>
                                                    <span>{booking.notes}</span>
                                                </div>
                                            )}
                                            {booking.rejectionReason && (
                                                <div className="detail rejection">
                                                    <span className="detail-icon">⚠️</span>
                                                    <span>Reason: {booking.rejectionReason}</span>
                                                </div>
                                            )}
                                        </div>
                                        {(booking.status === 'PENDING' || booking.status === 'ACCEPTED') && (
                                            <div className="booking-item-actions">
                                                <button
                                                    className="btn-cancel-booking"
                                                    onClick={() => handleCancelBooking(booking.id)}
                                                >
                                                    Cancel {booking.status === 'PENDING' ? 'Request' : 'Session'}
                                                </button>
                                            </div>
                                        )}
                                        {booking.status === 'ACCEPTED' && (
                                            <div className="booking-item-actions">
                                                <button className="btn-join-session">Join Session →</button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="booking-footer">
                    <p className="booking-note">
                        💡 Need help? <a href="/contact" className="help-link">Contact Support</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Booking;