import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Home, Grid, ShoppingBag, Search, User, ShieldCheck } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { 
    route, 
    setRoute, 
    cartCount, 
    setCartDrawerOpen, 
    currentUser, 
    setAuthModalOpen,
    setSelectedCategory
  } = useStore();

  // If in admin mode, do not show customer bottom nav
  if (route === 'admin') return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around">
        
        {/* Home */}
        <button
          onClick={() => setRoute('home')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
            route === 'home' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* Categories */}
        <button
          onClick={() => {
            setSelectedCategory(null);
            setRoute('categories');
          }}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
            route === 'categories' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Grid className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Categories</span>
        </button>

        {/* Search / Shop */}
        <button
          onClick={() => {
            setSelectedCategory(null);
            setRoute('products');
          }}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
            route === 'products' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Shop</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setCartDrawerOpen(true)}
          className="flex flex-col items-center py-1 px-2.5 rounded-lg text-slate-500 hover:text-slate-800 relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-emerald-600 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Basket</span>
        </button>

        {/* Account / Track */}
        <button
          onClick={() => {
            if (currentUser) {
              setRoute('my-orders');
            } else {
              setAuthModalOpen(true);
            }
          }}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
            route === 'my-orders' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">{currentUser ? 'Orders' : 'Account'}</span>
        </button>

      </div>
    </div>
  );
};
