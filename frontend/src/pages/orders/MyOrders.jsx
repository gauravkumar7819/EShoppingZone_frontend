import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { orderService } from '../../services/orderService';
import { 
  EyeIcon, 
  ShoppingBagIcon, 
  TruckIcon, 
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrdersByCustomer(user.id);
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items?.some(item => 
          item.productName?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const getStatusConfig = (status) => {
    const configs = {
      'Placed': { 
        color: 'badge-info', 
        icon: ClockIcon,
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700'
      },
      'Confirmed': { 
        color: 'badge-info', 
        icon: CheckCircleIcon,
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700'
      },
      'Processing': { 
        color: 'badge-warning', 
        icon: ArrowPathIcon,
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700'
      },
      'Shipped': { 
        color: 'badge-warning', 
        icon: TruckIcon,
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700'
      },
      'Delivered': { 
        color: 'badge-success', 
        icon: CheckCircleIcon,
        bgColor: 'bg-green-50',
        textColor: 'text-green-700'
      },
      'Cancelled': { 
        color: 'badge-danger', 
        icon: XCircleIcon,
        bgColor: 'bg-red-50',
        textColor: 'text-red-700'
      },
      'Refunded': { 
        color: 'badge-info', 
        icon: ArrowPathIcon,
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700'
      },
    };
    return configs[status] || configs['Placed'];
  };

  const getStatusCounts = () => {
    const counts = { all: orders.length };
    orders.forEach(order => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return counts;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="loading-spinner mb-4"></div>
        <p className="text-gray-500">Loading your orders...</p>
      </div>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-500">Track and manage your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <ShoppingBagIcon className="empty-state-icon" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-6 max-w-md">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">
            <ShoppingBagIcon className="h-5 w-5" />
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders by ID or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-200"
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    statusFilter === 'all'
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All ({statusCounts.all})
                </button>
                <button
                  onClick={() => setStatusFilter('Processing')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    statusFilter === 'Processing'
                      ? 'bg-yellow-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Processing ({statusCounts.Processing || 0})
                </button>
                <button
                  onClick={() => setStatusFilter('Shipped')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    statusFilter === 'Shipped'
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Shipped ({statusCounts.Shipped || 0})
                </button>
                <button
                  onClick={() => setStatusFilter('Delivered')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    statusFilter === 'Delivered'
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Delivered ({statusCounts.Delivered || 0})
                </button>
                <button
                  onClick={() => setStatusFilter('Cancelled')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    statusFilter === 'Cancelled'
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Cancelled ({statusCounts.Cancelled || 0})
                </button>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="empty-state">
              <FunnelIcon className="empty-state-icon" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'No orders match the selected filter'}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={order.orderId}
                    className="card hover-lift group"
                  >
                    <div className="p-6">
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">
                              Order #{order.orderId}
                            </h3>
                            <span className={`badge ${statusConfig.color} flex items-center gap-1.5`}>
                              <StatusIcon className="h-3.5 w-3.5" />
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            <ClockIcon className="h-4 w-4" />
                            Placed on {new Date(order.orderDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary-600">
                            ₹{order.totalAmount?.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <div className="space-y-3">
                          {order.items?.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0">
                                  <ShoppingBagIcon className="h-6 w-6 text-gray-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">
                                    {item.productName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                              </div>
                              <p className="font-semibold text-gray-700 text-sm">
                                ₹{item.subtotal?.toLocaleString()}
                              </p>
                            </div>
                          ))}
                          {order.items?.length > 3 && (
                            <p className="text-sm text-gray-500 text-center pt-2 border-t border-gray-200">
                              +{order.items.length - 3} more items
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex justify-end">
                        <Link
                          to={`/orders/${order.orderId}`}
                          className="btn-secondary inline-flex items-center gap-2 group-hover:bg-primary-50 group-hover:border-primary-200 group-hover:text-primary-700 transition-all duration-200"
                        >
                          <EyeIcon className="h-4 w-4" />
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyOrders;