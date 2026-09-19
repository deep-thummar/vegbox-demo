import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  ArrowRight, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { confirmedOrderId, orders, settings, setRoute } = useStore();

  const order = orders.find(o => o.id === confirmedOrderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h3 className="text-lg font-bold text-slate-900">No active order found</h3>
        <button
          onClick={() => setRoute('home')}
          className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
        >
          Return Home
        </button>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Confirmation Header Banner */}
      <div className="bg-gradient-to-b from-emerald-50 to-white border border-emerald-200 rounded-3xl p-8 text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30 animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Order Placed Successfully
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Your fresh vegetables are on their way!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
            Thank you for ordering with VegBox. We have notified our partner farm to sort and pack your morning harvest.
          </p>
        </div>

        {/* Order Meta Pill */}
        <div className="inline-flex flex-wrap items-center justify-center gap-4 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-2xs text-xs">
          <div>
            <span className="text-slate-400">Order ID: </span>
            <span className="font-extrabold text-emerald-800 font-mono">{order.orderNumber}</span>
          </div>
          <span className="text-slate-300">•</span>
          <div>
            <span className="text-slate-400">Date: </span>
            <span className="font-semibold text-slate-700">{orderDate}</span>
          </div>
          <span className="text-slate-300">•</span>
          <div>
            <span className="text-slate-400">Status: </span>
            <span className="font-bold text-amber-600 capitalize">{order.status.replace(/_/g, ' ')}</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setRoute('my-orders')}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order Progress</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setRoute('products')}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs px-5 py-3 rounded-xl transition-colors"
          >
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>

      {/* Order Details Breakdown Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        
        {/* Customer & Shipping Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Delivery Address</span>
            </h4>
            <p className="text-xs font-bold text-slate-800">{order.customerName}</p>
            <p className="text-xs text-slate-600 mt-0.5">{order.shippingAddress.address}</p>
            <p className="text-xs text-slate-600">
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
            <p className="text-xs text-slate-500 mt-1">Phone: {order.customerPhone}</p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Estimated Delivery Window</span>
            </h4>
            <p className="text-xs font-bold text-emerald-800">Within 3 Hours (Today)</p>
            <p className="text-xs text-slate-500 mt-1">Payment: {order.paymentMethod.toUpperCase()} ({order.paymentStatus.toUpperCase()})</p>
            {order.shippingAddress.deliveryInstructions && (
              <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg mt-2 border border-slate-200">
                <span className="font-semibold text-slate-700">Note:</span> {order.shippingAddress.deliveryInstructions}
              </p>
            )}
          </div>
        </div>

        {/* Items List */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            Harvest Items in this Crate ({order.items.length})
          </h4>
          
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
            {order.items.map((item, index) => (
              <div key={index} className="p-3.5 flex items-center justify-between text-xs bg-white hover:bg-slate-50">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-11 h-11 rounded-lg object-cover border border-slate-100 shrink-0"
                  />
                  <div>
                    <p className="font-bold text-slate-800">{item.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {item.quantity} × {settings.currencySymbol}{item.price} per {item.unit}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-slate-900">
                  {settings.currencySymbol}{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Items Subtotal</span>
            <span className="font-semibold text-slate-800">{settings.currencySymbol}{order.subtotal}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Direct Farm Delivery</span>
            <span className="font-semibold text-slate-800">
              {order.deliveryCharge === 0 ? 'FREE' : `${settings.currencySymbol}${order.deliveryCharge}`}
            </span>
          </div>
          <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-black text-slate-900">
            <span>Total Paid</span>
            <span className="text-emerald-700">{settings.currencySymbol}{order.total}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
