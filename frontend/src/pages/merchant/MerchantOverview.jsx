import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { productService } from '../../services/productService';
import { 
  ShoppingBagIcon, 
  CurrencyRupeeIcon, 
  ArrowTrendingUpIcon,
  TagIcon 
} from '@heroicons/react/24/outline';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

const MerchantOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    outOfStock: 0,
    lowStock: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Use server-side /my endpoint – merchantId is read from the JWT,
        // no need for fragile client-side user ID extraction.
        const products = await productService.getMyProducts();
        const list = Array.isArray(products) ? products : [];
        setStats({
          totalProducts: list.length,
          activeProducts: list.filter(p => p.isActive).length,
          outOfStock: list.filter(p => p.stockQuantity === 0).length,
          lowStock: list.filter(p => p.stockQuantity > 0 && p.stockQuantity < 10).length
        });
      } catch (error) {
        console.error('Failed to load merchant stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back, {(user?.fullName || user?.FullName || 'Merchant')?.split(' ')[0]}!</h1>
        <p className="text-gray-500 mt-2">Here's what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          icon={ShoppingBagIcon} 
          color="bg-primary-600" 
        />
        <StatCard 
          title="Active Products" 
          value={stats.activeProducts} 
          icon={TagIcon} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Low Stock" 
          value={stats.lowStock} 
          icon={ArrowTrendingUpIcon} 
          color="bg-yellow-500" 
        />
        <StatCard 
          title="Out of Stock" 
          value={stats.outOfStock} 
          icon={CurrencyRupeeIcon} 
          color="bg-red-500" 
        />
      </div>

      {/* Placeholder for Recent Activity or Sales Chart */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Sales Performance</h2>
          <select className="bg-gray-50 border-none rounded-lg text-sm font-medium px-4 py-2 outline-none cursor-pointer">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl">
          <div className="text-center">
            <div className="bg-primary-50 p-4 rounded-full inline-block mb-4">
              <ArrowTrendingUpIcon className="h-8 w-8 text-primary-600" />
            </div>
            <p className="text-gray-400 font-medium">Sales analytics integration coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantOverview;
