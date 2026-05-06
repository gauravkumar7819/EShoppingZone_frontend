import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { orderService } from '../../services/orderService';
import { UsersIcon } from '@heroicons/react/24/outline';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { CurrencyRupeeIcon } from '@heroicons/react/24/outline';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon, ClipboardDocumentListIcon, CubeIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AdminOverview from './AdminOverview';
import AdminUsers from './AdminUsers';
import AdminOrders from './AdminOrders';
import AdminProducts from './AdminProducts';
import AdminMerchants from './AdminMerchants';

const AdminDashboard = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: ChartBarIcon },
    { name: 'Users', path: '/admin/users', icon: UsersIcon },
    { name: 'Orders', path: '/admin/orders', icon: ClipboardDocumentListIcon },
    { name: 'Products', path: '/admin/products', icon: CubeIcon },
    { name: 'Merchants', path: '/admin/merchants', icon: BuildingStorefrontIcon },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] gap-6 p-4 md:p-8 bg-gray-50/50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 space-y-2">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Admin Menu</h2>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span className="font-medium">{item.name}</span>
                  {isActive && <ChevronRightIcon className="h-4 w-4 ml-auto text-white" />}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-50"></div>
        
        <div className="relative z-10 h-full">
          <Routes>
            <Route path="dashboard" element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="merchants" element={<AdminMerchants />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;