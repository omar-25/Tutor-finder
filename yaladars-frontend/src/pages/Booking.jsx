import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import './Booking.css';

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tutorFromState  = location.state?.tutor;
  const preferredSlot   = location.state?.preferredSlot;
  const studentId       = localStorage.getItem('userId') || localStorage.getItem('studentId');

  const [formData, setFormData] = useState({
    tutorId:   tutorFromState?.id   || '',
    tutorName: tutorFromState?.name || '',
    studentId: studentId || '',
    subject:   preferredSlot?.subject || '',
    date:      '',
    time:      preferredSlot?.startTime?.substring(0,5) || '',
    duration:  60,
    notes:     '',
  });
  const [errors, setErrors]     = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('new');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (studentId) fetchMyBookings();
  }, [studentId]);

  const fetchMyBookings = async () => {
    if (!studentId) return;
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/student/${studentId}`, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) setBookings(await res.json());
    } catch {}
  };

  const validate = () => {
    const e = {};
    if (!formData.tutorId)  e.tutorId  = 'Please select a tutor';
    if (!formData.subject)  e.subject  = 'Subject is required';
    if (!formData.date)     e.date     = 'Date is required';
    if (!formData.time)     e.time     = 'Time is required';
    if (formData.date) {
      const sel = new Date(formData.date); const today = new Date(); today.setHours(0,0,0,0);
      if (sel < today) e.date = 'Cannot book in the past';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const sid = localStorage.getItem('userId');
    if (!sid) { setErrors({ submit: 'Student ID not found. Please log in again.' }); return; }
    setIsLoading(true);
    setErrors(p => ({ ...p, submit: '' }));
    try {
      const start = new Date(`${formData.date}T${formData.time}`);
      const end   = new Date(start.getTime() + formData.duration * 60000);
      const res = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({
          tutorId: formData.tutorId, studentId: sid,
          subject: formData.subject, startTime: start.toISOString(),
          endTime: end.toISOString(), totalAmount: 0, notes: formData.notes,
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Booking failed');
      setFormData(p => ({ ...p, subject:'', date:'', time:'', duration:60, notes:'' }));
      setSuccessMsg('Session requested successfully!');
      setActiveTab('my');
      await fetchMyBookings();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrors(p => ({ ...p, submit: err.message }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/${bookingId}/cancel`, {
        method: 'PUT', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) { await fetchMyBookings(); setSuccessMsg('Booking cancelled.'); setTimeout(() => setSuccessMsg(''), 3000); }
      else { const err = await res.json(); alert('Failed: ' + (err.message || 'Unknown error')); }
    } catch { alert('Failed to cancel booking'); }
  };

  // Standalone page mode (navigated to directly)
  const isStandalone = location.pathname === '/booking';

  return (
    <div className={`bk-page ${isStandalone ? 'standalone' : 'embedded'}`}>
      {isStandalone && <Navbar />}
      <div className={isStandalone ? 'bk-wrapper container' : 'bk-embedded-wrapper'}>

        {isStandalone && (
          <div className="bk-header">
            <h1 className="page-title">Book a Session</h1>
            <p className="page-subtitle">Schedule your learning session with an expert tutor</p>
          </div>
        )}

        {/* Success toast */}
        {successMsg && (
          <div className="toast toast-success">{successMsg}</div>
        )}

        {/* Tabs */}
        <div className="tabs" style={{ marginBottom: 'var(--space-6)' }}>
          <button className={`tab-btn ${activeTab === 'new' ? 'active' : ''}`} onClick={() => setActiveTab('new')}>
            New Booking
          </button>
          <button className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`} onClick={() => setActiveTab('my')}>
            My Bookings {bookings.length > 0 && <span className="bk-count">{bookings.length}</span>}
          </button>
        </div>

        {/* New booking form */}
        {activeTab === 'new' && (
          <div className="card card-padding animate-fade-in">
            <form onSubmit={handleSubmit} className="bk-form">
              {/* Tutor field */}
              <div className="form-group">
                <label className="form-label">Tutor *</label>
                {tutorFromState ? (
                  <div className="bk-selected-tutor">
                    <div className="bk-tutor-avatar">{formData.tutorName?.charAt(0) || 'T'}</div>
                    <div>
                      <div className="bk-tutor-name">{formData.tutorName}</div>
                      <div className="bk-tutor-id">ID: {formData.tutorId}</div>
                    </div>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/tutors')}>
                      Change
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                    <input name="tutorId" value={formData.tutorId} onChange={handleChange}
                      className={`form-input ${errors.tutorId ? 'input-error' : ''}`} placeholder="Enter Tutor ID" />
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => navigate('/tutors')} style={{whiteSpace:'nowrap'}}>
                      Browse Tutors
                    </button>
                  </div>
                )}
                {errors.tutorId && <span className="error-message">{errors.tutorId}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Subject / Topic *</label>
                <input name="subject" value={formData.subject} onChange={handleChange}
                  className={`form-input ${errors.subject ? 'input-error' : ''}`}
                  placeholder="e.g., Mathematics, Programming, English" />
                {errors.subject && <span className="error-message">{errors.subject}</span>}
              </div>

              <div className="bk-row-3">
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange}
                    className={`form-input ${errors.date ? 'input-error' : ''}`}
                    min={new Date().toISOString().split('T')[0]} />
                  {errors.date && <span className="error-message">{errors.date}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Time *</label>
                  <input type="time" name="time" value={formData.time} onChange={handleChange}
                    className={`form-input ${errors.time ? 'input-error' : ''}`} />
                  {errors.time && <span className="error-message">{errors.time}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <select name="duration" value={formData.duration} onChange={handleChange} className="form-input">
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange}
                  className="form-textarea" rows="3"
                  placeholder="Any specific topics or requirements for this session…" />
              </div>

              {errors.submit && <div className="submit-error">{errors.submit}</div>}

              <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
                {isLoading ? <><span className="spinner" /> Requesting…</> : 'Request Session →'}
              </button>
            </form>
          </div>
        )}

        {/* My bookings */}
        {activeTab === 'my' && (
          <div className="animate-fade-in">
            {bookings.length === 0 ? (
              <div className="empty-state card">
                <div className="empty-state-icon">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                </div>
                <h3>No Bookings Yet</h3>
                <p>You haven't booked any sessions. Create your first one!</p>
                <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('new')}>
                  Book a Session
                </button>
              </div>
            ) : (
              <div className="bk-list">
                {bookings.map(b => (
                  <div key={b.id} className="bk-item card card-padding">
                    <div className="bk-item-header">
                      <div>
                        <h3 className="bk-item-subject">{b.subject}</h3>
                        <span className="bk-item-id">Tutor #{b.tutorId}</span>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                    <div className="bk-item-details">
                      <span>📅 {new Date(b.startTime).toLocaleDateString()}</span>
                      <span>⏰ {new Date(b.startTime).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span>
                      <span>⏱️ {Math.round((new Date(b.endTime) - new Date(b.startTime)) / 60000)} min</span>
                    </div>
                    {b.notes && <p className="bk-item-notes">📝 {b.notes}</p>}
                    {b.rejectionReason && <p className="bk-item-reject">⚠️ {b.rejectionReason}</p>}
                    <div className="bk-item-actions">
                      {b.status === 'ACCEPTED' && (
                        <button className="btn btn-primary btn-sm">Join Session →</button>
                      )}
                      {(b.status === 'PENDING' || b.status === 'ACCEPTED') && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b.id)}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;