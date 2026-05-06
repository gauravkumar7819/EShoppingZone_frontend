import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import { productService } from '../../services/productService';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { ProductCardSkeleton } from '../../components/common/Skeleton';

const categories = ['All', 'Electronics', 'Books', 'Apparel', 'Personal Care'];

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 12,
    totalCount: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) setSelectedCategory(category);
    loadProducts();
  }, [searchParams, pagination.pageNumber]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const category = selectedCategory === 'All' ? null : selectedCategory;
      const data = await productService.getAllProducts(
        pagination.pageNumber,
        pagination.pageSize,
        category,
        searchTerm || null
      );
      setProducts(data.items || []);
      setPagination(prev => ({
        ...prev,
        totalCount: data.totalCount,
        totalPages: data.totalPages,
      }));
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPagination(prev => ({ ...prev, pageNumber: 1 }));
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, pageNumber: 1 }));
    loadProducts();
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, pageNumber: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Decorative Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-primary-400 p-8 md:p-12 mb-12 shadow-2xl">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 animate-fade-in">
            Discover Amazing Deals
          </h1>
          <p className="text-primary-50 text-lg max-w-xl opacity-90 mb-8 leading-relaxed">
            From the latest gadgets to premium personal care, find everything you need in one place.
          </p>
          
          {/* Integrated Search */}
          <form onSubmit={handleSearch} className="max-w-xl relative group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products, brands, and more..."
              className="w-full bg-white/95 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-xl outline-none text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-white/20 transition-all border-none"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 transition-all hover:scale-105 shadow-lg"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
          </form>
        </div>
        
        {/* Background Decorations */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <svg className="w-64 h-64 text-white" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="100" fill="currentColor" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                <FunnelIcon className="h-5 w-5 text-primary-600" />
                Filters
              </h2>
              {selectedCategory !== 'All' && (
                <button 
                  onClick={() => handleCategoryChange('All')}
                  className="text-xs font-bold text-primary-600 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Categories</p>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group flex items-center justify-between ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white font-bold shadow-lg shadow-primary-500/30'
                      : 'bg-gray-50 text-gray-600 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <span className="text-sm">{category}</span>
                  <div className={`w-1.5 h-1.5 rounded-full transition-all ${
                    selectedCategory === category ? 'bg-white scale-100' : 'bg-primary-600 scale-0 group-hover:scale-100'
                  }`}></div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Showing <span className="text-gray-900 font-bold">{products.length}</span> results
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Sort by:</span>
              <select className="bg-transparent border-none text-sm font-bold text-primary-600 outline-none cursor-pointer">
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Rated</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="bg-gray-50 p-6 rounded-full inline-block mb-6">
                <MagnifyingGlassIcon className="h-12 w-12 text-gray-300" />
              </div>
              <p className="text-xl font-bold text-gray-800 mb-2">No matches found</p>
              <p className="text-gray-500 max-w-sm mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  loadProducts();
                }}
                className="btn-primary mt-8 px-10"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Enhanced Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-16">
                  <button
                    onClick={() => handlePageChange(pagination.pageNumber - 1)}
                    disabled={pagination.pageNumber === 1}
                    className="p-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all font-bold text-gray-600 text-sm flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                    Prev
                  </button>
                  <div className="flex gap-2">
                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-11 h-11 rounded-xl font-bold text-sm transition-all shadow-sm ${
                            pagination.pageNumber === pageNum
                              ? 'bg-primary-600 text-white shadow-primary-500/30'
                              : 'bg-white border border-gray-50 text-gray-600 hover:border-primary-400'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => handlePageChange(pagination.pageNumber + 1)}
                    disabled={pagination.pageNumber === pagination.totalPages}
                    className="p-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all font-bold text-gray-600 text-sm flex items-center gap-2"
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;