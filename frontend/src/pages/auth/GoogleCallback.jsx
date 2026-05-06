import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { googleLogin } = useAuth();
  const hasCalled = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      // Prevent double call in strict mode
      if (hasCalled.current) return;
      hasCalled.current = true;

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        try {
          await googleLogin(code);
          navigate('/');
        } catch (error) {
          console.error('Google callback error:', error);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate, googleLogin]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Completing Google sign in...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
