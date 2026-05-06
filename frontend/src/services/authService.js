import api from './api';

const API_GATEWAY = import.meta.env.VITE_API_GATEWAY || 'http://localhost:5000/api';

export const authService = {
  // Customer Registration
  registerCustomer: async (userData) => {
    const response = await api.post('/auth/register/customer', userData);
    return response.data;
  },

  // Merchant Registration
  registerMerchant: async (userData) => {
    const response = await api.post('/auth/register/merchant', userData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Get Current User
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Get Profile
  getProfile: async () => {
    const response = await api.get('/Profile');
    return response.data;
  },

  // Update Profile
  updateProfile: async (profileData) => {
    const response = await api.put('/Profile/update', profileData);
    return response.data;
  },

  // Change Password
  changePassword: async (passwordData) => {
    const response = await api.post('/Profile/change-password', passwordData);
    return response.data;
  },

  // Address Management
  addAddress: async (addressData) => {
    const response = await api.post('/Profile/address', addressData);
    return response.data;
  },

  getAddresses: async () => {
    const response = await api.get('/Profile/addresses');
    return response.data;
  },

  updateAddress: async (addressId, addressData) => {
    const response = await api.put(`/Profile/address/${addressId}`, addressData);
    return response.data;
  },

  deleteAddress: async (addressId) => {
    const response = await api.delete(`/Profile/address/${addressId}`);
    return response.data;
  },

  setDefaultAddress: async (addressId) => {
    const response = await api.post(`/Profile/address/${addressId}/default`);
    return response.data;
  },

  // Google OAuth
  getGoogleLoginUrl: () => {
    return `${API_GATEWAY}/auth/google-login`;
  },

  googleCallback: async (code) => {
    const response = await api.get(`/auth/google-callback?code=${code}`);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
};