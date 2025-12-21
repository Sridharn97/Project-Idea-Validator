import React, { createContext, useState, useEffect } from 'react';
import axios, { retryRequest } from '../axiosConfig';

export const AuthContext = createContext(); 

export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage immediately to avoid delay
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false); // Start as false since we load synchronously
  const [error, setError] = useState(null);

  // Set axios auth header immediately when user is available
  useEffect(() => {
    if (user?.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [user]);

  // Register user with retry logic for Render cold starts
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Log the API URL being used (for debugging)
      console.log('Register attempt - API URL:', axios.defaults.baseURL);
      
      // Use retry logic for timeout/network errors
      const response = await retryRequest({
        method: 'post',
        url: '/api/auth/register',
        data: userData
      });
      
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      // Enhanced error handling with detailed logging
      console.error('Registration error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        code: err.code,
        baseURL: axios.defaults.baseURL
      });
      
      let errorMessage = 'Registration failed';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. The server may be starting up. Please try again in a moment.';
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error: Unable to reach the server. Please check your connection.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Server endpoint not found. The backend may be down or the URL is incorrect.';
      } else if (err.response?.status === 400 || err.response?.status === 409) {
        errorMessage = err.response?.data?.message || 'Registration failed. Please check your information.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error: Please try again later.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      const error = new Error(errorMessage);
      error.response = err.response;
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login user with retry logic for Render cold starts
  const login = async (credentials, retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      // Log the API URL being used (for debugging)
      console.log('Login attempt - API URL:', axios.defaults.baseURL);
      
      // Use retry logic for timeout/network errors
      const response = await retryRequest({
        method: 'post',
        url: '/api/auth/login',
        data: credentials
      });
      
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      // Enhanced error handling with detailed logging
      console.error('Login error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        code: err.code,
        baseURL: axios.defaults.baseURL
      });
      
      let errorMessage = 'Login failed';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. The server may be starting up. Please try again in a moment.';
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error: Unable to reach the server. Please check your connection.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Server endpoint not found. The backend may be down or the URL is incorrect.';
      } else if (err.response?.status === 401) {
        errorMessage = err.response?.data?.message || 'Invalid email or password';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error: Please try again later.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      const error = new Error(errorMessage);
      error.response = err.response;
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };


  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
