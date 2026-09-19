export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  joinedDate: string;
  createdAt?: string;
  avatar?: string;
}

export type ProductUnit = '250g' | '500g' | '1kg' | '2kg' | '1 bunch' | 'bunch' | '1 piece' | 'Pack of 3' | 'pack';
export type ProductStatus = 'available' | 'out_of_stock' | 'hidden';

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  unit: ProductUnit;
  stock: number;
  status: ProductStatus;
  image: string;
  gallery?: string[];
  description: string;
  nutritionHighlights?: string[];
  farmOrigin: string;
  isOrganic: boolean;
  isFeatured: boolean;
  rating: number;
  reviewsCount: number;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  icon?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  unit: ProductUnit;
}

export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';
export type PaymentStatus = 'paid' | 'pending';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  unit: ProductUnit;
  quantity: number;
  image: string;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    deliveryInstructions?: string;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  statusHistory: OrderStatusHistory[];
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  review: string;
  isActive: boolean;
  createdAt: string;
  role?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'replied' | 'archived';
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoUrl: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  cityState: string;
  currency: string;
  currencySymbol: string;
  deliveryCharge: number;
  freeDeliveryThreshold: number;
  businessHours: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    whatsapp: string;
  };
}

export interface WhyChooseItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface HowItWorksItem {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface CMSContent {
  branding: {
    logo: string;
    siteName: string;
    tagline: string;
    brandDescription: string;
  };
  hero: {
    badge: string;
    title: string;
    highlightTitle: string;
    subtitle: string;
    image: string;
    ctaPrimary: string;
    ctaSecondary: string;
    statNumber: string;
    statLabel: string;
  };
  whyChooseUs: WhyChooseItem[];
  howItWorks: HowItWorksItem[];
  farmToHome: {
    badge: string;
    title: string;
    content: string;
    image: string;
    farmersCount: string;
    freshnessGuarantee: string;
  };
  aboutUs: {
    title: string;
    subtitle: string;
    story: string;
    mission: string;
    vision: string;
    heroImage: string;
    teamImage: string;
    stats: Array<{ label: string; value: string }>;
  };
  footer: {
    description: string;
    copyright: string;
  };
}

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

export type StoreSettings = SiteSettings;
