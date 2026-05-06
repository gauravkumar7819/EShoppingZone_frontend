import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { orderService } from '../../services/orderService';
import { 
  ShoppingBagIcon, 
  CurrencyRupeeIcon, 
  CalendarIcon,
  UserIcon,
  MapPinIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await adminService.getAllOrders();
      setOrders(data || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, { status: newStatus });
      toast.success('Order status updated successfully');
      loadOrders();
      setShowStatusModal(false);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    
    try {
      await adminService.deleteOrder(orderId);
      toast.success('Order deleted successfully');
      loadOrders();
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = order.orderId.toString().includes(search) ||
      (order.customerName && order.customerName.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
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
      <div className="flex justify-center items-center h-96">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (filteredOrders.length === 0) {
    return (
      <div className="empty-state">
        <ShoppingBagIcon className="empty-state-icon" />
        <p className="text-gray-500 text-lg">No orders found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
          <p className="text-gray-500 mt-2">Manage all platform orders</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
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
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <div key={order.orderId} className="card">
            <div className="flex justify-between items-start mb-4 p-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-gray-800">Order #{order.orderId}</h3>
                  <span className={`badge ${getStatusColor(order.status)}`}>
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
            <div className="border-t pt-4 mb-4 px-6">
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
                      ₹{item.subtotal?.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            {order.deliveryAddress && (
              <div className="border-t pt-4 mb-4 px-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{order.deliveryAddress}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="border-t pt-4 flex gap-2 px-6 pb-6">
              <select
                value={order.status}
                onChange={(e) => handleStatusUpdate(order.orderId, e.target.value)}
                className="input-field px-3 py-2 text-sm"
              >
                <option value="Placed">Placed</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <button
                onClick={() => handleDeleteOrder(order.orderId)}
                className="btn-danger px-3 py-2 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
