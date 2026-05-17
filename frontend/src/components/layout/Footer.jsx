import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin 
} from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-brand font-black mb-4 text-white">
              Shopping<span className="text-primary-500">Karo</span>
            </h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              India's smartest way to shop. Quality products, best prices, and exceptional service delivered Dil Se!
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/products" className="hover:text-white transition-colors">Products</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns Policy</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-400 mb-6">
              <li className="flex items-start gap-3">
                <EnvelopeIcon className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span>support@shoppingkaro.com</span>
              </li>
              <li className="flex items-start gap-3">
                <PhoneIcon className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span>+91 1800-SHOP-KARO</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span>ShoppingKaro HQ, Bandra West, Mumbai, MH</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div>
              <h4 className="font-semibold mb-3">Newsletter</h4>
              {subscribed ? (
                <div className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm text-center">
                  Thank you for subscribing!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 rounded-l-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-r-lg text-sm font-medium transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              <p className="mb-2">We Accept:</p>
              <div className="flex gap-3">
                <div className="bg-white px-3 py-1 rounded text-xs font-bold text-gray-800">VISA</div>
                <div className="bg-white px-3 py-1 rounded text-xs font-bold text-gray-800">MasterCard</div>
                <div className="bg-white px-3 py-1 rounded text-xs font-bold text-gray-800">UPI</div>
                <div className="bg-white px-3 py-1 rounded text-xs font-bold text-gray-800">Paytm</div>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              <p>&copy; 2026 ShoppingKaro India Private Limited. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;