import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  /**
   * Load only the products owned by the authenticated merchant.
   * Uses GET /api/merchant/products/my which reads the merchantId
   * from the JWT on the server – no need to pass it from the client.
   */
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getMyProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load products:', error);
      console.error('Error response:', error.response?.data);
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      // Uses /merchant/products/{id} – backend verifies ownership before deleting.
      await productService.deleteProduct(id);
      toast.success('Product removed successfully');
      loadProducts();
    } catch (error) {
      console.error('Delete error:', error);
      console.error('Delete error response:', error.response?.data);
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to delete product';
      toast.error(msg);
    }
  };

  const filteredProducts = products.filter(p => {
    const name = p.name || p.Name || '';
    const brand = p.brand || p.Brand || '';
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-40 bg-gray-100 rounded-3xl animate-pulse"></div>
        <div className="h-80 bg-gray-50 rounded-3xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track your inventory</p>
        </div>
        <Link to="/merchant/products/new" className="btn-premium flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Add New Product
        </Link>
      </div>

      <div className="flex bg-gray-50 p-2 rounded-2xl mb-8 border border-gray-100">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search your products..."
            className="w-full bg-transparent pl-12 pr-4 py-3 outline-none text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Product Details</th>
              <th className="px-6 py-4 text-center">Category</th>
              <th className="px-6 py-4 text-center">Price</th>
              <th className="px-6 py-4 text-center">Stock</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map((product) => {
              const productId = product.id || product.Id || product.productId;
              return (
                <tr key={productId} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                        {product.imageUrl || product.image
                          ? <img src={product.imageUrl || product.image} className="w-full h-full object-cover rounded-xl" alt={product.name} />
                          : <ShoppingBagIcon className="h-6 w-6" />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-gray-800">₹{Number(product.price).toLocaleString()}</span>
                      <span className="text-[10px] text-gray-400 line-through">₹{Number(product.mrp).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-bold ${
                      product.stockQuantity === 0 ? 'text-red-500' 
                      : product.stockQuantity < 10 ? 'text-yellow-600' 
                      : 'text-green-600'
                    }`}>
                      {product.stockQuantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`badge ${product.isActive ? 'badge-success' : 'badge-danger'} scale-90`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        to={`/merchant/products/${productId}/edit`}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(productId)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="6" className="py-20 text-center">
                  <div className="flex flex-col items-center opacity-40">
                    <ShoppingBagIcon className="h-16 w-16 mb-4" />
                    <p className="font-medium">No products found in your inventory.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
