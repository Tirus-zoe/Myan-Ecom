import React, { useState } from 'react';
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  ShieldCheck,
  LogOut,
  LogIn,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  Check,
  X,
  Phone,
  Store,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Receipt,
  Eye,
  RotateCcw,
  Edit3,
  Package,
  CreditCard,
  MessageCircle,
  Headphones,
  Info,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { getTheme } from '../../utils/theme';
import { Order, CustomerAddress } from '../../types';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    shopInfo,
    currentCustomer,
    customerOrders,
    customerAddresses,
    customerWishlist,
    cart,
    products,
    townships,
    loginCustomer,
    registerCustomer,
    logoutCustomer,
    updateCustomerProfile,
    addCustomerAddress,
    deleteCustomerAddress,
    setDefaultAddress,
    toggleWishlist,
    addToCart,
  } = useStore();

  const theme = getTheme(shopInfo.themeColor);

  // Active Profile Sub-Tab
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist'>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'confirmed' | 'shipped' | 'delivered'>('all');

  // Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Auth Form State
  const [authIdentifier, setAuthIdentifier] = useState('');
  const [authName, setAuthName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regTownship, setRegTownship] = useState(townships[0]?.township || '');
  const [regAddress, setRegAddress] = useState('');
  const [authError, setAuthError] = useState('');

  // New Address Form State
  const [addrLabel, setAddrLabel] = useState('Home (အိမ်)');
  const [addrRecipient, setAddrRecipient] = useState(currentCustomer?.name || '');
  const [addrPhone, setAddrPhone] = useState(currentCustomer?.phone || '');
  const [addrTownship, setAddrTownship] = useState(townships[0]?.township || '');
  const [addrDetail, setAddrDetail] = useState('');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Edit Profile Form State
  const [editName, setEditName] = useState(currentCustomer?.name || '');
  const [editPhone, setEditPhone] = useState(currentCustomer?.phone || '');
  const [editEmail, setEditEmail] = useState(currentCustomer?.email || '');

  // Filtered Orders
  const filteredOrders = customerOrders.filter((order) => {
    if (orderFilter === 'all') return true;
    return order.status === orderFilter;
  });

  // Count orders by status
  const pendingOrdersCount = customerOrders.filter((o) => o.status === 'pending').length;
  const confirmedOrdersCount = customerOrders.filter((o) => o.status === 'confirmed').length;
  const shippedOrdersCount = customerOrders.filter((o) => o.status === 'shipped').length;
  const deliveredOrdersCount = customerOrders.filter((o) => o.status === 'delivered').length;

  // Wishlisted Products
  const wishlistedProducts = products.filter((p) => customerWishlist.includes(p.id));

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authIdentifier.trim()) {
      setAuthError('Please enter your Phone Number or Email');
      return;
    }
    try {
      await loginCustomer(authIdentifier, authName);
      setShowAuthModal(false);
      setAuthError('');
    } catch (err: any) {
      setAuthError(err.message || 'Login failed');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authName.trim() || !regPhone.trim()) {
      setAuthError('Please enter your Name and Phone Number');
      return;
    }
    try {
      await registerCustomer({
        name: authName.trim(),
        phone: regPhone.trim(),
        email: regEmail.trim() || undefined,
        defaultTownship: regTownship,
        defaultAddress: regAddress.trim() || undefined,
      });
      setShowAuthModal(false);
      setAuthError('');
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed');
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrRecipient.trim() || !addrPhone.trim() || !addrDetail.trim()) {
      return;
    }
    await addCustomerAddress({
      label: addrLabel,
      recipientName: addrRecipient.trim(),
      phone: addrPhone.trim(),
      city: 'Yangon',
      township: addrTownship,
      addressDetail: addrDetail.trim(),
      isDefault: addrIsDefault || customerAddresses.length === 0,
    });
    setShowAddressModal(false);
    setAddrDetail('');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    await updateCustomerProfile({
      name: editName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim(),
    });
    setShowEditProfileModal(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={12} /> Pending (စစ်ဆေးဆဲ)
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 size={12} /> Confirmed (အတည်ပြုပြီး)
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Truck size={12} /> Shipped (ပို့ဆောင်နေဆဲ)
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Check size={12} /> Delivered (ရောက်ရှိပြီး)
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <X size={12} /> Cancelled (ပယ်ဖျက်သည်)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-50 text-gray-700 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 text-gray-800">
      {/* 1. TOP MOBILE APP HEADER & PROFILE BANNER */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 text-white px-4 pt-6 pb-10 rounded-b-[2rem] shadow-md relative overflow-hidden">
        {/* Subtle Ambient Background Accents */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 -left-12 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-xl mx-auto relative z-10 space-y-4">
          {currentCustomer ? (
            /* Logged-In Customer Card */
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-13 h-13 rounded-2xl ${theme.primaryLightBg} ${theme.primaryText} flex items-center justify-center font-black text-xl border-2 ${theme.primaryBorder} shadow-md shrink-0`}
                >
                  {currentCustomer.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h1 className="font-bold text-white text-base truncate">
                      {currentCustomer.name}
                    </h1>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-0.5">
                      <Sparkles size={9} /> Member
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium mt-0.5 truncate">
                    {currentCustomer.phone || currentCustomer.email || 'Customer Account'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  id="edit-profile-btn"
                  onClick={() => {
                    setEditName(currentCustomer.name || '');
                    setEditPhone(currentCustomer.phone || '');
                    setEditEmail(currentCustomer.email || '');
                    setShowEditProfileModal(true);
                  }}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-colors"
                  title="Edit Profile"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  type="button"
                  id="logout-customer-btn"
                  onClick={logoutCustomer}
                  className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/30 transition-colors"
                  title="Log Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            /* Guest Customer Mobile App Header Card */
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-sm space-y-3.5">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-2xl bg-white/15 flex items-center justify-center text-white border border-white/20 shrink-0 shadow-inner">
                  <User size={24} className="text-slate-100" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-white text-base leading-tight">Guest Shopper</h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Guest Mode
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    အကောင့်မလိုဘဲ တိုက်ရိုက်မှာယူနိုင်ပါသည်
                  </p>
                </div>
              </div>

              {/* Login / Register Call to Action Bar */}
              <div className="pt-2.5 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-400 shrink-0" />
                  <span>ပိုမိုမြန်ဆန်စွာ မှာယူရန် အကောင့်ဝင်ပါ</span>
                </div>
                <button
                  type="button"
                  id="login-register-trigger-btn"
                  onClick={() => {
                    setAuthMode('login');
                    setShowAuthModal(true);
                  }}
                  className={`py-2.5 px-4 rounded-xl font-bold text-xs ${theme.primaryBg} text-white shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap`}
                >
                  <LogIn size={14} className="shrink-0" />
                  <span>Login / Register (အကောင့်ဝင်ရန်)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. FLOATING STATS HUB (Native Mobile App Style) */}
      <div className="max-w-xl mx-auto px-4 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-lg border border-gray-100 grid grid-cols-3 divide-x divide-gray-100">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`p-2 rounded-xl text-center transition-all ${
              activeTab === 'orders'
                ? `${theme.primaryLightBg} ${theme.primaryText}`
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <div className="font-black text-lg leading-tight">
              {customerOrders.length}
            </div>
            <div className="text-[11px] font-bold mt-0.5 truncate">
              Orders
            </div>
            <div className="text-[9px] text-gray-400 truncate">
              အော်ဒါများ
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('addresses')}
            className={`p-2 rounded-xl text-center transition-all ${
              activeTab === 'addresses'
                ? `${theme.primaryLightBg} ${theme.primaryText}`
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <div className="font-black text-lg leading-tight">
              {customerAddresses.length}
            </div>
            <div className="text-[11px] font-bold mt-0.5 truncate">
              Addresses
            </div>
            <div className="text-[9px] text-gray-400 truncate">
              လိပ်စာများ
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wishlist')}
            className={`p-2 rounded-xl text-center transition-all ${
              activeTab === 'wishlist'
                ? `${theme.primaryLightBg} ${theme.primaryText}`
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <div className="font-black text-lg leading-tight">
              {customerWishlist.length}
            </div>
            <div className="text-[11px] font-bold mt-0.5 truncate">
              Wishlist
            </div>
            <div className="text-[9px] text-gray-400 truncate">
              စိတ်ကြိုက်
            </div>
          </button>
        </div>
      </div>

      {/* 2. MAIN MOBILE CONTENT CONTAINER */}
      <div className="max-w-xl mx-auto px-3.5 sm:px-4 mt-3.5 space-y-3.5">
        {/* 🛍️ SIGNATURE MOBILE "MY ORDERS" STATUS HUB */}
        <div className="bg-white rounded-3xl p-4 border border-gray-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-xl ${theme.primaryLightBg} ${theme.primaryText} flex items-center justify-center`}>
                <ShoppingBag size={15} />
              </div>
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm">
                My Orders <span className="text-gray-400 font-normal text-[11px]">(ကျွန်ုပ်၏ အော်ဒါများ)</span>
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveTab('orders');
                setOrderFilter('all');
              }}
              className={`text-[11px] font-bold ${theme.primaryText} hover:underline flex items-center gap-0.5`}
            >
              <span>View All</span>
              <ChevronRight size={13} />
            </button>
          </div>

          {/* 5 Status Action Icons */}
          <div className="grid grid-cols-5 gap-1 text-center">
            <button
              onClick={() => {
                setActiveTab('orders');
                setOrderFilter('pending');
              }}
              className={`flex flex-col items-center p-1.5 rounded-2xl transition-all ${
                activeTab === 'orders' && orderFilter === 'pending'
                  ? `${theme.primaryLightBg} ring-1.5 ${theme.primaryBorder}`
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="relative p-2 rounded-xl bg-amber-50 text-amber-600 mb-1">
                <Clock size={17} />
                {pendingOrdersCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {pendingOrdersCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold text-gray-700 leading-tight">To Pay</span>
              <span className="text-[9px] text-gray-400">စစ်ဆေးဆဲ</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('orders');
                setOrderFilter('confirmed');
              }}
              className={`flex flex-col items-center p-1.5 rounded-2xl transition-all ${
                activeTab === 'orders' && orderFilter === 'confirmed'
                  ? `${theme.primaryLightBg} ring-1.5 ${theme.primaryBorder}`
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="relative p-2 rounded-xl bg-blue-50 text-blue-600 mb-1">
                <CheckCircle2 size={17} />
                {confirmedOrdersCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {confirmedOrdersCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold text-gray-700 leading-tight">Confirmed</span>
              <span className="text-[9px] text-gray-400">အတည်ပြု</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('orders');
                setOrderFilter('shipped');
              }}
              className={`flex flex-col items-center p-1.5 rounded-2xl transition-all ${
                activeTab === 'orders' && orderFilter === 'shipped'
                  ? `${theme.primaryLightBg} ring-1.5 ${theme.primaryBorder}`
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="relative p-2 rounded-xl bg-indigo-50 text-indigo-600 mb-1">
                <Truck size={17} />
                {shippedOrdersCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {shippedOrdersCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold text-gray-700 leading-tight">To Ship</span>
              <span className="text-[9px] text-gray-400">ပို့ဆောင်ဆဲ</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('orders');
                setOrderFilter('delivered');
              }}
              className={`flex flex-col items-center p-1.5 rounded-2xl transition-all ${
                activeTab === 'orders' && orderFilter === 'delivered'
                  ? `${theme.primaryLightBg} ring-1.5 ${theme.primaryBorder}`
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="relative p-2 rounded-xl bg-emerald-50 text-emerald-600 mb-1">
                <Check size={17} />
                {deliveredOrdersCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {deliveredOrdersCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold text-gray-700 leading-tight">Delivered</span>
              <span className="text-[9px] text-gray-400">ရောက်ရှိ</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('orders');
                setOrderFilter('all');
              }}
              className={`flex flex-col items-center p-1.5 rounded-2xl transition-all ${
                activeTab === 'orders' && orderFilter === 'all'
                  ? `${theme.primaryLightBg} ring-1.5 ${theme.primaryBorder}`
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="relative p-2 rounded-xl bg-slate-100 text-slate-700 mb-1">
                <Package size={17} />
                {customerOrders.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-slate-600 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {customerOrders.length}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold text-gray-700 leading-tight">All Orders</span>
              <span className="text-[9px] text-gray-400">အားလုံး</span>
            </button>
          </div>
        </div>

        {/* 3. ACTIVE SUB-TAB VIEW (Orders / Addresses / Wishlist) */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            {/* Status Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {(['all', 'pending', 'confirmed', 'shipped', 'delivered'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setOrderFilter(status)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all capitalize ${
                    orderFilter === status
                      ? `${theme.primaryText} ${theme.primaryLightBg} border ${theme.primaryBorder}`
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {status === 'all' ? 'All Orders' : status}
                </button>
              ))}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-7 border border-gray-200/80 shadow-xs text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag size={26} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">No Orders Found</h3>
                  <p className="text-[11px] text-gray-500 max-w-xs mx-auto mt-0.5">
                    {orderFilter === 'all'
                      ? 'You have not placed any orders yet. Explore our latest items!'
                      : `No orders currently in ${orderFilter} status.`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className={`px-5 py-2.5 rounded-2xl font-bold text-xs ${theme.primaryBg} text-white shadow-sm hover:brightness-110`}
                >
                  Start Shopping (ပစ္စည်းများ ကြည့်ရန်)
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-4 border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow space-y-3"
                  >
                    {/* Order Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-gray-900 text-xs sm:text-sm">
                            #{order.orderNumber}
                          </span>
                        </div>
                        <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium">
                          {order.createdAt}
                        </span>
                      </div>
                      <div>{getStatusBadge(order.status)}</div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-800 text-xs truncate">
                              {item.productName}
                            </h4>
                            <p className="text-[11px] text-gray-500">
                              Qty: {item.quantity}
                              {item.variantName ? ` • ${item.variantName}` : ''}
                              {item.size ? ` • Size ${item.size}` : ''}
                              {item.color ? ` • ${item.color}` : ''}
                            </p>
                          </div>
                          <span className="font-bold text-xs text-gray-800 shrink-0">
                            {(item.price * item.quantity).toLocaleString()} Ks
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary & Actions */}
                    <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-gray-400">Total Amount:</div>
                        <div className={`font-extrabold text-sm ${theme.primaryText}`}>
                          {order.totalAmount.toLocaleString()} Ks
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedOrderDetails(order)}
                          className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Eye size={13} />
                          <span>Details</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            order.items.forEach((item) => {
                              const foundProd = products.find((p) => p.id === item.productId);
                              if (foundProd) {
                                addToCart(
                                  foundProd,
                                  item.quantity,
                                  item.color,
                                  undefined,
                                  item.size
                                );
                              }
                            });
                            navigate('/cart');
                          }}
                          className={`px-3 py-1.5 rounded-xl ${theme.primaryLightBg} ${theme.primaryText} border ${theme.primaryBorder} text-xs font-bold flex items-center gap-1 hover:brightness-95 transition-all`}
                        >
                          <RotateCcw size={13} />
                          <span>Reorder</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. ADDRESSES TAB */}
        {activeTab === 'addresses' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-gray-800 text-xs sm:text-sm">
                Delivery Addresses <span className="text-gray-400 font-normal text-[11px]">(လိပ်စာများ)</span>
              </h3>
              <button
                type="button"
                id="add-new-address-btn"
                onClick={() => setShowAddressModal(true)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs ${theme.primaryBg} text-white shadow-xs flex items-center gap-1 shrink-0 whitespace-nowrap`}
              >
                <Plus size={14} className="shrink-0" />
                <span>Add New</span>
              </button>
            </div>

            {customerAddresses.length === 0 ? (
              <div className="bg-white rounded-3xl p-7 border border-gray-200/80 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                  <MapPin size={26} />
                </div>
                <h4 className="font-bold text-gray-800 text-sm">No Saved Addresses</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Save your home or office address to checkout in one click next time!
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(true)}
                  className={`px-4 py-2 rounded-2xl font-bold text-xs ${theme.primaryBg} text-white`}
                >
                  Add Your Address
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {customerAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`bg-white rounded-2xl p-4 border transition-all space-y-2 ${
                      addr.isDefault ? `${theme.primaryBorder} ring-1 ${theme.primaryLightBg}` : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-xs">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Default (အဓိကလိပ်စာ)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {!addr.isDefault && (
                          <button
                            type="button"
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-[11px] text-gray-500 hover:text-emerald-700 font-semibold px-2 py-0.5 rounded-lg hover:bg-gray-100"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteCustomerAddress(addr.id)}
                          className="text-gray-400 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Delete Address"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs space-y-0.5 text-gray-600">
                      <div className="font-semibold text-gray-800">
                        {addr.recipientName} ({addr.phone})
                      </div>
                      <div>
                        {addr.addressDetail}, {addr.township}, {addr.city}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. WISHLIST TAB */}
        {activeTab === 'wishlist' && (
          <div className="space-y-3">
            <h3 className="font-bold text-gray-800 text-xs sm:text-sm">
              Saved Wishlist <span className="text-gray-400 font-normal text-[11px]">(စိတ်ကြိုက်ပစ္စည်းများ)</span>
            </h3>
            {wishlistedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-7 border border-gray-200/80 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto text-rose-400">
                  <Heart size={26} />
                </div>
                <h4 className="font-bold text-gray-800 text-sm">Your Wishlist is Empty</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Tap the heart icon on any product to save it to your wishlist for later.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className={`px-4 py-2 rounded-2xl font-bold text-xs ${theme.primaryBg} text-white`}
                >
                  Explore Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {wishlistedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-3xl p-3 border border-gray-100 shadow-xs flex flex-col justify-between"
                  >
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-2">
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => toggleWishlist(p.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-rose-500 shadow-xs"
                      >
                        <Heart size={14} className="fill-rose-500" />
                      </button>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-800 text-xs truncate">{p.name}</h4>
                      <p className={`font-extrabold text-xs mt-1 ${theme.primaryText}`}>
                        {p.price.toLocaleString()} Ks
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        addToCart(p, 1);
                      }}
                      className={`w-full mt-2 py-1.5 rounded-xl text-xs font-bold ${theme.primaryBg} text-white shadow-xs hover:brightness-110 flex items-center justify-center gap-1`}
                    >
                      <ShoppingBag size={12} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 📱 4. GROUPED SERVICES & SETTINGS MENU (Native Mobile Style) */}
        <div className="space-y-3 pt-2">
          {/* Group 1: Shopping & Account Features */}
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden divide-y divide-gray-100">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShoppingBag size={16} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-xs sm:text-sm">Order History</div>
                  <div className="text-[11px] text-gray-400">ယခင်မှာယူခဲ့သော အော်ဒါများ</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {customerOrders.length}
                </span>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('addresses')}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <MapPin size={16} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-xs sm:text-sm">Saved Addresses</div>
                  <div className="text-[11px] text-gray-400">ပို့ဆောင်ရမည့် လိပ်စာများ</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {customerAddresses.length}
                </span>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('wishlist')}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Heart size={16} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-xs sm:text-sm">Saved Wishlist</div>
                  <div className="text-[11px] text-gray-400">သိမ်းဆည်းထားသော စိတ်ကြိုက်များ</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {customerWishlist.length}
                </span>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ShoppingBag size={16} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-xs sm:text-sm">Shopping Cart</div>
                  <div className="text-[11px] text-gray-400">လက်ရှိ စျေးဝယ်လှည်း</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {totalCartCount > 0 && (
                  <span className="text-xs font-bold text-white bg-rose-500 px-2 py-0.5 rounded-full">
                    {totalCartCount}
                  </span>
                )}
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </button>
          </div>

          {/* Group 2: Support & Shop Contacts */}
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden divide-y divide-gray-100">
            {shopInfo.phone && (
              <a
                href={`tel:${shopInfo.phone.split('/')[0].trim()}`}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Phone size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-xs sm:text-sm">Call Store Support</div>
                    <div className="text-[11px] text-gray-500 font-mono">{shopInfo.phone}</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </a>
            )}

            {shopInfo.socials?.telegram && (
              <a
                href={shopInfo.socials.telegram.startsWith('http') ? shopInfo.socials.telegram : `https://t.me/${shopInfo.socials.telegram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center">
                    <MessageCircle size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-xs sm:text-sm">Telegram Customer Service</div>
                    <div className="text-[11px] text-gray-400">အော်ဒါနှင့် မေးခွန်းများ မေးမြန်းရန်</div>
                  </div>
                </div>
                <ExternalLink size={15} className="text-gray-400" />
              </a>
            )}

            <button
              type="button"
              onClick={() => navigate('/about')}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Store size={16} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-xs sm:text-sm">Shop Info & Location</div>
                  <div className="text-[11px] text-gray-400">{shopInfo.name || 'ဆိုင်လိပ်စာနှင့် ဖွင့်ချိန်'}</div>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          </div>

          {/* Group 3: Merchant & Store Owners Portal */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white rounded-3xl p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                <ShieldCheck size={18} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-white">Merchant & Store Portal</h3>
                <p className="text-[11px] text-slate-300">ဆိုင်ရှင်နှင့် ကုန်ပစ္စည်းတင်သွင်းသူများအတွက်</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button
                type="button"
                id="goto-admin-btn"
                onClick={() => navigate('/admin')}
                className="py-2.5 px-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Store size={14} />
                <span>Admin Panel</span>
              </button>
              <button
                type="button"
                id="goto-vendor-btn"
                onClick={() => navigate('/vendor')}
                className="py-2.5 px-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <ExternalLink size={14} />
                <span>Vendor Login</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AUTH MODAL (Login / Register) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl h-[88vh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white sticky top-0 z-10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl ${theme.primaryLightBg} ${theme.primaryText} flex items-center justify-center`}>
                  <User size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {authMode === 'login' ? 'Customer Login (အကောင့်ဝင်ရန်)' : 'Create Member Account (အကောင့်ဖွင့်ရန်)'}
                  </h3>
                  <p className="text-[11px] text-gray-500">အော်ဒါမှတ်တမ်းများနှင့် လိပ်စာများ သိမ်းဆည်းရန်</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  setAuthError('');
                }}
                className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {/* Switch Tabs */}
              <div className="flex bg-gray-100 p-1 rounded-2xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthError('');
                  }}
                  className={`flex-1 py-2.5 rounded-xl transition-all ${
                    authMode === 'login' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'
                  }`}
                >
                  Quick Login (ဖုန်းဖြင့် ဝင်မည်)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setAuthError('');
                  }}
                  className={`flex-1 py-2.5 rounded-xl transition-all ${
                    authMode === 'register' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'
                  }`}
                >
                  Register (အကောင့်သစ်)
                </button>
              </div>

              {authError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
                  {authError}
                </div>
              )}

              {authMode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Phone Number or Email (ဖုန်း / အီးမေးလ်) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 09123456789 or khin@gmail.com"
                      value={authIdentifier}
                      onChange={(e) => setAuthIdentifier(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 font-semibold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Your Name (အမည် - Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Daw Khin Khin"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 font-semibold text-xs"
                    />
                  </div>

                  <p className="text-[11px] text-gray-500 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    💡 Password စာရိုက်စရာမလိုဘဲ ဖုန်းနံပါတ်ဖြင့် တိုက်ရိုက် လွယ်ကူစွာ Login ဝင်နိုင်ပါသည်။
                  </p>

                  <button
                    type="submit"
                    className={`w-full py-3.5 rounded-2xl font-bold text-xs ${theme.primaryBg} text-white shadow-md hover:brightness-110 transition-all`}
                  >
                    Log In (အကောင့်ဝင်မည်)
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Your Full Name (အမည်) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Daw Khin Khin"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 font-semibold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Phone Number (ဖုန်းနံပါတ်) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="09..."
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 font-semibold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Email (အီးမေးလ် - Optional)</label>
                    <input
                      type="email"
                      placeholder="user@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Township (မြို့နယ်)</label>
                      <select
                        value={regTownship}
                        onChange={(e) => setRegTownship(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-xs"
                      >
                        {townships.map((t) => (
                          <option key={t.id} value={t.township}>
                            {t.township} ({t.city})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Address (လိပ်စာ)</label>
                      <input
                        type="text"
                        placeholder="Street, Room..."
                        value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3.5 rounded-2xl font-bold text-xs ${theme.primaryBg} text-white shadow-md hover:brightness-110 transition-all mt-2`}
                  >
                    Create Account (အကောင့်ဖွင့်မည်)
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD ADDRESS MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl h-[85vh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl ${theme.primaryLightBg} ${theme.primaryText} flex items-center justify-center`}>
                  <MapPin size={17} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Add New Address</h3>
                  <p className="text-[11px] text-gray-500">ပို့ဆောင်ရမည့် လိပ်စာအသစ် ထည့်သွင်းမည်</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 overflow-y-auto flex-1 space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Address Label (အမည်သတ်မှတ်ရန်)</label>
                  <div className="flex gap-2">
                    {['Home (အိမ်)', 'Office (ရုံး)', 'Other (အခြား)'].map((lbl) => (
                      <button
                        key={lbl}
                        type="button"
                        onClick={() => setAddrLabel(lbl)}
                        className={`flex-1 py-2 rounded-xl border font-bold text-xs ${
                          addrLabel === lbl
                            ? `${theme.primaryLightBg} ${theme.primaryBorder} ${theme.primaryText}`
                            : 'bg-gray-50 border-gray-200 text-gray-600'
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Recipient Name *</label>
                    <input
                      type="text"
                      required
                      value={addrRecipient}
                      onChange={(e) => setAddrRecipient(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={addrPhone}
                      onChange={(e) => setAddrPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Township (မြို့နယ်) *</label>
                  <select
                    value={addrTownship}
                    onChange={(e) => setAddrTownship(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-xs"
                  >
                    {townships.map((t) => (
                      <option key={t.id} value={t.township}>
                        {t.township} ({t.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Street Address / Landmark *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. No. 12, Strand Road, Near Supermarket..."
                    value={addrDetail}
                    onChange={(e) => setAddrDetail(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={addrIsDefault}
                    onChange={(e) => setAddrIsDefault(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-gray-700 font-semibold">Set as default shipping address</span>
                </label>
              </div>

              {/* Fixed Bottom Action Bar */}
              <div className="p-4 border-t border-gray-100 bg-white/95 backdrop-blur-sm sticky bottom-0 z-10 shrink-0 shadow-lg">
                <button
                  type="submit"
                  className={`w-full py-3.5 rounded-2xl font-bold text-xs ${theme.primaryBg} text-white shadow-md hover:brightness-110 transition-all`}
                >
                  Save Address (လိပ်စာသိမ်းမည်)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl h-[80vh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl ${theme.primaryLightBg} ${theme.primaryText} flex items-center justify-center`}>
                  <Edit3 size={17} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Edit Profile Information</h3>
                  <p className="text-[11px] text-gray-500">ကိုယ်ရေးအချက်အလက် ပြင်ဆင်မည်</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditProfileModal(false)}
                className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 overflow-y-auto flex-1 space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Fixed Bottom Action Bar */}
              <div className="p-4 border-t border-gray-100 bg-white/95 backdrop-blur-sm sticky bottom-0 z-10 shrink-0 shadow-lg">
                <button
                  type="submit"
                  className={`w-full py-3.5 rounded-2xl font-bold text-xs ${theme.primaryBg} text-white shadow-md hover:brightness-110 transition-all`}
                >
                  Save Changes (ပြောင်းလဲမှုများ သိမ်းမည်)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL - Full View Dialog with Fixed Bottom Action Bar */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
          <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl h-[92vh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white sticky top-0 z-10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl ${theme.primaryLightBg} ${theme.primaryText} flex items-center justify-center`}>
                  <Receipt size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                    Order #{selectedOrderDetails.orderNumber}
                  </h3>
                  <p className="text-[11px] text-gray-500">{selectedOrderDetails.createdAt}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderDetails(null)}
                className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
              {/* Status */}
              <div className="flex items-center justify-between bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                <span className="font-semibold text-gray-600">Current Status:</span>
                <div>{getStatusBadge(selectedOrderDetails.status)}</div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <h4 className="font-bold text-gray-800 text-xs">Purchased Items ({selectedOrderDetails.items.length}):</h4>
                <div className="divide-y divide-gray-100 bg-gray-50/70 rounded-2xl p-3.5 border border-gray-100 space-y-2.5">
                  {selectedOrderDetails.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 pt-2.5 first:pt-0">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-12 h-12 rounded-xl object-cover bg-gray-200 shrink-0 border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-800 text-xs truncate">
                          {item.productName}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          {item.quantity} x {item.price.toLocaleString()} Ks
                          {item.variantName ? ` (${item.variantName})` : ''}
                          {item.size ? ` (Size ${item.size})` : ''}
                          {item.color ? ` (${item.color})` : ''}
                        </div>
                      </div>
                      <div className="font-bold text-gray-900 text-xs shrink-0">
                        {(item.price * item.quantity).toLocaleString()} Ks
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100 space-y-1.5 text-gray-700">
                <h4 className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                  <MapPin size={14} className={theme.primaryText} /> Delivery Information:
                </h4>
                <div className="font-semibold">{selectedOrderDetails.customerName} ({selectedOrderDetails.customerPhone})</div>
                <div className="text-gray-500">
                  {selectedOrderDetails.addressDetail}, {selectedOrderDetails.township}, {selectedOrderDetails.city}
                </div>
                {selectedOrderDetails.notes && (
                  <div className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 mt-2">
                    Note: {selectedOrderDetails.notes}
                  </div>
                )}
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100 space-y-2 text-gray-700">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Payment Method:</span>
                  <span className="font-bold text-gray-900">{selectedOrderDetails.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal:</span>
                  <span>{selectedOrderDetails.subtotal.toLocaleString()} Ks</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery Fee:</span>
                  <span>{selectedOrderDetails.deliveryFee.toLocaleString()} Ks</span>
                </div>
                <div className="flex justify-between font-extrabold text-sm text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total Paid/Payable:</span>
                  <span className={theme.primaryText}>
                    {selectedOrderDetails.totalAmount.toLocaleString()} Ks
                  </span>
                </div>

                {selectedOrderDetails.paymentProofUrl && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-[11px] font-semibold text-gray-600 block mb-1.5">
                      Attached Payment Slip (ငွေလွှဲပြေစာ):
                    </span>
                    <img
                      src={selectedOrderDetails.paymentProofUrl}
                      alt="Payment Slip"
                      className="max-h-48 rounded-xl border border-gray-200 object-contain mx-auto bg-black/5"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Fixed Bottom Action Bar */}
            <div className="p-4 border-t border-gray-100 bg-white/95 backdrop-blur-sm sticky bottom-0 z-10 shrink-0 shadow-lg space-y-2">
              <button
                type="button"
                onClick={() => {
                  selectedOrderDetails.items.forEach((item) => {
                    const foundProd = products.find((p) => p.id === item.productId);
                    if (foundProd) {
                      addToCart(foundProd, item.quantity, item.color, undefined, item.size);
                    }
                  });
                  setSelectedOrderDetails(null);
                  navigate('/cart');
                }}
                className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs ${theme.primaryBg} text-white ${theme.primaryHover} shadow-lg flex items-center justify-center gap-2 transition-all`}
              >
                <RotateCcw size={15} />
                <span>Reorder All Items (ပစ္စည်းများ ပြန်မှာမည်)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                {shopInfo.phone ? (
                  <a
                    href={`tel:${shopInfo.phone.split('/')[0].trim()}`}
                    className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold flex items-center justify-center gap-1.5 text-xs transition-colors"
                  >
                    <Phone size={13} />
                    <span>Call Store</span>
                  </a>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={() => setSelectedOrderDetails(null)}
                  className="py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-xs transition-colors"
                >
                  Close (ပိတ်မည်)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
