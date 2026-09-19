import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminOrders } from './AdminOrders';
import { AdminCustomers } from './AdminCustomers';
import { AdminTestimonials } from './AdminTestimonials';
import { AdminCMS } from './AdminCMS';
import { AdminSettings } from './AdminSettings';
import { Menu, Store, ExternalLink } from 'lucide-react';
import { AdminTab } from '../../types';

export const AdminLayout: React.FC = () => {
  const { adminTab, setAdminTab, setRoute, orders } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pendingCount = orders.filter(o => o.status === 'placed' || o.status === 'confirmed').length;

  const tabTitles: Record<AdminTab, string> = {
    dashboard: 'Farm Commerce Dashboard',
    products: 'Products Catalog Management',
    categories: 'Produce Categories',
    orders: 'Live Orders & Logistics Dispatch',
    customers: 'Customer Accounts',
    testimonials: 'Social Proof & Reviews',
    messages: 'Customer Inquiries & Support Messages',
    cms: 'Website Content Management (CMS)',
    settings: 'Store Configuration & Economics',
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* Sidebar */}
      <AdminSidebar
        currentTab={adminTab}
        setCurrentTab={setAdminTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-800 lg:hidden rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-black text-slate-900 truncate">
              {tabTitles[adminTab]}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            {pendingCount > 0 && (
              <button
                onClick={() => setAdminTab('orders')}
                className="hidden sm:inline-flex items-center space-x-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold hover:bg-amber-100 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>{pendingCount} Pending Order{pendingCount === 1 ? '' : 's'}</span>
              </button>
            )}

            <button
              onClick={() => setRoute('home')}
              className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span className="hidden sm:inline">Storefront Live</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {adminTab === 'dashboard' && <AdminDashboard setCurrentTab={setAdminTab} />}
          {adminTab === 'products' && <AdminProducts />}
          {adminTab === 'categories' && <AdminCategories />}
          {adminTab === 'orders' && <AdminOrders />}
          {adminTab === 'customers' && <AdminCustomers />}
          {adminTab === 'testimonials' && <AdminTestimonials />}
          {adminTab === 'messages' && <AdminDashboard setCurrentTab={setAdminTab} />}
          {adminTab === 'cms' && <AdminCMS />}
          {adminTab === 'settings' && <AdminSettings />}
        </main>

      </div>

    </div>
  );
};
