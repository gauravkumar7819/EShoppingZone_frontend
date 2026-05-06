import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { orderService } from '../../services/orderService';
import { 
  ShoppingBagIcon, 
  CurrencyRupeeIcon, 
  CalendarIcon,
  UserIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const MerchantOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, [user?.userId]);

  const loadOrders = async () => {
    try {
      // LoginResponseDto serializes UserId -> userId (camelCase)
      const userId = user?.userId || user?.UserId || user?.id || user?.Id;
      if (!userId) {
        console.warn('No userId found in user object for merchant orders');
        setOrders([]);
        setLoading(false);
        return;
      }
      const data = await orderService.getOrdersByMerchant(userId);
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status.toLowerCase() === filter.toLowerCase();
  });

  const getStatusColor = (status) => {
    const colors = {
      'Placed': 'bg-blue-100 text-blue-800',
      'Confirmed': 'bg-purple-100 text-purple-800',
      'Processing': 'bg-yellow-100 text-yellow-800',
      'Shipped': 'bg-indigo-100 text-indigo-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'Refunded': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-40 bg-gray-100 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        <p className="text-gray-500 mt-2">Manage your incoming orders</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium text-sm capitalize transition-colors ${
              filter === status
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <ShoppingBagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order.orderId} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-800">Order #{order.orderId}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      {new Date(order.orderDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <UserIcon className="h-4 w-4" />
                      Customer #{order.customerId}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">
                    ₹{order.totalAmount?.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">{order.modeOfPayment}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-700 mb-3">Items</h4>
                <div className="space-y-2">
                  {order.items?.map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.productName}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        ₹{(item.price * item.quantity)?.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              {order.deliveryAddress && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{order.deliveryAddress}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MerchantOrders;
