import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Product,
  Category,
  PromoBanner,
  DeliveryTownship,
  PaymentAccount,
  ShopInfo,
  Order,
  OrderStatus,
} from '../types';
import {
  initialProducts,
  initialCategories,
  initialBanners,
  initialTownships,
  initialPaymentAccounts,
  initialShopInfo,
  initialShopInfoMap,
  initialOrders,
  initialVendors,
} from '../data/initialData';
import { sendTelegramOrder } from '../utils/telegram';
import {
  saveToFirestore,
  deleteFromFirestore,
  seedAllCollections,
} from '../services/firestoreSync';
import { StoreContextType } from '../types/storeContextTypes';
import { useCartManager } from './useCartManager';
import { useFirestoreListeners } from './useFirestoreListeners';
import { useVendorManager } from './useVendorManager';

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ALL_PRODUCTS: 'sc_products_v2',
  ALL_CATEGORIES: 'sc_categories_v2',
  ALL_BANNERS: 'sc_banners_v2',
  ALL_TOWNSHIPS: 'sc_townships_v2',
  ALL_PAYMENTS: 'sc_payments_v2',
  SHOP_INFOS_MAP: 'sc_shop_infos_map_v2',
  ALL_ORDERS: 'sc_orders_v2',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const vendorManager = useVendorManager();
  const activeVendorId = vendorManager.activeVendor?.id || 'vendor_smart_living';

  // 1. Raw State Collections (Contains all vendors' data)
  const [allProducts, setAllProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALL_PRODUCTS);
    if (!saved) return initialProducts;
    try {
      const parsed: Product[] = JSON.parse(saved);
      const initialIds = new Set(initialProducts.map((p) => p.id));
      const customProducts = parsed.filter((p) => !initialIds.has(p.id));
      return [...initialProducts, ...customProducts];
    } catch {
      return initialProducts;
    }
  });

  const [allCategories, setAllCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALL_CATEGORIES);
    if (!saved) return initialCategories;
    try {
      const parsed: Category[] = JSON.parse(saved);
      const initialIds = new Set(initialCategories.map((c) => c.id));
      const customCategories = parsed.filter((c) => !initialIds.has(c.id));
      return [...initialCategories, ...customCategories];
    } catch {
      return initialCategories;
    }
  });

  const [allBanners, setAllBanners] = useState<PromoBanner[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALL_BANNERS);
    if (!saved) return initialBanners;
    try {
      const parsed: PromoBanner[] = JSON.parse(saved);
      const initialIds = new Set(initialBanners.map((b) => b.id));
      const customBanners = parsed.filter((b) => !initialIds.has(b.id));
      return [...initialBanners, ...customBanners];
    } catch {
      return initialBanners;
    }
  });

  const [allTownships, setAllTownships] = useState<DeliveryTownship[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALL_TOWNSHIPS);
    return saved ? JSON.parse(saved) : initialTownships;
  });

  const [allPaymentAccounts, setAllPaymentAccounts] = useState<PaymentAccount[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALL_PAYMENTS);
    if (!saved) return initialPaymentAccounts;
    try {
      const parsed: PaymentAccount[] = JSON.parse(saved);
      const initialIds = new Set(initialPaymentAccounts.map((pa) => pa.id));
      const customPayments = parsed.filter((pa) => !initialIds.has(pa.id));
      return [...initialPaymentAccounts, ...customPayments];
    } catch {
      return initialPaymentAccounts;
    }
  });

  const [shopInfosMap, setShopInfosMap] = useState<Record<string, ShopInfo>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SHOP_INFOS_MAP);
    if (!saved) return initialShopInfoMap;
    try {
      const parsed = JSON.parse(saved);
      return { ...initialShopInfoMap, ...parsed };
    } catch {
      return initialShopInfoMap;
    }
  });

  const [allOrders, setAllOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALL_ORDERS);
    if (!saved) return initialOrders;
    try {
      const parsed: Order[] = JSON.parse(saved);
      const initialIds = new Set(initialOrders.map((o) => o.id));
      const customOrders = parsed.filter((o) => !initialIds.has(o.id));
      return [...initialOrders, ...customOrders];
    } catch {
      return initialOrders;
    }
  });

  // Customer Profile & Guest State
  const [currentCustomer, setCurrentCustomer] = useState<any | null>(() => {
    const saved = localStorage.getItem('sc_customer_user_v1');
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  const [customerAddresses, setCustomerAddresses] = useState<any[]>(() => {
    const saved = localStorage.getItem('sc_customer_addresses_v1');
    if (!saved) {
      return [
        {
          id: 'addr-default-1',
          label: 'Home (အိမ်)',
          recipientName: 'Khin Khin',
          phone: '09798889999',
          city: 'Yangon',
          township: 'Hlaing',
          addressDetail: 'No. 42, Insein Road, Near Junction Square',
          isDefault: true,
        },
      ];
    }
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  const [customerWishlist, setCustomerWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('sc_customer_wishlist_v1');
    return saved ? JSON.parse(saved) : [];
  });

  const [guestOrderIds, setGuestOrderIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('sc_guest_orders_v1');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickOrderProduct, setQuickOrderProduct] = useState<Product | null>(null);
  const [isFirestoreSyncing, setIsFirestoreSyncing] = useState(false);
  const [firestoreError, setFirestoreError] = useState<string | null>(null);

  const cartManager = useCartManager();

  // 2. Persist Raw Data to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALL_PRODUCTS, JSON.stringify(allProducts));
  }, [allProducts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALL_CATEGORIES, JSON.stringify(allCategories));
  }, [allCategories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALL_BANNERS, JSON.stringify(allBanners));
  }, [allBanners]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALL_TOWNSHIPS, JSON.stringify(allTownships));
  }, [allTownships]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALL_PAYMENTS, JSON.stringify(allPaymentAccounts));
  }, [allPaymentAccounts]);

  useEffect(() => {
    if (currentCustomer) {
      localStorage.setItem('sc_customer_user_v1', JSON.stringify(currentCustomer));
    } else {
      localStorage.removeItem('sc_customer_user_v1');
    }
  }, [currentCustomer]);

  useEffect(() => {
    localStorage.setItem('sc_customer_addresses_v1', JSON.stringify(customerAddresses));
  }, [customerAddresses]);

  useEffect(() => {
    localStorage.setItem('sc_customer_wishlist_v1', JSON.stringify(customerWishlist));
  }, [customerWishlist]);

  useEffect(() => {
    localStorage.setItem('sc_guest_orders_v1', JSON.stringify(guestOrderIds));
  }, [guestOrderIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHOP_INFOS_MAP, JSON.stringify(shopInfosMap));
  }, [shopInfosMap]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALL_ORDERS, JSON.stringify(allOrders));
  }, [allOrders]);

  // 3. Strict Multi-Tenant Filtered Data for Active Vendor
  const products = useMemo(() => {
    return allProducts.filter((p) => (p.vendorId || 'vendor_smart_living') === activeVendorId);
  }, [allProducts, activeVendorId]);

  const categories = useMemo(() => {
    return allCategories.filter((c) => (c.vendorId || 'vendor_smart_living') === activeVendorId);
  }, [allCategories, activeVendorId]);

  const banners = useMemo(() => {
    return allBanners.filter((b) => (b.vendorId || 'vendor_smart_living') === activeVendorId);
  }, [allBanners, activeVendorId]);

  const townships = useMemo(() => {
    const scoped = allTownships.filter((t) => (t.vendorId || 'vendor_smart_living') === activeVendorId);
    // If the vendor has not created custom delivery rates yet, provide default initial townships
    if (scoped.length > 0) return scoped;
    return initialTownships.map((t) => ({ ...t, vendorId: activeVendorId }));
  }, [allTownships, activeVendorId]);

  const paymentAccounts = useMemo(() => {
    const scoped = allPaymentAccounts.filter((pa) => (pa.vendorId || 'vendor_smart_living') === activeVendorId);
    return scoped;
  }, [allPaymentAccounts, activeVendorId]);

  const orders = useMemo(() => {
    return allOrders.filter((o) => (o.vendorId || 'vendor_smart_living') === activeVendorId);
  }, [allOrders, activeVendorId]);

  const shopInfo: ShopInfo = useMemo(() => {
    const cur = shopInfosMap[activeVendorId] || initialShopInfoMap[activeVendorId];
    const activeV = vendorManager.activeVendor;
    return {
      name: activeV?.shopName || cur?.name || initialShopInfo.name,
      logoUrl: activeV?.logoUrl || cur?.logoUrl || initialShopInfo.logoUrl,
      tagline: activeV?.tagline || cur?.tagline || initialShopInfo.tagline,
      description: cur?.description || `Welcome to ${activeV?.shopName || 'our store'}. Order premium products with fast doorstep delivery.`,
      phone: activeV?.phone || cur?.phone || '09 789 123 456',
      email: cur?.email || `contact@${activeV?.slug || 'shop'}.store`,
      address: cur?.address || 'Kamayut Township, Yangon, Myanmar',
      city: cur?.city || 'Yangon, Myanmar',
      openingHours: cur?.openingHours || 'Mon - Sun: 9:00 AM - 8:00 PM',
      mapEmbedUrl: cur?.mapEmbedUrl || '',
      themeColor: activeV?.themeColor || cur?.themeColor || 'emerald',
      customDomain: activeV?.customDomain || cur?.customDomain,
      domainStatus: activeV?.domainStatus || cur?.domainStatus,
      socials: cur?.socials || {
        facebook: '',
        telegram: '',
        viber: '',
        tiktok: '',
        instagram: '',
      },
      telegramSettings: cur?.telegramSettings || {
        botToken: '',
        chatId: '',
        channelUsername: '',
        enabled: false,
      },
      currencySymbol: cur?.currencySymbol || 'Ks',
      vendorId: activeVendorId,
    };
  }, [shopInfosMap, activeVendorId, vendorManager.activeVendor]);

  // 4. Real-time Firestore Sync Listeners
  useFirestoreListeners({
    setVendors: vendorManager.setVendors,
    setProducts: setAllProducts,
    setCategories: setAllCategories,
    setBanners: setAllBanners,
    setTownships: setAllTownships,
    setShopInfosMap: setShopInfosMap,
    setOrders: setAllOrders,
    setPaymentAccounts: setAllPaymentAccounts,
    setIsSyncing: setIsFirestoreSyncing,
    setError: setFirestoreError,
  });

  // Auto-seed initial multi-vendor shops to Firestore if not yet seeded
  useEffect(() => {
    const hasSeeded = sessionStorage.getItem('sc_has_initial_seeded_v1');
    if (!hasSeeded) {
      sessionStorage.setItem('sc_has_initial_seeded_v1', 'true');
      seedAllCollections({
        vendors: vendorManager.vendors,
        products: allProducts,
        categories: allCategories,
        banners: allBanners,
        townships: allTownships,
        paymentAccounts: allPaymentAccounts,
        shopInfo,
        shopInfosMap,
        orders: allOrders,
      }).catch(console.error);
    }
  }, []);

  // Customer Order Filtering
  const customerOrders = useMemo(() => {
    if (currentCustomer) {
      return allOrders.filter(
        (o) =>
          (o.customerId && o.customerId === currentCustomer.id) ||
          (currentCustomer.phone && o.customerPhone === currentCustomer.phone) ||
          guestOrderIds.includes(o.id)
      );
    }
    return allOrders.filter((o) => guestOrderIds.includes(o.id));
  }, [allOrders, currentCustomer, guestOrderIds]);

  // Customer Profile Actions
  const loginCustomer = async (phoneOrEmail: string, name?: string): Promise<any> => {
    const normalized = phoneOrEmail.trim();
    const existingUser = {
      id: currentCustomer?.id || `cust-${Date.now()}`,
      name: name?.trim() || currentCustomer?.name || (normalized.includes('@') ? normalized.split('@')[0] : `User ${normalized.slice(-4)}`),
      phone: normalized.includes('@') ? currentCustomer?.phone || '' : normalized,
      email: normalized.includes('@') ? normalized : currentCustomer?.email || '',
      createdAt: currentCustomer?.createdAt || new Date().toISOString(),
    };
    if (name?.trim()) existingUser.name = name.trim();

    setCurrentCustomer(existingUser);
    localStorage.setItem('sc_customer_user_v1', JSON.stringify(existingUser));
    await saveToFirestore('customers', existingUser.id, existingUser);
    return existingUser;
  };

  const registerCustomer = async (data: {
    name: string;
    phone: string;
    email?: string;
    defaultCity?: string;
    defaultTownship?: string;
    defaultAddress?: string;
  }): Promise<any> => {
    const newUser = {
      id: `cust-${Date.now()}`,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || '',
      defaultCity: data.defaultCity || 'Yangon',
      defaultTownship: data.defaultTownship || '',
      defaultAddress: data.defaultAddress || '',
      createdAt: new Date().toISOString(),
    };
    setCurrentCustomer(newUser);
    localStorage.setItem('sc_customer_user_v1', JSON.stringify(newUser));
    await saveToFirestore('customers', newUser.id, newUser);

    if (data.defaultAddress && data.defaultTownship) {
      const newAddr = {
        id: `addr-${Date.now()}`,
        label: 'Home (အိမ်)',
        recipientName: data.name,
        phone: data.phone,
        city: data.defaultCity || 'Yangon',
        township: data.defaultTownship,
        addressDetail: data.defaultAddress,
        isDefault: true,
      };
      setCustomerAddresses([newAddr]);
      localStorage.setItem('sc_customer_addresses_v1', JSON.stringify([newAddr]));
    }
    return newUser;
  };

  const logoutCustomer = () => {
    setCurrentCustomer(null);
    localStorage.removeItem('sc_customer_user_v1');
  };

  const updateCustomerProfile = async (updates: Partial<any>) => {
    if (!currentCustomer) return;
    const updated = { ...currentCustomer, ...updates };
    setCurrentCustomer(updated);
    localStorage.setItem('sc_customer_user_v1', JSON.stringify(updated));
    await saveToFirestore('customers', updated.id, updated);
  };

  const addCustomerAddress = async (address: Omit<any, 'id'>) => {
    const newAddr = {
      ...address,
      id: `addr-${Date.now()}`,
    };
    setCustomerAddresses((prev) => {
      let next = address.isDefault ? prev.map((a) => ({ ...a, isDefault: false })) : [...prev];
      next = [newAddr, ...next];
      localStorage.setItem('sc_customer_addresses_v1', JSON.stringify(next));
      return next;
    });
  };

  const deleteCustomerAddress = async (id: string) => {
    setCustomerAddresses((prev) => {
      const next = prev.filter((a) => a.id !== id);
      localStorage.setItem('sc_customer_addresses_v1', JSON.stringify(next));
      return next;
    });
  };

  const setDefaultAddress = async (id: string) => {
    setCustomerAddresses((prev) => {
      const next = prev.map((a) => ({ ...a, isDefault: a.id === id }));
      localStorage.setItem('sc_customer_addresses_v1', JSON.stringify(next));
      return next;
    });
  };

  const toggleWishlist = (productId: string) => {
    setCustomerWishlist((prev) => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      localStorage.setItem('sc_customer_wishlist_v1', JSON.stringify(updated));
      return updated;
    });
  };

  const isWishlisted = (productId: string) => customerWishlist.includes(productId);

  // 5. Orders CRUD (Strictly Scoped to Active Vendor)
  const createOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Promise<Order> => {
    const prefix = (vendorManager.activeVendor?.shopName || 'SC')
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 3)
      .toUpperCase();
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      vendorId: activeVendorId,
      customerId: currentCustomer?.id || undefined,
      orderNumber: `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending',
    };

    setAllOrders((prev) => [newOrder, ...prev]);
    setGuestOrderIds((prev) => {
      const updated = [newOrder.id, ...prev.filter((id) => id !== newOrder.id)];
      localStorage.setItem('sc_guest_orders_v1', JSON.stringify(updated));
      return updated;
    });
    await saveToFirestore('orders', newOrder.id, newOrder);

    if (shopInfo.telegramSettings?.enabled) {
      sendTelegramOrder(newOrder, shopInfo).catch(console.error);
    }
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setAllOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    await saveToFirestore('orders', orderId, { status });
  };

  const deleteOrder = async (orderId: string) => {
    setAllOrders((prev) => prev.filter((o) => o.id !== orderId));
    await deleteFromFirestore('orders', orderId);
  };

  // 6. Products CRUD (Strictly Scoped to Active Vendor)
  const addProduct = async (prod: Omit<Product, 'id' | 'createdAt'>) => {
    const newProd: Product = {
      ...prod,
      id: `prod-${Date.now()}`,
      vendorId: prod.vendorId || activeVendorId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAllProducts((prev) => [newProd, ...prev]);
    await saveToFirestore('products', newProd.id, newProd);
  };

  const updateProduct = async (prod: Product) => {
    const updatedProd: Product = {
      ...prod,
      vendorId: prod.vendorId || activeVendorId,
    };
    setAllProducts((prev) => prev.map((p) => (p.id === prod.id ? updatedProd : p)));
    await saveToFirestore('products', prod.id, updatedProd);
  };

  const deleteProduct = async (id: string) => {
    setAllProducts((prev) => prev.filter((p) => p.id !== id));
    await deleteFromFirestore('products', id);
  };

  const toggleProductStock = async (id: string) => {
    const target = allProducts.find((p) => p.id === id);
    if (!target) return;
    const updated = { ...target, inStock: !target.inStock };
    await updateProduct(updated);
  };

  // 7. Categories CRUD (Strictly Scoped to Active Vendor)
  const addCategory = async (cat: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
      vendorId: cat.vendorId || activeVendorId,
    };
    setAllCategories((prev) => [...prev, newCat]);
    await saveToFirestore('categories', newCat.id, newCat);
  };

  const updateCategory = async (cat: Category) => {
    const updatedCat: Category = {
      ...cat,
      vendorId: cat.vendorId || activeVendorId,
    };
    setAllCategories((prev) => prev.map((c) => (c.id === cat.id ? updatedCat : c)));
    await saveToFirestore('categories', cat.id, updatedCat);
  };

  const deleteCategory = async (id: string) => {
    setAllCategories((prev) => prev.filter((c) => c.id !== id));
    await deleteFromFirestore('categories', id);
  };

  // 8. Banners CRUD (Strictly Scoped to Active Vendor)
  const addBanner = async (ban: Omit<PromoBanner, 'id'>) => {
    const newBan: PromoBanner = {
      ...ban,
      id: `ban-${Date.now()}`,
      vendorId: ban.vendorId || activeVendorId,
    };
    setAllBanners((prev) => [...prev, newBan]);
    await saveToFirestore('banners', newBan.id, newBan);
  };

  const updateBanner = async (ban: PromoBanner) => {
    const updatedBan: PromoBanner = {
      ...ban,
      vendorId: ban.vendorId || activeVendorId,
    };
    setAllBanners((prev) => prev.map((b) => (b.id === ban.id ? updatedBan : b)));
    await saveToFirestore('banners', ban.id, updatedBan);
  };

  const deleteBanner = async (id: string) => {
    setAllBanners((prev) => prev.filter((b) => b.id !== id));
    await deleteFromFirestore('banners', id);
  };

  // 9. Townships CRUD (Strictly Scoped to Active Vendor)
  const addTownship = async (t: Omit<DeliveryTownship, 'id'>) => {
    const newT: DeliveryTownship = {
      ...t,
      id: `town-${Date.now()}`,
      vendorId: t.vendorId || activeVendorId,
    };
    setAllTownships((prev) => [...prev, newT]);
    await saveToFirestore('townships', newT.id, newT);
  };

  const updateTownship = async (t: DeliveryTownship) => {
    const updatedT: DeliveryTownship = {
      ...t,
      vendorId: t.vendorId || activeVendorId,
    };
    setAllTownships((prev) => prev.map((item) => (item.id === t.id ? updatedT : item)));
    await saveToFirestore('townships', t.id, updatedT);
  };

  const deleteTownship = async (id: string) => {
    setAllTownships((prev) => prev.filter((item) => item.id !== id));
    await deleteFromFirestore('townships', id);
  };

  // 10. Payment Accounts CRUD (Strictly Scoped to Active Vendor)
  const addPaymentAccount = async (pa: Omit<PaymentAccount, 'id'>) => {
    const newPa: PaymentAccount = {
      ...pa,
      id: `pay-${Date.now()}`,
      vendorId: pa.vendorId || activeVendorId,
    };
    setAllPaymentAccounts((prev) => [...prev, newPa]);
    await saveToFirestore('paymentAccounts', newPa.id, newPa);
  };

  const updatePaymentAccount = async (pa: PaymentAccount) => {
    const updatedPa: PaymentAccount = {
      ...pa,
      vendorId: pa.vendorId || activeVendorId,
    };
    setAllPaymentAccounts((prev) => prev.map((p) => (p.id === pa.id ? updatedPa : p)));
    await saveToFirestore('paymentAccounts', pa.id, updatedPa);
  };

  const deletePaymentAccount = async (id: string) => {
    setAllPaymentAccounts((prev) => prev.filter((p) => p.id !== id));
    await deleteFromFirestore('paymentAccounts', id);
  };

  // 11. Shop Info Management (Strictly Scoped to Active Vendor)
  const updateShopInfo = async (info: ShopInfo) => {
    const updatedInfo: ShopInfo = {
      ...info,
      vendorId: activeVendorId,
    };
    setShopInfosMap((prev) => ({
      ...prev,
      [activeVendorId]: updatedInfo,
    }));
    await saveToFirestore('shopInfo', activeVendorId, updatedInfo);

    // Sync branding with vendor profile
    if (vendorManager.activeVendor) {
      await vendorManager.updateVendor({
        ...vendorManager.activeVendor,
        shopName: info.name,
        logoUrl: info.logoUrl,
        tagline: info.tagline,
        phone: info.phone,
        themeColor: info.themeColor,
        customDomain: info.customDomain,
        domainStatus: info.domainStatus,
      });
    }
  };

  // 12. Reset & Seed Operations
  const resetAllData = async () => {
    vendorManager.setVendors(initialVendors);
    setAllProducts(initialProducts);
    setAllCategories(initialCategories);
    setAllBanners(initialBanners);
    setAllTownships(initialTownships);
    setAllPaymentAccounts(initialPaymentAccounts);
    setShopInfosMap(initialShopInfoMap);
    setAllOrders(initialOrders);
    cartManager.clearCart();
    localStorage.clear();
  };

  const seedAllToFirestore = async () => {
    return seedAllCollections({
      vendors: vendorManager.vendors,
      products: allProducts,
      categories: allCategories,
      banners: allBanners,
      townships: allTownships,
      paymentAccounts: allPaymentAccounts,
      shopInfo,
      shopInfosMap,
      orders: allOrders,
    });
  };

  return (
    <StoreContext.Provider
      value={{
        ...vendorManager,
        products,
        categories,
        banners,
        townships,
        paymentAccounts,
        shopInfo,
        orders,
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        selectedProduct,
        setSelectedProduct,
        quickOrderProduct,
        setQuickOrderProduct,
        currentCustomer,
        customerAddresses,
        customerWishlist,
        customerOrders,
        guestOrderIds,
        loginCustomer,
        registerCustomer,
        logoutCustomer,
        updateCustomerProfile,
        addCustomerAddress,
        deleteCustomerAddress,
        setDefaultAddress,
        toggleWishlist,
        isWishlisted,
        ...cartManager,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStock,
        addCategory,
        updateCategory,
        deleteCategory,
        addBanner,
        updateBanner,
        deleteBanner,
        updateTownship,
        addTownship,
        deleteTownship,
        updatePaymentAccount,
        addPaymentAccount,
        deletePaymentAccount,
        updateShopInfo,
        resetAllData,
        seedAllToFirestore,
        isFirestoreSyncing,
        firestoreError,
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
