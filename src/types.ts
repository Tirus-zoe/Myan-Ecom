export interface Vendor {
  id: string;
  shopName: string;
  slug: string;
  username: string;
  password: string; // Stored securely for vendor login
  customDomain?: string; // e.g. "shop.modernliving.com" or "living.store"
  domainStatus?: 'active' | 'pending' | 'not_configured';
  status: 'active' | 'suspended';
  themeColor: ColorTheme;
  phone?: string;
  logoUrl?: string;
  tagline?: string;
  ownerName?: string;
  createdAt: string;
}

export interface SuperAdminUser {
  username: string;
  password: string;
  name: string;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Size S", "3-Seater Sofa", "500ml", "Standard"
  price?: number; // custom price or override price
  originalPrice?: number;
  stockCount?: number;
  inStock?: boolean;
}

export interface Product {
  id: string;
  vendorId?: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  description: string;
  imageUrl: string;
  galleryImages?: string[];
  category: string;
  inStock: boolean;
  stockCount: number;
  soldCount: number;
  rating: number;
  reviewCount: number;
  colors?: string[];
  sizes?: string[]; // Quick size pills e.g. ['S', 'M', 'L', 'XL']
  variants?: ProductVariant[]; // Sub-items with individual prices
  isBestSeller?: boolean;
  isPopular?: boolean;
  location?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  vendorId?: string;
  name: string;
  icon: string;
  imageUrl?: string;
  itemCount?: number;
}

export interface PromoBanner {
  id: string;
  vendorId?: string;
  title: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  linkCategoryId?: string;
  bgColor?: string;
}

export interface CartItem {
  id: string; // Unique cart item identifier
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedVariant?: ProductVariant;
  selectedSize?: string;
  selected: boolean;
}

export interface DeliveryTownship {
  id: string;
  vendorId?: string;
  city: string;
  township: string;
  deliveryFee: number;
  estimatedDays: string;
}

export interface PaymentAccount {
  id: string;
  vendorId?: string;
  name: string; // e.g. KBZPay, WavePay, AYA Pay, CB Pay
  accountName: string;
  accountNumber: string;
  qrCodeUrl?: string;
  color: string;
  iconName: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  color?: string;
  variantName?: string;
  size?: string;
  imageUrl: string;
}

export interface Order {
  id: string;
  vendorId?: string;
  customerId?: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  city: string;
  township: string;
  addressDetail: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentProofUrl?: string;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
  telegramSent?: boolean;
}

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  defaultCity?: string;
  defaultTownship?: string;
  defaultAddress?: string;
  createdAt: string;
}

export interface CustomerAddress {
  id: string;
  label: string; // 'Home', 'Office', 'Other'
  recipientName: string;
  phone: string;
  city: string;
  township: string;
  addressDetail: string;
  isDefault?: boolean;
}

export type ColorTheme =
  | 'emerald'
  | 'rose'
  | 'amber'
  | 'blue'
  | 'purple'
  | 'slate'
  | 'orange'
  | 'teal';

export interface ShopInfo {
  vendorId?: string;
  name: string;
  logoUrl?: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  openingHours: string;
  mapEmbedUrl: string;
  themeColor: ColorTheme;
  customDomain?: string;
  domainStatus?: 'active' | 'pending' | 'not_configured';
  socials: {
    facebook?: string;
    telegram?: string;
    viber?: string;
    tiktok?: string;
    instagram?: string;
  };
  telegramSettings: {
    botToken?: string;
    chatId?: string;
    channelUsername?: string;
    enabled: boolean;
  };
  currencySymbol: string;
}

