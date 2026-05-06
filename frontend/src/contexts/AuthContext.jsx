import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      loadProfile();
    }
    setLoading(false);
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(prev => ({ ...prev, ...profile }));
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const login = async (emailOrMobile, password) => {
    try {
      const response = await authService.login({ emailOrMobile, password });
      setUser(response);
      toast.success('Login successful!');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
      throw error;
    }
  };

  const googleLogin = async (code) => {
    try {
      const response = await authService.googleCallback(code);
      setUser(response);
      toast.success('Google login successful!');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Google login failed');
      throw error;
    }
  };

  const register = async (userData, role) => {
    try {
      let response;
      if (role === 'Merchant') {
        response = await authService.registerMerchant(userData);
      } else {
        response = await authService.registerCustomer(userData);
      }
      toast.success('Registration successful! Please login.');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      setUser(prev => ({ ...prev, ...response }));
      toast.success('Profile updated successfully');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Update failed');
      throw error;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await authService.changePassword(passwordData);
      toast.success('Password changed successfully');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Password change failed');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      googleLogin,
      register, 
      logout, 
      updateProfile,
      changePassword,
      loadProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};