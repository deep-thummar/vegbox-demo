import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
import { store } from '../services/store';
import { 
  Category, 
  Product, 
  Order, 
  Testimonial, 
  ContactMessage, 
  SiteSettings, 
  CMSContent, 
  User, 
  CartItem, 
  ProductUnit, 
  OrderStatus 
} from '../types';

export type AppRoute = 
  | 'home' 
  | 'products' 
  | 'product-detail' 
  | 'categories' 
  | 'cart' 
  | 'checkout' 
  | 'order-confirmation' 
  | 'my-orders' 
  | 'about' 
  | 'contact' 
  | 'admin';

export type AdminTab = 
  | 'dashboard' 
  | 'orders' 
  | 'products' 
  | 'categories' 
  | 'customers' 
  | 'testimonials' 
  | 'messages' 
  | 'cms' 
  | 'settings';

export interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface StoreContextType {
  // State
  categories: Category[];
  products: Product[];
  orders: Order[];
  testimonials: Testimonial[];
  messages: ContactMessage[];
  contactMessages: ContactMessage[];
  users: User[];
  settings: SiteSettings;
  cms: CMSContent;
  currentUser: User | null;
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  deliveryCharge: number;
  cartTotal: number;

  // Navigation & Route
  route: AppRoute;
  setRoute: (route: AppRoute) => void;
  selectedCategory: string | null;
  setSelectedCategory: (catId: string | null) => void;
  selectedProductId: string | null;
  setSelectedProductId: (prodId: string | null) => void;
  confirmedOrderId: string | null;
  setConfirmedOrderId: (orderId: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Admin Navigation
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;

  // Modals & Drawers
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;

  // Toast
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Actions
  addToCart: (product: Product, quantity?: number, unit?: ProductUnit) => void;
  updateCartQty: (productId: string, unit: ProductUnit, quantity: number) => void;
  removeFromCart: (productId: string, unit: ProductUnit) => void;
  clearCart: () => void;
  
  createOrder: (orderData: Parameters<typeof store.createOrder>[0]) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;

  login: (email: string) => { success: boolean; error?: string };
  register: (data: Parameters<typeof store.register>[0]) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (userId: string, updates: Partial<User>) => void;

  // Admin CRUD
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (productOrId: string | Product, updates?: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStock: (id: string) => void;

  addCategory: (category: Omit<Category, 'id'>) => Category;
  updateCategory: (catOrId: string | Category, updates?: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addTestimonial: (test: Omit<Testimonial, 'id' | 'createdAt'>) => void;
  updateTestimonial: (testOrId: string | Testimonial, updates?: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;

  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => void;
  updateMessageStatus: (id: string, status: 'new' | 'replied' | 'archived') => void;
  deleteMessage: (id: string) => void;

  updateSettings: (updates: Partial<SiteSettings>) => void;
  updateCMS: (updates: Partial<CMSContent>) => void;
  resetDemoData: () => void;
  resetAllData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Sync state with store
  const [categories, setCategories] = useState<Category[]>(() => store.getCategories());
  const [products, setProducts] = useState<Product[]>(() => store.getProducts());
  const [orders, setOrders] = useState<Order[]>(() => store.getOrders());
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => store.getTestimonials());
  const [messages, setMessages] = useState<ContactMessage[]>(() => store.getMessages());
  const [settings, setSettings] = useState<SiteSettings>(() => store.getSettings());
  const [cms, setCms] = useState<CMSContent>(() => store.getCMS());
  const [currentUser, setCurrentUser] = useState<User | null>(() => store.getCurrentUser());
  const [users, setUsers] = useState<User[]>(() => store.getUsers());
  const [cart, setCart] = useState<CartItem[]>(() => store.getCart());

  // Navigation state
  const [route, setRouteState] = useState<AppRoute>('home');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // UI States
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const setRoute = (newRoute: AppRoute) => {
    setRouteState(newRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCategories(store.getCategories());
      setProducts(store.getProducts());
      setOrders(store.getOrders());
      setTestimonials(store.getTestimonials());
      setMessages(store.getMessages());
      setSettings(store.getSettings());
      setCms(store.getCMS());
      setCurrentUser(store.getCurrentUser());
      setUsers(store.getUsers());
      setCart(store.getCart());
    });
    return unsubscribe;
  }, []);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cart Computations
  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const deliveryCharge = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    return cartSubtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryCharge;
  }, [cartSubtotal, settings.freeDeliveryThreshold, settings.deliveryCharge]);

  const cartTotal = useMemo(() => {
    return cartSubtotal + deliveryCharge;
  }, [cartSubtotal, deliveryCharge]);

  // Actions
  const addToCart = (product: Product, quantity = 1, unit?: ProductUnit) => {
    if (product.status === 'out_of_stock') {
      showToast(`${product.name} is currently out of stock!`, 'warning');
      return;
    }
    store.addToCart(product, quantity, unit);
    showToast(`Added ${quantity}x ${product.name} to basket!`, 'success');
  };

  const updateCartQty = (productId: string, unit: ProductUnit, quantity: number) => {
    store.updateCartQuantity(productId, unit, quantity);
  };

  const removeFromCart = (productId: string, unit: ProductUnit) => {
    store.removeFromCart(productId, unit);
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    store.clearCart();
  };

  const createOrder = (orderData: Parameters<typeof store.createOrder>[0]) => {
    const order = store.createOrder(orderData);
    setConfirmedOrderId(order.id);
    showToast(`Order #${order.orderNumber} confirmed successfully!`, 'success');
    return order;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    store.updateOrderStatus(orderId, status, note);
    showToast(`Order status updated to "${status.replace(/_/g, ' ')}"`, 'success');
  };

  const login = (email: string) => {
    const res = store.login(email);
    if (res.user) {
      showToast(`Welcome back, ${res.user.name}!`, 'success');
      return { success: true };
    }
    showToast(res.error || 'Login failed', 'error');
    return { success: false, error: res.error };
  };

  const register = (data: Parameters<typeof store.register>[0]) => {
    const res = store.register(data);
    if (res.user) {
      showToast(`Account created! Welcome to VegBox, ${res.user.name}!`, 'success');
      return { success: true };
    }
    showToast(res.error || 'Registration failed', 'error');
    return { success: false, error: res.error };
  };

  const logout = () => {
    store.logout();
    showToast('You have been logged out.', 'info');
  };

  const updateProfile = (userId: string, updates: Partial<User>) => {
    store.updateProfile(userId, updates);
    showToast('Profile details updated successfully', 'success');
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const p = store.addProduct(product);
    showToast(`Added new product "${p.name}"`, 'success');
    return p;
  };

  const updateProduct = (productOrId: string | Product, updates?: Partial<Product>) => {
    if (typeof productOrId === 'string') {
      store.updateProduct(productOrId, updates || {});
    } else {
      store.updateProduct(productOrId.id, productOrId);
    }
    showToast('Product updated successfully', 'success');
  };

  const deleteProduct = (id: string) => {
    store.deleteProduct(id);
    showToast('Product deleted', 'info');
  };

  const toggleProductStock = (id: string) => {
    const p = store.toggleProductStock(id);
    if (p) {
      showToast(`Product status toggled to "${p.status}"`, 'info');
    }
  };

  const addCategory = (cat: Omit<Category, 'id'>) => {
    const c = store.addCategory(cat);
    showToast(`Category "${c.name}" created`, 'success');
    return c;
  };

  const updateCategory = (catOrId: string | Category, updates?: Partial<Category>) => {
    if (typeof catOrId === 'string') {
      store.updateCategory(catOrId, updates || {});
    } else {
      store.updateCategory(catOrId.id, catOrId);
    }
    showToast('Category updated successfully', 'success');
  };

  const deleteCategory = (id: string) => {
    store.deleteCategory(id);
    showToast('Category deleted', 'info');
  };

  const addTestimonial = (test: Omit<Testimonial, 'id' | 'createdAt'>) => {
    store.addTestimonial(test);
    showToast('Testimonial added', 'success');
  };

  const updateTestimonial = (testOrId: string | Testimonial, updates?: Partial<Testimonial>) => {
    if (typeof testOrId === 'string') {
      store.updateTestimonial(testOrId, updates || {});
    } else {
      store.updateTestimonial(testOrId.id, testOrId);
    }
    showToast('Testimonial updated', 'success');
  };

  const deleteTestimonial = (id: string) => {
    store.deleteTestimonial(id);
    showToast('Testimonial deleted', 'info');
  };

  const addContactMessage = (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => {
    store.addMessage(msg);
    showToast('Your message has been sent to the farm team!', 'success');
  };

  const updateMessageStatus = (id: string, status: 'new' | 'replied' | 'archived') => {
    store.updateMessageStatus(id, status);
    showToast(`Message marked as ${status}`, 'info');
  };

  const deleteMessage = (id: string) => {
    store.deleteMessage(id);
    showToast('Message deleted', 'info');
  };

  const updateSettings = (updates: Partial<SiteSettings>) => {
    store.updateSettings(updates);
    showToast('Site settings saved and applied!', 'success');
  };

  const updateCMS = (updates: Partial<CMSContent>) => {
    store.updateCMS(updates);
    showToast('Website content updated successfully!', 'success');
  };

  const resetDemoData = () => {
    store.resetToDemoData();
    showToast('Demo store data has been reset to defaults!', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        categories,
        products,
        orders,
        testimonials,
        messages,
        contactMessages: messages,
        users,
        settings,
        cms,
        currentUser,
        cart,
        cartCount,
        cartSubtotal,
        deliveryCharge,
        cartTotal,
        route,
        setRoute,
        selectedCategory,
        setSelectedCategory,
        selectedProductId,
        setSelectedProductId,
        confirmedOrderId,
        setConfirmedOrderId,
        searchQuery,
        setSearchQuery,
        adminTab,
        setAdminTab,
        authModalOpen,
        setAuthModalOpen,
        cartDrawerOpen,
        setCartDrawerOpen,
        toasts,
        showToast,
        removeToast,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        createOrder,
        updateOrderStatus,
        login,
        register,
        logout,
        updateProfile,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStock,
        addCategory,
        updateCategory,
        deleteCategory,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        addContactMessage,
        updateMessageStatus,
        deleteMessage,
        updateSettings,
        updateCMS,
        resetDemoData,
        resetAllData: resetDemoData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
