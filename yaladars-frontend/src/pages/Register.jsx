import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        role: 'STUDENT',
        agreeToTerms: false
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (formData.phoneNumber.replace(/\D/g, '').length < 8) {
            newErrors.phoneNumber = 'Please enter a valid phone number';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Must contain uppercase, lowercase, and a number';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'You must agree to the Terms and Conditions';
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

        // UX Fix: Only clear errors immediately if it's text input or checking a checkbox true
        if (errors[name] && (type !== 'checkbox' || checked === true)) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Run front-end validations first
        if (!validateForm()) return;

        setIsLoading(true);
        // Clear any previous submit-wide errors
        setErrors(prev => ({ ...prev, submit: '' }));

        try {
            // 2. Prepare payload matching your backend's expected structure
            const registrationData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                password: formData.password,
                role: formData.role
            };

            // 3. Make the actual API call using the proxy route
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData),
            });

            // 4. Parse the incoming response JSON
            const data = await response.json();

            // 5. If server returns an error status (400, 401, 500, etc.)
            if (!response.ok) {
                // If your backend returns specific field validation errors, map them here:
                if (data.fields) {
                    setErrors(prev => ({ ...prev, ...data.fields }));
                }

                // Otherwise, throw a general message to fall into the catch block
                throw new Error(data.message || 'Registration failed. Please try again.');
            }

            // 6. Handle Successful Registration
            console.log('Registration Successful Backend Response:', data);

            // Store vital user session variables if returned (e.g., token, email)
            localStorage.setItem('userEmail', formData.email);
            localStorage.setItem('userRole', formData.role);
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            // 7. Route the user to their respective dashboard instantly
            if (formData.role === 'STUDENT') {
                navigate('/student/dashboard');
            } else {
                navigate('/tutor/dashboard');
            }

        } catch (error) {
            console.error('API Error Connection Connection:', error);
            // Display the error text directly inside the form banner UI
            setErrors(prev => ({
                ...prev,
                submit: error.message || 'Cannot connect to server. Ensure backend is running on port 8080.'
            }));
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h1 className="register-title">Create Account</h1>
                    <p className="register-subtitle">Join our community of learners and educators</p>
                </div>

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName" className="form-label">First Name <span className="required">*</span></label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`form-input ${errors.firstName ? 'input-error' : ''}`}
                                placeholder="Jane"
                            />
                            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName" className="form-label">Last Name <span className="required">*</span></label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={`form-input ${errors.lastName ? 'input-error' : ''}`}
                                placeholder="Doe"
                            />
                            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email Address <span className="required">*</span></label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`form-input ${errors.email ? 'input-error' : ''}`}
                            placeholder="you@example.com"
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phoneNumber" className="form-label">Phone Number <span className="required">*</span></label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className={`form-input ${errors.phoneNumber ? 'input-error' : ''}`}
                            placeholder="+1 (555) 000-0000"
                        />
                        {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password <span className="required">*</span></label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`form-input ${errors.password ? 'input-error' : ''}`}
                            placeholder="••••••••"
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                        <div className="password-hint">Min. 8 characters with alternating case sizes & numbers</div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password <span className="required">*</span></label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="role" className="form-label">I want to join as <span className="required">*</span></label>
                        <select id="role" name="role" value={formData.role} onChange={handleChange} className="form-select">
                            <option value="STUDENT">Student - Find tutors and learn</option>
                            <option value="TUTOR">Tutor - Share knowledge and earn</option>
                        </select>
                    </div>

                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={handleChange}
                                className="checkbox-input"
                            />
                            <span className="checkbox-text">
                I agree to the <Link to="/terms" className="link">Terms and Conditions</Link> and <Link to="/privacy" className="link">Privacy Policy</Link>
              </span>
                        </label>
                        {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}
                    </div>

                    {errors.submit && <div className="submit-error">{errors.submit}</div>}

                    <button type="submit" className="register-button" disabled={isLoading}>
                        {isLoading ? <><span className="spinner"></span>Creating Account...</> : 'Create Account'}
                    </button>

                    <div className="register-footer">
                        <p className="login-prompt">
                            Already have an account? <Link to="/login" className="login-link">Sign in here</Link>
                        </p>
                    </div>
                </form>

                <div className="register-divider">
                    <span className="divider-text">or</span>
                </div>

                <div className="social-registration">
                    <button type="button" className="social-button">
                        <svg className="social-icon" viewBox="0 0 24 24" width="20" height="20">
                            <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#4285F4" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#34A853" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Google
                    </button>
                    <button type="button" className="social-button">
                        <svg className="social-icon" viewBox="0 0 24 24" width="20" height="20">
                            <path fill="#1877F2" d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/>
                        </svg>
                        Facebook
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;