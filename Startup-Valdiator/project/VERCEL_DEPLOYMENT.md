# Vercel Deployment Guide

## Environment Variables Setup

For the application to work correctly on Vercel, you need to set the environment variable in the Vercel dashboard:

### Steps to Set Environment Variable in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new environment variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://backend-2-hq3s.onrender.com`
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**
5. **Redeploy** your application for the changes to take effect

### Important Notes:

- Environment variables in `vercel.json` are **NOT** automatically used by Vite builds
- Vite requires environment variables to be prefixed with `VITE_` to be exposed to the client
- After setting environment variables, you must redeploy for them to take effect
- The backend URL is already configured as a fallback, but setting it explicitly ensures consistency

### Troubleshooting Login Issues:

If you're experiencing "Login failed" errors after deployment:

1. **Check Environment Variables**: Verify `VITE_API_URL` is set in Vercel dashboard
2. **Check Browser Console**: Open browser DevTools and check the console for:
   - The backend URL being used
   - Any network errors
   - Detailed error messages
3. **Check Network Tab**: Verify that API requests are being made to the correct backend URL
4. **Backend Status**: Ensure your backend server (Render) is running and accessible
5. **CORS Configuration**: Verify backend CORS settings allow requests from your Vercel domain

### Common Issues:

- **Network Error**: Backend server might be down or URL is incorrect
- **CORS Error**: Backend needs to allow your Vercel domain in CORS settings
- **401 Unauthorized**: Invalid credentials or token issues
- **500 Server Error**: Backend server error, check backend logs

### Testing:

After deployment, test the following:
1. Open browser console (F12)
2. Check the logged "Backend URL" - should match your backend
3. Try logging in with valid credentials
4. Check network tab for API request/response details

