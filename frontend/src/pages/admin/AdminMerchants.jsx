import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { productService } from '../../services/productService';
import { 
  BuildingStorefrontIcon, 
  CurrencyRupeeIcon, 
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const AdminMerchants = () => {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadMerchants();
  }, []);

  const loadMerchants = async () => {
    try {
      const data = await adminService.getAllUsers();
      const merchantData = data?.items?.filter(user => user.role === 'Merchant') || [];
      
      // Add product counts for each merchant
      const merchantsWithStats = await Promise.all(
        merchantData.map(async (merchant) => {
          try {
            const products = await productService.getProductsByMerchant(merchant.id);
            return {
              ...merchant,
              productCount: products?.length || 0
            };
          } catch {
            return {
              ...merchant,
              productCount: 0
            };
          }
        })
      );
      
      setMerchants(merchantsWithStats);
    } catch (error) {
      console.error('Failed to load merchants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMerchants = merchants.filter(merchant => {
    return merchant.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      merchant.email?.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-gray-100 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Merchant Management</h1>
          <p className="text-gray-500 mt-2">Manage all platform merchants</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search merchants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Merchants Grid */}
      {filteredMerchants.length === 0 ? (
        <div className="empty-state">
          <BuildingStorefrontIcon className="empty-state-icon" />
          <p className="text-gray-500 text-lg">No merchants found</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMerchants.map(merchant => (
            <div key={merchant.id} className="card p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <BuildingStorefrontIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{merchant.fullName}</h3>
                  <p className="text-sm text-gray-500">{merchant.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <ShoppingBagIcon className="h-4 w-4" />
                    <span className="text-xs">Products</span>
                  </div>
                  <p className="text-xl font-bold text-gray-800">{merchant.productCount}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <UserIcon className="h-4 w-4" />
                    <span className="text-xs">Status</span>
                  </div>
                  <p className={`text-sm font-semibold ${merchant.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {merchant.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Merchant ID</span>
                  <span className="font-medium text-gray-800">{merchant.userId}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500">Joined</span>
                  <span className="font-medium text-gray-800">
                    {new Date(merchant.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {merchant.phoneNumber && (
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">Phone</span>
                    <span className="font-medium text-gray-800">{merchant.phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMerchants;
