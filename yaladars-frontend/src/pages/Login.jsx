import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Register.css';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData]   = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors]       = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Enter a valid email';
    if (!formData.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setErrors(p => ({ ...p, submit: '' }));

    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid email or password');

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

      navigate(data.role === 'STUDENT' ? '/student/dashboard' : '/tutor/dashboard');
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
            <h2>Welcome back to YalaDars.</h2>
            <p>Sign in to continue your learning journey and connect with your tutors.</p>
            <div className="auth-panel-features">
              {['Access your bookings', 'Message your tutors', 'Track your progress', 'Manage your schedule'].map(f => (
                <div key={f} className="auth-panel-feature">
                  <div className="auth-feature-check">✓</div>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="auth-panel auth-panel-right">
          <div className="auth-form-wrapper">
            <div className="auth-form-header">
              <h1 className="auth-form-title">Sign In</h1>
              <p className="auth-form-subtitle">New here? <Link to="/register">Create an account</Link></p>
            </div>

            <form onSubmit={handleSubmit} className="auth-step-content">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="you@example.com" autoComplete="email" />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">Password</label>
                  <Link to="/forgot-password" className="login-forgot">Forgot password?</Link>
                </div>
                <div className="password-wrapper">
                  <input type={showPassword ? 'text' : 'password'} name="password"
                    value={formData.password} onChange={handleChange}
                    className={`form-input ${errors.password ? 'input-error' : ''}`}
                    placeholder="Your password" autoComplete="current-password" />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(p => !p)}>
                    {showPassword
                      ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <label className="checkbox-label">
                <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />
                <span>Remember me for 30 days</span>
              </label>

              {errors.submit && <div className="submit-error">{errors.submit}</div>}

              <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
                {isLoading ? <><span className="spinner" /> Signing in...</> : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;