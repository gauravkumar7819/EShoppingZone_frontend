import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const GitHubCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        try {
          // Call backend to exchange code for token
          const response = await fetch(`http://localhost:5000/api/auth/github-callback?code=${code}`);
          const data = await response.json();
          
          if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            toast.success('GitHub login successful!');
            navigate('/');
          } else {
            toast.error('GitHub login failed');
            navigate('/login');
          }
        } catch (error) {
          console.error('GitHub callback error:', error);
          toast.error('GitHub login failed');
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );
};

export default GitHubCallback;