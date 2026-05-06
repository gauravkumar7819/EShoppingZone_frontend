import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { productService } from '../../services/productService';
import { 
  StarIcon, 
  ShoppingCartIcon, 
  HeartIcon, 
  MagnifyingGlassPlusIcon, 
  MagnifyingGlassMinusIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import toast from 'react-hot-toast';
import { ProductDetailSkeleton } from '../../components/common/Skeleton';
import Breadcrumbs from '../../components/common/Breadcrumbs';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      loadRelatedProducts();
    }
  }, [product]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (error) {
      console.error('Failed to load product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedProducts = async () => {
    try {
      const category = product.category;
      const data = await productService.getAllProducts(1, 4, category);
      setRelatedProducts(data.items?.filter(p => p.id !== product.id) || []);
    } catch (error) {
      console.error('Failed to load related products:', error);
    }
  };

  const handleAddToCart = async () => {
    const success = await addToCart(
      product.id,
      product.name,
      product.price,
      quantity,
      product.images?.[0] || product.imageUrl || product.image,
      product.merchantId
    );
    if (success) {
      toast.success(`${quantity} × ${product.name} added to cart!`);
    }
  };

  const handleSubmitReview = async () => {
    if (!rating) {
      toast.error('Please select a rating');
      return;
    }
    if (!reviewText.trim()) {
      toast.error('Please write a review');
      return;
    }

    setSubmitting(true);
    try {
      await productService.addReview(product.id, {
        rating,
        review: reviewText,
        userId: JSON.parse(localStorage.getItem('user'))?.userId || 1,
      });
      toast.success('Review submitted successfully');
      setReviewText('');
      setRating(0);
      loadProduct(); // Reload to show new review
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => interactive && setRating(i)}
          className={interactive ? 'cursor-pointer' : ''}
        >
          {i <= rating ? (
            <StarSolidIcon className="h-6 w-6 text-yellow-400" />
          ) : (
            <StarIcon className="h-6 w-6 text-gray-300" />
          )}
        </button>
      );
    }
    return stars;
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  // Handle both array format (images) and single string format (imageUrl/image)
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : (product.imageUrl || product.image ? [product.imageUrl || product.image] : []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs 
        customBreadcrumbs={[
          { label: 'Products', href: '/products' },
          { label: product.name, href: null }
        ]}
      />
      
      {/* Back Button */}
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Back to Products
      </Link>

      {/* Product Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Images Carousel */}
        <div className="card-premium relative overflow-hidden">
          {productImages.length > 0 ? (
            <div className="relative">
              <Carousel showThumbs={productImages.length > 1} showStatus={false} infiniteLoop={productImages.length > 1}>
                {productImages.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img 
                      src={img} 
                      alt={`${product.name} - ${idx + 1}`} 
                      className={`h-[500px] object-contain cursor-pointer transition-transform duration-300 ${
                        isZoomed ? 'scale-150' : 'scale-100'
                      }`}
                      onClick={() => setIsZoomed(!isZoomed)}
                    />
                  </div>
                ))}
              </Carousel>
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors z-10"
                title={isZoomed ? 'Zoom out' : 'Zoom in'}
              >
                {isZoomed ? (
                  <MagnifyingGlassMinusIcon className="h-5 w-5 text-gray-600" />
                ) : (
                  <MagnifyingGlassPlusIcon className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          ) : (
            <div className="h-[500px] bg-gray-100 flex flex-col items-center justify-center rounded-2xl">
              <ShoppingBagIcon className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-400">No images available</p>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
              {product.category}
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1">
              {renderStars(Math.floor(product.averageRating || 0))}
            </div>
            <span className="text-sm text-gray-500">
              {product.totalReviews || 0} reviews
            </span>
            {product.stockQuantity > 0 ? (
              <span className="badge badge-success flex items-center gap-1">
                <CheckCircleIcon className="h-3 w-3" />
                In Stock ({product.stockQuantity})
              </span>
            ) : (
              <span className="badge badge-danger flex items-center gap-1">
                <XCircleIcon className="h-3 w-3" />
                Out of Stock
              </span>
            )}
          </div>

          <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 rounded-2xl p-6 border border-primary-100">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-4xl font-bold text-primary-600">
                ₹{product.price?.toLocaleString()}
              </span>
              <span className="text-xl text-gray-400 line-through">
                ₹{product.mrp?.toLocaleString()}
              </span>
              {discount > 0 && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {discount}% OFF
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">Inclusive of all taxes</p>
          </div>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShieldCheckIcon className="h-5 w-5 text-primary-600" />
                Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="bg-white p-3 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{key}</p>
                    <p className="font-medium text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <TruckIcon className="h-6 w-6 text-green-600 mb-2" />
              <p className="text-sm font-semibold text-green-900">Free Delivery</p>
              <p className="text-xs text-green-700">Orders above ₹499</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <ShieldCheckIcon className="h-6 w-6 text-blue-600 mb-2" />
              <p className="text-sm font-semibold text-blue-900">Secure Payment</p>
              <p className="text-xs text-blue-700">100% protected</p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 hover:bg-gray-100 transition-colors font-bold text-lg"
              >
                -
              </button>
              <span className="w-16 text-center font-bold text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                className="px-4 py-3 hover:bg-gray-100 transition-colors font-bold text-lg"
                disabled={quantity >= product.stockQuantity}
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
              className="flex-1 btn-premium py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              Add to Cart
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-all">
              <HeartIcon className="h-6 w-6 text-gray-400 hover:text-red-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="card mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => {
                const relatedImages = relatedProduct.images && relatedProduct.images.length > 0 
                  ? relatedProduct.images 
                  : (relatedProduct.imageUrl || relatedProduct.image ? [relatedProduct.imageUrl || relatedProduct.image] : []);
                const relatedDiscount = Math.round(((relatedProduct.mrp - relatedProduct.price) / relatedProduct.mrp) * 100);
                return (
                  <Link key={relatedProduct.id} to={`/product/${relatedProduct.id}`} className="card-premium group">
                    <div className="relative h-48 bg-gray-100 overflow-hidden rounded-t-2xl">
                      {relatedImages[0] ? (
                        <img
                          src={relatedImages[0]}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingBagIcon className="h-12 w-12 opacity-30" />
                        </div>
                      )}
                      {relatedDiscount > 0 && (
                        <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-full">
                          {relatedDiscount}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">{relatedProduct.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary-600">₹{relatedProduct.price?.toLocaleString()}</span>
                        {relatedDiscount > 0 && (
                          <span className="text-sm text-gray-400 line-through">₹{relatedProduct.mrp?.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="card">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          
          {/* Write Review */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <StarIcon className="h-5 w-5 text-primary-600" />
              Write a Review
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                <div className="flex gap-1">{renderStars(rating, true)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows="4"
                  className="input-field"
                  placeholder="Share your experience with this product... What did you like or dislike?"
                />
              </div>
              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="btn-primary px-8 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {product.reviews && Object.entries(product.reviews).length > 0 ? (
              Object.entries(product.reviews).map(([userId, review]) => (
                <div key={userId} className="bg-white border border-gray-100 rounded-xl p-5 hover-lift">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-primary-600">U{userId}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">User {userId}</p>
                        <div className="flex items-center gap-1">
                          {renderStars(product.ratings?.[userId] || 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <StarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No reviews yet</p>
                <p className="text-gray-400 text-sm mt-1">Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;