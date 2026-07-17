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

// Add request interceptor to attach auth token
axios.interceptors.request.use(
  config => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user && user.token) {
          // Explicitly set header on the config object
          config.headers['Authorization'] = `Bearer ${user.token}`;
        }
      }
    } catch (e) {
      console.error('Error parsing user from localStorage', e);
    }

    if (import.meta.env.DEV) {
      console.log('Starting Request:', {
        url: config.url,
        method: config.method,
        baseURL: config.baseURL,
        headers: config.headers
      });
    }
    return config;
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

// Add response timeout - increased for Render free tier cold starts (can take 30+ seconds)
axios.defaults.timeout = 30000; // 30 seconds

// Helper function to wake up Render backend (health check)
const wakeUpBackend = async () => {
  try {
    // Try a simple GET request to the root endpoint to wake up the backend
    await axios.get('/', {
      timeout: 10000,
      validateStatus: () => true // Accept any status code
    });
    console.log('Backend wake-up successful');
  } catch (error) {
    // Ignore errors, we're just trying to wake up the server
    console.log('Backend wake-up attempt completed (may still be starting)');
  }
};

// Helper function to retry requests on timeout
const retryRequest = async (config, retryCount = 0) => {
  const maxRetries = 2;
  
  try {
    return await axios(config);
  } catch (error) {
    // Retry on timeout or network errors
    // Only retry idempotent requests (like GET) to prevent duplicate POST submissions
    const isIdempotent = !config.method || config.method.toLowerCase() === 'get';
    
    if (isIdempotent && (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || error.response?.status === 404) && retryCount < maxRetries) {
      console.log(`Retrying request (attempt ${retryCount + 1}/${maxRetries})...`);
      
      // On first retry, try to wake up the backend if it's a timeout or 404
      if (retryCount === 0 && (error.code === 'ECONNABORTED' || error.response?.status === 404)) {
        console.log('Attempting to wake up backend...');
        await wakeUpBackend();
        // Wait a bit longer for Render cold start
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      }
      
      return retryRequest(config, retryCount + 1);
    }
    throw error;
  }
};

// Export axios instance and retry helper
export { retryRequest, wakeUpBackend };
export default axios;
