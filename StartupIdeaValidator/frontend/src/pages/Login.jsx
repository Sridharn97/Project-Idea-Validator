import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Lightbulb } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const userData = await login(formData);
      toast.success('Welcome back!');
      if (userData?.role === 'admin') navigate('/manage-ideas');
      else navigate('/dashboard');
    } catch (error) {
      let msg = error.response?.data?.message || error.message || 'Login failed';
      if (error.code === 'ECONNABORTED' || msg.includes('timeout')) {
        msg = 'Request timed out. Please try again.';
      }
      toast.error(msg, { duration: 5000 });
      if (msg.includes('Invalid email') || msg === 'Invalid email or password') {
        setErrors({ email: ' ', password: 'Invalid email or password' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-image-panel">
        <img 
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80" 
          alt="Clean workspace" 
          className="auth-image" 
        />
        <div className="auth-image-overlay">
          <div>
            <p className="auth-quote">"Validation is the first step to building something that actually matters."</p>
            <span className="auth-quote-author">— StartupValidator</span>
          </div>
        </div>
      </div>

      <div className="auth-content">
        <div className="auth-card-container">
          <div className="auth-card">
            <div className="auth-header">
            <Link to="/" className="auth-brand-link">
              <Lightbulb className="auth-brand-icon icon-sm" />
              <span className="auth-brand-name">StartupValidator</span>
            </Link>
            <h2 className="auth-title">Welcome back</h2>
            <p className="auth-subtitle">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field-row">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`auth-input ${errors.email ? 'has-error' : ''}`}
                  placeholder="your@email.com"
                />
                {errors.email && errors.email !== ' ' && <p className="form-error animate-fade-in">{errors.email}</p>}
              </div>

              <div className="form-group">
                <div className="auth-label-row">
                  <label htmlFor="password" className="form-label">Password</label>
                  <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
                </div>
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
            </div>

            <button type="submit" disabled={isLoading} className="auth-submit-btn">
              {isLoading ? <><Loader2 className="icon-sm spinner" /> Signing In...</> : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer-text">
            Don't have an account?
            <Link to="/register" className="auth-footer-link">Create one free</Link>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;