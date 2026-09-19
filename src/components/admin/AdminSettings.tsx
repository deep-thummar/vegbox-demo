import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Save, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { StoreSettings } from '../../types';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, resetAllData, showToast } = useStore();

  const [formData, setFormData] = useState<StoreSettings>({ ...settings });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    showToast('Store configurations updated successfully.', 'success');
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data (products, orders, cms, settings) back to fresh demo seed defaults?')) {
      resetAllData();
      setFormData({ ...settings });
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="text-xl font-black text-slate-900">Store Settings & Business Rules</h2>
        <p className="text-xs text-slate-500">
          Configure delivery thresholds, logistics charges, and communication contact details.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
        
        {/* Business Profile */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
            Business Profile & Branding
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Business Name</label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Brand Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Delivery Thresholds */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
            Delivery Economics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Currency Symbol</label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600 font-bold font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Standard Delivery Fee</label>
              <input
                type="number"
                value={formData.deliveryCharge}
                onChange={(e) => setFormData({ ...formData, deliveryCharge: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Free Delivery Order Threshold</label>
              <input
                type="number"
                value={formData.freeDeliveryThreshold}
                onChange={(e) => setFormData({ ...formData, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600 font-mono text-emerald-700 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
            Contact & Support Channels
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Customer Helpline Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">WhatsApp Hotline</label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Inquiry Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Hub Physical Street Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">City / State</label>
              <input
                type="text"
                value={formData.cityState}
                onChange={(e) => setFormData({ ...formData, cityState: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-bold text-slate-700 mb-1">Business & Dispatch Operating Hours</label>
              <input
                type="text"
                value={formData.businessHours}
                onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </button>
        </div>

      </form>

      {/* Danger Zone: Reset Data */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 space-y-3">
        <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <span>Demo Data Management (Danger Zone)</span>
        </div>
        <p className="text-xs text-rose-700 leading-relaxed">
          Need a fresh testing environment? Clicking below will reset all products, orders, categories, customer accounts, and CMS content back to the default farm dataset.
        </p>
        <button
          type="button"
          onClick={handleResetData}
          className="inline-flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Demo Data to Seed Defaults</span>
        </button>
      </div>

    </div>
  );
};
