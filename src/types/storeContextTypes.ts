import {
  Vendor,
  Product,
  ProductVariant,
  Category,
  PromoBanner,
  CartItem,
  DeliveryTownship,
  PaymentAccount,
  ShopInfo,
  Order,
  OrderStatus,
  CustomerUser,
  CustomerAddress,
} from '../types';

export interface StoreContextType {
  // Multi-Tenant State
  vendors: Vendor[];
  activeVendor: Vendor;
  setActiveVendorBySlug: (slugOrDomain: string) => void;
  addVendor: (vendorData: Omit<Vendor, 'id' | 'createdAt'>) => Promise<Vendor>;
  updateVendor: (vendor: Vendor) => Promise<void>;
  deleteVendor: (id: string) => Promise<void>;
  toggleVendorStatus: (id: string) => Promise<void>;
  updateVendorDomain: (vendorId: string, customDomain: string, status?: 'active' | 'pending' | 'not_configured') => Promise<void>;

  // Products & Store Data (Scoped to active tenant or current vendor)
  products: Product[];
  categories: Category[];
  banners: PromoBanner[];
  townships: DeliveryTownship[];
  paymentAccounts: PaymentAccount[];
  shopInfo: ShopInfo;
  orders: Order[];
  cart: CartItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (catId: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  quickOrderProduct: Product | null;
  setQuickOrderProduct: (p: Product | null) => void;

  // Customer Profile & Guest Mode
  currentCustomer: CustomerUser | null;
  customerAddresses: CustomerAddress[];
  customerWishlist: string[];
  customerOrders: Order[];
  guestOrderIds: string[];
  loginCustomer: (phoneOrEmail: string, name?: string) => Promise<CustomerUser>;
  registerCustomer: (data: {
    name: string;
    phone: string;
    email?: string;
    defaultCity?: string;
    defaultTownship?: string;
    defaultAddress?: string;
  }) => Promise<CustomerUser>;
  logoutCustomer: () => void;
  updateCustomerProfile: (updates: Partial<CustomerUser>) => Promise<void>;
  addCustomerAddress: (address: Omit<CustomerAddress, 'id'>) => Promise<void>;
  deleteCustomerAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Cart Actions
  addToCart: (
    product: Product,
    quantity?: number,
    color?: string,
    variant?: ProductVariant,
    size?: string
  ) => void;
  updateCartItem: (
    oldCartItemId: string,
    updates: {
      quantity?: number;
      selectedColor?: string;
      selectedVariant?: ProductVariant;
      selectedSize?: string;
    }
  ) => void;
  updateCartItemQty: (cartItemId: string, quantity: number) => void;
  toggleCartItemSelect: (cartItemId: string) => void;
  selectAllCartItems: (select: boolean) => void;
  removeCartItem: (cartItemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSelectedTotal: number;

  // Order Actions
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;

  // Vendor Management (Product, Category, Banner, Rates, Payments, Branding)
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductStock: (id: string) => Promise<void>;

  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  addBanner: (banner: Omit<PromoBanner, 'id'>) => Promise<void>;
  updateBanner: (banner: PromoBanner) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;

  updateTownship: (township: DeliveryTownship) => Promise<void>;
  addTownship: (township: Omit<DeliveryTownship, 'id'>) => Promise<void>;
  deleteTownship: (id: string) => Promise<void>;

  updatePaymentAccount: (account: PaymentAccount) => Promise<void>;
  addPaymentAccount: (account: Omit<PaymentAccount, 'id'>) => Promise<void>;
  deletePaymentAccount: (id: string) => Promise<void>;

  updateShopInfo: (info: ShopInfo) => Promise<void>;
  resetAllData: () => Promise<void>;
  seedAllToFirestore: () => Promise<{ success: boolean; message: string }>;
  isFirestoreSyncing: boolean;
  firestoreError: string | null;
}
