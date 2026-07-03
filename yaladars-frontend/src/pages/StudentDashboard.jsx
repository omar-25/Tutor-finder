import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import Booking from './Booking';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]   = useState('overview');
  const [user, setUser]             = useState({ firstName:'', lastName:'', email:'', phoneNumber:'', studentId:'' });
  const [isLoading, setIsLoading]   = useState(true);
  const [bookings, setBookings]     = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [formData, setFormData]     = useState({ firstName:'', lastName:'', email:'', phoneNumber:'', currentPassword:'', newPassword:'', confirmPassword:'' });
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const email  = localStorage.getItem('userEmail');
    const token  = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!email || !token) { navigate('/login'); return; }
    setUser({
      firstName:   localStorage.getItem('userFirstName') || '',
      lastName:    localStorage.getItem('userLastName')  || '',
      email,
      phoneNumber: localStorage.getItem('userPhone') || '',
      studentId:   userId,
    });
    setFormData(p => ({
      ...p,
      firstName:   localStorage.getItem('userFirstName') || '',
      lastName:    localStorage.getItem('userLastName')  || '',
      email,
      phoneNumber: localStorage.getItem('userPhone') || '',
    }));
    if (userId) loadBookings(userId).then(() => setIsLoading(false));
    else setIsLoading(false);
  }, [navigate]);

  const loadBookings = async (studentId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/student/${studentId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) setBookings(await res.json());
    } catch {}
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUser(p => ({ ...p, firstName: formData.firstName, lastName: formData.lastName, phoneNumber: formData.phoneNumber }));
    setShowProfileModal(false);
    setSuccessMsg('Profile updated!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Cancel this session?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/${bookingId}/cancel`, {
        method: 'PUT', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        await loadBookings(user.studentId);
        setSuccessMsg('Session cancelled.');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch {}
  };

  if (isLoading && !user.firstName) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', flexDirection:'column', gap:16 }}>
        <div className="spinner spinner-dark" style={{width:36,height:36}} />
        <p style={{color:'var(--text-muted)'}}>Loading dashboard…</p>
      </div>
    );
  }

  const upcoming  = bookings.filter(b => b.status === 'ACCEPTED');
  const pending   = bookings.filter(b => b.status === 'PENDING');
  const completed = bookings.filter(b => b.status === 'COMPLETED');

  return (
    <div className="dashboard-layout">
      <Sidebar role="STUDENT" activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="dashboard-main">
        <div className="sd-content">
          {/* Top bar */}
          <div className="sd-topbar">
            <div>
              <h1 className="sd-topbar-title">Welcome back, {user.firstName}!</h1>
              <p className="sd-topbar-subtitle">Here's what's happening with your learning.</p>
            </div>
            <div className="sd-topbar-actions">
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/tutors')}>
                Find a Tutor
              </button>
              <button className="sd-avatar-btn" onClick={() => setShowProfileModal(true)}>
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </button>
            </div>
          </div>

          {successMsg && <div className="toast toast-success">{successMsg}</div>}

          {/* ── Overview ── */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              {/* Stats */}
              <div className="sd-stats-grid">
                {[
                  { icon: '📚', label: 'Subjects Booked',   value: [...new Set(bookings.map(b=>b.subject))].length, cls: 'stat-icon-blue'   },
                  { icon: '✅', label: 'Completed',          value: completed.length, cls: 'stat-icon-green'  },
                  { icon: '📅', label: 'Upcoming',           value: upcoming.length,  cls: 'stat-icon-yellow' },
                  { icon: '⏳', label: 'Pending',            value: pending.length,   cls: 'stat-icon-red'    },
                ].map(s => (
                  <div key={s.label} className="stat-card">
                    <div className={`stat-card-icon ${s.cls}`}>{s.icon}</div>
                    <div className="stat-card-value">{s.value}</div>
                    <div className="stat-card-label">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Upcoming sessions */}
              <div className="sd-section">
                <div className="section-header">
                  <h2 className="section-title">Upcoming Sessions</h2>
                  <button className="section-action" onClick={() => setActiveTab('sessions')}>View all →</button>
                </div>
                {upcoming.length === 0 ? (
                  <div className="sd-empty-card card card-padding">
                    <p>No upcoming sessions. <button className="sd-inline-link" onClick={() => navigate('/tutors')}>Find a tutor →</button></p>
                  </div>
                ) : (
                  <div className="sd-session-list">
                    {upcoming.slice(0,3).map(b => (
                      <div key={b.id} className="sd-session-card card card-padding">
                        <div className="sd-session-info">
                          <h4 className="sd-session-subject">{b.subject}</h4>
                          <p className="sd-session-meta">
                            📅 {new Date(b.startTime).toLocaleDateString()} &nbsp;
                            ⏰ {new Date(b.startTime).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})} &nbsp;
                            ⏱️ {Math.round((new Date(b.endTime)-new Date(b.startTime))/60000)} min
                          </p>
                        </div>
                        <div className="sd-session-actions">
                          <button className="btn btn-primary btn-sm">Join →</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleCancelBooking(b.id)}>Cancel</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent bookings */}
              <div className="sd-section">
                <div className="section-header">
                  <h2 className="section-title">Recent Bookings</h2>
                  <button className="section-action" onClick={() => setActiveTab('bookings')}>View all →</button>
                </div>
                <div className="sd-table-wrap card">
                  {bookings.length === 0 ? (
                    <div className="sd-empty-card card-padding"><p>No bookings yet.</p></div>
                  ) : (
                    <table className="sd-table">
                      <thead><tr><th>Subject</th><th>Date</th><th>Duration</th><th>Status</th><th></th></tr></thead>
                      <tbody>
                        {bookings.slice(0,5).map(b => (
                          <tr key={b.id}>
                            <td><strong>{b.subject}</strong></td>
                            <td>{new Date(b.startTime).toLocaleDateString()}</td>
                            <td>{Math.round((new Date(b.endTime)-new Date(b.startTime))/60000)} min</td>
                            <td><StatusBadge status={b.status} /></td>
                            <td>
                              {(b.status==='PENDING'||b.status==='ACCEPTED') && (
                                <button className="btn btn-ghost btn-sm" onClick={() => handleCancelBooking(b.id)}>Cancel</button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Sessions ── */}
          {activeTab === 'sessions' && (
            <div className="animate-fade-in">
              <div className="sd-section">
                <div className="section-header">
                  <h2 className="section-title">All Sessions</h2>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate('/tutors')}>Book New Session</button>
                </div>
                {upcoming.length === 0 ? (
                  <div className="empty-state card" style={{padding:'var(--space-10)'}}>
                    <div className="empty-state-icon">📅</div>
                    <h3>No Upcoming Sessions</h3>
                    <p>Schedule a session with a tutor to get started.</p>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/tutors')}>Find Tutors</button>
                  </div>
                ) : upcoming.map(b => (
                  <div key={b.id} className="sd-session-card card card-padding" style={{marginBottom:'var(--space-4)'}}>
                    <div className="sd-session-info">
                      <h4 className="sd-session-subject">{b.subject}</h4>
                      <p className="sd-session-meta">
                        Tutor #{b.tutorId} &nbsp;·&nbsp;
                        {new Date(b.startTime).toLocaleDateString()} &nbsp;
                        {new Date(b.startTime).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})} &nbsp;·&nbsp;
                        {Math.round((new Date(b.endTime)-new Date(b.startTime))/60000)} min
                      </p>
                    </div>
                    <div className="sd-session-actions">
                      <button className="btn btn-primary btn-sm">Join Session →</button>
                      <button className="btn btn-outline btn-sm">Reschedule</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleCancelBooking(b.id)}>Cancel</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Bookings ── */}
          {activeTab === 'bookings' && (
            <div className="animate-fade-in">
              <Booking />
            </div>
          )}

          {/* ── Find / recommended ── */}
          {(activeTab === 'find' || activeTab === 'reviews') && (
            <div className="animate-fade-in" style={{marginTop:'var(--space-6)'}}>
              <div className="sd-redirect-card card card-padding">
                <h2 className="section-title">
                  {activeTab === 'find' ? 'Find Your Perfect Tutor' : 'Your Achievements'}
                </h2>
                <p style={{color:'var(--text-secondary)',marginBottom:'var(--space-5)'}}>
                  {activeTab === 'find'
                    ? 'Browse our expert tutors and book your next session.'
                    : `You've completed ${completed.length} session${completed.length!==1?'s':''}.`}
                </p>
                {activeTab === 'find' && (
                  <button className="btn btn-primary" onClick={() => navigate('/tutors')}>Browse Tutors</button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Profile Settings</h2>
              <button className="modal-close" onClick={() => setShowProfileModal(false)}>✕</button>
            </div>
            <form onSubmit={handleProfileUpdate}>
              <div className="modal-body">
                <div className="sd-profile-avatar">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </div>
                <div className="form-row-2" style={{gap:'var(--space-4)'}}>
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input className="form-input" value={formData.firstName} onChange={e => setFormData(p=>({...p,firstName:e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input className="form-input" value={formData.lastName} onChange={e => setFormData(p=>({...p,lastName:e.target.value}))} />
                  </div>
                </div>
                <div className="form-group" style={{marginTop:'var(--space-4)'}}>
                  <label className="form-label">Email</label>
                  <input className="form-input" value={formData.email} disabled style={{background:'var(--bg-subtle)'}} />
                </div>
                <div className="form-group" style={{marginTop:'var(--space-4)'}}>
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={formData.phoneNumber} onChange={e => setFormData(p=>({...p,phoneNumber:e.target.value}))} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowProfileModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;