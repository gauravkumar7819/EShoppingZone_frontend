import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingBagIcon, 
  ArrowRightIcon, 
  FireIcon, 
  BoltIcon, 
  ShieldCheckIcon, 
  TruckIcon,
  StarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import ProductCard from './products/ProductCard';

const categories = [
  { name: 'Fashion', icon: '👕', count: '1.2k+ Items', color: 'bg-blue-50' },
  { name: 'Electronics', icon: '📱', count: '850+ Items', color: 'bg-purple-50' },
  { name: 'Home & Decor', icon: '🏠', count: '2k+ Items', color: 'bg-orange-50' },
  { name: 'Beauty', icon: '💄', count: '500+ Items', color: 'bg-pink-50' },
  { name: 'Appliances', icon: '📺', count: '300+ Items', color: 'bg-cyan-50' },
  { name: 'Groceries', icon: '🍎', count: '1.5k+ Items', color: 'bg-green-50' },
];

const trendingProducts = [
  { id: 1, name: "Premium Wireless Headphones", price: 2999, mrp: 5999, category: "Electronics", images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"] },
  { id: 2, name: "Modern Smart Watch", price: 1499, mrp: 3499, category: "Fashion", images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"] },
  { id: 3, name: "Artistic Home Vase", price: 899, mrp: 1299, category: "Home", images: ["https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500&q=80"] },
  { id: 4, name: "Organic Face Serum", price: 499, mrp: 999, category: "Beauty", images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80"] },
];

const Home = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-primary-950 pt-20 pb-32 lg:pt-32 lg:pb-48 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#4f46e5_0%,_transparent_60%)] animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-500/20 text-secondary-400 text-xs font-black uppercase tracking-[0.2em] mb-8 border border-secondary-500/30">
                <FireIcon className="h-4 w-4" />
                India's Biggest Sale is Live!
              </div>
              <h1 className="text-6xl lg:text-8xl font-brand font-black text-white leading-[1.1] mb-8">
                Shopping <span className="text-primary-500">Karo</span>, <br />
                <span className="text-secondary-500">Dil Se!</span>
              </h1>
              <p className="text-xl text-slate-300 mb-12 max-w-lg leading-relaxed font-medium">
                Experience the magic of Indian retail. From heritage crafts to modern essentials, get everything delivered to your doorstep.
              </p>
              <div className="flex flex-wrap gap-5">
                <Link to="/products" className="btn-cta px-10 py-5 text-lg">
                  Shop the Sale
                </Link>
                <Link to="/products?category=Electronics" className="bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-bold transition-all border border-white/10 backdrop-blur-xl">
                  View Gadgets
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/10">
                <img 
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80" 
                  alt="Hero" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary-500 rounded-full flex flex-col items-center justify-center rotate-12 shadow-2xl animate-bounce">
                <span className="text-white font-black text-3xl">70%</span>
                <span className="text-white font-bold text-sm uppercase">Off</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-indigo-50 rounded-2xl shadow-sm">
                <TruckIcon className="h-7 w-7 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Pan India Delivery</h4>
                <p className="text-xs font-semibold text-slate-500">Free on orders above ₹499</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="p-4 bg-amber-50 rounded-2xl shadow-sm">
                <ArrowPathIcon className="h-7 w-7 text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">7-Day Returns</h4>
                <p className="text-xs font-semibold text-slate-500">Hassle-free exchanges</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="p-4 bg-emerald-50 rounded-2xl shadow-sm">
                <ShieldCheckIcon className="h-7 w-7 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Secure Payments</h4>
                <p className="text-xs font-semibold text-slate-500">100% PCI-DSS Secure</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="p-4 bg-rose-50 rounded-2xl shadow-sm">
                <StarIcon className="h-7 w-7 text-rose-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Curated Quality</h4>
                <p className="text-xs font-semibold text-slate-500">Only Verified Sellers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Shop by Category</h2>
            <div className="w-20 h-1.5 bg-secondary-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className={`${cat.color} p-8 rounded-[2.5rem] flex flex-col items-center text-center group cursor-pointer border border-transparent hover:border-gray-200 transition-all`}
              >
                <span className="text-5xl mb-4 group-hover:scale-125 transition-transform">{cat.icon}</span>
                <h4 className="font-bold text-gray-900 mb-1">{cat.name}</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{cat.count}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-2">Trending Now</h2>
              <p className="text-gray-500">The most loved products this week</p>
            </div>
            <Link to="/products" className="text-primary-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              View All <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale Banner */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-secondary-500 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden shadow-2xl shadow-secondary-500/30">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_100%_0%,_rgba(255,255,255,0.2)_0%,_transparent_70%)]"></div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 text-white">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-bold uppercase tracking-widest mb-6">
                  <BoltIcon className="h-5 w-5" /> Flash Sale
                </div>
                <h2 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
                  Deal of the <br /> Day!
                </h2>
                <p className="text-xl text-white/80 mb-10 max-w-md">
                  Hurry up! These prices won't last forever. Ends in <span className="font-black text-white">04h : 20m : 55s</span>
                </p>
                <Link to="/products" className="bg-white text-secondary-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all inline-block">
                  Grab it Now
                </Link>
              </div>
              <div className="w-full lg:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80" 
                  alt="Deal" 
                  className="w-full h-auto drop-shadow-2xl hover:rotate-6 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
