import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { orderService } from '../../services/orderService';
import { 
  TruckIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ArrowLeftIcon,
  ClockIcon,
  MapPinIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  ClipboardDocumentIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadOrderDetails();
  }, [id]);

  const loadOrderDetails = async () => {
    setLoading(true);
    try {
      const [orderData, trackingData] = await Promise.all([
        orderService.getOrderById(id),
        orderService.trackOrder(id),
      ]);
      setOrder(orderData);
      setTracking(trackingData);
    } catch (error) {
      console.error('Failed to load order:', error);
      toast.error('Order not found');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) return;
    
    setCancelling(true);
    try {
      await orderService.cancelOrder(id, 'Cancelled by customer');
      toast.success('Order cancelled successfully');
      loadOrderDetails();
    } catch (error) {
      toast.error('Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      'Placed': { 
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: ClockIcon,
        label: 'Order Placed'
      },
      'Confirmed': { 
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: CheckCircleIcon,
        label: 'Order Confirmed'
      },
      'Processing': { 
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: ArrowPathIcon,
        label: 'Processing'
      },
      'Shipped': { 
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        icon: TruckIcon,
        label: 'Shipped'
      },
      'Delivered': { 
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: CheckCircleIcon,
        label: 'Delivered'
      },
      'Cancelled': { 
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: XCircleIcon,
        label: 'Cancelled'
      },
      'Refunded': { 
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        icon: ArrowPathIcon,
        label: 'Refunded'
      },
    };
    return configs[status] || configs['Placed'];
  };

  const getStatusProgress = (status) => {
    const progressMap = {
      'Placed': 10,
      'Confirmed': 25,
      'Processing': 50,
      'Shipped': 75,
      'Delivered': 100,
      'Cancelled': 0,
      'Refunded': 0,
    };
    return progressMap[status] || 10;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="loading-spinner mb-4"></div>
        <p className="text-gray-500">Loading order details...</p>
      </div>
    );
  }

  if (!order) return null;

  const canCancel = ['Placed', 'Confirmed', 'Processing'].includes(order.status);
  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Details</h1>
            <p className="text-gray-500">Order #{order.orderId}</p>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${statusConfig.color}`}>
            <StatusIcon className="h-5 w-5" />
            <span className="font-semibold">{statusConfig.label}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Order Progress</span>
            <span className="text-sm font-semibold text-primary-600">{getStatusProgress(order.status)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getStatusProgress(order.status)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Info & Tracking */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Timeline */}
          {tracking?.statusHistory && (
            <div className="card">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <ClipboardDocumentIcon className="h-5 w-5 text-primary-600" />
                  <h2 className="text-lg font-bold text-gray-900">Order Timeline</h2>
                </div>
                <div className="space-y-0">
                  {tracking.statusHistory.map((status, index) => {
                    const isLast = index === tracking.statusHistory.length - 1;
                    const statusConf = getStatusConfig(status.status);
                    const StatusIcon = statusConf.icon;
                    
                    return (
                      <div key={index} className="relative">
                        {!isLast && (
                          <div className="absolute left-4 top-8 w-0.5 h-full bg-gray-200"></div>
                        )}
                        <div className="flex items-start gap-4 pb-8">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${statusConf.color}`}>
                            <StatusIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-gray-900">{status.status}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(status.changedAt).toLocaleString()}
                              </p>
                            </div>
                            {status.remarks && (
                              <p className="text-sm text-gray-600">{status.remarks}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {tracking.estimatedDeliveryDate && (
                  <div className="mt-4 p-4 bg-primary-50 rounded-xl border border-primary-100">
                    <div className="flex items-center gap-3">
                      <TruckIcon className="h-5 w-5 text-primary-600" />
                      <div>
                        <p className="text-sm font-medium text-primary-900">Estimated Delivery</p>
                        <p className="text-sm text-primary-700">
                          {new Date(tracking.estimatedDeliveryDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="card">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingBagIcon className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-bold text-gray-900">Order Items</h2>
                <span className="ml-auto text-sm text-gray-500">
                  {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0">
                      <ShoppingBagIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.productName}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × ₹{item.price?.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-primary-600">
                      ₹{item.subtotal?.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-primary-600">
                    ₹{order.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          {/* Order Information */}
          <div className="card">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <ClipboardDocumentIcon className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-bold text-gray-900">Order Information</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Order Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(order.orderDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCardIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Payment Method</p>
                    <p className="font-medium text-gray-900">{order.modeOfPayment}</p>
                  </div>
                </div>
                {order.trackingNumber && (
                  <div className="flex items-start gap-3">
                    <TruckIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Tracking Number</p>
                      <p className="font-medium text-gray-900">{order.trackingNumber}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="card">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <MapPinIcon className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 whitespace-pre-line">{order.deliveryAddress}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-3">
                {canCancel && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="w-full btn-danger flex items-center justify-center gap-2"
                  >
                    <XCircleIcon className="h-5 w-5" />
                    {cancelling ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
                <Link
                  to="/products"
                  className="w-full btn-primary inline-flex items-center justify-center gap-2"
                >
                  <ShoppingBagIcon className="h-5 w-5" />
                  Shop Again
                </Link>
                <Link
                  to="/orders"
                  className="w-full btn-secondary inline-flex items-center justify-center gap-2"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                  View All Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;