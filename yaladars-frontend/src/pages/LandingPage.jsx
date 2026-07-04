import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const statsRef = useRef(null);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role  = localStorage.getItem('userRole');
    if (token) {
      navigate(role === 'TUTOR' ? '/tutor/dashboard' : '/student/dashboard');
    }
  }, [navigate]);

  const features = [
    { icon: '🔍', title: 'Find Tutors Easily',    desc: 'Search by subject, availability, and price to find the perfect match.' },
    { icon: '📅', title: 'Flexible Scheduling',   desc: 'Book sessions around your schedule. Cancel or reschedule anytime.' },
    { icon: '💳', title: 'Secure Payments',        desc: 'Pay safely per session with full refund protection.' },
    { icon: '⭐', title: 'Verified Experts',        desc: 'Every tutor is reviewed by our team before going live.' },
    { icon: '📱', title: 'Real-time Updates',      desc: 'Get instant notifications on bookings, confirmations, and reminders.' },
    { icon: '🏆', title: 'Track Progress',          desc: 'Monitor sessions completed, subjects covered, and milestones reached.' },
  ];

  const steps = [
    { num: '01', title: 'Create an Account',  desc: 'Sign up as a student in seconds.' },
    { num: '02', title: 'Find Your Tutor',    desc: 'Browse tutors, read reviews, and check availability.' },
    { num: '03', title: 'Book a Session',     desc: 'Request a session — your tutor confirms and you\'re set.' },
    { num: '04', title: 'Start Learning',     desc: 'Attend your session and leave a review.' },
  ];

  const tutorSteps = [
    { num: '01', title: 'Create a Profile',   desc: 'Sign up as a tutor and complete your profile.' },
    { num: '02', title: 'Get Approved',       desc: 'Our team reviews your profile to ensure quality.' },
    { num: '03', title: 'Set Availability',   desc: 'Add your available time slots and hourly rate.' },
    { num: '04', title: 'Teach & Earn',       desc: 'Accept session requests and receive payments.' },
  ];

  return (
    <div className="landing">
      <Navbar />

      {/* ─── Hero ─── */}
      <section className="landing-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">Connect. Learn. Grow.</div>
            <h1 className="hero-title">
              Find the Right Tutor<br />
              <span className="hero-highlight">for Every Subject</span>
            </h1>
            <p className="hero-subtitle">
              YalaDars connects students with verified expert tutors for personalized
              1-on-1 learning sessions — on your schedule.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
              <Link to="/tutors" className="btn btn-outline btn-lg">
                Browse Tutors
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-value">500+</span>
                <span className="hero-stat-label">Expert Tutors</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-value">12k+</span>
                <span className="hero-stat-label">Sessions Completed</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-value">4.9★</span>
                <span className="hero-stat-label">Average Rating</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card hero-card-main">
              <div className="hero-card-avatar">A</div>
              <div>
                <div className="hero-card-name">Ahmed Khalil</div>
                <div className="hero-card-role">Mathematics Tutor</div>
              </div>
              <div className="hero-card-rating">⭐ 4.9</div>
            </div>
            <div className="hero-card hero-card-booking">
              <div className="hero-card-icon">📅</div>
              <div>
                <div className="hero-card-label">Next Session</div>
                <div className="hero-card-value">Today, 4:00 PM</div>
              </div>
            </div>
            <div className="hero-card hero-card-subject">
              <div className="subject-tags">
                <span className="subject-tag">Mathematics</span>
                <span className="subject-tag">Physics</span>
                <span className="subject-tag">Chemistry</span>
              </div>
            </div>
            <div className="hero-bg-shape" />
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="landing-section">
        <div className="container">
          <div className="section-label">Why YalaDars</div>
          <h2 className="landing-section-title">Everything you need to learn effectively</h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card card card-padding">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works — Students ─── */}
      <section className="landing-section landing-section-alt">
        <div className="container">
          <div className="how-it-works">
            <div className="how-header">
              <div className="section-label">For Students</div>
              <h2 className="landing-section-title">Start learning in 4 simple steps</h2>
            </div>
            <div className="steps-grid">
              {steps.map((s, i) => (
                <div key={i} className="step-card">
                  <div className="step-num">{s.num}</div>
                  <h3 className="step-title">{s.title}</h3>
                  <p className="step-desc">{s.desc}</p>
                  {i < steps.length - 1 && <div className="step-connector" />}
                </div>
              ))}
            </div>
            <div className="how-cta">
              <Link to="/register" className="btn btn-primary btn-lg">
                Start as a Student
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works — Tutors ─── */}
      <section className="landing-section">
        <div className="container">
          <div className="how-it-works">
            <div className="how-header">
              <div className="section-label">For Tutors</div>
              <h2 className="landing-section-title">Share your knowledge and earn</h2>
            </div>
            <div className="steps-grid">
              {tutorSteps.map((s, i) => (
                <div key={i} className="step-card tutor-step">
                  <div className="step-num tutor">{s.num}</div>
                  <h3 className="step-title">{s.title}</h3>
                  <p className="step-desc">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="how-cta">
              <Link to="/register" className="btn btn-outline btn-lg">
                Become a Tutor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="landing-cta">
        <div className="container">
          <div className="cta-box">
            <h2 className="cta-title">Ready to start learning?</h2>
            <p className="cta-subtitle">Join thousands of students already using YalaDars.</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
              <Link to="/login"    className="btn btn-outline btn-lg" style={{color:'white', borderColor:'rgba(255,255,255,0.4)'}}>Sign In</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <div className="sidebar-logo-icon" style={{display:'inline-flex',width:'28px',height:'28px',background:'var(--primary)',color:'white',borderRadius:'6px',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'15px'}}>Y</div>
              <span style={{fontWeight:700,fontSize:'16px',color:'var(--text-primary)',marginLeft:'8px'}}>YalaDars</span>
              <p style={{fontSize:'13px',color:'var(--text-muted)',marginTop:'8px',maxWidth:'220px'}}>Connecting students with expert tutors for personalized learning.</p>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <div className="footer-col-title">Platform</div>
                <Link to="/tutors"   className="footer-link">Browse Tutors</Link>
                <Link to="/register" className="footer-link">Sign Up</Link>
                <Link to="/login"    className="footer-link">Sign In</Link>
              </div>
              <div className="footer-col">
                <div className="footer-col-title">Legal</div>
                <Link to="/terms"   className="footer-link">Terms of Service</Link>
                <Link to="/privacy" className="footer-link">Privacy Policy</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2025 YalaDars. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
