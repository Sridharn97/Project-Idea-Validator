import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const userData = await login(formData);
      toast.success('Login successful! Redirecting...', {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      // Redirect based on user role
      if (userData?.role === 'admin') {
        navigate('/manage-ideas');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      let errorMessage = error.response?.data?.message || error.message || 'Login failed';
      
      // Handle timeout errors specifically
      if (error.code === 'ECONNABORTED' || errorMessage.includes('timeout')) {
        errorMessage = 'Request timed out. The server may be starting up. Please wait a moment and try again.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Server endpoint not found. The backend may be down. Please try again in a moment.';
      }
      
      toast.error(errorMessage, {
        style: {
          borderRadius: '10px',
          background: '#ff3333',
          color: '#fff',
        },
        duration: 5000, // Show longer for timeout errors
      });
      
      if (errorMessage === 'Invalid email or password' || errorMessage.includes('Invalid email')) {
        setErrors({
          email: ' ',
          password: 'Invalid email or password',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Sign in to continue to your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field-row">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`auth-input ${errors.email ? 'has-error' : ''}`}
                  placeholder="your@email.com"
                />
                {errors.email && errors.email !== ' ' && (
                  <p className="form-error animate-fade-in">{errors.email}</p>
                )}
              </div>
              
              <div className="form-group">
                <div className="auth-label-row">
                  <label htmlFor="password" className="form-label mb-0">
                    Password
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="auth-link"
                  >
                    Forgot password?
                  </Link>
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="icon-sm" />
                    ) : (
                      <Eye className="icon-sm" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="form-error animate-fade-in">{errors.password}</p>
                )}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="auth-submit-btn"
            >
              {isLoading ? (
                <>
                  <Loader2 className="icon-md spinner" style={{ marginRight: '0.5rem' }} />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
            
            <div className="auth-footer-text">
              New to our platform?{' '}
              <Link 
                to="/register" 
                className="auth-footer-link"
              >
                Create an account
              </Link>
            </div>
          </form>
        </div>
        
        <div className="auth-legal-text">
          By continuing, you agree to our{' '}
          <Link to="/terms" className="auth-legal-link">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="auth-legal-link">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;