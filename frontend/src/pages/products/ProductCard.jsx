import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { ShoppingCartIcon, StarIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart, loading } = useCart();

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarSolidIcon key={i} className="h-4 w-4 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<StarIcon key="half" className="h-4 w-4 text-yellow-400" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    return stars;
  };

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    const success = await addToCart(
      product.id, 
      product.name, 
      product.price, 
      1, 
      product.images?.[0] || product.imageUrl,
      product.merchantId
    );
    if (success) {
      toast.success(`${product.name} added to cart!`);
    }
  };

  return (
    <div className="card-premium group">
      <Link to={`/product/${product.id}`} data-testid={`product-card-${product.id}`}>
        <div className="relative h-64 bg-gray-100 overflow-hidden">
          {product.images?.[0] || product.imageUrl || product.image ? (
            <img
              src={product.images?.[0] || product.imageUrl || product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
              <ShoppingBagIcon className="h-12 w-12 opacity-20" />
            </div>
          )}
          
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-4 left-4 bg-accent-600 text-white text-[11px] font-black px-3 py-1.5 rounded-lg shadow-xl uppercase tracking-tighter">
              {discount}% OFF
            </div>
          )}
          
          {/* Quick Add Overlay */}
          <div className="absolute inset-0 bg-primary-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
            <button 
              onClick={handleAddToCart}
              disabled={loading || product.stockQuantity === 0}
              data-testid="add-to-cart-button"
              className="bg-white text-primary-600 p-4 rounded-full shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-primary-600 hover:text-white"
            >
              <ShoppingCartIcon className="h-6 w-6" />
            </button>
          </div>

          {product.stockQuantity === 0 && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <span className="text-gray-900 font-black uppercase tracking-widest text-xs border-2 border-gray-900 px-4 py-2">
                Sold Out
              </span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-800 line-clamp-1 group-hover:text-primary-600 transition-colors uppercase text-sm tracking-tight">
              {product.name}
            </h3>
          </div>
          
          <div className="flex items-center gap-1.5 mb-5">
            <div className="flex items-center">
              {renderStars(product.averageRating || 4.5)}
            </div>
            <span className="text-xs font-bold text-slate-400">({product.totalReviews || 124})</span>
          </div>

          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-900 font-brand tracking-tight">₹{product.price?.toLocaleString()}</span>
              {discount > 0 && (
                <span className="text-sm text-slate-400 line-through font-medium">₹{product.mrp?.toLocaleString()}</span>
              )}
            </div>
            <div className="text-[10px] font-black text-primary-700 uppercase tracking-widest bg-primary-50 px-2.5 py-1.5 rounded-lg">
              {product.category}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;