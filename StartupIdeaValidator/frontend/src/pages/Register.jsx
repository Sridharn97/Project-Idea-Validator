import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X, Loader2, Lightbulb } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: '', adminCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const passwordCriteria = [
    { label: 'At least 6 characters', test: (p) => p.length >= 6 },
    { label: 'Contains a number',     test: (p) => /\d/.test(p) },
    { label: 'Contains a letter',     test: (p) => /[a-zA-Z]/.test(p) },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    else if (formData.username.trim().length < 3) newErrors.username = 'At least 3 characters';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (passwordCriteria.some(c => !c.test(formData.password))) newErrors.password = 'Password does not meet requirements';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await register({ username: formData.username, email: formData.email, password: formData.password, adminCode: formData.adminCode });
      toast.success('Account created! Welcome 🎉');
      navigate('/dashboard');
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      if (msg === 'User already exists') setErrors({ ...errors, email: 'Email already registered' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card-container" style={{ maxWidth: '28rem' }}>
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="auth-brand-link">
              <Lightbulb className="auth-brand-icon icon-sm" />
              <span className="auth-brand-name">StartupValidator</span>
            </Link>
            <h2 className="auth-title">Create an account</h2>
            <p className="auth-subtitle">Join thousands of founders validating their ideas</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field-row">
              <div className="auth-grid-2">
                {/* Username */}
                <div className="form-group">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`auth-input ${errors.username ? 'has-error' : ''}`}
                    placeholder="john_doe"
                  />
                  {errors.username && <p className="form-error animate-fade-in">{errors.username}</p>}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`auth-input ${errors.email ? 'has-error' : ''}`}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="form-error animate-fade-in">{errors.email}</p>}
                </div>
              </div>

              <div className="auth-grid-2">
                {/* Password */}
                <div className="form-group">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="auth-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`auth-input ${errors.password ? 'has-error' : ''}`}
                      placeholder="••••••••"
                      style={{ paddingRight: '2.75rem' }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                      {showPassword ? <EyeOff className="icon-sm" /> : <Eye className="icon-sm" />}
                    </button>
                  </div>
                  {errors.password && <p className="form-error animate-fade-in">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">Confirm</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`auth-input ${errors.confirmPassword ? 'has-error' : ''}`}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && <p className="form-error animate-fade-in">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Password criteria */}
              {formData.password && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {passwordCriteria.map((c, i) => (
                    <span
                      key={i}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.2rem',
                        fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.5rem',
                        borderRadius: '9999px',
                        background: c.test(formData.password) ? '#f0fdf4' : '#f9fafb',
                        color: c.test(formData.password) ? '#065f46' : '#9ca3af',
                        border: `1px solid ${c.test(formData.password) ? '#a7f3d0' : '#e5e7eb'}`,
                        transition: 'all 0.2s',
                      }}
                    >
                      {c.test(formData.password)
                        ? <Check style={{ width: '0.65rem', height: '0.65rem' }} />
                        : <X style={{ width: '0.65rem', height: '0.65rem' }} />
                      }
                      {c.label}
                    </span>
                  ))}
                </div>
              )}

              {/* Admin Code */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Admin Code</label>
                  <button
                    type="button"
                    onClick={() => setIsAdmin(!isAdmin)}
                    className="auth-link"
                    style={{ fontSize: '0.75rem' }}
                  >
                    {isAdmin ? 'Cancel' : 'Register as Admin?'}
                  </button>
                </div>
                {isAdmin && (
                  <input
                    type="password"
                    id="adminCode"
                    name="adminCode"
                    value={formData.adminCode}
                    onChange={handleChange}
                    className="auth-input"
                    placeholder="Enter admin code"
                  />
                )}
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="auth-submit-btn">
              {isSubmitting
                ? <><Loader2 className="icon-sm spinner" /> Creating Account...</>
                : 'Create Account'
              }
            </button>
          </form>

          <div className="auth-footer-text">
            Already have an account?
            <Link to="/login" className="auth-footer-link">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;