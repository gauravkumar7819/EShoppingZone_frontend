import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import GoogleCallback from './pages/auth/GoogleCallback';
import ProductListing from './pages/products/ProductListing';
import ProductDetail from './pages/products/ProductDetail';
import CartDrawer from './components/cart/CartDrawer';
import ProfilePage from './pages/profile/ProfilePage';
import MyOrders from './pages/orders/MyOrders';
import OrderDetail from './pages/orders/OrderDetail';
import WalletDashboard from './pages/wallet/WalletDashboard';
import Checkout from './pages/checkout/Checkout';
import MerchantDashboard from './pages/merchant/MerchantDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Layout>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Navigate to="/products" />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Navigate to="/register/customer" />} />
                  <Route path="/register/customer" element={<Register defaultRole="Customer" />} />
                  <Route path="/register/merchant" element={<Register defaultRole="Merchant" />} />
                  <Route path="/google-callback" element={<GoogleCallback />} />
                  <Route path="/products" element={<ProductListing />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  
                  {/* Protected Routes - Customer */}
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <MyOrders />
                    </ProtectedRoute>
                  } />
                  <Route path="/orders/:id" element={
                    <ProtectedRoute>
                      <OrderDetail />
                    </ProtectedRoute>
                  } />
                  <Route path="/wallet" element={
                    <ProtectedRoute>
                      <WalletDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } />
                  
                  {/* Protected Routes - Merchant */}
                  <Route path="/merchant/*" element={
                    <ProtectedRoute requiredRole="Merchant">
                      <MerchantDashboard />
                    </ProtectedRoute>
                  } />
                  
                  {/* Protected Routes - Admin */}
                  <Route path="/admin/*" element={
                    <ProtectedRoute requiredRole="Admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  
                  {/* 404 Page */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
              <CartDrawer />
              <Toaster position="top-right" />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;