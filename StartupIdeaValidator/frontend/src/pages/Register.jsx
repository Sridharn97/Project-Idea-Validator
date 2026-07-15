import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X, User, Mail, Lock, Key, Loader2 } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  // Password validation criteria
  const passwordCriteria = [
    { label: 'At least 6 characters', test: (pass) => pass.length >= 6 },
    { label: 'Contains a number', test: (pass) => /\d/.test(pass) },
    { label: 'Contains a letter', test: (pass) => /[a-zA-Z]/.test(pass) },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const failedCriteria = passwordCriteria.filter(
        criterion => !criterion.test(formData.password)
      );
      
      if (failedCriteria.length > 0) {
        newErrors.password = 'Password does not meet the requirements';
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        adminCode: formData.adminCode
      });
      
      toast.success('Registration successful! Redirecting to dashboard...', {
        duration: 3000,
      });
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage, {
        duration: 4000,
      });
      
      if (errorMessage === 'User already exists') {
        setErrors({
          ...errors,
          email: 'This email is already registered',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">Join StartupValidator</h2>
            <p className="auth-subtitle">Create your account to get started</p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field-row">
              {/* Username Field */}
              <div className="form-group">
                <label htmlFor="username" className="form-label" style={{ display: 'flex', alignItems: 'center' }}>
                  <User className="icon-sm" style={{ marginRight: '0.5rem', color: 'var(--primary)' }} />
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`auth-input ${errors.username ? 'has-error' : ''}`}
                  placeholder="john_doe"
                />
                {errors.username && (
                  <p className="form-error animate-fade-in">{errors.username}</p>
                )}
              </div>
              
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label" style={{ display: 'flex', alignItems: 'center' }}>
                  <Mail className="icon-sm" style={{ marginRight: '0.5rem', color: 'var(--primary)' }} />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`auth-input ${errors.email ? 'has-error' : ''}`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="form-error animate-fade-in">{errors.email}</p>
                )}
              </div>
              
              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password" className="form-label" style={{ display: 'flex', alignItems: 'center' }}>
                  <Lock className="icon-sm" style={{ marginRight: '0.5rem', color: 'var(--primary)' }} />
                  Password
                </label>
                <div className="auth-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`auth-input ${errors.password ? 'has-error' : ''}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="icon-sm" /> : <Eye className="icon-sm" />}
                  </button>
                </div>
                
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--bg-body)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    PASSWORD REQUIREMENTS
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {passwordCriteria.map((criterion, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
                        {criterion.test(formData.password) ? (
                          <Check className="icon-sm" style={{ color: 'var(--success)', marginRight: '0.5rem' }} />
                        ) : (
                          <X className="icon-sm" style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }} />
                        )}
                        <span style={{ color: criterion.test(formData.password) ? 'var(--success)' : 'var(--text-secondary)' }}>
                          {criterion.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {errors.password && (
                  <p className="form-error animate-fade-in">{errors.password}</p>
                )}
              </div>
              
              {/* Confirm Password Field */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label" style={{ display: 'flex', alignItems: 'center' }}>
                  <Lock className="icon-sm" style={{ marginRight: '0.5rem', color: 'var(--primary)' }} />
                  Confirm Password
                </label>
                <div className="auth-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`auth-input ${errors.confirmPassword ? 'has-error' : ''}`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="form-error animate-fade-in">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Admin Code Field */}
              <div className="form-group" style={{ paddingTop: '0.5rem' }}>
                <div className="auth-label-row">
                  <label htmlFor="adminCode" className="form-label mb-0" style={{ display: 'flex', alignItems: 'center' }}>
                    <Key className="icon-sm" style={{ marginRight: '0.5rem', color: 'var(--primary)' }} />
                    Admin Code
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAdmin(!isAdmin)}
                    className="auth-link"
                  >
                    {isAdmin ? 'Hide' : 'Register as Admin?'}
                  </button>
                </div>
                {isAdmin && (
                  <div className="auth-input-wrapper">
                    <input
                      type="password"
                      id="adminCode"
                      name="adminCode"
                      value={formData.adminCode}
                      onChange={handleChange}
                      className="auth-input"
                      placeholder="Enter admin code"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="auth-submit-btn"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="icon-md spinner" style={{ marginRight: '0.5rem' }} />
                  Processing...
                </>
              ) : (
                'Create Account'
              )}
            </button>
            
            <div className="auth-footer-text">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="auth-footer-link"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;