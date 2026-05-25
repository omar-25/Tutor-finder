import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
        role: 'STUDENT'
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const targetValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: targetValue
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setErrors(prev => ({ ...prev, submit: '' }));

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),

            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Invalid email or password');
            }

            // Store auth data
            localStorage.setItem('token', data.token);
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('userRole', data.role);

            // Fetch user profile to get ID
            const userResponse = await fetch(`http://localhost:8080/api/users/email/${data.email}`, {
                headers: { 'Authorization': `Bearer ${data.token}` }
            });

            if (userResponse.ok) {
                const userData = await userResponse.json();
                console.log(userData.id)
                localStorage.setItem('userId', userData.id);
                localStorage.setItem('userFirstName', userData.firstName);
                localStorage.setItem('userLastName', userData.lastName);
                localStorage.setItem('userPhone', userData.phoneNumber);
            }

            if (data.role === 'STUDENT') {
                navigate('/student/dashboard');
            } else {
                navigate('/tutor/dashboard');
            }

        } catch (error) {
            setErrors(prev => ({ ...prev, submit: error.message || 'Cannot connect to server.' }));
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="login-container">
            <div className="login-decoration">
                <div className="decoration-circle circle-1"></div>
                <div className="decoration-circle circle-2"></div>
                <div className="decoration-circle circle-3"></div>
            </div>

            <div className="login-card">
                <div className="login-header">
                    <div className="login-icon">🔐</div>
                    <h1 className="login-title">Welcome Back</h1>
                    <p className="login-subtitle">Sign in to continue your learning journey</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label className="form-label">
                            <span className="label-icon">📧</span>
                            Email Address <span className="required">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`form-input ${errors.email ? 'input-error' : ''}`}
                            placeholder="you@example.com"
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <span className="label-icon">🔒</span>
                            Password <span className="required">*</span>
                        </label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`form-input ${errors.password ? 'input-error' : ''}`}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <span className="label-icon">🎯</span>
                            Sign in as <span className="required">*</span>
                        </label>
                    </div>

                    <div className="form-options">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="checkbox-input"
                            />
                            <span className="checkbox-text">Remember me</span>
                        </label>
                        <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
                    </div>

                    {errors.submit && <div className="submit-error">{errors.submit}</div>}

                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Signing In...
                            </>
                        ) : (
                            <>
                                <span>✨</span>
                                Sign In
                                <span>→</span>
                            </>
                        )}
                    </button>

                    <div className="login-footer">
                        <p className="register-prompt">
                            Don't have an account? <Link to="/register" className="register-link">Create Account</Link>
                        </p>
                    </div>
                </form>

                <div className="login-divider">
                    <span className="divider-text">or continue with</span>
                </div>

                <div className="social-login">
                    <button type="button" className="social-button google">
                        <svg className="social-icon" viewBox="0 0 24 24">
                            <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#4285F4" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#34A853" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Google
                    </button>
                    <button type="button" className="social-button facebook">
                        <svg className="social-icon" viewBox="0 0 24 24">
                            <path fill="#1877F2" d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/>
                        </svg>
                        Facebook
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;