import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './SetAvailability.css';

const SetAvailability = () => {
    const { tutorId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        dayOfTheWeek: 'MONDAY',
        startTime: '',
        endTime: '',
        subject: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

    // Common subjects suggestions
    const subjectSuggestions = [
        'Mathematics', 'Physics', 'Chemistry', 'Biology',
        'English', 'History', 'Programming', 'Web Development',
        'Data Science', 'Art', 'Music', 'Spanish', 'French'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear messages when user starts typing
        if (error) setError('');
        if (success) setSuccess('');
    };

    const validateForm = () => {
        if (!formData.startTime) {
            setError('Please select a start time');
            return false;
        }
        if (!formData.endTime) {
            setError('Please select an end time');
            return false;
        }
        if (formData.startTime >= formData.endTime) {
            setError('End time must be after start time');
            return false;
        }
        if (!formData.subject.trim()) {
            setError('Please enter a subject');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setError('');
        setSuccess('');

        const availabilityData = {
            ...formData,
            startTime: formData.startTime.includes(':00') ? formData.startTime : formData.startTime + ':00',
            endTime: formData.endTime.includes(':00') ? formData.endTime : formData.endTime + ':00',
        };

        try {
            const response = await fetch(`http://localhost:8080/api/availability?tutorId=${tutorId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(availabilityData),
            });

            if (!response.ok) throw new Error('Failed to add availability');

            await response.json();
            setSuccess('✓ Availability slot added successfully!');

            // Reset form after successful submission
            setTimeout(() => {
                setFormData({
                    dayOfTheWeek: 'MONDAY',
                    startTime: '',
                    endTime: '',
                    subject: '',
                });
                setSuccess('');
            }, 2000);
        } catch (err) {
            setError('❌ Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddAnother = () => {
        setFormData({
            dayOfTheWeek: 'MONDAY',
            startTime: '',
            endTime: '',
            subject: '',
        });
        setShowPreview(false);
        setSuccess('');
    };

    const formatTimeForDisplay = (time) => {
        if (!time) return '';
        return time.substring(0, 5);
    };

    return (
        <div className="avail-page">
            <div className="avail-container">
                {/* Back Navigation */}
                <button className="avail-back-btn" onClick={() => navigate('/tutor/dashboard')}>
                    ← Back to Dashboard
                </button>

                {/* Main Card */}
                <div className="avail-card">
                    <div className="avail-header">
                        <div className="avail-icon">📅</div>
                        <div>
                            <h1 className="avail-title">Set Availability</h1>
                            <p className="avail-subtitle">Add your teaching hours so students can book sessions</p>
                        </div>
                    </div>

                    {/* Notifications */}
                    {error && (
                        <div className="avail-notification error">
                            <span className="avail-notif-icon">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="avail-notification success">
                            <span className="avail-notif-icon">✅</span>
                            <span>{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Day Selection */}
                        <div className="avail-form-group">
                            <label className="avail-label">
                                <span className="label-icon">📆</span>
                                Day of Week
                            </label>
                            <div className="avail-day-grid">
                                {days.map(day => (
                                    <button
                                        key={day}
                                        type="button"
                                        className={`avail-day-btn ${formData.dayOfTheWeek === day ? 'active' : ''}`}
                                        onClick={() => setFormData(prev => ({ ...prev, dayOfTheWeek: day }))}
                                    >
                                        {day.substring(0, 3)}
                                        <span className="day-full">{day.substring(3)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Time Selection - Modern dual input */}
                        <div className="avail-time-row">
                            <div className="avail-form-group half">
                                <label className="avail-label">
                                    <span className="label-icon">⏰</span>
                                    Start Time
                                </label>
                                <div className="avail-time-input-wrapper">
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleInputChange}
                                        className="avail-input time-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="avail-form-group half">
                                <label className="avail-label">
                                    <span className="label-icon">⏰</span>
                                    End Time
                                </label>
                                <div className="avail-time-input-wrapper">
                                    <input
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleInputChange}
                                        className="avail-input time-input"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Subject with suggestions */}
                        <div className="avail-form-group">
                            <label className="avail-label">
                                <span className="label-icon">📚</span>
                                Subject
                            </label>
                            <input
                                type="text"
                                name="subject"
                                placeholder="e.g., Mathematics, Physics, Programming"
                                value={formData.subject}
                                onChange={handleInputChange}
                                className="avail-input"
                                required
                                list="subject-suggestions"
                            />
                            <datalist id="subject-suggestions">
                                {subjectSuggestions.map(sub => (
                                    <option key={sub} value={sub} />
                                ))}
                            </datalist>
                            <p className="avail-hint">✨ Popular subjects appear as suggestions</p>
                        </div>

                        {/* Live Preview (when fields are partially filled) */}
                        {(formData.startTime || formData.endTime || formData.subject) && (
                            <div className="avail-preview">
                                <div className="avail-preview-header">
                                    <span>👀</span>
                                    <span>Preview</span>
                                </div>
                                <div className="avail-preview-content">
                                    <div className="preview-day">{formData.dayOfTheWeek}</div>
                                    <div className="preview-time">
                                        {formData.startTime && formData.endTime
                                            ? `${formatTimeForDisplay(formData.startTime)} - ${formatTimeForDisplay(formData.endTime)}`
                                            : 'Select time'}
                                    </div>
                                    <div className="preview-subject">
                                        {formData.subject || 'Subject'}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="avail-actions">
                            <button
                                type="submit"
                                className="avail-submit-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner-small"></span>
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        ✨ Add Availability Slot
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                className="avail-cancel-btn"
                                onClick={() => navigate('/tutor/dashboard')}
                            >
                                Cancel
                            </button>
                        </div>

                        {/* Quick tip */}
                        <div className="avail-tip">
                            <span className="tip-icon">💡</span>
                            <span className="tip-text">
                                Tip: Add multiple slots for different days to maximize your visibility to students
                            </span>
                        </div>
                    </form>
                </div>

                {/* Success Modal (optional) */}
                {success && (
                    <div className="avail-success-overlay" onClick={() => setSuccess('')}>
                        <div className="avail-success-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="success-icon">🎉</div>
                            <h3>Availability Added!</h3>
                            <p>Your slot has been successfully added to your schedule.</p>
                            <div className="success-actions">
                                <button className="success-btn" onClick={handleAddAnother}>
                                    Add Another Slot
                                </button>
                                <button className="success-btn secondary" onClick={() => navigate('/tutor/dashboard')}>
                                    Go to Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SetAvailability;