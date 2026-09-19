import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle, 
  Plus, 
  TrendingUp, 
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { AdminTab, OrderStatus } from '../../types';

interface AdminDashboardProps {
  setCurrentTab: (tab: AdminTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setCurrentTab }) => {
  const { 
    orders, 
    products, 
    categories, 
    users, 
    settings, 
    contactMessages, 
    updateOrderStatus 
  } = useStore();

  // Metrics
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter(o => o.status === 'placed' || o.status === 'confirmed');
  const outOfStockProducts = products.filter(p => p.status === 'out_of_stock');
  const customersCount = users.filter(u => u.role === 'customer').length;
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const statusOptions: OrderStatus[] = [
    'placed',
    'confirmed',
    'preparing',
    'out_for_delivery',
    'delivered',
    'cancelled',
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Farm Commerce Dashboard</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time morning harvests, incoming customer baskets, and dispatch statuses.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setCurrentTab('products')}
            className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
          <button
            onClick={() => setCurrentTab('categories')}
            className="inline-flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <i className="fa-solid fa-indian-rupee-sign text-sm"></i>
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">
            {settings.currencySymbol}{totalRevenue.toLocaleString()}
          </p>
          <div className="flex items-center space-x-1 text-[11px] text-emerald-700 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Direct from partner agro-farms</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Orders</span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">{orders.length}</p>
          <p className="text-[11px] text-slate-500">
            <span className="font-bold text-amber-600">{pendingOrders.length}</span> awaiting packing/dispatch
          </p>
        </div>

        {/* Products in Catalog */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Products Catalog</span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">{products.length}</p>
          <p className="text-[11px] text-slate-500">
            Across <span className="font-bold text-purple-700">{categories.length}</span> farm categories
          </p>
        </div>

        {/* Registered Customers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Customers</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">{customersCount}</p>
          <p className="text-[11px] text-slate-500">Verified household kitchen accounts</p>
        </div>

      </div>

      {/* Stock Alerts & Customer Inquiries Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Out of Stock Alert Card */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Harvest Stock Alert ({outOfStockProducts.length})
              </h3>
            </div>
            <button
              onClick={() => setCurrentTab('products')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Manage Catalog
            </button>
          </div>

          {outOfStockProducts.length === 0 ? (
            <div className="py-4 text-center text-xs text-slate-500 flex items-center justify-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>All vegetables currently in stock!</span>
            </div>
          ) : (
            <div className="space-y-2">
              {outOfStockProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between p-2 rounded-xl bg-rose-50/50 border border-rose-100 text-xs">
                  <div className="flex items-center space-x-2.5">
                    <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <p className="text-[10px] text-slate-500">{p.farmOrigin}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                    Sold Out
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Customer Inquiries Card */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recent Contact Messages ({contactMessages.length})
              </h3>
            </div>
          </div>

          {contactMessages.length === 0 ? (
            <div className="py-4 text-center text-xs text-slate-500">
              No inquiries received yet.
            </div>
          ) : (
            <div className="space-y-2">
              {contactMessages.slice(0, 3).map(msg => (
                <div key={msg.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{msg.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-emerald-800">{msg.subject}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">"{msg.message}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Recent Orders Live Table with Quick Status Changer */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Customer Orders</h3>
            <p className="text-[11px] text-slate-500">Change status here to immediately update the customer tracking screen.</p>
          </div>
          <button
            onClick={() => setCurrentTab('orders')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>View All ({orders.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Live Dispatch Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{ord.customerName}</p>
                    <p className="text-[10px] text-slate-500">{ord.customerPhone}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {ord.items.length} items
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                    {settings.currencySymbol}{ord.total}
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {ord.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border outline-hidden cursor-pointer ${
                        ord.status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : ord.status === 'out_for_delivery'
                          ? 'bg-purple-50 text-purple-800 border-purple-300'
                          : ord.status === 'preparing'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : ord.status === 'cancelled'
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : 'bg-blue-50 text-blue-800 border-blue-300'
                      }`}
                    >
                      {statusOptions.map((st) => (
                        <option key={st} value={st}>
                          {st.replace(/_/g, ' ').toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
