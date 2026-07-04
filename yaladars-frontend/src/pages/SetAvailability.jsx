import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './SetAvailability.css';

const DAYS = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'];
const DAY_SHORT = { MONDAY:'Mon', TUESDAY:'Tue', WEDNESDAY:'Wed', THURSDAY:'Thu', FRIDAY:'Fri', SATURDAY:'Sat', SUNDAY:'Sun' };

const SUBJECT_SUGGESTIONS = [
  'Mathematics','Physics','Chemistry','Biology','English','History',
  'Programming','Web Development','Data Science','Art','Music','Spanish','French'
];

const SetAvailability = () => {
  const { tutorId } = useParams();
  const navigate    = useNavigate();

  const [formData, setFormData] = useState({
    dayOfTheWeek: 'MONDAY',
    startTime: '',
    endTime: '',
    subject: '',
  });
  const [existingSlots, setExistingSlots] = useState([]);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8080/api/availability/tutor/${tutorId}`)
      .then(r => r.json())
      .then(data => setExistingSlots(data))
      .catch(() => {});
  }, [tutorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (error) setError('');
  };

  const validate = () => {
    if (!formData.startTime) { setError('Please select a start time'); return false; }
    if (!formData.endTime)   { setError('Please select an end time');   return false; }
    if (formData.startTime >= formData.endTime) { setError('End time must be after start time'); return false; }
    if (!formData.subject.trim()) { setError('Please enter a subject'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true); setError(''); setSuccess('');

    const payload = {
      ...formData,
      startTime: formData.startTime.includes(':00') ? formData.startTime : formData.startTime + ':00',
      endTime:   formData.endTime.includes(':00')   ? formData.endTime   : formData.endTime   + ':00',
    };

    try {
      const res = await fetch(`http://localhost:8080/api/availability?tutorId=${tutorId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to add availability');
      const newSlot = await res.json();
      setExistingSlots(p => [...p, newSlot]);
      setSuccess('Availability slot added successfully!');
      setShowSuccess(true);
      setFormData({ dayOfTheWeek: 'MONDAY', startTime: '', endTime: '', subject: '' });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (availId) => {
    if (!window.confirm('Remove this slot?')) return;
    try {
      await fetch(`http://localhost:8080/api/availability/${availId}`, { method: 'DELETE' });
      setExistingSlots(p => p.filter(s => s.availabilityId !== availId));
    } catch {}
  };

  const fmt = (t) => t ? t.substring(0, 5) : '';

  return (
    <div className="sa-page">
      <Navbar />
      <div className="sa-wrapper container">
        <button className="btn btn-ghost btn-sm sa-back" onClick={() => navigate('/tutor/dashboard')}>
          ← Back to Dashboard
        </button>

        <div className="sa-layout">
          {/* ── Form ── */}
          <div className="sa-form-panel">
            <div className="card card-padding">
              <div className="sa-form-header">
                <h1 className="sa-title">Set Availability</h1>
                <p className="sa-subtitle">Add your teaching hours so students can book sessions with you.</p>
              </div>

              {error   && <div className="submit-error" style={{marginBottom:'var(--space-4)'}}>{error}</div>}
              {success && <div className="sa-success-banner">{success}</div>}

              <form onSubmit={handleSubmit} className="sa-form">
                {/* Day selector */}
                <div className="form-group">
                  <label className="form-label">Day of Week</label>
                  <div className="sa-day-grid">
                    {DAYS.map(d => (
                      <button
                        key={d}
                        type="button"
                        className={`sa-day-btn ${formData.dayOfTheWeek === d ? 'active' : ''}`}
                        onClick={() => setFormData(p => ({ ...p, dayOfTheWeek: d }))}
                      >
                        {DAY_SHORT[d]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time row */}
                <div className="sa-time-row">
                  <div className="form-group">
                    <label className="form-label">Start Time *</label>
                    <input
                      type="time" name="startTime" value={formData.startTime}
                      onChange={handleChange} className="form-input" required
                    />
                  </div>
                  <div className="sa-time-sep">→</div>
                  <div className="form-group">
                    <label className="form-label">End Time *</label>
                    <input
                      type="time" name="endTime" value={formData.endTime}
                      onChange={handleChange} className="form-input" required
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <input
                    type="text" name="subject"
                    value={formData.subject} onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., Mathematics, Physics"
                    list="subject-list" required
                  />
                  <datalist id="subject-list">
                    {SUBJECT_SUGGESTIONS.map(s => <option key={s} value={s} />)}
                  </datalist>
                  <p className="sa-hint">💡 Type to see suggestions</p>
                </div>

                {/* Live preview */}
                {(formData.startTime || formData.subject) && (
                  <div className="sa-preview">
                    <span className="sa-preview-label">Preview</span>
                    <div className="sa-preview-content">
                      <span className="sa-preview-day">{formData.dayOfTheWeek}</span>
                      <span className="sa-preview-time">
                        {formData.startTime && formData.endTime
                          ? `${fmt(formData.startTime)} – ${fmt(formData.endTime)}`
                          : '—'}
                      </span>
                      <span className="sa-preview-subject">{formData.subject || '—'}</span>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? <><span className="spinner" /> Adding…</> : '+ Add Slot'}
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => navigate('/tutor/dashboard')}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ── Existing slots ── */}
          <div className="sa-slots-panel">
            <div className="sa-slots-header">
              <h2 className="section-title">Your Schedule</h2>
              <span className="sa-slot-count">{existingSlots.length} slot{existingSlots.length !== 1 ? 's' : ''}</span>
            </div>

            {existingSlots.length === 0 ? (
              <div className="sa-empty-slots card card-padding">
                <div style={{ fontSize: 32, marginBottom: 'var(--space-3)' }}>📅</div>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
                  No slots added yet. Add your first availability slot on the left.
                </p>
              </div>
            ) : (
              <div className="sa-slots-list">
                {DAYS.map(day => {
                  const daySlots = existingSlots.filter(s => s.dayOfTheWeek === day);
                  if (daySlots.length === 0) return null;
                  return (
                    <div key={day} className="sa-day-group">
                      <div className="sa-day-group-label">{day}</div>
                      {daySlots.map(slot => (
                        <div key={slot.availabilityId} className="sa-slot-item card">
                          <div className="sa-slot-detail">
                            <span className="sa-slot-time">{fmt(slot.startTime)} – {fmt(slot.endTime)}</span>
                            <span className="sa-slot-subject">{slot.subject}</span>
                          </div>
                          <button
                            className="sa-slot-remove"
                            onClick={() => handleDelete(slot.availabilityId)}
                            aria-label="Remove slot"
                          >✕</button>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetAvailability;