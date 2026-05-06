import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { 
  ArrowLeftIcon, 
  CheckIcon,
  CloudArrowUpIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Electronics',
    type: '',
    price: '',
    mrp: '',
    stockQuantity: '',
    brand: '',
    specifications: {},
    imageUrl: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await productService.getProductById(id);
      setFormData({
        name: data.name,
        description: data.description,
        category: data.category,
        type: data.type,
        price: data.price,
        mrp: data.mrp,
        stockQuantity: data.stockQuantity,
        brand: data.brand,
        specifications: data.specifications || {},
        imageUrl: data.imageUrl || data.image || '',
        isActive: data.isActive ?? true
      });
    } catch (error) {
      toast.error('Failed to load product data');
      navigate('/merchant/products');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate imageUrl is not a base64 data URL
    if (formData.imageUrl && formData.imageUrl.startsWith('data:')) {
      toast.error('Please use a direct image URL (e.g., from cloud storage), not base64 data. Upload your image to a service like Cloudinary, AWS S3, or Imgur and paste the URL.');
      return;
    }
    
    setLoading(true);
    try {
      if (isEdit) {
        // Backend verifies that the authenticated merchant owns this product.
        await productService.updateProduct(id, formData);
        toast.success('Product updated successfully');
      } else {
        // Do NOT pass merchantId from frontend – the backend reads it from
        // the JWT (ClaimTypes.NameIdentifier) to prevent spoofing.
        await productService.createProduct(formData);
        toast.success('Product added to your store');
      }
      navigate('/merchant/products');
    } catch (error) {
      console.error('Error during product operation:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="animate-pulse space-y-8 p-10">
      <div className="h-10 bg-gray-200 rounded w-1/3"></div>
      <div className="grid grid-cols-2 gap-10">
        <div className="h-96 bg-gray-100 rounded-3xl"></div>
        <div className="h-96 bg-gray-100 rounded-3xl"></div>
      </div>
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/merchant/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Section: Basic Info */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">1</div>
            <h2 className="text-lg font-bold text-gray-800">Basic Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Product Title</label>
              <input 
                type="text" 
                className="input-field py-4" 
                placeholder="e.g. MacBook Pro M3 Max"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea 
                className="input-field py-4" 
                rows="4" 
                placeholder="Wait till you see what the amazing description is..."
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Brand</label>
              <input 
                type="text" 
                className="input-field py-3" 
                placeholder="Apple"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Product Type</label>
              <input 
                type="text" 
                className="input-field py-3" 
                placeholder="Laptop"
                required
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select 
                className="input-field py-3 appearance-none cursor-pointer"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Electronics">Electronics</option>
                <option value="Books">Books</option>
                <option value="Apparel">Apparel</option>
                <option value="Personal Care">Personal Care</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section: Inventory & Pricing */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">2</div>
            <h2 className="text-lg font-bold text-gray-800">Inventory & Pricing</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Selling Price (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                <input 
                  type="number" 
                  className="input-field py-3 pl-8" 
                  placeholder="0.00"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">MRP (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                <input 
                  type="number" 
                  className="input-field py-3 pl-8" 
                  placeholder="0.00"
                  required
                  value={formData.mrp}
                  onChange={(e) => setFormData({...formData, mrp: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Stock Quantity</label>
              <input 
                type="number" 
                className="input-field py-3" 
                placeholder="50"
                required
                value={formData.stockQuantity}
                onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Section: Product Image */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">3</div>
            <h2 className="text-lg font-bold text-gray-800">Product Image</h2>
          </div>
          
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center hover:border-primary-400 transition-colors group">
            <div className="max-w-md mx-auto">
              {formData.imageUrl ? (
                <div className="relative group/img">
                  <img src={formData.imageUrl} className="w-full h-48 object-contain rounded-xl mb-4" />
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, imageUrl: ''})}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                  <p className="text-xs text-gray-400 truncate">{formData.imageUrl}</p>
                </div>
              ) : (
                <>
                  <div className="bg-white p-4 rounded-2xl inline-block shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <CloudArrowUpIcon className="h-8 w-8 text-primary-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-4">Enter Image URL to preview</p>
                </>
              )}
              <input 
                type="url" 
                className="w-full bg-white px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary-500" 
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Section: Visibility */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">4</div>
            <h2 className="text-lg font-bold text-gray-800">Status & Visibility</h2>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-3xl p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <p className="font-bold text-gray-800 text-lg flex items-center gap-2">
                Product Status: 
                <span className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider ${formData.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {formData.isActive ? 'Active' : 'Inactive'}
                </span>
              </p>
              <p className="text-sm text-gray-400 mt-1">Deactivated products are hidden from customers but preserved in your records.</p>
            </div>
            
            <button
              type="button"
              onClick={() => setFormData({...formData, isActive: !formData.isActive})}
              className={`relative inline-flex h-9 w-18 items-center rounded-full transition-all duration-300 focus:outline-none shadow-inner ${
                formData.isActive ? 'bg-green-500' : 'bg-gray-300'
              }`}
              style={{ width: '72px' }}
            >
              <span
                className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                  formData.isActive ? 'translate-x-10' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="pt-10 flex gap-4">
          <button 
            type="submit" 
            disabled={loading}
            className="btn-premium flex-1 flex items-center justify-center gap-2"
          >
            {loading ? 'Saving...' : (
              <>
                <CheckIcon className="h-5 w-5" />
                {isEdit ? 'Update Product' : 'List Product'}
              </>
            )}
          </button>
          <Link to="/merchant/products" className="btn-secondary px-10 flex items-center justify-center">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
