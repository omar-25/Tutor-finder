import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TutorList.css';

const TutorList = () => {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [allSubjects, setAllSubjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/api/tutors')
            .then(res => res.json())
            .then(data => {
                setTutors(data);
                setLoading(false);
                // Extract unique subjects from all tutors
                const subjects = new Set();
                data.forEach(tutor => {
                    tutor.subjects?.forEach(subject => subjects.add(subject));
                });
                setAllSubjects(Array.from(subjects).sort());
            })
            .catch(err => { console.error(err); setLoading(false); });
    }, []);

    const filteredTutors = tutors.filter(tutor => {
        const matchesSearch = tutor.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tutor.subjects?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesSubject = !selectedSubject || tutor.subjects?.includes(selectedSubject);
        return matchesSearch && matchesSubject;
    });

    return (
        <div className="tutorlist-page">
            {/* Hero Section */}
            <div className="tutorlist-hero">
                <div className="tutorlist-hero-content">
                    <div className="tutorlist-hero-badge">
                        <span>🌟 Expert Tutors</span>
                    </div>
                    <h1 className="tutorlist-hero-title">
                        Find Your Perfect<br />
                        <span className="tutorlist-hero-highlight">Learning Companion</span>
                    </h1>
                    <p className="tutorlist-hero-subtitle">
                        Connect with experienced tutors who are passionate about teaching
                    </p>
                    <button className="tutorlist-back-btn" onClick={() => navigate('/student/dashboard')}>
                        ← Back to Dashboard
                    </button>
                </div>
                <div className="tutorlist-hero-stats">
                    <div className="tutorlist-stat">
                        <div className="tutorlist-stat-number">{tutors.length}</div>
                        <div className="tutorlist-stat-label">Available Tutors</div>
                    </div>
                    <div className="tutorlist-stat">
                        <div className="tutorlist-stat-number">{allSubjects.length}</div>
                        <div className="tutorlist-stat-label">Subjects</div>
                    </div>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="tutorlist-filters">
                <div className="tutorlist-search-box">
                    <span className="tutorlist-search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search by name or subject..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="tutorlist-search-input"
                    />
                    {searchTerm && (
                        <button className="tutorlist-clear-btn" onClick={() => setSearchTerm('')}>✖</button>
                    )}
                </div>

                <select
                    className="tutorlist-subject-filter"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                >
                    <option value="">All Subjects</option>
                    {allSubjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                    ))}
                </select>
            </div>

            {/* Results Count */}
            {!loading && (
                <div className="tutorlist-results-count">
                    Showing {filteredTutors.length} {filteredTutors.length === 1 ? 'tutor' : 'tutors'}
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="tutorlist-loading-container">
                    <div className="tutorlist-spinner"></div>
                    <p className="tutorlist-loading-text">Loading amazing tutors...</p>
                </div>
            ) : filteredTutors.length === 0 ? (
                <div className="tutorlist-empty-state">
                    <div className="tutorlist-empty-icon">🔍</div>
                    <h3 className="tutorlist-empty-title">No tutors found</h3>
                    <p className="tutorlist-empty-text">Try adjusting your search or filters</p>
                    <button className="tutorlist-reset-btn" onClick={() => { setSearchTerm(''); setSelectedSubject(''); }}>
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="tutorlist-grid">
                    {filteredTutors.map(tutor => (
                        <div key={tutor.tutorId} className="tutorlist-card">
                            <div className="tutorlist-card-badge">
                                <span className="tutorlist-card-rate">${tutor.hourlyRate}/hr</span>
                            </div>
                            <div className="tutorlist-card-avatar">
                                <div className="tutorlist-avatar-icon">👨‍🏫</div>
                            </div>
                            <div className="tutorlist-card-content">
                                <h3 className="tutorlist-card-name">
                                    {tutor.name || 'Expert Tutor'}
                                </h3>
                                <p className="tutorlist-card-bio">
                                    {tutor.bio?.length > 100 ? tutor.bio.substring(0, 100) + '...' : tutor.bio}
                                </p>
                                <div className="tutorlist-card-subjects">
                                    {tutor.subjects?.slice(0, 3).map((subject, idx) => (
                                        <span key={idx} className="tutorlist-subject-tag">{subject}</span>
                                    ))}
                                    {tutor.subjects?.length > 3 && (
                                        <span className="tutorlist-subject-tag">+{tutor.subjects.length - 3}</span>
                                    )}
                                </div>
                                <div className="tutorlist-card-stats">
                                    <div className="tutorlist-stat-item">
                                        <span>⭐</span> 4.9
                                    </div>
                                    <div className="tutorlist-stat-item">
                                        <span>📚</span> {tutor.subjects?.length || 0} subjects
                                    </div>
                                </div>
                                <button
                                    className="tutorlist-view-btn"
                                    onClick={() => navigate(`/tutor/${tutor.tutorId}`)}
                                >
                                    View Profile →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TutorList;