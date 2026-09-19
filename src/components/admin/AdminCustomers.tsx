import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Users, Search, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { users, orders, settings } = useStore();
  const [search, setSearch] = useState('');

  const customers = users.filter(u => u.role === 'customer');

  const filtered = customers.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900">Customer Accounts & Activity</h2>
        <p className="text-xs text-slate-500">
          View registered customer accounts, their total spent, and lifetime orders with VegBox.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search customers by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
          />
        </div>
        <span className="text-xs font-bold text-slate-500">
          {filtered.length} Customer{filtered.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Contact Details</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(cust => {
                const custOrders = orders.filter(o => o.userId === cust.id || o.customerEmail === cust.email);
                const totalSpent = custOrders.reduce((sum, o) => sum + o.total, 0);

                return (
                  <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                          {cust.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{cust.name}</p>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold">
                            Verified Customer
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 space-y-0.5">
                      <div className="flex items-center space-x-1 text-slate-600">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{cust.email}</span>
                      </div>
                      {cust.phone && (
                        <div className="flex items-center space-x-1 text-slate-500 text-[11px]">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{cust.phone}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {cust.city ? `${cust.city}, ${cust.state || ''}` : 'Pune, Maharashtra'}
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {custOrders.length} order{custOrders.length === 1 ? '' : 's'}
                    </td>

                    <td className="py-3 px-4 font-bold text-emerald-700 font-mono">
                      {settings.currencySymbol}{totalSpent}
                    </td>

                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {cust.createdAt ? new Date(cust.createdAt).toLocaleDateString() : 'Recent'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
