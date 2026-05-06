
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import MerchantOverview from './MerchantOverview';
import MerchantOrders from './MerchantOrders';
import { 
  Square2StackIcon, 
  ShoppingBagIcon, 
  PlusCircleIcon,
  ChevronRightIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const MerchantDashboard = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Overview', path: '/merchant/dashboard', icon: Square2StackIcon },
    { name: 'My Products', path: '/merchant/products', icon: ShoppingBagIcon },
    { name: 'Add Product', path: '/merchant/products/new', icon: PlusCircleIcon },
    { name: 'Orders', path: '/merchant/orders', icon: ClipboardDocumentListIcon },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] gap-6 p-4 md:p-8 bg-gray-50/50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 space-y-2">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Merchant Menu</h2>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
                  location.pathname === item.path
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                    : 'text-gray-600 hover:bg-white hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
                <ChevronRightIcon className={`h-4 w-4 transition-transform ${
                  location.pathname === item.path ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                }`} />
              </Link>
            ))}
          </nav>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-6 rounded-2xl shadow-xl text-white overflow-hidden relative group">
          <div className="relative z-10">
            <h3 className="font-bold text-lg mb-2">Grow your business</h3>
            <p className="text-xs text-primary-100 mb-4 opacity-80">Check out our new merchant tools to boost your sales.</p>
            <button className="text-xs font-bold bg-white text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors">
              Learn More
            </button>
          </div>
          <div className="absolute -right-4 -bottom-4 bg-white/10 w-24 h-24 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-50"></div>
        
        <div className="relative z-10 h-full">
          <Routes>
            <Route path="dashboard" element={<MerchantOverview />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route path="orders" element={<MerchantOrders />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default MerchantDashboard;