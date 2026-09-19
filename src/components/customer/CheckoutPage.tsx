import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  QrCode, 
  Building2, 
  Banknote, 
  ArrowLeft, 
  CheckCircle2, 
  Loader2, 
  Lock 
} from 'lucide-react';
import { PaymentMethod } from '../../types';

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    deliveryCharge, 
    cartTotal, 
    settings, 
    currentUser, 
    createOrder, 
    setRoute, 
    showToast 
  } = useStore();

  // Shipping details state
  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Alex Green',
    email: currentUser?.email || 'alex.green@example.com',
    phone: currentUser?.phone || '+91 98765 43210',
    address: currentUser?.address || 'Flat 402, Green Meadows, SB Road',
    city: currentUser?.city || 'Pune',
    state: currentUser?.state || 'Maharashtra',
    pincode: currentUser?.pincode || '411016',
    deliveryInstructions: 'Please deliver fresh morning harvest, ring bell twice',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('alex@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8921');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('842');
  
  // Payment processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl">
          <i className="fa-solid fa-basket-shopping"></i>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your Basket is Empty</h2>
        <p className="text-xs text-slate-500">
          Add some farm-fresh vegetables to your basket before proceeding to checkout.
        </p>
        <button
          onClick={() => setRoute('products')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors cursor-pointer"
        >
          Explore Fresh Produce
        </button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.pincode.trim()) {
      showToast('Please fill in all mandatory customer and delivery address fields.', 'error');
      return;
    }

    setIsProcessing(true);
    setProcessingStep('Connecting to Demo Payment Gateway...');

    setTimeout(() => {
      setProcessingStep('Authorizing farm direct payment...');
    }, 900);

    setTimeout(() => {
      setProcessingStep('Verifying morning inventory reserve...');
    }, 1800);

    setTimeout(() => {
      // Complete order
      const orderItems = cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        unit: item.unit,
        quantity: item.quantity,
        image: item.product.image,
      }));

      const newOrder = createOrder({
        userId: currentUser?.id || 'guest-user',
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          deliveryInstructions: formData.deliveryInstructions,
        },
        items: orderItems,
        subtotal: cartSubtotal,
        deliveryCharge,
        total: cartTotal,
        paymentMethod,
        paymentStatus: 'paid',
        status: 'placed',
        estimatedDelivery: 'Today within 3 Hours',
      });

      setIsProcessing(false);
      setRoute('order-confirmation');
    }, 2600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setRoute('products')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>
        <span className="text-xs text-slate-400 font-medium">Demo Secure Checkout</span>
      </div>

      <form onSubmit={handleSubmitPayment}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Customer & Delivery Info + Demo Payment Options */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Customer & Shipping Address */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm border-b border-slate-100 pb-3">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>1. Customer & Delivery Address</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-800 outline-hidden"
                    placeholder="Enter recipient full name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-800 outline-hidden"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-800 outline-hidden"
                    placeholder="For order receipts and tracking alerts"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Street Address / Flat / Building *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-800 outline-hidden"
                    placeholder="e.g. Flat 304, Sunshine Heights, Main Road"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-800 outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-800 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-800 outline-hidden"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Instructions (Optional)</label>
                  <textarea
                    name="deliveryInstructions"
                    rows={2}
                    value={formData.deliveryInstructions}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-800 outline-hidden"
                    placeholder="e.g. Leave crate outside door, call upon arrival"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* 2. Realistic Demo Payment Section */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>2. Select Payment Method (Demo Gateway)</span>
                </div>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Sandbox Demo
                </span>
              </div>

              {/* Payment Methods Options */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'upi', label: 'Instant UPI / QR', icon: <QrCode className="w-5 h-5" /> },
                  { id: 'card', label: 'Debit / Credit Card', icon: <CreditCard className="w-5 h-5" /> },
                  { id: 'netbanking', label: 'Net Banking', icon: <Building2 className="w-5 h-5" /> },
                  { id: 'cod', label: 'Cash On Delivery', icon: <Banknote className="w-5 h-5" /> },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setPaymentMethod(item.id as PaymentMethod)}
                    className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer ${
                      paymentMethod === item.id
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-800 shadow-xs font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <div className={paymentMethod === item.id ? 'text-emerald-700' : 'text-slate-500'}>
                      {item.icon}
                    </div>
                    <span className="text-[11px] leading-tight">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Method Details UI */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
                {paymentMethod === 'upi' && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-800">Scan & Pay or Enter UPI VPA:</p>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-24 h-24 bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-center shrink-0">
                        <i className="fa-solid fa-qrcode text-4xl text-slate-800"></i>
                        <span className="text-[8px] font-bold text-emerald-700 mt-1">BHIM UPI QR</span>
                      </div>
                      <div className="flex-1 w-full space-y-2">
                        <label className="text-[11px] font-semibold text-slate-600">UPI Virtual Address</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-mono"
                          placeholder="yourname@bank"
                        />
                        <p className="text-[10px] text-slate-500">
                          Supports Google Pay, PhonePe, Paytm, CRED & BHIM. Auto-approved in sandbox.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-800">Demo Card Information:</p>
                      <span className="text-[10px] font-semibold text-slate-500">256-Bit Encrypted</span>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Card Number"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-mono"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-mono"
                        />
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="CVV"
                          maxLength={4}
                          className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="space-y-2 text-xs">
                    <p className="font-bold text-slate-800">Select Bank for Direct Debit:</p>
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak', 'Others'].map(bank => (
                        <div key={bank} className="bg-white p-2 rounded-lg border border-slate-200 text-center text-[11px] font-medium text-slate-700">
                          {bank}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <p className="font-bold text-slate-800 flex items-center space-x-1.5 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Cash or UPI upon delivery available</span>
                    </p>
                    <p className="text-[11px]">
                      Our delivery executive will carry a mobile QR code and accept cash at your doorstep.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Right Column: Order Summary & Pay CTA */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5 sticky top-28">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Order Summary ({cart.reduce((sum, i) => sum + i.quantity, 0)} Items)
              </h3>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-slate-100">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.unit}`} className="pt-2 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-100 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-800 line-clamp-1">{item.product.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {item.quantity} × {settings.currencySymbol}{item.product.price} ({item.unit})
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0">
                      {settings.currencySymbol}{item.product.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Calculation */}
              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">{settings.currencySymbol}{cartSubtotal}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center space-x-1">
                    <span>Farm Direct Delivery</span>
                    {deliveryCharge === 0 && (
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 rounded">
                        FREE
                      </span>
                    )}
                  </span>
                  <span className="font-semibold text-slate-800">
                    {deliveryCharge === 0 ? 'FREE' : `${settings.currencySymbol}${deliveryCharge}`}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-base font-extrabold text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-emerald-700 text-lg">{settings.currencySymbol}{cartTotal}</span>
                </div>
              </div>

              {/* Pay Now Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex flex-col items-center justify-center cursor-pointer disabled:opacity-80"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-xs font-semibold">{processingStep}</span>
                  </div>
                ) : (
                  <>
                    <span className="text-sm">Complete Demo Payment • {settings.currencySymbol}{cartTotal}</span>
                    <span className="text-[10px] text-emerald-200 font-normal">Click to simulate realistic instant order placement</span>
                  </>
                )}
              </button>

              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-[11px] text-emerald-800 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Demo Project Guarantee</span>
                </div>
                <p className="text-emerald-700 text-[10px] leading-relaxed">
                  Upon completion, this order will generate a unique tracking ID, deduct stock, and sync live to the Admin Panel for status management.
                </p>
              </div>

            </div>

          </div>

        </div>
      </form>

    </div>
  );
};
