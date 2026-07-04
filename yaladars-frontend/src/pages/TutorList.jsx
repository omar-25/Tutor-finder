import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './TutorList.css';

const TutorList = () => {
  const [tutors, setTutors]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [searchTerm, setSearchTerm]       = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [allSubjects, setAllSubjects]     = useState([]);
  const [sortBy, setSortBy]               = useState('default');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/api/tutors')
      .then(res => res.json())
      .then(data => {
        setTutors(data);
        setLoading(false);
        const subjects = new Set();
        data.forEach(t => t.subjects?.forEach(s => subjects.add(s)));
        setAllSubjects(Array.from(subjects).sort());
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = tutors
    .filter(t => {
      const matchSearch = !searchTerm ||
        t.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subjects?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (t.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchSubject = !selectedSubject || t.subjects?.includes(selectedSubject);
      return matchSearch && matchSubject;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.hourlyRate - b.hourlyRate;
      if (sortBy === 'price-desc') return b.hourlyRate - a.hourlyRate;
      return 0;
    });

  const subjectColors = ['#3B4ADB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="tl-page">
      <Navbar />
      <div className="tl-wrapper">
        {/* Page header */}
        <div className="tl-header-bar">
          <div className="container">
            <div className="tl-header-inner">
              <div>
                <h1 className="page-title">Browse Tutors</h1>
                <p className="page-subtitle">
                  {loading ? 'Loading...' : `${filtered.length} tutor${filtered.length !== 1 ? 's' : ''} available`}
                </p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
                ← Back
              </button>
            </div>
          </div>
        </div>

        <div className="container">
          {/* Filters */}
          <div className="tl-filters">
            <div className="tl-search-box">
              <svg className="tl-search-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input
                type="text"
                placeholder="Search by name, subject, or bio…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="tl-search-input"
              />
              {searchTerm && (
                <button className="tl-clear-btn" onClick={() => setSearchTerm('')}>✕</button>
              )}
            </div>

            <select className="tl-filter-select" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
              <option value="">All Subjects</option>
              {allSubjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select className="tl-filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>

          {/* Subject pills */}
          {allSubjects.length > 0 && (
            <div className="tl-subject-pills">
              <button
                className={`tl-pill ${!selectedSubject ? 'active' : ''}`}
                onClick={() => setSelectedSubject('')}
              >All</button>
              {allSubjects.slice(0, 8).map((s, i) => (
                <button
                  key={s}
                  className={`tl-pill ${selectedSubject === s ? 'active' : ''}`}
                  style={selectedSubject === s ? { background: subjectColors[i % subjectColors.length], borderColor: 'transparent', color: 'white' } : {}}
                  onClick={() => setSelectedSubject(selectedSubject === s ? '' : s)}
                >{s}</button>
              ))}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="tl-loading">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="tl-skeleton card">
                  <div className="skeleton" style={{ height: 80, borderRadius: '50%', width: 80, margin: '0 auto 16px' }} />
                  <div className="skeleton" style={{ height: 16, width: '60%', margin: '0 auto 8px' }} />
                  <div className="skeleton" style={{ height: 12, width: '80%', margin: '0 auto' }} />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              </div>
              <h3>No tutors found</h3>
              <p>Try adjusting your search or clearing filters.</p>
              <button className="btn btn-outline btn-sm" onClick={() => { setSearchTerm(''); setSelectedSubject(''); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="tl-grid">
              {filtered.map((tutor, idx) => (
                <div key={tutor.tutorId} className="tl-card card">
                  {/* Rate badge */}
                  <div className="tl-rate-badge">${tutor.hourlyRate}/hr</div>

                  {/* Avatar */}
                  <div className="tl-avatar">
                    {tutor.name ? tutor.name.charAt(0).toUpperCase() : 'T'}
                  </div>

                  {/* Info */}
                  <div className="tl-card-body">
                    <h3 className="tl-tutor-name">{tutor.name || 'Expert Tutor'}</h3>
                    <div className="tl-rating">
                      <span className="tl-stars">★★★★★</span>
                      <span className="tl-rating-val">4.9</span>
                      <span className="tl-review-count">(127)</span>
                    </div>
                    <p className="tl-bio">
                      {tutor.bio?.length > 90 ? tutor.bio.substring(0, 90) + '…' : tutor.bio || 'Experienced tutor ready to help.'}
                    </p>

                    {/* Subjects */}
                    <div className="tl-subjects">
                      {tutor.subjects?.slice(0, 3).map((s, i) => (
                        <span key={i} className="tl-subject-tag"
                          style={{ background: subjectColors[i % subjectColors.length] + '18', color: subjectColors[i % subjectColors.length] }}>
                          {s}
                        </span>
                      ))}
                      {tutor.subjects?.length > 3 && (
                        <span className="tl-subject-tag" style={{ background: 'var(--gray-100)', color: 'var(--gray-500)' }}>
                          +{tutor.subjects.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    className="btn btn-primary btn-full"
                    style={{ margin: '0 var(--space-4) var(--space-4)' }}
                    onClick={() => navigate(`/tutor/${tutor.tutorId}`)}
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorList;