import api from './api';

export const adminService = {
  // User Management
  getAllUsers: async (pageNumber = 1, pageSize = 10) => {
    const response = await api.get(`/admin/users?page=${pageNumber}&size=${pageSize}`);
    return response.data;
  },

  suspendUser: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/deactivate`);
    return response.data;
  },

  reactivateUser: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/activate`);
    return response.data;
  },

  registerDeliveryAgent: async (userData) => {
    // Not implemented in backend
    console.warn('registerDeliveryAgent not implemented in backend');
    return null;
  },

  // Analytics
  getAnalytics: async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
  },

  getRevenueAnalytics: async (days = 30, period = 'daily') => {
    const response = await api.get(`/admin/analytics/revenue?days=${days}&period=${period}`);
    return response.data;
  },

  getOrderStatusAnalytics: async () => {
    const response = await api.get('/admin/analytics/orders/status');
    return response.data;
  },

  getTopCustomers: async (limit = 10) => {
    const response = await api.get(`/admin/analytics/customers/top?limit=${limit}`);
    return response.data;
  },

  // Order Management
  getAllOrders: async () => {
    const response = await api.get('/admin/orders');
    return response.data;
  },

  updateOrderStatus: async (orderId, statusData) => {
    const response = await api.put(`/admin/orders/${orderId}/status`, statusData);
    return response.data;
  },

  deleteOrder: async (orderId) => {
    const response = await api.delete(`/admin/orders/${orderId}`);
    return response.data;
  },

  // Product Management
  getAdminProducts: async (page = 1, size = 10, search = '') => {
    const response = await api.get(`/admin/products?page=${page}&size=${size}&search=${search}`);
    return response.data;
  },

  toggleProductStatus: async (productId, isActive) => {
    const response = await api.put(`/admin/products/${productId}/status?active=${isActive}`);
    return response.data;
  },

  adminDeleteProduct: async (productId) => {
    const response = await api.delete(`/admin/products/${productId}`);
    return response.data;
  },
};