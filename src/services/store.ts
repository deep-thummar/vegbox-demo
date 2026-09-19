import { 
  Category, 
  Product, 
  Testimonial, 
  Order, 
  OrderStatus, 
  User, 
  SiteSettings, 
  CMSContent, 
  ContactMessage, 
  CartItem, 
  ProductUnit 
} from '../types';
import { 
  SEED_CATEGORIES, 
  SEED_PRODUCTS, 
  SEED_TESTIMONIALS, 
  SEED_USERS, 
  SEED_ORDERS, 
  SEED_MESSAGES, 
  SEED_SETTINGS, 
  SEED_CMS 
} from '../data/seedData';

const STORAGE_KEYS = {
  CATEGORIES: 'vegbox_categories',
  PRODUCTS: 'vegbox_products',
  TESTIMONIALS: 'vegbox_testimonials',
  ORDERS: 'vegbox_orders',
  MESSAGES: 'vegbox_messages',
  SETTINGS: 'vegbox_settings',
  CMS: 'vegbox_cms',
  USERS: 'vegbox_users',
  CURRENT_USER: 'vegbox_current_user',
  CART: 'vegbox_cart',
};

type Listener = () => void;

class Store {
  private listeners: Set<Listener> = new Set();

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error('Error in store listener:', e);
      }
    });
  }

  private load<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
      }
      return JSON.parse(item) as T;
    } catch {
      return fallback;
    }
  }

  private save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      this.notify();
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  }

  // --- CATEGORIES ---
  getCategories(): Category[] {
    return this.load<Category[]>(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES);
  }

  addCategory(category: Omit<Category, 'id'>): Category {
    const categories = this.getCategories();
    const newCat: Category = {
      ...category,
      id: `cat-${Date.now()}`,
    };
    categories.push(newCat);
    this.save(STORAGE_KEYS.CATEGORIES, categories);
    return newCat;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const categories = this.getCategories();
    const idx = categories.findIndex(c => c.id === id);
    if (idx === -1) return null;
    categories[idx] = { ...categories[idx], ...updates };
    this.save(STORAGE_KEYS.CATEGORIES, categories);
    return categories[idx];
  }

  deleteCategory(id: string): boolean {
    const categories = this.getCategories();
    const filtered = categories.filter(c => c.id !== id);
    if (filtered.length === categories.length) return false;
    this.save(STORAGE_KEYS.CATEGORIES, filtered);
    return true;
  }

  // --- PRODUCTS ---
  getProducts(): Product[] {
    return this.load<Product[]>(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
  }

  getProductById(id: string): Product | undefined {
    return this.getProducts().find(p => p.id === id);
  }

  addProduct(product: Omit<Product, 'id'>): Product {
    const products = this.getProducts();
    const newProd: Product = {
      ...product,
      id: `prod-${Date.now()}`,
    };
    products.unshift(newProd);
    this.save(STORAGE_KEYS.PRODUCTS, products);
    return newProd;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = this.getProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    products[idx] = { ...products[idx], ...updates };
    this.save(STORAGE_KEYS.PRODUCTS, products);
    return products[idx];
  }

  deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) return false;
    this.save(STORAGE_KEYS.PRODUCTS, filtered);
    return true;
  }

  toggleProductStock(id: string): Product | null {
    const product = this.getProductById(id);
    if (!product) return null;
    const newStatus = product.status === 'available' ? 'out_of_stock' : 'available';
    return this.updateProduct(id, { 
      status: newStatus,
      stock: newStatus === 'available' ? (product.stock > 0 ? product.stock : 25) : 0 
    });
  }

  // --- ORDERS ---
  getOrders(): Order[] {
    return this.load<Order[]>(STORAGE_KEYS.ORDERS, SEED_ORDERS);
  }

  getOrderById(id: string): Order | undefined {
    return this.getOrders().find(o => o.id === id || o.orderNumber === id);
  }

  getOrdersByUserId(userId: string): Order[] {
    return this.getOrders().filter(o => o.userId === userId);
  }

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'statusHistory'>): Order {
    const orders = this.getOrders();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const now = new Date().toISOString();
    
    // Delivery estimated 3 hours from now
    const est = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `VB-${randomNum}`,
      createdAt: now,
      estimatedDelivery: est,
      statusHistory: [
        {
          status: 'placed',
          timestamp: now,
          note: `Order placed via ${orderData.paymentMethod.toUpperCase()}`,
        }
      ]
    };

    // Deduct stock
    const products = this.getProducts();
    orderData.items.forEach(item => {
      const prodIndex = products.findIndex(p => p.id === item.productId);
      if (prodIndex !== -1) {
        products[prodIndex].stock = Math.max(0, products[prodIndex].stock - item.quantity);
        if (products[prodIndex].stock === 0) {
          products[prodIndex].status = 'out_of_stock';
        }
      }
    });
    this.save(STORAGE_KEYS.PRODUCTS, products);

    orders.unshift(newOrder);
    this.save(STORAGE_KEYS.ORDERS, orders);
    this.clearCart();
    return newOrder;
  }

  updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string): Order | null {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return null;

    const defaultNotes: Record<OrderStatus, string> = {
      placed: 'Order placed by customer',
      confirmed: 'Order accepted by dispatch farm team',
      preparing: 'Vegetables sorted, hydro-washed, and eco-packed',
      out_for_delivery: 'Out for delivery with courier route',
      delivered: 'Delivered directly to customer doorstep',
      cancelled: 'Order was cancelled',
    };

    const historyEntry = {
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || defaultNotes[newStatus] || `Status changed to ${newStatus}`,
    };

    orders[idx].status = newStatus;
    if (!orders[idx].statusHistory) orders[idx].statusHistory = [];
    orders[idx].statusHistory.push(historyEntry);

    this.save(STORAGE_KEYS.ORDERS, orders);
    return orders[idx];
  }

  // --- TESTIMONIALS ---
  getTestimonials(): Testimonial[] {
    return this.load<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, SEED_TESTIMONIALS);
  }

  addTestimonial(testimonial: Omit<Testimonial, 'id' | 'createdAt'>): Testimonial {
    const list = this.getTestimonials();
    const newTest: Testimonial = {
      ...testimonial,
      id: `test-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    list.unshift(newTest);
    this.save(STORAGE_KEYS.TESTIMONIALS, list);
    return newTest;
  }

  updateTestimonial(id: string, updates: Partial<Testimonial>): Testimonial | null {
    const list = this.getTestimonials();
    const idx = list.findIndex(t => t.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    this.save(STORAGE_KEYS.TESTIMONIALS, list);
    return list[idx];
  }

  deleteTestimonial(id: string): boolean {
    const list = this.getTestimonials();
    const filtered = list.filter(t => t.id !== id);
    if (filtered.length === list.length) return false;
    this.save(STORAGE_KEYS.TESTIMONIALS, filtered);
    return true;
  }

  // --- CONTACT MESSAGES ---
  getMessages(): ContactMessage[] {
    return this.load<ContactMessage[]>(STORAGE_KEYS.MESSAGES, SEED_MESSAGES);
  }

  addMessage(message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): ContactMessage {
    const messages = this.getMessages();
    const newMsg: ContactMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    messages.unshift(newMsg);
    this.save(STORAGE_KEYS.MESSAGES, messages);
    return newMsg;
  }

  updateMessageStatus(id: string, status: 'new' | 'replied' | 'archived'): ContactMessage | null {
    const messages = this.getMessages();
    const idx = messages.findIndex(m => m.id === id);
    if (idx === -1) return null;
    messages[idx].status = status;
    this.save(STORAGE_KEYS.MESSAGES, messages);
    return messages[idx];
  }

  deleteMessage(id: string): boolean {
    const messages = this.getMessages();
    const filtered = messages.filter(m => m.id !== id);
    if (filtered.length === messages.length) return false;
    this.save(STORAGE_KEYS.MESSAGES, filtered);
    return true;
  }

  // --- SETTINGS ---
  getSettings(): SiteSettings {
    return this.load<SiteSettings>(STORAGE_KEYS.SETTINGS, SEED_SETTINGS);
  }

  updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    const current = this.getSettings();
    const updated = { ...current, ...updates };
    this.save(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  // --- CMS ---
  getCMS(): CMSContent {
    return this.load<CMSContent>(STORAGE_KEYS.CMS, SEED_CMS);
  }

  updateCMS(updates: Partial<CMSContent>): CMSContent {
    const current = this.getCMS();
    const updated = { ...current, ...updates };
    this.save(STORAGE_KEYS.CMS, updated);
    return updated;
  }

  // --- USERS & AUTH ---
  getUsers(): User[] {
    return this.load<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
  }

  getCurrentUser(): User | null {
    return this.load<User | null>(STORAGE_KEYS.CURRENT_USER, SEED_USERS[1]); // default logged in as Alex Green for easy demo
  }

  setCurrentUser(user: User | null): void {
    this.save(STORAGE_KEYS.CURRENT_USER, user);
  }

  login(email: string): { user?: User; error?: string } {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { error: 'No account found with this email. Please register or use a demo account.' };
    }
    this.setCurrentUser(user);
    return { user };
  }

  register(userData: { name: string; email: string; phone?: string; address?: string; city?: string; pincode?: string }): { user?: User; error?: string } {
    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { error: 'An account with this email address already exists. Please log in.' };
    }
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: 'customer',
      phone: userData.phone || '',
      address: userData.address || '',
      city: userData.city || 'Pune',
      state: 'Maharashtra',
      pincode: userData.pincode || '',
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    };
    users.push(newUser);
    this.save(STORAGE_KEYS.USERS, users);
    this.setCurrentUser(newUser);
    return { user: newUser };
  }

  updateProfile(userId: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...updates };
    this.save(STORAGE_KEYS.USERS, users);
    const curr = this.getCurrentUser();
    if (curr && curr.id === userId) {
      this.setCurrentUser(users[idx]);
    }
    return users[idx];
  }

  logout(): void {
    this.setCurrentUser(null);
  }

  // --- CART ---
  getCart(): CartItem[] {
    return this.load<CartItem[]>(STORAGE_KEYS.CART, []);
  }

  addToCart(product: Product, quantity = 1, unit?: ProductUnit): CartItem[] {
    const cart = this.getCart();
    const chosenUnit = unit || product.unit;
    const existingIndex = cart.findIndex(
      item => item.product.id === product.id && item.unit === chosenUnit
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        product,
        quantity,
        unit: chosenUnit,
      });
    }

    this.save(STORAGE_KEYS.CART, cart);
    return cart;
  }

  updateCartQuantity(productId: string, unit: ProductUnit, newQuantity: number): CartItem[] {
    let cart = this.getCart();
    if (newQuantity <= 0) {
      cart = cart.filter(item => !(item.product.id === productId && item.unit === unit));
    } else {
      const item = cart.find(item => item.product.id === productId && item.unit === unit);
      if (item) {
        item.quantity = newQuantity;
      }
    }
    this.save(STORAGE_KEYS.CART, cart);
    return cart;
  }

  removeFromCart(productId: string, unit: ProductUnit): CartItem[] {
    const cart = this.getCart().filter(item => !(item.product.id === productId && item.unit === unit));
    this.save(STORAGE_KEYS.CART, cart);
    return cart;
  }

  clearCart(): void {
    this.save(STORAGE_KEYS.CART, []);
  }

  // --- RESET SYSTEM ---
  resetToDemoData(): void {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(SEED_TESTIMONIALS));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(SEED_MESSAGES));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(SEED_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.CMS, JSON.stringify(SEED_CMS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_USERS[1]));
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    this.notify();
  }
}

export const store = new Store();
