export const API_BASE_URL = import.meta.env.VITE_API_GATEWAY || 'http://localhost:5000/api';

export const PRODUCT_CATEGORIES = [
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Books', label: 'Books' },
  { value: 'Apparel', label: 'Apparel' },
  { value: 'Personal Care', label: 'Personal Care' },
];

export const ORDER_STATUS = {
  PLACED: 'Placed',
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
};

export const PAYMENT_METHODS = [
  { value: 'COD', label: 'Cash on Delivery' },
  { value: 'Wallet', label: 'Wallet' },
];

export const TRANSACTION_TYPES = {
  CREDIT: 'CREDIT',
  DEBIT: 'DEBIT',
};