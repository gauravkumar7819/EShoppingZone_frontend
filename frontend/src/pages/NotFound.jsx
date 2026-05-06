import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ExclamationTriangleIcon, HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <ExclamationTriangleIcon className="h-24 w-24 text-primary-500 mx-auto mb-4" />
          <h1 className="text-9xl font-bold text-gray-800 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
          <p className="text-gray-500">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Go Back
          </button>
          <Link to="/" className="btn-primary flex items-center justify-center gap-2">
            <HomeIcon className="h-5 w-5" />
            Back to Home
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-400 mb-4">You might be looking for:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link to="/products" className="text-primary-600 hover:underline text-sm">
              Products
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/profile" className="text-primary-600 hover:underline text-sm">
              Profile
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/orders" className="text-primary-600 hover:underline text-sm">
              Orders
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/wallet" className="text-primary-600 hover:underline text-sm">
              Wallet
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
