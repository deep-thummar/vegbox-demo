import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  CheckCircle2 
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, addContactMessage, showToast } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showToast('Please fill out all required fields.', 'warning');
      return;
    }

    addContactMessage({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject || 'General Produce Inquiry',
      message: formData.message,
    });

    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span>We're Always Here</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Get in Touch with our Farm Team
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Have inquiries about bulk orders, recurring subscriptions, or delivery schedules? Send us a message or reach out via WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Direct Contact Channels
            </h3>

            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Customer Helpline</p>
                  <a href={`tel:${settings.phone}`} className="text-emerald-700 hover:underline">
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <i className="fa-brands fa-whatsapp text-lg text-emerald-600"></i>
                </div>
                <div>
                  <p className="font-bold text-slate-900">WhatsApp Instant Support</p>
                  <a 
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-emerald-700 hover:underline"
                  >
                    Chat on WhatsApp ({settings.whatsapp})
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Email Address</p>
                  <a href={`mailto:${settings.email}`} className="text-emerald-700 hover:underline">
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Central Farm Dispatch Hub</p>
                  <p className="text-slate-500">{settings.address}, {settings.cityState}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Operating Hours</p>
                  <p className="text-slate-500">{settings.businessHours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Preview Simulation */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Farm Hub Location</span>
              <span className="text-emerald-700 text-[11px]">Agro-Park Cluster 4</span>
            </div>
            <div className="relative rounded-xl overflow-hidden h-40 bg-slate-100 border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80"
                alt="Farm geographic cluster map"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-emerald-950/20 flex items-center justify-center">
                <div className="bg-white/95 px-3 py-1.5 rounded-lg shadow-md flex items-center space-x-1.5 text-xs font-bold text-emerald-800">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>VegBox Central Packing Hub</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Message Received by Dispatch!</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Thank you for contacting VegBox. Your inquiry has been routed to our hub team (and logged in the Admin Panel inbox). We typically reply within 2 working hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Send Us an Inquiry
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-800 outline-hidden"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-800 outline-hidden"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-800 outline-hidden"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-800 outline-hidden"
                    placeholder="e.g. Weekly family box subscription"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-800 outline-hidden"
                    placeholder="How can our organic harvest team help you?"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>

              <p className="text-[11px] text-slate-400">
                Messages submit immediately to the live Admin Panel Inbox for real-time review.
              </p>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
