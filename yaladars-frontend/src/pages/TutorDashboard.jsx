import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import './TutorDetails.css';
import './TutorDashboard.css';

const TutorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]     = useState('overview');
  const [tutorId, setTutorId]         = useState(localStorage.getItem('tutorId'));
  const [tutorProfile, setTutorProfile] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData]       = useState({ hourlyRate:'', bio:'', subjects:'' });
  const [isLoading, setIsLoading]     = useState(false);
  const [successMsg, setSuccessMsg]   = useState('');
  const [errorMsg, setErrorMsg]       = useState('');

  const name  = localStorage.getItem('userName')  || 'Tutor';
  const email = localStorage.getItem('userEmail') || '';
  const firstName = localStorage.getItem('userFirstName') || '';

  useEffect(() => {
    if (tutorId) {
      Promise.all([loadTutorProfile(), loadAvailability(), loadBookings()]);
    }
  }, [tutorId]);

  const loadTutorProfile = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/tutors/${tutorId}`);
      if (res.ok) setTutorProfile(await res.json());
    } catch {}
  };
  const loadAvailability = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/availability/tutor/${tutorId}`);
      if (res.ok) setAvailability(await res.json());
    } catch {}
  };
  const loadBookings = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/tutor/${tutorId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAllBookings(data);
        setPendingBookings(data.filter(b => b.status === 'PENDING'));
      }
    } catch {}
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true); setErrorMsg('');
    try {
      const res = await fetch('http://localhost:8080/api/tutors', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({
          hourlyRate: parseFloat(formData.hourlyRate),
          bio:        formData.bio,
          subjects:   formData.subjects.split(',').map(s => s.trim()),
          userId:     localStorage.getItem('userId'),
        }),
      });
      if (!res.ok) throw new Error('Failed to create profile');
      const data = await res.json();
      setTutorId(data.tutorId);
      localStorage.setItem('tutorId', data.tutorId);
      setShowCreateForm(false);
      setSuccessMsg('Profile created successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      loadTutorProfile();
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.');
    } finally { setIsLoading(false); }
  };

  const handleAccept = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/${id}/accept`, {
        method: 'PUT', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) { setSuccessMsg('Booking accepted!'); setTimeout(()=>setSuccessMsg(''),3000); await loadBookings(); }
      else setErrorMsg('Failed to accept.');
    } catch { setErrorMsg('Failed to accept.'); }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Reason for rejection:');
    if (!reason) return;
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/${id}/reject?reason=${encodeURIComponent(reason)}`, {
        method: 'PUT', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) { setSuccessMsg('Booking rejected.'); setTimeout(()=>setSuccessMsg(''),3000); await loadBookings(); }
      else setErrorMsg('Failed to reject.');
    } catch { setErrorMsg('Failed to reject.'); }
  };

  const handleComplete = async (id) => {
    if (!window.confirm('Mark this session as completed?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/${id}/complete`, {
        method: 'PUT', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) { setSuccessMsg('Session marked complete!'); setTimeout(()=>setSuccessMsg(''),3000); await loadBookings(); }
    } catch {}
  };

  const handleDeleteSlot = async (availId) => {
    if (!window.confirm('Remove this availability slot?')) return;
    try {
      await fetch(`http://localhost:8080/api/availability/${availId}`, { method:'DELETE' });
      setAvailability(p => p.filter(a => a.availabilityId !== availId));
      setSuccessMsg('Slot removed.'); setTimeout(()=>setSuccessMsg(''),3000);
    } catch {}
  };

  const fmt = (t) => t ? t.substring(0,5) : '';
  const completed = allBookings.filter(b => b.status === 'COMPLETED');
  const accepted  = allBookings.filter(b => b.status === 'ACCEPTED');

  return (
    <div className="dashboard-layout">
      <Sidebar role="TUTOR" activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="dashboard-main">
        <div className="td2-content">
          {/* Top bar */}
          <div className="sd-topbar">
            <div>
              <h1 className="sd-topbar-title">Welcome, {firstName}!</h1>
              <p className="sd-topbar-subtitle">{email}</p>
            </div>
            {tutorId && (
              <button className="btn btn-primary btn-sm" onClick={() => navigate(`/availability/${tutorId}`)}>
                + Add Availability
              </button>
            )}
          </div>

          {successMsg && <div className="toast toast-success">{successMsg}</div>}
          {errorMsg   && <div className="toast toast-error">{errorMsg}</div>}

          {/* ── Overview ── */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              {/* Stats */}
              {tutorId && (
                <div className="sd-stats-grid">
                  {[
                    { icon:'📅', label:'Available Slots',   value: availability.length, cls:'stat-icon-blue'   },
                    { icon:'📨', label:'Pending Requests',  value: pendingBookings.length, cls:'stat-icon-yellow' },
                    { icon:'✅', label:'Completed Sessions', value: completed.length, cls:'stat-icon-green'  },
                    { icon:'📖', label:'Active Sessions',   value: accepted.length, cls:'stat-icon-blue' },
                  ].map(s => (
                    <div key={s.label} className="stat-card">
                      <div className={`stat-card-icon ${s.cls}`}>{s.icon}</div>
                      <div className="stat-card-value">{s.value}</div>
                      <div className="stat-card-label">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Profile card */}
              <div className="sd-section">
                <div className="section-header">
                  <h2 className="section-title">Tutor Profile</h2>
                  {tutorId && tutorProfile && (
                    <button className="section-action" onClick={() => navigate(`/availability/${tutorId}`)}>+ Add Availability</button>
                  )}
                </div>

                {!tutorId && !showCreateForm && (
                  <div className="card card-padding td2-create-prompt">
                    <div className="td2-create-icon">👨‍🏫</div>
                    <h3>Set Up Your Tutor Profile</h3>
                    <p>Create your tutor profile to start receiving session requests from students.</p>
                    <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>Create Profile</button>
                  </div>
                )}

                {showCreateForm && (
                  <div className="card card-padding animate-fade-in">
                    <h3 style={{marginBottom:'var(--space-5)'}}>Create Tutor Profile</h3>
                    <form onSubmit={handleCreateProfile} style={{display:'flex',flexDirection:'column',gap:'var(--space-4)'}}>
                      <div className="form-group">
                        <label className="form-label">Hourly Rate ($) *</label>
                        <input type="number" className="form-input" placeholder="e.g., 50"
                          value={formData.hourlyRate} onChange={e => setFormData(p=>({...p,hourlyRate:e.target.value}))} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Bio *</label>
                        <textarea className="form-textarea" rows="4"
                          placeholder="Tell students about your teaching experience, qualifications, and approach…"
                          value={formData.bio} onChange={e => setFormData(p=>({...p,bio:e.target.value}))} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Subjects (comma separated) *</label>
                        <input type="text" className="form-input"
                          placeholder="e.g., Mathematics, Physics, Programming"
                          value={formData.subjects} onChange={e => setFormData(p=>({...p,subjects:e.target.value}))} required />
                      </div>
                      {errorMsg && <div className="submit-error">{errorMsg}</div>}
                      <div style={{display:'flex',gap:'var(--space-3)'}}>
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                          {isLoading ? <><span className="spinner"/>Saving…</> : 'Save Profile'}
                        </button>
                        <button type="button" className="btn btn-outline" onClick={() => setShowCreateForm(false)}>Cancel</button>
                      </div>
                    </form>
                  </div>
                )}

                {tutorId && tutorProfile && !showCreateForm && (
                  <div className="card card-padding">
                    <div className="td2-profile-grid">
                      <div className="td2-profile-item">
                        <span className="td2-profile-label">Hourly Rate</span>
                        <span className="td2-profile-value">${tutorProfile.hourlyRate}/hr</span>
                      </div>
                      <div className="td2-profile-item">
                        <span className="td2-profile-label">Bio</span>
                        <span className="td2-profile-value" style={{fontWeight:400,color:'var(--text-secondary)'}}>{tutorProfile.bio}</span>
                      </div>
                      <div className="td2-profile-item">
                        <span className="td2-profile-label">Subjects</span>
                        <div className="td2-subjects">
                          {tutorProfile.subjects?.map((s,i) => (
                            <span key={i} className="td-subject-chip">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pending requests */}
              {tutorId && pendingBookings.length > 0 && (
                <div className="sd-section">
                  <div className="section-header">
                    <h2 className="section-title">Pending Requests <span className="td2-badge">{pendingBookings.length}</span></h2>
                    <button className="section-action" onClick={() => setActiveTab('requests')}>View all →</button>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:'var(--space-3)'}}>
                    {pendingBookings.slice(0,3).map(b => (
                      <div key={b.id} className="card card-padding td2-request-card">
                        <div className="td2-request-info">
                          <h4>{b.subject}</h4>
                          <p className="sd-session-meta">Student #{b.studentId} &nbsp;·&nbsp; {new Date(b.startTime).toLocaleDateString()} {new Date(b.startTime).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})} &nbsp;·&nbsp; {Math.round((new Date(b.endTime)-new Date(b.startTime))/60000)} min</p>
                          {b.notes && <p style={{fontSize:'var(--font-size-sm)',color:'var(--text-muted)',marginTop:4}}>📝 {b.notes}</p>}
                        </div>
                        <div className="td2-request-actions">
                          <button className="btn btn-primary btn-sm" onClick={() => handleAccept(b.id)}>✓ Accept</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleReject(b.id)}>✗ Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Requests tab ── */}
          {activeTab === 'requests' && (
            <div className="animate-fade-in sd-section">
              <div className="section-header">
                <h2 className="section-title">All Booking Requests</h2>
              </div>
              {allBookings.length === 0 ? (
                <div className="empty-state card" style={{padding:'var(--space-10)'}}>
                  <div className="empty-state-icon">📨</div>
                  <h3>No Requests Yet</h3>
                  <p>Students will appear here once they request sessions.</p>
                </div>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:'var(--space-3)'}}>
                  {allBookings.map(b => (
                    <div key={b.id} className="card card-padding td2-request-card">
                      <div className="td2-request-info">
                        <div style={{display:'flex',alignItems:'center',gap:'var(--space-3)',marginBottom:6}}>
                          <h4>{b.subject}</h4>
                          <StatusBadge status={b.status} />
                        </div>
                        <p className="sd-session-meta">
                          Student #{b.studentId} &nbsp;·&nbsp;
                          {new Date(b.startTime).toLocaleDateString()} {new Date(b.startTime).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})} &nbsp;·&nbsp;
                          {Math.round((new Date(b.endTime)-new Date(b.startTime))/60000)} min
                        </p>
                        {b.notes && <p style={{fontSize:'var(--font-size-sm)',color:'var(--text-muted)',marginTop:4}}>📝 {b.notes}</p>}
                        {b.rejectionReason && <p style={{fontSize:'var(--font-size-sm)',color:'var(--error)',marginTop:4}}>Reason: {b.rejectionReason}</p>}
                      </div>
                      <div className="td2-request-actions">
                        {b.status === 'PENDING' && <>
                          <button className="btn btn-primary btn-sm" onClick={() => handleAccept(b.id)}>✓ Accept</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleReject(b.id)}>✗ Reject</button>
                        </>}
                        {b.status === 'ACCEPTED' && (
                          <button className="btn btn-outline btn-sm" onClick={() => handleComplete(b.id)}>Mark Complete</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Sessions ── */}
          {activeTab === 'sessions' && (
            <div className="animate-fade-in sd-section">
              <div className="section-header">
                <h2 className="section-title">Upcoming Sessions</h2>
              </div>
              {/* Availability slots */}
              <div className="section-header" style={{marginTop:'var(--space-6)'}}>
                <h3 className="section-title" style={{fontSize:'var(--font-size-base)'}}>Availability Schedule</h3>
                {tutorId && <button className="btn btn-primary btn-sm" onClick={() => navigate(`/availability/${tutorId}`)}>+ Add Slot</button>}
              </div>
              {availability.length === 0 ? (
                <div className="empty-state card" style={{padding:'var(--space-8)'}}>
                  <p style={{color:'var(--text-muted)'}}>No availability slots yet.</p>
                  {tutorId && <button className="btn btn-primary btn-sm" style={{marginTop:'var(--space-3)'}} onClick={() => navigate(`/availability/${tutorId}`)}>Add First Slot</button>}
                </div>
              ) : (
                <div className="td-slots-grid">
                  {availability.map(slot => (
                    <div key={slot.availabilityId} className="td-slot-card">
                      <div className="td-slot-day">{slot.dayOfTheWeek}</div>
                      <div className="td-slot-time">{fmt(slot.startTime)} — {fmt(slot.endTime)}</div>
                      <div className="td-slot-subject">{slot.subject}</div>
                      <button className="btn btn-danger btn-sm" style={{marginTop:'auto'}} onClick={() => handleDeleteSlot(slot.availabilityId)}>Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Profile tab ── */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in sd-section">
              <h2 className="section-title" style={{marginBottom:'var(--space-5)'}}>My Profile</h2>
              {!tutorId ? (
                <div className="card card-padding td2-create-prompt">
                  <div className="td2-create-icon">👨‍🏫</div>
                  <h3>No Profile Yet</h3>
                  <p>Create your tutor profile to start receiving students.</p>
                  <button className="btn btn-primary" onClick={() => { setActiveTab('overview'); setShowCreateForm(true); }}>Create Profile</button>
                </div>
              ) : tutorProfile ? (
                <div className="card card-padding">
                  <div className="td2-profile-grid">
                    <div className="td2-profile-item"><span className="td2-profile-label">Hourly Rate</span><span className="td2-profile-value">${tutorProfile.hourlyRate}/hr</span></div>
                    <div className="td2-profile-item"><span className="td2-profile-label">Bio</span><span className="td2-profile-value" style={{fontWeight:400,color:'var(--text-secondary)'}}>{tutorProfile.bio}</span></div>
                    <div className="td2-profile-item">
                      <span className="td2-profile-label">Subjects</span>
                      <div className="td2-subjects">{tutorProfile.subjects?.map((s,i)=><span key={i} className="td-subject-chip">{s}</span>)}</div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TutorDashboard;