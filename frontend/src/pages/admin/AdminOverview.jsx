import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { UsersIcon } from '@heroicons/react/24/outline';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { CurrencyRupeeIcon } from '@heroicons/react/24/outline';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminOverview = () => {
  const [analytics, setAnalytics] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsData, revenue, status] = await Promise.allSettled([
        adminService.getAnalytics(),
        adminService.getRevenueAnalytics(30, 'daily'),
        adminService.getOrderStatusAnalytics(),
      ]);
      
      if (analyticsData.status === 'fulfilled') setAnalytics(analyticsData.value);
      if (revenue.status === 'fulfilled') setRevenueData(revenue.value);
      if (status.status === 'fulfilled') setStatusData(status.value);
      
      if (analyticsData.status === 'rejected') console.error('Admin summary failed:', analyticsData.reason);
    } catch (error) {
      console.error('Failed to load analytics suite:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Admin Console</h1>
          <p className="text-gray-500 mt-2">Global system analytics and operations hub</p>
        </div>
        <div className="flex gap-3">
          <button onClick={loadAnalytics} className="btn-secondary flex items-center gap-2">
            <ChartBarIcon className="h-5 w-5" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="card-premium p-6 group hover:bg-primary-600 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-primary-100 transition-colors">Total Users</p>
              <p className="text-3xl font-black text-gray-900 group-hover:text-white transition-colors">{analytics?.summary?.totalUsers || 0}</p>
            </div>
            <div className="p-3 bg-primary-50 rounded-2xl group-hover:bg-primary-500 transition-colors">
              <UsersIcon className="h-8 w-8 text-primary-600 group-hover:text-white" />
            </div>
          </div>
        </div>

        <div className="card-premium p-6 group hover:bg-green-600 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-green-100 transition-colors">Total Orders</p>
              <p className="text-3xl font-black text-gray-900 group-hover:text-white transition-colors">{analytics?.summary?.totalOrders || 0}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-2xl group-hover:bg-green-500 transition-colors">
              <ShoppingBagIcon className="h-8 w-8 text-green-600 group-hover:text-white" />
            </div>
          </div>
        </div>

        <div className="card-premium p-6 group hover:bg-yellow-600 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-yellow-100 transition-colors">Total Revenue</p>
              <p className="text-3xl font-black text-gray-900 group-hover:text-white transition-colors">₹{(analytics?.summary?.totalRevenue || 0).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-2xl group-hover:bg-yellow-500 transition-colors">
              <CurrencyRupeeIcon className="h-8 w-8 text-yellow-600 group-hover:text-white" />
            </div>
          </div>
        </div>

        <div className="card-premium p-6 group hover:bg-purple-600 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-purple-100 transition-colors">Conversion</p>
              <p className="text-3xl font-black text-gray-900 group-hover:text-white transition-colors">{analytics?.summary?.conversionRate?.toFixed(1) || 0}%</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-2xl group-hover:bg-purple-500 transition-colors">
              <ChartBarIcon className="h-8 w-8 text-purple-600 group-hover:text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 card-premium p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-800">Revenue Analysis</h2>
            <div className="bg-gray-50 px-4 py-2 rounded-xl text-xs font-bold text-gray-500">Daily Forecast</div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} name="Revenue (₹)" />
                <Line type="monotone" dataKey="orderCount" stroke="#10b981" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-premium p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-8">Order Status</h2>
          <div className="h-[350px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="count"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-3xl font-black text-gray-900">{analytics?.summary?.totalOrders || 0}</span>
              <span className="text-[10px] uppercase font-bold text-gray-400">Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card-premium overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <h2 className="text-xl font-bold text-gray-800">Order Status Distribution</h2>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {analytics?.statusDistribution?.map((status) => (
              <div key={status.status} className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{status.status}</p>
                <p className="text-2xl font-black text-gray-800">{status.count}</p>
                <p className="text-xs text-gray-500">{status.percentage.toFixed(1)}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
