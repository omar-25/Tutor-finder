import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phoneNumber: '',
    password: '', confirmPassword: '', role: 'STUDENT', agreeToTerms: false
  });
  const [errors, setErrors]           = useState({});
  const [isLoading, setIsLoading]     = useState(false);
  const [showPassword, setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calcStrength = (pw) => {
    let s = 0;
    if (pw.length >= 8)              s++;
    if (/[a-z]/.test(pw))            s++;
    if (/[A-Z]/.test(pw))            s++;
    if (/[0-9]/.test(pw))            s++;
    if (/[$@#&!]/.test(pw))          s++;
    return s;
  };

  const strengthLabel = ['', 'Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', '#EF4444','#EF4444','#F59E0B','#10B981','#3B4ADB'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(p => ({ ...p, [name]: val }));
    if (name === 'password') setPasswordStrength(calcStrength(value));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validateStep1 = () => {
    const e = {};
    if (!formData.firstName.trim()) e.firstName = 'Required';
    if (!formData.lastName.trim())  e.lastName  = 'Required';
    if (!formData.email.trim()) {
      e.email = 'Required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      e.email = 'Enter a valid email';
    }
    if (!formData.phoneNumber.trim()) {
      e.phoneNumber = 'Required';
    } else if (formData.phoneNumber.replace(/\D/g,'').length < 8) {
      e.phoneNumber = 'Enter a valid phone number';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!formData.password) {
      e.password = 'Required';
    } else if (formData.password.length < 8) {
      e.password = 'At least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      e.password = 'Need uppercase, lowercase, and a number';
    }
    if (formData.password !== formData.confirmPassword) {
      e.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeToTerms) e.agreeToTerms = 'Please accept the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setIsLoading(true);
    setErrors(p => ({ ...p, submit: '' }));
    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName:  formData.lastName,
          email:     formData.email,
          phoneNumber: formData.phoneNumber,
          password:  formData.password,
          role:      formData.role,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed. Please try again.');

      localStorage.clear();
      localStorage.setItem('token',     data.token);
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userRole',  data.role);

      const userRes = await fetch(`http://localhost:8080/api/users/email/${data.email}`, {
        headers: { 'Authorization': `Bearer ${data.token}` }
      });
      if (userRes.ok) {
        const ud = await userRes.json();
        localStorage.setItem('userId',        ud.id);
        localStorage.setItem('userFirstName', ud.firstName);
        localStorage.setItem('userLastName',  ud.lastName);
        localStorage.setItem('userPhone',     ud.phoneNumber);
        localStorage.setItem('userName',      `${ud.firstName} ${ud.lastName}`);
      }

      navigate(formData.role === 'STUDENT' ? '/student/dashboard' : '/tutor/dashboard');
    } catch (err) {
      setErrors(p => ({ ...p, submit: err.message || 'Cannot connect to server.' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-container">
        {/* Left panel */}
        <div className="auth-panel auth-panel-left">
          <div className="auth-panel-content">
            <div className="auth-panel-logo">
              <div className="auth-panel-logo-icon">Y</div>
              <span>YalaDars</span>
            </div>
            <h2>Start your learning journey today.</h2>
            <p>Join thousands of students and tutors connecting on YalaDars.</p>
            <div className="auth-panel-features">
              {['Verified expert tutors', 'Flexible scheduling', 'Secure payments', 'Real-time notifications'].map(f => (
                <div key={f} className="auth-panel-feature">
                  <div className="auth-feature-check">✓</div>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="auth-panel auth-panel-right">
          <div className="auth-form-wrapper">
            <div className="auth-form-header">
              <h1 className="auth-form-title">Create Account</h1>
              <p className="auth-form-subtitle">Already have one? <Link to="/login">Sign in</Link></p>
            </div>

            {/* Step indicator */}
            <div className="auth-steps">
              <div className={`auth-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>
                <div className="auth-step-dot">1</div>
                <span>Info</span>
              </div>
              <div className="auth-step-line" />
              <div className={`auth-step ${step >= 2 ? 'active' : ''}`}>
                <div className="auth-step-dot">2</div>
                <span>Security</span>
              </div>
            </div>

            {/* Role selector — always visible */}
            <div className="role-selector">
              {[
                { value: 'STUDENT', label: 'Student', icon: '🎓', desc: 'Find tutors & learn' },
                { value: 'TUTOR',   label: 'Tutor',   icon: '👨‍🏫', desc: 'Share knowledge & earn' },
              ].map(r => (
                <button
                  key={r.value}
                  type="button"
                  className={`role-btn ${formData.role === r.value ? 'active' : ''}`}
                  onClick={() => setFormData(p => ({ ...p, role: r.value }))}
                >
                  <span className="role-icon">{r.icon}</span>
                  <span className="role-label">{r.label}</span>
                  <span className="role-desc">{r.desc}</span>
                </button>
              ))}
            </div>

            {/* Step 1 */}
            {step === 1 && (
              <div className="auth-step-content animate-fade-in">
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">First Name *</label>
                    <input name="firstName" value={formData.firstName} onChange={handleChange}
                      className={`form-input ${errors.firstName ? 'input-error' : ''}`} placeholder="Ahmed" />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name *</label>
                    <input name="lastName" value={formData.lastName} onChange={handleChange}
                      className={`form-input ${errors.lastName ? 'input-error' : ''}`} placeholder="Khalil" />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange}
                    className={`form-input ${errors.email ? 'input-error' : ''}`} placeholder="you@example.com" />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                    className={`form-input ${errors.phoneNumber ? 'input-error' : ''}`} placeholder="+20 1xx xxx xxxx" />
                  {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                </div>
                <button type="button" className="btn btn-primary btn-full" onClick={handleNext}>
                  Continue →
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="auth-step-content animate-fade-in">
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <div className="password-wrapper">
                    <input type={showPassword ? 'text' : 'password'} name="password"
                      value={formData.password} onChange={handleChange}
                      className={`form-input ${errors.password ? 'input-error' : ''}`}
                      placeholder="Create a strong password" />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword(p => !p)}>
                      {showPassword
                        ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                  {formData.password && (
                    <div className="pw-strength">
                      <div className="pw-bars">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className="pw-bar"
                            style={{ background: i <= passwordStrength ? strengthColor[passwordStrength] : 'var(--gray-200)' }} />
                        ))}
                      </div>
                      <span style={{ fontSize: '11px', color: strengthColor[passwordStrength] }}>
                        {strengthLabel[passwordStrength]}
                      </span>
                    </div>
                  )}
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <div className="password-wrapper">
                    <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword"
                      value={formData.confirmPassword} onChange={handleChange}
                      className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                      placeholder="Confirm your password" />
                    <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(p => !p)}>
                      {showConfirmPassword
                        ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>

                <label className="checkbox-label">
                  <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} />
                  <span>I agree to the <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link></span>
                </label>
                {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}

                {errors.submit && <div className="submit-error">{errors.submit}</div>}

                <div className="auth-step-nav">
                  <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? <><span className="spinner" />Creating...</> : 'Create Account'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;