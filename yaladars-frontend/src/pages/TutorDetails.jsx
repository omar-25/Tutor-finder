import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './TutorDetails.css';

const DAYS = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'];

const TutorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutor, setTutor]           = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selectedDay, setSelectedDay] = useState('all');
  const [showModal, setShowModal]   = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:8080/api/tutors/${id}`).then(r => r.json()),
      fetch(`http://localhost:8080/api/availability/tutor/${id}`).then(r => r.json()),
    ])
      .then(([t, a]) => { setTutor(t); setAvailability(a); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const filtered = selectedDay === 'all'
    ? availability
    : availability.filter(s => s.dayOfTheWeek === selectedDay);

  const handleBook = (slot) => { setSelectedSlot(slot); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setSelectedSlot(null); };

  const confirmBooking = () => {
    closeModal();
    navigate('/booking', {
      state: {
        tutor: { id: tutor.tutorId, name: tutor.name },
        preferredSlot: selectedSlot ? {
          day: selectedSlot.dayOfTheWeek,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          subject: selectedSlot.subject,
        } : null,
      }
    });
  };

  if (loading) return (
    <div className="td-page"><Navbar />
      <div className="td-loading-wrap">
        <div className="spinner spinner-dark" style={{width:36,height:36}} />
        <p>Loading tutor profile…</p>
      </div>
    </div>
  );

  if (!tutor) return (
    <div className="td-page"><Navbar />
      <div className="empty-state" style={{marginTop: 120}}>
        <div className="empty-state-icon">😕</div>
        <h3>Tutor Not Found</h3>
        <p>This tutor doesn't exist or has been removed.</p>
        <button className="btn btn-outline" onClick={() => navigate('/tutors')}>Browse Tutors</button>
      </div>
    </div>
  );

  return (
    <div className="td-page">
      <Navbar />
      <div className="td-wrapper">
        <div className="container">
          <button className="btn btn-ghost btn-sm td-back" onClick={() => navigate('/tutors')}>
            ← Back to Tutors
          </button>

          {/* Profile header */}
          <div className="td-hero card card-padding">
            <div className="td-hero-avatar">
              {tutor.name ? tutor.name.charAt(0).toUpperCase() : 'T'}
            </div>
            <div className="td-hero-info">
              <div className="badge badge-accepted" style={{width:'fit-content',marginBottom:8}}>✓ Verified Tutor</div>
              <h1 className="td-hero-name">{tutor.name || 'Expert Tutor'}</h1>
              <p className="td-hero-bio">{tutor.bio}</p>
              <div className="td-hero-meta">
                <div className="td-meta-item">
                  <span className="td-meta-label">Rating</span>
                  <span className="td-meta-value">⭐ 4.9 <span style={{color:'var(--text-muted)',fontWeight:400}}>(127 reviews)</span></span>
                </div>
                <div className="td-meta-divider" />
                <div className="td-meta-item">
                  <span className="td-meta-label">Hourly Rate</span>
                  <span className="td-meta-value">${tutor.hourlyRate}<span style={{color:'var(--text-muted)',fontWeight:400}}>/hr</span></span>
                </div>
                <div className="td-meta-divider" />
                <div className="td-meta-item">
                  <span className="td-meta-label">Subjects</span>
                  <span className="td-meta-value">{tutor.subjects?.length || 0}</span>
                </div>
                <div className="td-meta-divider" />
                <div className="td-meta-item">
                  <span className="td-meta-label">Available Slots</span>
                  <span className="td-meta-value">{availability.length}</span>
                </div>
              </div>
            </div>
            <div className="td-hero-action">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/booking', { state: { tutor: { id: tutor.tutorId, name: tutor.name } } })}>
                Book a Session
              </button>
            </div>
          </div>

          <div className="td-content">
            {/* Subjects */}
            <div className="card card-padding td-section">
              <h2 className="section-title">Subjects Taught</h2>
              <div className="td-subjects">
                {tutor.subjects?.map((s, i) => (
                  <div key={i} className="td-subject-chip">{s}</div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="card card-padding td-section">
              <h2 className="section-title">Availability Schedule</h2>

              {/* Day filter */}
              <div className="td-day-filter">
                <button className={`tl-pill ${selectedDay === 'all' ? 'active' : ''}`} onClick={() => setSelectedDay('all')}>
                  All Days
                </button>
                {DAYS.map(d => (
                  <button key={d} className={`tl-pill ${selectedDay === d ? 'active' : ''}`} onClick={() => setSelectedDay(d)}>
                    {d.charAt(0) + d.slice(1,3).toLowerCase()}
                  </button>
                ))}
              </div>

              {filtered.length === 0 ? (
                <div className="empty-state" style={{padding:'32px 0'}}>
                  <p style={{color:'var(--text-muted)',fontSize:'var(--font-size-sm)'}}>
                    {availability.length === 0 ? 'No availability added yet.' : 'No slots for this day.'}
                  </p>
                </div>
              ) : (
                <div className="td-slots-grid">
                  {filtered.map((slot, i) => (
                    <div key={slot.availabilityId || i} className="td-slot-card">
                      <div className="td-slot-day">{slot.dayOfTheWeek}</div>
                      <div className="td-slot-time">
                        {slot.startTime?.substring(0,5)} — {slot.endTime?.substring(0,5)}
                      </div>
                      <div className="td-slot-subject">{slot.subject || 'General'}</div>
                      <button className="btn btn-primary btn-sm td-slot-btn" onClick={() => handleBook(slot)}>
                        Book →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking confirmation modal */}
      {showModal && selectedSlot && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Confirm Booking</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="td-modal-details">
                {[
                  ['Tutor',   tutor.name || 'Expert Tutor'],
                  ['Day',     selectedSlot.dayOfTheWeek],
                  ['Time',    `${selectedSlot.startTime?.substring(0,5)} — ${selectedSlot.endTime?.substring(0,5)}`],
                  ['Subject', selectedSlot.subject || 'General'],
                  ['Rate',    `$${tutor.hourlyRate}/hr`],
                ].map(([k,v]) => (
                  <div key={k} className="td-modal-row">
                    <span className="td-modal-label">{k}</span>
                    <span className="td-modal-value">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={confirmBooking}>Continue to Booking →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorDetails;