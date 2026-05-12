import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  ShoppingCartIcon, 
  UserIcon, 
  HomeIcon,
  WalletIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getTotalItems, setIsOpen } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const totalItems = getTotalItems();
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <HomeIcon className="h-8 w-8 text-primary-600" />
            <span className="font-bold text-xl text-gray-800 dark:text-gray-100 hidden sm:inline">EShoppingZone</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/products" data-testid="nav-products" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Products
            </Link>
            
            {user?.role === 'Merchant' && (
              <Link to="/merchant/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Merchant Dashboard
              </Link>
            )}
            
            {user?.role === 'Admin' && (
              <>
                <Link to="/admin/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  <ChartBarIcon className="h-5 w-5 inline mr-1" />
                  Analytics
                </Link>
                <Link to="/admin/users" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Users
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => setIsOpen(true)}
              data-testid="cart-button"
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <ShoppingCartIcon className="h-6 w-6" data-testid="cart-icon" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <UserIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  <span className="text-gray-700 dark:text-gray-200">{user.fullName?.split(' ')[0]}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 border dark:border-gray-700 animate-fade-in">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <UserIcon className="h-4 w-4 inline mr-2" />
                      My Profile
                    </Link>
                    <Link 
                      to="/orders" 
                      className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <ClipboardDocumentListIcon className="h-4 w-4 inline mr-2" />
                      My Orders
                    </Link>
                    <Link 
                      to="/wallet" 
                      className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <WalletIcon className="h-4 w-4 inline mr-2" />
                      Wallet
                    </Link>
                    <hr className="my-1 dark:border-gray-700" />
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" data-testid="login-link" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium px-3 py-2 rounded-lg transition-colors group relative">
                  Login
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <div className="relative group">
                  <button className="btn-primary flex items-center gap-1 group">
                    Register
                    <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 z-50 border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <Link to="/register/customer" className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      Join as Customer
                    </Link>
                    <Link to="/register/merchant" className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      Join as Merchant
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {showMobileMenu ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t dark:border-gray-700">
            <div className="flex flex-col space-y-3">
              <Link to="/products" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400" onClick={() => setShowMobileMenu(false)}>
                Products
              </Link>
              {user?.role === 'Merchant' && (
                <Link to="/merchant/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400" onClick={() => setShowMobileMenu(false)}>
                  Merchant Dashboard
                </Link>
              )}
              {user?.role === 'Admin' && (
                <>
                  <Link to="/admin/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400" onClick={() => setShowMobileMenu(false)}>
                    Analytics
                  </Link>
                  <Link to="/admin/users" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400" onClick={() => setShowMobileMenu(false)}>
                    Users
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  setIsOpen(true);
                  setShowMobileMenu(false);
                }}
                className="text-left text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              >
                Cart ({totalItems})
              </button>
              {user ? (
                <>
                  <Link to="/profile" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400" onClick={() => setShowMobileMenu(false)}>
                    Profile
                  </Link>
                  <Link to="/orders" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400" onClick={() => setShowMobileMenu(false)}>
                    Orders
                  </Link>
                  <Link to="/wallet" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400" onClick={() => setShowMobileMenu(false)}>
                    Wallet
                  </Link>
                  <button onClick={logout} className="text-left text-red-600 dark:text-red-400">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400" onClick={() => setShowMobileMenu(false)}>
                    Login
                  </Link>
                  <Link to="/register/customer" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400" onClick={() => setShowMobileMenu(false)}>
                    Join as Customer
                  </Link>
                  <Link to="/register/merchant" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400" onClick={() => setShowMobileMenu(false)}>
                    Join as Merchant
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;