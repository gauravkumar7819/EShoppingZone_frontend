import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 p-10 md:p-16 mb-12 shadow-2xl shadow-primary-500/20">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-brand font-black text-white tracking-tight mb-6 leading-tight">
              Discover <span className="text-secondary-400">Amazing</span> Deals
            </h1>
            <p className="text-primary-50 text-xl max-w-2xl opacity-90 mb-10 leading-relaxed font-medium">
              From the latest tech gadgets to artisanal lifestyle products, ShoppingKaro brings the best of India and the world to your screen.
            </p>
            
            {/* Integrated Search */}
            <form onSubmit={handleSearch} className="max-w-2xl relative group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products, brands, and more..."
                data-testid="search-input"
                className="w-full bg-white/95 backdrop-blur-xl px-8 py-5 rounded-2xl shadow-2xl outline-none text-slate-800 placeholder-slate-400 focus:ring-4 focus:ring-white/30 transition-all border-none font-medium text-lg"
              />
              <button
                type="submit"
                data-testid="search-button"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary-600 text-white p-4 rounded-xl hover:bg-primary-700 transition-all hover:scale-105 shadow-xl shadow-primary-500/30"
              >
                <MagnifyingGlassIcon className="h-7 w-7" />
              </button>
            </form>
          </motion.div>
        </div>
        
        {/* Background Decorations */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-[100px]"></div>
        <div className="absolute -left-10 -top-10 w-64 h-64 bg-secondary-500/20 rounded-full blur-[80px]"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-72 space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-24">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-brand font-bold text-slate-900 flex items-center gap-3 text-xl">
                <FunnelIcon className="h-6 w-6 text-primary-600" />
                Filters
              </h2>
              {selectedCategory !== 'All' && (
                <button 
                  onClick={() => handleCategoryChange('All')}
                  className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Categories</p>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  data-testid={`category-filter-${category.toLowerCase().replace(/\s+/g, '-')}`}
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