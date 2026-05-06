import api from './api';

export const walletService = {
  // Create wallet
  createWallet: async (customerId, initialBalance = 0) => {
    const response = await api.post(`/wallet/create/${customerId}?initialBalance=${initialBalance}`);
    return response.data;
  },

  // Get wallet by customer ID
  getWalletByCustomer: async (customerId) => {
    const response = await api.get(`/wallet/customer/${customerId}`);
    return response.data;
  },

  // Get wallet by ID
  getWalletById: async (walletId) => {
    const response = await api.get(`/wallet/${walletId}`);
    return response.data;
  },

  // Get balance
  getBalance: async (walletId) => {
    const response = await api.get(`/wallet/${walletId}/balance`);
    return response.data;
  },

  // Get statements
  getStatements: async (walletId, pageNumber = 1, pageSize = 20) => {
    const response = await api.get(`/wallet/${walletId}/statements?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return response.data;
  },

  // Get transaction summary
  getTransactionSummary: async (walletId) => {
    const response = await api.get(`/wallet/${walletId}/summary`);
    return response.data;
  },

  // Add money (direct - admin only)
  addMoney: async (walletId, amount, remarks) => {
    const response = await api.post('/wallet/addmoney', { walletId, amount, remarks });
    return response.data;
  },

  // Process payment
  processPayment: async (walletId, amount, orderId, remarks) => {
    const response = await api.post('/wallet/pay', { walletId, amount, orderId, remarks });
    return response.data;
  },

  // Initiate Razorpay payment
  initiateRazorpayPayment: async (payload) => {
    const response = await api.post('/wallet/razorpay/initiate', payload);
    return response.data;
  },

  // Verify Razorpay payment
  verifyRazorpayPayment: async (verificationData) => {
    const response = await api.post('/wallet/razorpay/verify', verificationData);
    return response.data;
  },

  // Process refund
  refundAmount: async (walletId, amount, orderId, remarks) => {
    const response = await api.post('/wallet/refund', { walletId, amount, orderId, remarks });
    return response.data;
  },
};