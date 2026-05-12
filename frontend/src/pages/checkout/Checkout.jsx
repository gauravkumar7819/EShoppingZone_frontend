import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWallet } from '../../contexts/WalletContext';
import { authService } from '../../services/authService';
import { orderService } from '../../services/orderService';
import { WalletProvider } from '../../contexts/WalletContext';
import toast from 'react-hot-toast';
import {
  MapPinIcon,
  CreditCardIcon,
  WalletIcon,
  ArrowLeftIcon,
  ShoppingBagIcon,
  TruckIcon,
  CheckCircleIcon,
  PlusIcon,
  XMarkIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const CheckoutContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, getCartTotal, loadCart } = useCart();
  const { balance, makePayment } = useWallet();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    houseNumber: '',
    streetName: '',
    colonyName: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    loadAddresses();
    loadCart();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await authService.getAddresses();
      console.log('Addresses response:', data);
      setAddresses(data);
      // Handle different possible property names for default address
      const defaultAddr = data.find(a => a.isDefault || a.isDefaultAddress || a.default);
      if (defaultAddr) setSelectedAddress(defaultAddr);
    } catch (error) {
      console.error('Failed to load addresses:', error);
      console.error('Error response:', error.response?.data);
      toast.error('Failed to load addresses');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const newAddress = await authService.addAddress(addressForm);
      toast.success('Address added successfully');
      setAddressForm({
        houseNumber: '',
        streetName: '',
        colonyName: '',
        city: '',
        state: '',
        pincode: '',
      });
      setShowAddressForm(false);
      await loadAddresses();
      // Auto-select the newly added address
      if (newAddress) {
        setSelectedAddress(newAddress);
      }
    } catch (error) {
      console.error('Failed to add address:', error);
      toast.error('Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    if (!cart?.cartId) {
      toast.error('Cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customerId: user.id,
        cartId: cart.cartId,
        deliveryAddressId: selectedAddress.id,
        modeOfPayment: paymentMethod,
        deliveryAddress: `${selectedAddress.houseNumber}, ${selectedAddress.streetName}, ${selectedAddress.colonyName}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`,
      };

      // Backend handles wallet payment internally - no need to call makePayment from frontend
      const response = await orderService.placeOrder(orderData);
      
      if (response.paymentSuccess || paymentMethod === 'COD') {
        toast.success('Order placed successfully!');
        navigate(`/orders/${response.orderId}`);
      } else {
        toast.error(response.message || 'Order failed');
      }
    } catch (error) {
      console.error('Order failed:', error);
      toast.error(error.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = getCartTotal();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-500">Complete your order in a few simple steps</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <div className="card">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5 text-primary-600" />
                  <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
                </div>
                {addresses.length > 0 && (
                  <button 
                    onClick={() => setShowAddressForm(!showAddressForm)} 
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    {showAddressForm ? (
                      <>
                        <XMarkIcon className="h-4 w-4" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <PlusIcon className="h-4 w-4" />
                        Add New Address
                      </>
                    )}
                  </button>
                )}
              </div>

              {showAddressForm && (
                <div className="mb-6 p-6 bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl border border-primary-100">
                  <h3 className="font-bold text-gray-900 mb-4">Add New Address</h3>
                  <form onSubmit={handleAddAddress} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">House Number</label>
                        <input
                          type="text"
                          value={addressForm.houseNumber}
                          onChange={(e) => setAddressForm({ ...addressForm, houseNumber: e.target.value })}
                          className="input-field"
                          placeholder="Enter house/flat number"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Street Name</label>
                        <input
                          type="text"
                          value={addressForm.streetName}
                          onChange={(e) => setAddressForm({ ...addressForm, streetName: e.target.value })}
                          className="input-field"
                          placeholder="Enter street name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Colony/Area</label>
                        <input
                          type="text"
                          value={addressForm.colonyName}
                          onChange={(e) => setAddressForm({ ...addressForm, colonyName: e.target.value })}
                          className="input-field"
                          placeholder="Enter colony or area"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          className="input-field"
                          placeholder="Enter city"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                        <input
                          type="text"
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          className="input-field"
                          placeholder="Enter state"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Pincode</label>
                        <input
                          type="text"
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                          className="input-field"
                          placeholder="Enter 6-digit pincode"
                          pattern="[0-9]{6}"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 pt-2">
                      <button type="submit" className="btn-primary flex-1 py-3">Save Address</button>
                      <button 
                        type="button" 
                        onClick={() => setShowAddressForm(false)} 
                        className="btn-secondary flex-1 py-3"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {addresses.length === 0 && !showAddressForm ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <MapPinIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium mb-4">No addresses saved yet</p>
                  <button 
                    onClick={() => setShowAddressForm(true)} 
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Add New Address
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label 
                      key={addr.id} 
                      className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                        selectedAddress?.id === addr.id
                          ? 'border-primary-500 bg-primary-50 shadow-md'
                          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="relative mt-1">
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress?.id === addr.id}
                          onChange={() => setSelectedAddress(addr)}
                          className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        {selectedAddress?.id === addr.id && (
                          <div className="absolute -inset-1 bg-primary-500/20 rounded-full animate-ping"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-bold text-gray-900">
                              {addr.houseNumber}, {addr.streetName}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {addr.colonyName}, {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                          </div>
                          {(addr.isDefault || addr.isDefaultAddress || addr.default) && (
                            <span className="badge badge-success flex items-center gap-1 flex-shrink-0">
                              <CheckCircleIcon className="h-3 w-3" />
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="card">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <CreditCardIcon className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
              </div>
              <div className="space-y-4">
                <label 
                  className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                    paymentMethod === 'COD'
                      ? 'border-primary-500 bg-primary-50 shadow-md'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    data-testid="payment-method-cod"
                    className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <TruckIcon className="h-5 w-5 text-gray-600" />
                      <p className="font-bold text-gray-900">Cash on Delivery</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Pay when you receive the order</p>
                  </div>
                  {paymentMethod === 'COD' && (
                    <CheckCircleIcon className="h-6 w-6 text-primary-600" />
                  )}
                </label>
                
                <label 
                  className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                    paymentMethod === 'Wallet'
                      ? 'border-primary-500 bg-primary-50 shadow-md'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  } ${balance < totalAmount ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="Wallet"
                    checked={paymentMethod === 'Wallet'}
                    onChange={() => setPaymentMethod('Wallet')}
                    disabled={balance < totalAmount}
                    data-testid="payment-method-wallet"
                    className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <WalletIcon className="h-5 w-5 text-gray-600" />
                      <p className="font-bold text-gray-900">Wallet Payment</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Available balance: <span className="font-semibold text-gray-900">₹{balance?.toLocaleString() || 0}</span>
                    </p>
                    {balance < totalAmount && (
                      <p className="text-sm text-red-500 font-medium mt-1 flex items-center gap-1">
                        <XMarkIcon className="h-4 w-4" />
                        Insufficient balance
                      </p>
                    )}
                  </div>
                  {paymentMethod === 'Wallet' && balance >= totalAmount && (
                    <CheckCircleIcon className="h-6 w-6 text-primary-600" />
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="card-premium sticky top-24">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingBagIcon className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
              </div>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cart?.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0">
                      <ShoppingBagIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{item.productName}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900 text-sm">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-500">Included</span>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-primary-600" data-testid="order-total">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-semibold text-green-900">Secure Checkout</p>
                </div>
                <p className="text-xs text-green-700 mt-1">Your payment information is safe with us</p>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || !selectedAddress || (paymentMethod === 'Wallet' && balance < totalAmount)}
                data-testid="place-order-button"
                className="w-full btn-premium py-4 mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner h-5 w-5 border-b-2 border-white"></div>
                    Placing Order...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5" />
                    Place Order
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing this order, you agree to our Terms of Service
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Checkout = () => {
  return (
    <WalletProvider>
      <CheckoutContent />
    </WalletProvider>
  );
};

export default Checkout;