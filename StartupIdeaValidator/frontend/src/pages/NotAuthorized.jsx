
import React from 'react';
import { Link } from 'react-router-dom';

const NotAuthorized = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-center">
    <h1 className="text-3xl font-bold text-red-600 mb-4">403 - Not Authorized</h1>
    <p className="text-gray-700 mb-6">You do not have permission to access this page.</p>
    <Link to="/" className="text-blue-600 hover:underline">Go back home</Link>
  </div>
);

export default NotAuthorized;
