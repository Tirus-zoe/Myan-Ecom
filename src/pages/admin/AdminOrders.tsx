import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Phone,
  MapPin,
  Send,
  Eye,
  Trash2,
  ExternalLink,
  Receipt,
  Check,
} from 'lucide-react';
import { getTelegramShareUrl } from '../../utils/telegram';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder, shopInfo } = useStore();
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [activeSlipModal, setActiveSlipModal] = useState<string | null>(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (selectedStatusFilter === 'all') return true;
    return o.status === selectedStatusFilter;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Pending</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Confirmed</span>;
      case 'shipped':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Shipped</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Delivered</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Cancelled</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex-shrink-0 transition-all ${
              selectedStatusFilter === st
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {st} ({st === 'all' ? orders.length : orders.filter((o) => o.status === st).length})
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-gray-200 space-y-2">
          <ShoppingBag size={28} className="mx-auto text-gray-300" />
          <p className="text-xs text-gray-500 font-medium">No orders found in this status.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3"
            >
              {/* Order Header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-gray-900">#{order.orderNumber}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <span className="text-[10px] text-gray-400 block mt-0.5">{order.createdAt}</span>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-emerald-800 text-sm">
                    {order.totalAmount.toLocaleString()} {shopInfo.currencySymbol}
                  </span>
                  <span className="text-[10px] text-gray-400 block">{order.paymentMethod}</span>
                </div>
              </div>

              {/* Customer info */}
              <div className="bg-gray-50 rounded-xl p-2.5 text-xs text-gray-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">{order.customerName}</span>
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="text-emerald-700 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Phone size={12} />
                    <span>{order.customerPhone}</span>
                  </a>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-gray-600">
                  <MapPin size={12} className="text-gray-400 flex-shrink-0" />
                  <span className="line-clamp-1">{order.city}, {order.township} - {order.addressDetail}</span>
                </div>
              </div>

              {/* Ordered items preview */}
              <div className="text-xs space-y-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-gray-600">
                    <span className="truncate max-w-[200px]">
                      {item.quantity}x {item.productName}
                    </span>
                    <span className="font-medium text-gray-900">
                      {(item.price * item.quantity).toLocaleString()} {shopInfo.currencySymbol}
                    </span>
                  </div>
                ))}
              </div>

              {/* Status Updater & Actions */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-600 cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  {order.paymentProofUrl && (
                    <button
                      onClick={() => setActiveSlipModal(order.paymentProofUrl || null)}
                      className="p-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold flex items-center gap-1"
                      title="View Payment Slip"
                    >
                      <Receipt size={14} />
                      <span className="text-[11px]">Slip</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={getTelegramShareUrl(order, shopInfo)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-600"
                    title="Share to Telegram"
                  >
                    <Send size={14} />
                  </a>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete order #${order.orderNumber}?`)) {
                        deleteOrder(order.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600"
                    title="Delete Order"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slip Image View Modal */}
      {activeSlipModal && (
        <div
          onClick={() => setActiveSlipModal(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        >
          <div className="relative max-w-sm w-full bg-white rounded-2xl p-2 overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center px-2 py-1 mb-1">
              <span className="text-xs font-bold text-gray-900">Payment Slip Proof</span>
              <button onClick={() => setActiveSlipModal(null)} className="text-xs font-bold text-gray-500">
                Close
              </button>
            </div>
            <img src={activeSlipModal} alt="Payment slip" className="w-full rounded-xl object-contain max-h-[70vh]" />
          </div>
        </div>
      )}
    </div>
  );
};
