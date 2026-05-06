import api from './api';

export const productService = {
  // ── Public / Customer endpoints ────────────────────────────────────────── //

  // Get all products with pagination and filters
  getAllProducts: async (pageNumber = 1, pageSize = 12, category = null, search = null) => {
    const params = { pageNumber, pageSize };
    if (category) params.category = category;
    if (search) params.search = search;
    const response = await api.get('/product', { params });
    return response.data;
  },

  // Get product by ID
  getProductById: async (id) => {
    const response = await api.get(`/product/${id}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    const response = await api.get(`/product/category/${category}`);
    return response.data;
  },

  // Get products by type
  getProductsByType: async (type) => {
    const response = await api.get(`/product/type/${type}`);
    return response.data;
  },

  // Search products
  searchProducts: async (name) => {
    const response = await api.get(`/product/search?name=${name}`);
    return response.data;
  },

  // Add review (authenticated users)
  addReview: async (productId, reviewData) => {
    const response = await api.post(`/product/${productId}/review`, reviewData);
    return response.data;
  },

  // Get products by merchant (public listing)
  getProductsByMerchant: async (merchantId) => {
    const response = await api.get(`/product/merchant/${merchantId}`);
    return response.data;
  },

  // ── Merchant endpoints (ownership enforced by backend) ─────────────────── //

  /**
   * Create a new product under the authenticated merchant's account.
   * The backend reads the merchantId from the JWT.
   */
  createProduct: async (productData) => {
    const response = await api.post('/merchant-products', productData);
    return response.data;
  },

  /**
   * Update a product. Backend verifies the caller owns this product.
   */
  updateProduct: async (id, productData) => {
    const response = await api.put(`/merchant-products/${id}`, productData);
    return response.data;
  },

  /**
   * Delete a product. Uses the merchant-scoped route so the backend
   * can verify the authenticated merchant owns this product.
   */
  deleteProduct: async (id) => {
    const response = await api.delete(`/merchant-products/${id}`);
    return response.data;
  },

  /**
   * Update stock for a product. Backend verifies ownership.
   */
  updateStock: async (id, quantity) => {
    const response = await api.put(`/merchant-products/${id}/stock?quantity=${quantity}`);
    return response.data;
  },

  /**
   * Fetch all products owned by the authenticated merchant
   * using the server-side /my endpoint.
   */
  getMyProducts: async () => {
    const response = await api.get('/merchant-products/my');
    return response.data;
  },
};