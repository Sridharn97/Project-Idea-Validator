import axios from 'axios';

// Use environment variable for backend URL, fallback to the hardcoded URL
const backendURL = import.meta.env.VITE_API_URL || 'https://backend-2-hq3s.onrender.com';

axios.defaults.baseURL = backendURL;
axios.defaults.withCredentials = false;

// Add request interceptor to log requests in development
if (import.meta.env.DEV) {
  axios.interceptors.request.use(request => {
    console.log('Starting Request:', request);
    return request;
  });

  axios.interceptors.response.use(
    response => {
      console.log('Response:', response);
      return response;
    },
    error => {
      console.error('Response Error:', error);
      return Promise.reject(error);
    }
  );
}

// Add response timeout
axios.defaults.timeout = 10000; // 10 seconds

export default axios;
