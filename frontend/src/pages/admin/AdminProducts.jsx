import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { 
  ShoppingBagIcon, 
  CurrencyRupeeIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);

  useEffect(() => {
    loadProducts();
  }, [page, search]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAdminProducts(page, pageSize, search);
      setProducts(data.items || []);
      setTotalCount(data.totalCount || 0);
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await adminService.toggleProductStatus(productId, newStatus);
      toast.success(`Product ${newStatus ? 'activated' : 'deactivated'} successfully`);
      loadProducts();
    } catch (error) {
      toast.error('Failed to update product status');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Delete this product permanently? This action cannot be undone unless order history prevents it.')) return;
    
    try {
      await adminService.adminDeleteProduct(productId);
      toast.success('Product deleted permanently');
      loadProducts();
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to delete product';
      toast.error(msg);
    }
  };

  if (loading && page === 1 && !search) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Product Inventory</h1>
          <p className="text-gray-500 mt-2">Oversee all products across all merchants</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, category or description..."
              value={search}
              onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
              }}
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 w-full md:w-80"
            />
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm">
          <ShoppingBagIcon className="h-16 w-16 mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 text-lg font-medium">No products match your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => {
            const isActive = product.isActive;
            return (
              <div key={product.id} className={`bg-white rounded-3xl border transition-all overflow-hidden group hover:shadow-xl ${isActive ? 'border-gray-100' : 'border-red-100 opacity-80'}`}>
                <div className="relative h-48 bg-gray-50 overflow-hidden">
                  <img
                    src={product.imageUrl || product.image || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'}}
                  />
                  
                  <div className="absolute top-3 left-3">
                     <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm ${isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {isActive ? 'Active' : 'Inactive'}
                     </span>
                  </div>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                        onClick={() => handleToggleStatus(product.id, isActive)}
                        className={`p-3 rounded-full text-white transition-transform hover:scale-110 ${isActive ? 'bg-red-500' : 'bg-green-500'}`}
                        title={isActive ? 'Deactivate' : 'Activate'}
                    >
                      {isActive ? <XCircleIcon className="h-6 w-6" /> : <CheckCircleIcon className="h-6 w-6" />}
                    </button>
                    <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-3 bg-white rounded-full text-red-500 transition-transform hover:scale-110"
                        title="Delete Permanently"
                    >
                      <TrashIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800 line-clamp-1 flex-1">{product.name}</h3>
                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-bold uppercase">{product.category}</span>
                  </div>
                  
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-xl font-black text-primary-600">₹{product.price?.toLocaleString()}</span>
                    {product.mrp > product.price && (
                      <span className="text-xs text-gray-400 line-through">₹{product.mrp?.toLocaleString()}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <div>
                      <p>Stock</p>
                      <p className={`text-sm mt-0.5 ${product.stockQuantity < 10 ? 'text-orange-500' : 'text-gray-800'}`}>
                        {product.stockQuantity || 0} units
                      </p>
                    </div>
                    <div className="text-right">
                      <p>Merchant</p>
                      <p className="text-sm mt-0.5 text-gray-800">#{product.merchantId}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalCount > pageSize && (
        <div className="flex justify-center items-center gap-2 pt-10">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 border rounded-xl disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm font-bold text-gray-500 px-4">Page {page} of {Math.ceil(totalCount / pageSize)}</span>
          <button 
            disabled={page >= Math.ceil(totalCount / pageSize)}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 border rounded-xl disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
