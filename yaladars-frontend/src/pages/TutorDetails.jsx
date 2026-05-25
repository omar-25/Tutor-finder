import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './TutorDetails.css';

const TutorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tutor, setTutor] = useState(null);
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState('all');
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/tutors/${id}`)
            .then(res => res.json())
            .then(data => { setTutor(data); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });

        fetch(`http://localhost:8080/api/availability/tutor/${id}`)
            .then(res => res.json())
            .then(data => setAvailability(data))
            .catch(err => console.error(err));
    }, [id]);

    const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

    const filteredAvailability = selectedDay === 'all'
        ? availability
        : availability.filter(slot => slot.dayOfTheWeek === selectedDay);

    const handleBookSession = (slot) => {
        setSelectedSlot(slot);
        setShowBookingModal(true);
    };

    const closeModal = () => {
        setShowBookingModal(false);
        setSelectedSlot(null);
    };

    // In TutorDetail.jsx, replace the confirmBooking and modal with this:


// Replace the confirmBooking function with:
    const confirmBooking = () => {
        // Close modal and navigate to booking page with tutor and slot info
        closeModal();
        navigate('/booking', {
            state: {
                tutor: {
                    id: tutor.tutorId,
                    name: tutor.name
                },
                preferredSlot: selectedSlot ? {
                    day: selectedSlot.dayOfTheWeek,
                    startTime: selectedSlot.startTime,
                    endTime: selectedSlot.endTime,
                    subject: selectedSlot.subject
                } : null
            }
        });
    };




    if (loading) {
        return (
            <div className="detail-page">
                <div className="detail-loader-container">
                    <div className="detail-spinner"></div>
                    <p className="detail-loading-text">Loading tutor profile...</p>
                </div>
            </div>
        );
    }

    if (!tutor) {
        return (
            <div className="detail-page">
                <div className="detail-error-container">
                    <div className="detail-error-icon">😕</div>
                    <h2 className="detail-error-title">Tutor Not Found</h2>
                    <p className="detail-error-text">The tutor you're looking for doesn't exist or has been removed.</p>
                    <button className="detail-back-btn" onClick={() => navigate('/tutors')}>
                        ← Browse Other Tutors
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="detail-page">
            {/* Back Button */}
            <button className="detail-back-btn" onClick={() => navigate('/tutors')}>
                ← Back to Tutors
            </button>

            {/* Tutor Profile Header */}
            <div className="detail-profile-header">
                <div className="detail-avatar-section">
                    <div className="detail-avatar">
                        <span className="detail-avatar-emoji">👨‍🏫</span>
                    </div>
                    <div className="detail-rating">
                        <span className="detail-stars">★★★★★</span>
                        <span className="detail-rating-score">4.9</span>
                        <span className="detail-review-count">(127 reviews)</span>
                    </div>
                </div>
                <div className="detail-header-content">
                    <div className="detail-badge">Verified Tutor</div>
                    <h1 className="detail-name">{tutor.name || 'Expert Tutor'}</h1>
                    <p className="detail-bio-text">{tutor.bio}</p>
                    <div className="detail-stats-grid">
                        <div className="detail-stat">
                            <div className="detail-stat-value">${tutor.hourlyRate}</div>
                            <div className="detail-stat-label">/hour</div>
                        </div>
                        <div className="detail-stat">
                            <div className="detail-stat-value">{tutor.subjects?.length || 0}</div>
                            <div className="detail-stat-label">Subjects</div>
                        </div>
                        <div className="detail-stat">
                            <div className="detail-stat-value">{availability.length}</div>
                            <div className="detail-stat-label">Available Slots</div>
                        </div>
                        <div className="detail-stat">
                            <div className="detail-stat-value">500+</div>
                            <div className="detail-stat-label">Students</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subjects Section */}
            <div className="detail-section">
                <div className="detail-section-header">
                    <h2 className="detail-section-title">📚 Subjects Taught</h2>
                    <div className="detail-section-line"></div>
                </div>
                <div className="detail-subjects-container">
                    {tutor.subjects?.map((subject, idx) => (
                        <div key={idx} className="detail-subject-card">
                            <span className="detail-subject-icon">
                                {subject === 'Mathematics' && '📐'}
                                {subject === 'Physics' && '⚡'}
                                {subject === 'Chemistry' && '🧪'}
                                {subject === 'Biology' && '🧬'}
                                {subject === 'Programming' && '💻'}
                                {!['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Programming'].includes(subject) && '📖'}
                            </span>
                            <span className="detail-subject-name">{subject}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Availability Section */}
            <div className="detail-section">
                <div className="detail-section-header">
                    <h2 className="detail-section-title">🗓️ Availability Schedule</h2>
                    <div className="detail-section-line"></div>
                </div>

                {/* Day Filter */}
                <div className="detail-day-filter">
                    <button
                        className={`detail-filter-btn ${selectedDay === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedDay('all')}
                    >
                        All Days
                    </button>
                    {daysOfWeek.map(day => (
                        <button
                            key={day}
                            className={`detail-filter-btn ${selectedDay === day ? 'active' : ''}`}
                            onClick={() => setSelectedDay(day)}
                        >
                            {day.substring(0, 3)}
                        </button>
                    ))}
                </div>

                {availability.length === 0 ? (
                    <div className="detail-empty-availability">
                        <div className="detail-empty-icon">📅</div>
                        <h3 className="detail-empty-title">No Availability Yet</h3>
                        <p className="detail-empty-text">This tutor hasn't added any available time slots.</p>
                        <button className="detail-notify-btn" onClick={() => alert("We'll notify you when they're available!")}>
                            Notify Me
                        </button>
                    </div>
                ) : filteredAvailability.length === 0 ? (
                    <div className="detail-empty-availability">
                        <p className="detail-empty-text">No slots available for the selected day.</p>
                    </div>
                ) : (
                    <div className="detail-availability-grid">
                        {filteredAvailability.map((slot, idx) => (
                            <div key={slot.availabilityId || idx} className="detail-slot-card">
                                <div className="detail-slot-day-badge">
                                    <span className="detail-slot-day">{slot.dayOfTheWeek}</span>
                                </div>
                                <div className="detail-slot-info">
                                    <div className="detail-slot-time">
                                        <span className="detail-time-icon">⏰</span>
                                        <span>{slot.startTime} - {slot.endTime}</span>
                                    </div>
                                    <div className="detail-slot-subject">
                                        <span className="detail-subject-icon-small">📖</span>
                                        <span>{slot.subject || 'General Session'}</span>
                                    </div>
                                </div>
                                <button
                                    className="detail-book-btn"
                                    onClick={() => handleBookSession(slot)}
                                >
                                    Book Session →
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            {showBookingModal && selectedSlot && (
                <div className="detail-modal-overlay" onClick={closeModal}>
                    <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="detail-modal-close" onClick={closeModal}>✖</button>
                        <div className="detail-modal-header">
                            <span className="detail-modal-icon">📅</span>
                            <h3 className="detail-modal-title">Confirm Booking</h3>
                        </div>
                        <div className="detail-modal-content">
                            <div className="detail-modal-detail">
                                <span className="detail-modal-label">Tutor:</span>
                                <span className="detail-modal-value">{tutor.name || 'Expert Tutor'}</span>
                            </div>
                            <div className="detail-modal-detail">
                                <span className="detail-modal-label">Day:</span>
                                <span className="detail-modal-value">{selectedSlot.dayOfTheWeek}</span>
                            </div>
                            <div className="detail-modal-detail">
                                <span className="detail-modal-label">Time:</span>
                                <span className="detail-modal-value">{selectedSlot.startTime} - {selectedSlot.endTime}</span>
                            </div>
                            <div className="detail-modal-detail">
                                <span className="detail-modal-label">Subject:</span>
                                <span className="detail-modal-value">{selectedSlot.subject || 'General'}</span>
                            </div>
                            <div className="detail-modal-detail">
                                <span className="detail-modal-label">Rate:</span>
                                <span className="detail-modal-value highlight">${tutor.hourlyRate}/hour</span>
                            </div>
                        </div>
                        <button className="detail-modal-confirm" onClick={confirmBooking}>
                            Continue to Booking →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TutorDetail;