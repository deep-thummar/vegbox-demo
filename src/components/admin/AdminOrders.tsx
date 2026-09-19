import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Search, 
  Eye, 
  Truck, 
  MapPin, 
  Clock, 
  X, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';

export const AdminOrders: React.FC = () => {
  const { orders, settings, updateOrderStatus, showToast } = useStore();

  const [search, setSearch] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [activeOrderModal, setActiveOrderModal] = useState<Order | null>(null);
  const [statusNote, setStatusNote] = useState('');

  const statusOptions: OrderStatus[] = [
    'placed',
    'confirmed',
    'preparing',
    'out_for_delivery',
    'delivered',
    'cancelled',
  ];

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus, statusNote.trim() || undefined);
    setStatusNote('');
    
    // Also update modal order if currently open
    if (activeOrderModal && activeOrderModal.id === orderId) {
      setActiveOrderModal({
        ...activeOrderModal,
        status: newStatus,
        statusHistory: [
          ...activeOrderModal.statusHistory,
          {
            status: newStatus,
            timestamp: new Date().toISOString(),
            note: statusNote.trim() || `Status changed to ${newStatus.replace(/_/g, ' ')}`,
          }
        ]
      });
    }
  };

  const filteredOrders = orders.filter(o => {
    if (selectedStatusFilter !== 'all' && o.status !== selectedStatusFilter) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900">Live Orders & Logistics Dispatch</h2>
        <p className="text-xs text-slate-500">
          Process incoming customer harvest baskets, update delivery milestones, and track fulfilled crates.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by Order ID (VB-94120), name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs outline-hidden focus:bg-white focus:border-emerald-600 font-mono"
            />
          </div>

          <span className="text-xs font-bold text-slate-500">
            {filteredOrders.length} Order{filteredOrders.length === 1 ? '' : 's'} Found
          </span>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedStatusFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors shrink-0 cursor-pointer ${
              selectedStatusFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Orders ({orders.length})
          </button>

          {statusOptions.map(st => {
            const count = orders.filter(o => o.status === st).length;
            const isSelected = selectedStatusFilter === st;

            return (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors shrink-0 flex items-center space-x-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span className="capitalize">{st.replace(/_/g, ' ')}</span>
                <span className={`text-[10px] px-1.5 rounded-full ${isSelected ? 'bg-emerald-900 text-emerald-100' : 'bg-slate-200 text-slate-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Customer & Phone</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                    {ord.orderNumber}
                  </td>

                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    {new Date(ord.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                    <span className="text-[10px] text-slate-400">
                      {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{ord.customerName}</p>
                    <p className="text-[10px] text-slate-500">{ord.customerPhone}</p>
                  </td>

                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                    {ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
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
                      onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
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

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setActiveOrderModal(ord)}
                      className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer inline-flex items-center space-x-1 font-semibold text-[11px]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {activeOrderModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveOrderModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-slate-100 pb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase">Farm Order Dispatch</span>
                <h3 className="text-xl font-black text-slate-900 font-mono">
                  {activeOrderModal.orderNumber}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Placed: {new Date(activeOrderModal.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Total Amount</span>
                <span className="text-xl font-black text-slate-900 font-mono">
                  {settings.currencySymbol}{activeOrderModal.total}
                </span>
              </div>
            </div>

            {/* Quick Status Update in Modal */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-emerald-900 flex items-center space-x-1.5">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  <span>Update Order Dispatch Milestone:</span>
                </label>
                <span className="text-[10px] font-bold uppercase bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                  Live Sync
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  value={activeOrderModal.status}
                  onChange={(e) => handleStatusChange(activeOrderModal.id, e.target.value as OrderStatus)}
                  className="bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs font-bold text-emerald-900 outline-hidden"
                >
                  {statusOptions.map((st) => (
                    <option key={st} value={st}>
                      {st.replace(/_/g, ' ').toUpperCase()}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Optional milestone note (e.g. Courier picked up)..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs outline-hidden"
                />
              </div>
            </div>

            {/* Customer & Shipping */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                <p className="font-bold text-slate-900">Customer Details</p>
                <p className="text-slate-700">{activeOrderModal.customerName}</p>
                <p className="text-slate-500">{activeOrderModal.customerEmail}</p>
                <p className="text-slate-500">{activeOrderModal.customerPhone}</p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                <p className="font-bold text-slate-900">Delivery Address</p>
                <p className="text-slate-700">{activeOrderModal.shippingAddress.address}</p>
                <p className="text-slate-500">
                  {activeOrderModal.shippingAddress.city}, {activeOrderModal.shippingAddress.state} - {activeOrderModal.shippingAddress.pincode}
                </p>
                {activeOrderModal.shippingAddress.deliveryInstructions && (
                  <p className="text-[10px] text-emerald-800 bg-emerald-50 p-1.5 rounded mt-1 border border-emerald-100">
                    Note: {activeOrderModal.shippingAddress.deliveryInstructions}
                  </p>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase">Ordered Vegetables ({activeOrderModal.items.length})</h4>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                {activeOrderModal.items.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs bg-white">
                    <div className="flex items-center space-x-3">
                      <img src={it.image} alt={it.name} className="w-9 h-9 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-slate-800">{it.name}</p>
                        <p className="text-[10px] text-slate-500">
                          {it.quantity} × {settings.currencySymbol}{it.price} ({it.unit})
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">
                      {settings.currencySymbol}{it.price * it.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status History Log */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase">Milestone Audit Log</h4>
              <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-[11px] text-slate-600">
                {activeOrderModal.statusHistory?.map((h, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-1">
                    <span className="font-bold text-slate-800 capitalize">{h.status.replace(/_/g, ' ')}</span>
                    <span className="text-slate-500">{h.note}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
