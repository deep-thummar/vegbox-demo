import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { HomePage } from './components/customer/HomePage';
import { ProductsPage } from './components/customer/ProductsPage';
import { CategoriesPage } from './components/customer/CategoriesPage';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutPage } from './components/customer/CheckoutPage';
import { OrderConfirmationPage } from './components/customer/OrderConfirmationPage';
import { MyOrdersPage } from './components/customer/MyOrdersPage';
import { AboutPage } from './components/customer/AboutPage';
import { ContactPage } from './components/customer/ContactPage';
import { ProductDetailModal } from './components/customer/ProductDetailModal';
import { AuthModal } from './components/customer/AuthModal';
import { AdminLayout } from './components/admin/AdminLayout';

const AppContent: React.FC = () => {
  const { route } = useStore();

  // Scroll to top whenever route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [route]);

  if (route === 'admin') {
    return (
      <>
        <AdminLayout />
        <Toast />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white pb-16 md:pb-0">
      {/* Customer Header */}
      <Header />

      {/* Main Page Routing */}
      <main className="flex-1">
        {route === 'home' && <HomePage />}
        {route === 'products' && <ProductsPage />}
        {route === 'categories' && <CategoriesPage />}
        {route === 'checkout' && <CheckoutPage />}
        {route === 'order-confirmation' && <OrderConfirmationPage />}
        {route === 'my-orders' && <MyOrdersPage />}
        {route === 'about' && <AboutPage />}
        {route === 'contact' && <ContactPage />}
      </main>

      {/* Customer Footer */}
      <Footer />

      {/* Mobile Fixed Bottom Nav */}
      <MobileBottomNav />

      {/* Global Interactive Overlays */}
      <CartDrawer />
      <ProductDetailModal />
      <AuthModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
