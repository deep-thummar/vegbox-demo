import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  Search, 
  AlertCircle, 
  XCircle,
  ExternalLink 
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';

export const MyOrdersPage: React.FC = () => {
  const { orders, currentUser, settings, setRoute } = useStore();
  const [searchOrderId, setSearchOrderId] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // User's orders (or all if admin or searching)
  const userOrders = currentUser 
    ? orders.filter(o => o.userId === currentUser.id || o.customerEmail === currentUser.email)
    : orders;

  // Selected or active order to track in detail
  const activeOrder = orders.find(o => 
    o.id === selectedOrderId || 
    o.orderNumber.toLowerCase() === searchOrderId.trim().toLowerCase()
  ) || (userOrders.length > 0 ? userOrders[0] : null);

  const statuses: OrderStatus[] = [
    'placed',
    'confirmed',
    'preparing',
    'out_for_delivery',
    'delivered',
  ];

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'cancelled') return -1;
    return statuses.indexOf(status);
  };

  const currentStep = activeOrder ? getStepIndex(activeOrder.status) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-800 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" />
            <span>Live Farm Tracking</span>
          </span>
          <h1 className="text-2xl sm:text-4xl font-black">My Orders & Live Dispatch</h1>
          <p className="text-xs sm:text-sm text-emerald-100">
            Real-time status updates synced straight from our farm sorting hubs and delivery couriers.
          </p>
        </div>
      </div>

      {/* Guest Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Order ID (e.g. VB-94120, VB-94121)..."
            value={searchOrderId}
            onChange={(e) => setSearchOrderId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl py-2 pl-9 pr-4 text-xs sm:text-sm outline-hidden font-mono"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Showing {userOrders.length} order{userOrders.length === 1 ? '' : 's'}
        </span>
      </div>

      {userOrders.length === 0 && !activeOrder ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto text-2xl">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Orders Found Yet</h3>
          <p className="text-xs text-slate-500">
            Once you place an order for fresh vegetables, you can track harvest and dispatch here in real time.
          </p>
          <button
            onClick={() => setRoute('products')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            Shop Today's Harvest
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Orders List */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Your Recent Orders</h3>
            
            <div className="space-y-3">
              {userOrders.map((ord) => {
                const isSelected = activeOrder?.id === ord.id;
                const dateStr = new Date(ord.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                const statusColor = {
                  placed: 'bg-blue-100 text-blue-800',
                  confirmed: 'bg-indigo-100 text-indigo-800',
                  preparing: 'bg-amber-100 text-amber-800',
                  out_for_delivery: 'bg-purple-100 text-purple-800',
                  delivered: 'bg-emerald-100 text-emerald-800',
                  cancelled: 'bg-rose-100 text-rose-800',
                }[ord.status] || 'bg-slate-100 text-slate-800';

                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrderId(ord.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-extrabold text-xs text-slate-900">
                        {ord.orderNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${statusColor}`}>
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                      <span>{dateStr}</span>
                      <span className="font-bold text-slate-800">
                        {settings.currencySymbol}{ord.total} ({ord.items.length} items)
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {ord.items.slice(0, 3).map((item, idx) => (
                          <img
                            key={idx}
                            src={item.image}
                            alt={item.name}
                            className="w-6 h-6 rounded-full object-cover border border-white"
                          />
                        ))}
                      </div>
                      <span className="truncate flex-1">
                        {ord.items.map(i => i.name).join(', ')}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Live Status Tracker Card */}
          {activeOrder && (
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              
              {/* Order Top Bar */}
              <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-black text-slate-900 font-mono">
                      Order #{activeOrder.orderNumber}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase bg-emerald-100 text-emerald-800">
                      Live
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Placed on {new Date(activeOrder.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500">Order Amount</p>
                  <p className="text-lg font-black text-emerald-700 font-mono">
                    {settings.currencySymbol}{activeOrder.total}
                  </p>
                </div>
              </div>

              {/* Cancelled Banner if applicable */}
              {activeOrder.status === 'cancelled' ? (
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center space-x-3 text-rose-800">
                  <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold">This Order Has Been Cancelled</h4>
                    <p className="text-[11px] text-rose-700">Any prepaid balance will be returned to your original payment method.</p>
                  </div>
                </div>
              ) : (
                /* 5-Step Order Progress Visual Stepper */
                <div className="py-4">
                  <div className="text-xs font-bold text-slate-700 mb-6 flex items-center justify-between">
                    <span>Dispatch Progress Timeline</span>
                    <span className="text-emerald-700 capitalize font-bold">
                      Current: {activeOrder.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="relative">
                    {/* Background line */}
                    <div className="absolute top-5 left-4 right-4 h-1 bg-slate-100 -z-0"></div>
                    
                    {/* Active progress bar line */}
                    <div
                      className="absolute top-5 left-4 h-1 bg-emerald-600 transition-all duration-500 -z-0"
                      style={{
                        width: `${Math.max(0, Math.min(100, (currentStep / (statuses.length - 1)) * 100))}%`,
                      }}
                    ></div>

                    <div className="grid grid-cols-5 gap-2 text-center relative z-10">
                      {[
                        { key: 'placed', label: 'Placed', icon: 'fa-cart-shopping' },
                        { key: 'confirmed', label: 'Confirmed', icon: 'fa-file-circle-check' },
                        { key: 'preparing', label: 'Preparing', icon: 'fa-box-open' },
                        { key: 'out_for_delivery', label: 'On Way', icon: 'fa-truck-fast' },
                        { key: 'delivered', label: 'Delivered', icon: 'fa-house-circle-check' },
                      ].map((step, idx) => {
                        const isDone = idx <= currentStep;
                        const isCurrent = idx === currentStep;

                        return (
                          <div key={step.key} className="flex flex-col items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-xs transition-all shadow-xs ${
                                isDone
                                  ? 'bg-emerald-600 text-white font-bold ring-4 ring-emerald-50'
                                  : 'bg-slate-100 text-slate-400'
                              } ${isCurrent ? 'scale-110 ring-emerald-200' : ''}`}
                            >
                              <i className={`fa-solid ${step.icon}`}></i>
                            </div>
                            <span className={`text-[11px] mt-2 font-bold leading-tight ${
                              isDone ? 'text-slate-900' : 'text-slate-400'
                            }`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Detailed Status History Log */}
              {activeOrder.statusHistory && activeOrder.statusHistory.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800">Tracking Event Log</h4>
                  <div className="space-y-2 text-xs">
                    {activeOrder.statusHistory.map((hist, idx) => (
                      <div key={idx} className="flex items-start space-x-3 text-slate-600">
                        <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0"></div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 capitalize">
                            {hist.status.replace(/_/g, ' ')}
                          </p>
                          <p className="text-[11px] text-slate-500">{hist.note}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                          {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Items in this Order */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800">Crate Contents ({activeOrder.items.length})</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 p-2.5 rounded-xl border border-slate-100 bg-white">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {item.quantity} × {settings.currencySymbol}{item.price} ({item.unit})
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address & Help */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-2">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Delivering to: {activeOrder.shippingAddress.address}, {activeOrder.shippingAddress.city}</span>
                </div>
                <button
                  onClick={() => setRoute('contact')}
                  className="text-emerald-700 hover:underline font-semibold"
                >
                  Need Support with Order?
                </button>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
