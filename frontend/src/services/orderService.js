import api from './api';

export const orderService = {
  // Place order
  placeOrder: async (orderData) => {
    const response = await api.post('/order/place', orderData);
    return response.data;
  },

  // Get orders by customer ID
  getOrdersByCustomer: async (customerId) => {
    const response = await api.get(`/order/customer/${customerId}`);
    return response.data;
  },

  // Get orders by merchant ID
  getOrdersByMerchant: async (merchantId) => {
    const response = await api.get(`/order/merchant/${merchantId}`);
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    const response = await api.get(`/order/${orderId}`);
    return response.data;
  },

  // Track order
  trackOrder: async (orderId) => {
    const response = await api.get(`/order/track/${orderId}`);
    return response.data;
  },

  // Get order summary
  getOrderSummary: async (orderId) => {
    const response = await api.get(`/order/${orderId}/summary`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId, reason) => {
    const response = await api.put(`/order/${orderId}/cancel`, { reason });
    return response.data;
  },

  // Admin: Update order status
  updateOrderStatus: async (orderId, statusData) => {
    const response = await api.put(`/admin/orders/${orderId}/status`, statusData);
    return response.data;
  },

  // Admin: Get all orders
  getAllOrders: async () => {
    const response = await api.get('/admin/orders');
    return response.data;
  },

  // Admin: Get analytics
  getAnalytics: async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
  },
};