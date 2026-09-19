import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Truck, 
  ShieldCheck 
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    cartCount, 
    cartSubtotal, 
    deliveryCharge, 
    cartTotal, 
    settings, 
    cartDrawerOpen, 
    setCartDrawerOpen, 
    updateCartQty, 
    removeFromCart, 
    clearCart, 
    setRoute 
  } = useStore();

  if (!cartDrawerOpen) return null;

  const freeDeliveryRemaining = Math.max(0, settings.freeDeliveryThreshold - cartSubtotal);
  const freeDeliveryPercent = Math.min(100, Math.round((cartSubtotal / settings.freeDeliveryThreshold) * 100));

  const handleCheckout = () => {
    setCartDrawerOpen(false);
    setRoute('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Harvest Basket</h2>
              <p className="text-[11px] text-slate-500 font-medium">
                {cartCount} item{cartCount === 1 ? '' : 's'} selected
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline px-2 py-1"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setCartDrawerOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Delivery Incentive Bar */}
        {cart.length > 0 && (
          <div className="bg-emerald-50 px-5 py-3 border-b border-emerald-100 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-900">
              <span className="flex items-center space-x-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                {freeDeliveryRemaining === 0 ? (
                  <span className="font-bold text-emerald-700">Congratulations! You unlocked FREE delivery!</span>
                ) : (
                  <span>
                    Add <span className="font-bold text-emerald-700">{settings.currencySymbol}{freeDeliveryRemaining}</span> more for Free Delivery
                  </span>
                )}
              </span>
              <span className="text-[11px] font-bold text-emerald-700">{freeDeliveryPercent}%</span>
            </div>
            <div className="w-full bg-emerald-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${freeDeliveryPercent}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
                <i className="fa-solid fa-basket-shopping"></i>
              </div>
              <h3 className="text-base font-bold text-slate-800">Your basket is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore our fresh daily harvest direct from regional partner farms and add crisp vegetables to your kitchen table.
              </p>
              <button
                onClick={() => {
                  setCartDrawerOpen(false);
                  setRoute('products');
                }}
                className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-colors cursor-pointer"
              >
                <span>Shop Fresh Vegetables</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.product.id}-${item.unit}`}
                className="flex items-center space-x-3.5 p-3 rounded-2xl border border-slate-200/80 bg-white hover:border-emerald-200 transition-colors"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {settings.currencySymbol}{item.product.price} / {item.unit}
                  </p>
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex items-center space-x-2 bg-slate-100 rounded-lg p-0.5">
                      <button
                        onClick={() => updateCartQty(item.product.id, item.unit, item.quantity - 1)}
                        className="w-6 h-6 rounded-md bg-white shadow-2xs flex items-center justify-center text-slate-700 hover:bg-slate-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-slate-800 px-1">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQty(item.product.id, item.unit, item.quantity + 1)}
                        className="w-6 h-6 rounded-md bg-white shadow-2xs flex items-center justify-center text-slate-700 hover:bg-slate-50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id, item.unit)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-black text-slate-900">
                    {settings.currencySymbol}{item.product.price * item.quantity}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer: Order Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Produce Subtotal:</span>
                <span className="font-semibold text-slate-800">{settings.currencySymbol}{cartSubtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center space-x-1">
                  <span>Farm-Direct Delivery:</span>
                  {deliveryCharge === 0 && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                      FREE
                    </span>
                  )}
                </span>
                <span className="font-semibold text-slate-800">
                  {deliveryCharge === 0 ? 'FREE' : `${settings.currencySymbol}${deliveryCharge}`}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-black text-slate-900">
                <span>Estimated Total:</span>
                <span className="text-emerald-700 text-base">{settings.currencySymbol}{cartTotal}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-400 font-medium pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe Contactless Farm Delivery • 100% Satisfaction</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
