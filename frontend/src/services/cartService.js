import api from './api';

export const cartService = {
  // Get cart by user ID
  getCartByUserId: async (userId) => {
    const response = await api.get(`/cart/user/${userId}`);
    return response.data;
  },

  // Get cart by cart ID
  getCartById: async (cartId) => {
    const response = await api.get(`/cart/${cartId}`);
    return response.data;
  },

  // Add item to cart
  addToCart: async (cartData) => {
    const response = await api.post('/cart/add', cartData);
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (updateData) => {
    const response = await api.put('/cart/update', updateData);
    return response.data;
  },

  // Remove cart item
  removeCartItem: async (cartItemId) => {
    const response = await api.delete(`/cart/item/${cartItemId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async (cartId) => {
    const response = await api.delete(`/cart/clear/${cartId}`);
    return response.data;
  },

  // Get cart total
  getCartTotal: async (cartId) => {
    const response = await api.get(`/cart/${cartId}/total`);
    return response.data;
  },
};