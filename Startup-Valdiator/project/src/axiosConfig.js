import axios from 'axios';

// Use environment variable for backend URL, fallback to the hardcoded URL
const backendURL = import.meta.env.VITE_API_URL || 'https://backend-2-hq3s.onrender.com';

// Log the backend URL being used (helps debug Vercel deployment issues)
if (typeof window !== 'undefined') {
  console.log('Backend URL:', backendURL);
  console.log('Environment:', import.meta.env.MODE);
  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
}

axios.defaults.baseURL = backendURL;
axios.defaults.withCredentials = false;

// Add request interceptor to log requests
axios.interceptors.request.use(
  request => {
    if (import.meta.env.DEV) {
      console.log('Starting Request:', {
        url: request.url,
        method: request.method,
        baseURL: request.baseURL,
        headers: request.headers
      });
    }
    return request;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
axios.interceptors.response.use(
  response => {
    if (import.meta.env.DEV) {
      console.log('Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data
      });
    }
    return response;
  },
  error => {
    // Always log errors for debugging (especially in production)
    console.error('Response Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL
    });
    return Promise.reject(error);
  }
);

// Add response timeout
axios.defaults.timeout = 10000; // 10 seconds

export default axios;
