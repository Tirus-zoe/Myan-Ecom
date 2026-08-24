import React from 'react';
import { CheckCircle2, Send, Phone } from 'lucide-react';
import { Order, ShopInfo } from '../../../types';
import { getTelegramShareUrl } from '../../../utils/telegram';
import { getTheme } from '../../../utils/theme';

interface CheckoutSuccessViewProps {
  order: Order;
  shopInfo: ShopInfo;
  onClose: () => void;
}

export const CheckoutSuccessView: React.FC<CheckoutSuccessViewProps> = ({
  order,
  shopInfo,
  onClose,
}) => {
  const theme = getTheme(shopInfo.themeColor);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Scrollable Content */}
      <div className="p-6 text-center space-y-4 overflow-y-auto flex-1 text-xs">
        <div className={`w-16 h-16 ${theme.primaryLightBg} ${theme.primaryText} rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50`}>
          <CheckCircle2 size={36} />
        </div>

        <div>
          <span className={`text-xs font-bold ${theme.primaryText} tracking-wider uppercase`}>Order Placed Successfully!</span>
          <h3 className="text-xl font-extrabold text-gray-900 mt-1">
            ကျေးဇူးတင်ပါသည် #{order.orderNumber}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            လူကြီးမင်း၏ အော်ဒါကို လက်ခံရရှိပြီးဖြစ်ပါသဖြင့် မကြာမီ ဆက်သွယ်ပေးပါမည်။
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-2 border border-gray-100 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">Order ID:</span>
            <span className="font-mono font-bold text-gray-900">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Customer:</span>
            <span className="font-semibold text-gray-800">{order.customerName} ({order.customerPhone})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Delivery Township:</span>
            <span className="font-semibold text-gray-800">{order.township}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment:</span>
            <span className="font-semibold text-gray-800">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2 font-bold">
            <span>Total Amount:</span>
            <span className={`${theme.primaryText} text-sm font-extrabold`}>
              {order.totalAmount.toLocaleString()} {shopInfo.currencySymbol}
            </span>
          </div>
        </div>
      </div>

      {/* Fixed Sticky Bottom Action Bar */}
      <div className="p-4 border-t border-gray-100 bg-white/95 backdrop-blur-sm sticky bottom-0 z-10 shrink-0 shadow-lg space-y-2">
        <a
          href={getTelegramShareUrl(order, shopInfo)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md transition-all text-xs"
        >
          <Send size={16} />
          <span>Confirm & Send via Telegram (Customer Service)</span>
        </a>

        <div className="grid grid-cols-2 gap-2">
          {shopInfo.phone ? (
            <a
              href={`tel:${shopInfo.phone.split('/')[0].trim()}`}
              className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold flex items-center justify-center gap-1.5 text-xs transition-colors"
            >
              <Phone size={13} />
              <span>Call Shop</span>
            </a>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-xs transition-colors"
          >
            Done Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
