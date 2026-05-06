import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { XMarkIcon, PlusIcon, MinusIcon, TrashIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

const CartDrawer = () => {
  const { cart, isOpen, setIsOpen, updateQuantity, removeItem, getCartTotal, loading } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fade-in"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 animate-slide-in flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Your Cart ({cart?.items?.length || 0})</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="text-gray-500">Loading your cart...</p>
            </div>
          ) : !cart?.items || cart.items.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-300 mb-4">
                <ShoppingCartIcon className="h-16 w-16 mx-auto" />
              </div>
              <p className="text-gray-500 mb-2">Your cart is empty</p>
              <p className="text-sm text-gray-400 mb-4">Add some items to get started!</p>
              <Link
                to="/products"
                onClick={() => setIsOpen(false)}
                className="btn-primary inline-block"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-4 hover:bg-gray-50 rounded-lg p-2 transition-colors">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 line-clamp-1">{item.productName}</h3>
                  <p className="text-primary-600 font-semibold">₹{item.price.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 ml-auto text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Remove item"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Subtotal: ₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart?.items && cart.items.length > 0 && (
          <div className="border-t p-4 space-y-4 bg-gray-50">
            <div className="space-y-2">
              <div className="flex justify-between text-lg font-semibold">
                <span>Subtotal:</span>
                <span className="text-primary-600">₹{getCartTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping:</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tax:</span>
                <span>Included</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span className="text-primary-600">₹{getCartTotal().toLocaleString()}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              onClick={() => setIsOpen(false)}
              className="w-full btn-primary py-3 text-center block font-semibold"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full btn-secondary py-2 text-center"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;