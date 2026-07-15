import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-8xl font-bold text-blue-600 mb-4">404</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Page Not Found</h1>
      <p className="text-gray-600 text-center max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        to="/" 
        className="flex items-center text-blue-600 font-medium hover:underline"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Go back to home page
      </Link>
    </div>
  );
};

export default NotFound;