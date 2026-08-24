import React, { useState } from 'react';
import { CreditCard, Copy, Check, Upload } from 'lucide-react';
import { PaymentAccount, ShopInfo } from '../../../types';
import { getTheme } from '../../../utils/theme';

interface CheckoutPaymentSectionProps {
  paymentAccounts: PaymentAccount[];
  selectedPaymentId: string;
  onSelectPaymentId: (id: string) => void;
  paymentSlipUrl: string;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  shopInfo: ShopInfo;
}

export const CheckoutPaymentSection: React.FC<CheckoutPaymentSectionProps> = ({
  paymentAccounts,
  selectedPaymentId,
  onSelectPaymentId,
  paymentSlipUrl,
  onFileUpload,
  shopInfo,
}) => {
  const theme = getTheme(shopInfo.themeColor);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentPayment =
    paymentAccounts.find((p) => p.id === selectedPaymentId) || paymentAccounts[0];

  const handleCopyNumber = (accNumber: string, id: string) => {
    navigator.clipboard.writeText(accNumber);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-2.5">
      <label className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
        <CreditCard size={14} className={theme.primaryText} />
        <span>Payment Method (ငွေပေးချေမှု ရွေးချယ်ရန်)</span>
      </label>

      {/* Payment Selection Pills */}
      <div className="grid grid-cols-2 gap-2">
        {paymentAccounts.map((acc) => {
          const isSelected = selectedPaymentId === acc.id;
          return (
            <button
              key={acc.id}
              type="button"
              onClick={() => onSelectPaymentId(acc.id)}
              className={`p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                isSelected
                  ? `${theme.primaryBorder} ${theme.primaryLightBg} ring-2 ${theme.primaryRing}`
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div>
                <span className="font-bold text-gray-900 text-xs block">{acc.name}</span>
                <span className="text-[10px] text-gray-500 line-clamp-1">{acc.accountName}</span>
              </div>
              {isSelected && <Check size={14} className={theme.primaryText} />}
            </button>
          );
        })}
      </div>

      {/* Selected Account Detail Card */}
      {currentPayment && (
        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold block">
              Transfer to: {currentPayment.name}
            </span>
            <span className="font-mono text-sm font-bold text-gray-900 block mt-0.5">
              {currentPayment.accountNumber}
            </span>
            <span className="text-[11px] text-gray-600 block">Name: {currentPayment.accountName}</span>
          </div>
          <button
            type="button"
            onClick={() => handleCopyNumber(currentPayment.accountNumber, currentPayment.id)}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition-all ${
              copiedId === currentPayment.id
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {copiedId === currentPayment.id ? (
              <>
                <Check size={12} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Payment Slip Upload (Native Mobile App Style) */}
      <div className="pt-1">
        <label className="text-[11px] font-bold text-gray-700 block mb-1.5">
          Payment Slip / Transfer Receipt (ငွေလွှဲပြေစာ ပုံတင်ရန်)
        </label>
        
        {paymentSlipUrl ? (
          <div className="relative p-2.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={paymentSlipUrl}
                alt="Payment Slip Preview"
                className="w-12 h-12 rounded-xl object-cover border border-emerald-300 shadow-xs bg-white shrink-0"
              />
              <div className="min-w-0">
                <span className="text-xs font-bold text-emerald-900 block truncate">
                  Slip Attached (ပြေစာ တင်ပြီးပါပြီ)
                </span>
                <span className="text-[10px] text-emerald-700">Tap Change to pick another image</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 shrink-0">
              <label className="cursor-pointer px-2.5 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-50 rounded-xl text-[11px] font-bold text-emerald-800 shadow-xs">
                <span>Change</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileUpload}
                />
              </label>
            </div>
          </div>
        ) : (
          <label className="border-2 border-dashed border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/20 rounded-2xl p-3.5 bg-gray-50/70 flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-98">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 shadow-xs shrink-0">
                <Upload size={17} className={theme.primaryText} />
              </div>
              <div>
                <span className="font-bold text-xs text-gray-800 block">
                  Upload Payment Screenshot
                </span>
                <span className="text-[10px] text-gray-400">
                  KBZPay, WavePay, CB, AYA slip (JPG, PNG)
                </span>
              </div>
            </div>

            <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${theme.primaryLightBg} ${theme.primaryText} border ${theme.primaryBorder} shrink-0`}>
              Browse
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileUpload}
            />
          </label>
        )}
      </div>
    </div>
  );
};
