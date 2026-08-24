import React, { useState } from 'react';
import { X, User, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { OrderItem } from '../../types';
import { getTheme } from '../../utils/theme';
import confetti from 'canvas-confetti';
import { CheckoutSuccessView } from './checkout/CheckoutSuccessView';
import { CheckoutPaymentSection } from './checkout/CheckoutPaymentSection';

interface CheckoutModalProps {
  items: OrderItem[];
  subtotal: number;
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  items,
  subtotal,
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const {
    townships,
    paymentAccounts,
    shopInfo,
    createOrder,
    currentCustomer,
    customerAddresses,
  } = useStore();
  const theme = getTheme(shopInfo.themeColor);

  const defaultAddr = customerAddresses.find((a) => a.isDefault) || customerAddresses[0];

  const [customerName, setCustomerName] = useState(
    currentCustomer?.name || defaultAddr?.recipientName || ''
  );
  const [customerPhone, setCustomerPhone] = useState(
    currentCustomer?.phone || defaultAddr?.phone || ''
  );
  const [selectedTownshipId, setSelectedTownshipId] = useState(() => {
    if (defaultAddr?.township) {
      const match = townships.find(
        (t) => t.township.toLowerCase() === defaultAddr.township.toLowerCase()
      );
      if (match) return match.id;
    }
    return townships[0]?.id || '';
  });
  const [addressDetail, setAddressDetail] = useState(
    defaultAddr?.addressDetail || currentCustomer?.defaultAddress || ''
  );
  const [selectedPaymentId, setSelectedPaymentId] = useState(paymentAccounts[0]?.id || '');
  const [paymentSlipUrl, setPaymentSlipUrl] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createdOrderData, setCreatedOrderData] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle address preset selection
  const handleSelectAddress = (addr: any) => {
    setCustomerName(addr.recipientName);
    setCustomerPhone(addr.phone);
    setAddressDetail(addr.addressDetail);
    const match = townships.find(
      (t) => t.township.toLowerCase() === addr.township.toLowerCase()
    );
    if (match) {
      setSelectedTownshipId(match.id);
    }
  };

  if (!isOpen) return null;

  const currentTownship = townships.find((t) => t.id === selectedTownshipId) || townships[0];
  const deliveryFee = currentTownship ? currentTownship.deliveryFee : 3000;
  const totalAmount = subtotal + deliveryFee;
  const currentPayment = paymentAccounts.find((p) => p.id === selectedPaymentId) || paymentAccounts[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentSlipUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !addressDetail.trim()) {
      setErrorMessage('Please fill in your name, phone number, and street address.');
      return;
    }

    setErrorMessage('');
    setSubmitting(true);

    try {
      const newOrder = await createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        city: currentTownship?.city || 'Yangon',
        township: currentTownship?.township || 'Downtown',
        addressDetail: addressDetail.trim(),
        items,
        subtotal,
        deliveryFee,
        totalAmount,
        paymentMethod: currentPayment ? currentPayment.name : 'Direct Transfer',
        paymentProofUrl: paymentSlipUrl || undefined,
        notes: notes.trim() || undefined,
      });

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // ignore
      }

      setCreatedOrderData(newOrder);
      if (onOrderSuccess) {
        onOrderSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 overflow-hidden">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl h-[92vh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl ${theme.primaryLightBg} ${theme.primaryText} flex items-center justify-center`}>
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm sm:text-base">
                {createdOrderData ? 'Order Confirmation' : 'Checkout & Order (မှာယူမည်)'}
              </h2>
              <p className="text-[11px] text-gray-500">
                {createdOrderData ? 'အော်ဒါ အောင်မြင်စွာ တင်ပြီးပါပြီ' : `Items: ${items.length} pcs • Delivery & Payment`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Success Screen */}
        {createdOrderData ? (
          <CheckoutSuccessView
            order={createdOrderData}
            shopInfo={shopInfo}
            onClose={onClose}
          />
        ) : (
          <form onSubmit={handleSubmitOrder} className="flex flex-col flex-1 overflow-hidden">
            {/* Scrollable Form Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
              {/* Customer Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                    <User size={14} className={theme.primaryText} />
                    <span>Customer Contact & Delivery Address</span>
                  </label>
                  {currentCustomer ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Member: {currentCustomer.name}
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      Guest Mode (တိုက်ရိုက်မှာယူမည်)
                    </span>
                  )}
                </div>

                {/* Saved Addresses quick pills if any */}
                {customerAddresses && customerAddresses.length > 0 && (
                  <div className="bg-gray-50/80 p-2.5 rounded-2xl border border-gray-100 space-y-1.5">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Saved Addresses (သိမ်းထားသော လိပ်စာများ):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {customerAddresses.map((addr) => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => handleSelectAddress(addr)}
                          className={`text-[11px] px-2.5 py-1 rounded-xl font-medium border transition-all text-left flex items-center gap-1 ${
                            addressDetail === addr.addressDetail && customerPhone === addr.phone
                              ? `${theme.primaryLightBg} ${theme.primaryBorder} ${theme.primaryText} font-bold shadow-xs`
                              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <span>{addr.label || 'Home'}</span>
                          <span className="text-[9px] text-gray-400">({addr.township})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 block mb-1">Your Name (အမည်) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Daw Khin Khin"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 font-semibold text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 block mb-1">Phone Number (ဖုန်းနံပါတ်) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="09..."
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 font-semibold text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-700 block mb-1">Township (မြို့နယ် ရွေးရန်) *</label>
                  <select
                    value={selectedTownshipId}
                    onChange={(e) => setSelectedTownshipId(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 font-semibold text-xs"
                  >
                    {townships.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.township} ({t.city}) - Delivery: {t.deliveryFee.toLocaleString()} {shopInfo.currencySymbol}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-700 block mb-1">Street Address / Landmark (အိမ်အမှတ်၊ လမ်း၊ တိုက်) *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. No. 45, 1st Floor, Near City Mart..."
                    value={addressDetail}
                    onChange={(e) => setAddressDetail(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-700 block mb-1">Special Delivery Notes (ပို့ဆောင်ရေး မှတ်ချက် - Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Call before delivery..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Payment Section */}
              <CheckoutPaymentSection
                paymentAccounts={paymentAccounts}
                selectedPaymentId={selectedPaymentId}
                onSelectPaymentId={setSelectedPaymentId}
                paymentSlipUrl={paymentSlipUrl}
                onFileUpload={handleFileUpload}
                shopInfo={shopInfo}
              />

              {/* Order Price Summary */}
              <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 space-y-1.5">
                <div className="flex justify-between text-gray-600 text-xs">
                  <span>Items Subtotal ({items.length} items):</span>
                  <span className="font-semibold text-gray-900">{subtotal.toLocaleString()} {shopInfo.currencySymbol}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-xs">
                  <span>Delivery Fee ({currentTownship?.township}):</span>
                  <span className="font-semibold text-gray-900">{deliveryFee.toLocaleString()} {shopInfo.currencySymbol}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total Amount (စုစုပေါင်း ကျသင့်ငွေ):</span>
                  <span className={theme.primaryText}>{totalAmount.toLocaleString()} {shopInfo.currencySymbol}</span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}
            </div>

            {/* Fixed Sticky Bottom Action Bar */}
            <div className="p-4 border-t border-gray-100 bg-white/95 backdrop-blur-sm sticky bottom-0 z-10 shrink-0 shadow-lg">
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3.5 px-5 ${theme.primaryBg} ${theme.primaryHover} disabled:opacity-50 text-white rounded-2xl font-bold flex items-center justify-between shadow-lg transition-all text-xs sm:text-sm`}
              >
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider text-white/80 font-medium">Total to Pay</div>
                  <div className="font-extrabold text-base leading-tight">
                    {totalAmount.toLocaleString()} {shopInfo.currencySymbol}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 font-bold bg-white/20 px-3.5 py-1.5 rounded-xl">
                  <span>{submitting ? 'Placing Order...' : 'Confirm Order'}</span>
                  <ArrowRight size={16} />
                </div>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
