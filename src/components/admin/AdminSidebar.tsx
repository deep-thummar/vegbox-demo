import React from "react";
import { useStore } from "../../context/StoreContext";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  MessageSquareQuote,
  Sliders,
  FileEdit,
  Store,
  LogOut,
  Bell,
  CheckCircle,
  Clock,
} from "lucide-react";
import { AdminTab } from "../../types";
import { Logo } from "../common/Logo";

interface AdminSidebarProps {
  currentTab: AdminTab;
  setCurrentTab: (tab: AdminTab) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  setCurrentTab,
  mobileOpen,
  setMobileOpen,
}) => {
  const { orders, setRoute, logout, settings, products } = useStore();

  const pendingOrdersCount = orders.filter(
    (o) => o.status === "placed" || o.status === "confirmed",
  ).length;
  const outOfStockCount = products.filter(
    (p) => p.status === "out_of_stock",
  ).length;

  const menuItems: {
    id: AdminTab;
    label: string;
    icon: any;
    badge?: number;
    badgeColor?: string;
  }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      id: "orders",
      label: "Orders Live Hub",
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeColor: "bg-amber-500 text-white",
    },
    {
      id: "products",
      label: "Products Catalog",
      icon: Package,
      badge: outOfStockCount > 0 ? outOfStockCount : undefined,
      badgeColor: "bg-rose-500 text-white",
    },
    { id: "categories", label: "Categories", icon: FolderTree },
    { id: "customers", label: "Customers", icon: Users },
    { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
    { id: "cms", label: "Website CMS", icon: FileEdit },
    { id: "settings", label: "Store Settings", icon: Sliders },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
        ></div>
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Branding */}
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Logo className="w-12 h-12 shrink-0" alt="VegBox Admin" />
              <div>
                <h1 className="text-base font-extrabold text-white tracking-tight">
                  VegBox Admin
                </h1>
                <p className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
                  Farm Control Suite
                </p>
              </div>
            </div>
          </div>

          {/* Quick Storefront Switcher Button */}
          <div className="p-4 pb-2">
            <button
              onClick={() => setRoute("home")}
              className="w-full bg-emerald-700/80 hover:bg-emerald-600 active:scale-98 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between shadow-xs cursor-pointer"
            >
              <span className="flex items-center space-x-2">
                <Store className="w-4 h-4" />
                <span>View Customer Site</span>
              </span>
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${item.badgeColor || "bg-emerald-500 text-white"}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                A
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  Administrator
                </p>
                <p className="text-[10px] text-emerald-400 truncate">
                  admin@vegbox.farm
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                setRoute("home");
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
