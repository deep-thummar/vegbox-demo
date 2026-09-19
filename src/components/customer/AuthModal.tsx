import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, Check } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, login, register, showToast, setRoute } = useStore();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('alex.green@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Alex Green');
  const [phone, setPhone] = useState('+91 98765 43210');

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      const res = login(email);
      if (res.success) {
        setAuthModalOpen(false);
      }
    } else {
      if (!name.trim() || !email.trim() || !password.trim()) {
        showToast('Please fill out all required fields', 'warning');
        return;
      }
      const res = register({
        name,
        email,
        phone,
      });
      if (res.success) {
        setAuthModalOpen(false);
      }
    }
  };

  const handleQuickLogin = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      login('admin@vegbox.farm');
      setAuthModalOpen(false);
      setRoute('admin');
    } else {
      login('alex.green@example.com');
      setAuthModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-xl font-bold">
            <i className="fa-solid fa-leaf"></i>
          </div>
          <h3 className="text-xl font-black text-slate-900">
            {mode === 'login' ? 'Welcome Back to VegBox' : 'Create Customer Account'}
          </h3>
          <p className="text-xs text-slate-500">
            {mode === 'login'
              ? 'Sign in to access your morning harvest orders and saved addresses.'
              : 'Join over 8,500 families eating direct farm-to-table vegetables.'}
          </p>
        </div>

        {/* Quick 1-Click Demo Accounts */}
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3.5 mb-5 space-y-2">
          <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center justify-between">
            <span>⚡ 1-Click Instant Demo Access</span>
            <span className="text-[9px] bg-emerald-200 text-emerald-800 px-1.5 py-0.2 rounded font-bold">Recommended</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('customer')}
              className="bg-white hover:bg-emerald-100/50 text-emerald-900 text-xs font-bold py-2 px-2.5 rounded-xl border border-emerald-200 transition-colors text-left"
            >
              <p className="font-extrabold text-[11px]">Customer Demo</p>
              <p className="text-[9px] text-emerald-700 font-normal">Alex Green (Orders & Cart)</p>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-2.5 rounded-xl transition-colors text-left shadow-xs"
            >
              <p className="font-extrabold text-[11px] text-emerald-400">Admin Owner</p>
              <p className="text-[9px] text-slate-300 font-normal">Full Backoffice Control</p>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 outline-hidden focus:border-emerald-600"
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 outline-hidden focus:border-emerald-600"
                placeholder="name@example.com"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 outline-hidden focus:border-emerald-600"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 outline-hidden focus:border-emerald-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all mt-2 cursor-pointer"
          >
            {mode === 'login' ? 'Sign In to Account' : 'Create Free Account'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-bold text-emerald-700 hover:underline"
              >
                Sign up free
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-emerald-700 hover:underline"
              >
                Sign in
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
