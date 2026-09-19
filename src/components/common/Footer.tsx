import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { Logo } from "./Logo";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Truck,
  ShieldCheck,
  Sparkles,
  Send,
} from "lucide-react";

export const Footer: React.FC = () => {
  const {
    settings,
    cms,
    setRoute,
    setSelectedCategory,
    categories,
    showToast,
  } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes("@")) {
      showToast("Please enter a valid email address.", "warning");
      return;
    }
    showToast(
      "Subscribed! You will receive morning harvest alerts and seasonal discounts.",
      "success",
    );
    setNewsletterEmail("");
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Props Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">
                Harvested at Dawn
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Picked daily at 4:30 AM from verified regional partner farms.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">
                100% Chemical Free
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Zero synthetic wax or carbide ripening sprays. Lab tested
                purity.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">
                3-Hour Doorstep Delivery
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Temperature-monitored routes delivered in breathable paper
                crates.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <i className="fa-solid fa-arrow-rotate-left text-lg"></i>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">
                No-Questions-Asked Return
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                If any veggie is not crisp or tender, get an instant replacement
                or refund.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-slate-800">
          {/* Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <Logo className="w-16 h-16 shrink-0" />
              <div>
                <span className="text-xl font-black tracking-tight text-white">
                  {settings.siteName || "VegBox"}
                </span>
                <p className="text-[11px] text-emerald-400 font-semibold tracking-wider uppercase">
                  Direct Farm Logistics
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {cms.footer?.description ||
                cms.branding?.brandDescription ||
                "Delivering unadulterated farm-fresh vegetables directly to your doorstep in hours."}
            </p>

            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-200 mb-2">
                Subscribe for Daily Harvest Alerts & Offers
              </p>
              <form onSubmit={handleNewsletter} className="flex max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs px-3.5 py-2.5 rounded-l-lg focus:outline-hidden focus:border-emerald-500 flex-1"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-r-lg transition-colors flex items-center space-x-1"
                >
                  <span>Join</span>
                  <Send className="w-3 h-3" />
                </button>
              </form>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Fresh Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setRoute("products");
                    }}
                    className="hover:text-emerald-400 transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => setRoute("categories")}
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  View All Categories →
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Nav Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Explore VegBox
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setRoute("products")}
                  className="hover:text-emerald-400 transition-colors"
                >
                  All Vegetables
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute("about")}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Our Farm Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute("my-orders")}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute("contact")}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute("admin")}
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Farm Contact Details */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Farm Hub
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {settings.address}, {settings.cityState}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`tel:${settings.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-white transition-colors"
                >
                  {settings.email}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings.businessHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            {cms.footer?.copyright ||
              `© 2026 ${settings.siteName}. All rights reserved.`}
          </p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-slate-400">
              <i className="fa-solid fa-lock text-emerald-500"></i>
              <span>SSL 256-bit Secure E-Commerce</span>
            </span>
            <span>•</span>
            <span>Made for Fresh Farm Lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
