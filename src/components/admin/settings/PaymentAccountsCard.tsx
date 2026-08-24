import React, { useState } from 'react';
import { CreditCard, Edit2, Trash2 } from 'lucide-react';
import { PaymentAccount, ShopInfo } from '../../../types';
import { getTheme } from '../../../utils/theme';

interface PaymentAccountsCardProps {
  paymentAccounts: PaymentAccount[];
  shopInfo: ShopInfo;
  onAddPayment: (acc: Omit<PaymentAccount, 'id'>) => void;
  onUpdatePayment: (acc: PaymentAccount) => void;
  onDeletePayment: (id: string) => void;
}

export const PaymentAccountsCard: React.FC<PaymentAccountsCardProps> = ({
  paymentAccounts,
  shopInfo,
  onAddPayment,
  onUpdatePayment,
  onDeletePayment,
}) => {
  const activeTheme = getTheme(shopInfo.themeColor);
  const [newPayName, setNewPayName] = useState('');
  const [newPayAccName, setNewPayAccName] = useState('');
  const [newPayAccNumber, setNewPayAccNumber] = useState('');
  const [editingPayment, setEditingPayment] = useState<PaymentAccount | null>(null);

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayName.trim() || !newPayAccNumber.trim()) return;
    onAddPayment({
      name: newPayName.trim(),
      accountName: newPayAccName.trim() || 'Store Account',
      accountNumber: newPayAccNumber.trim(),
      color: '#005BBB',
      iconName: 'Smartphone',
    });
    setNewPayName('');
    setNewPayAccName('');
    setNewPayAccNumber('');
  };

  const handleSaveEditedPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayment) return;
    onUpdatePayment(editingPayment);
    setEditingPayment(null);
  };

  return (
    <div id="sec-payments" className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3 scroll-mt-24">
      <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm border-b border-gray-100 pb-2">
        <CreditCard size={16} className={activeTheme.primaryText} />
        <span>4. Payment Accounts (ငွေလက်ခံအကောင့်များ စီမံရန်)</span>
      </div>

      <div className="space-y-2">
        {paymentAccounts.map((acc) => (
          <div
            key={acc.id}
            className="p-3 rounded-2xl border border-gray-200 flex items-center justify-between gap-2 bg-gray-50/50"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-xs">{acc.name}</span>
                <span className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                  {acc.accountName}
                </span>
              </div>
              <span className="font-mono text-gray-700 text-xs font-semibold mt-0.5 block">{acc.accountNumber}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setEditingPayment(acc)}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                title="Edit Account"
              >
                <Edit2 size={13} />
              </button>
              <button
                type="button"
                onClick={() => onDeletePayment(acc.id)}
                className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                title="Delete Account"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Payment Inline Modal */}
      {editingPayment && (
        <form onSubmit={handleSaveEditedPayment} className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
          <span className="font-bold text-amber-900 block">Edit Payment Account</span>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={editingPayment.name}
              onChange={(e) => setEditingPayment({ ...editingPayment, name: e.target.value })}
              className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-xl"
            />
            <input
              type="text"
              value={editingPayment.accountName}
              onChange={(e) => setEditingPayment({ ...editingPayment, accountName: e.target.value })}
              className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-xl"
            />
            <input
              type="text"
              value={editingPayment.accountNumber}
              onChange={(e) => setEditingPayment({ ...editingPayment, accountNumber: e.target.value })}
              className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-xl"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingPayment(null)}
              className="px-3 py-1 bg-gray-200 rounded-xl text-gray-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-3 py-1 ${activeTheme.primaryBg} text-white rounded-xl font-bold`}
            >
              Update Account
            </button>
          </div>
        </form>
      )}

      {/* Add Payment Form */}
      <form onSubmit={handleAddPayment} className="pt-2 border-t border-gray-100 space-y-2">
        <span className="font-bold text-gray-800 block">+ Add New Payment Method (ငွေပေးချေမှု အကောင့် အသစ်ထည့်ရန်)</span>
        <div className="grid grid-cols-3 gap-1.5">
          <input
            type="text"
            placeholder="e.g. KBZPay"
            value={newPayName}
            onChange={(e) => setNewPayName(e.target.value)}
            className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl"
          />
          <input
            type="text"
            placeholder="Account Name"
            value={newPayAccName}
            onChange={(e) => setNewPayAccName(e.target.value)}
            className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl"
          />
          <input
            type="text"
            placeholder="Phone / Account No"
            value={newPayAccNumber}
            onChange={(e) => setNewPayAccNumber(e.target.value)}
            className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl"
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 ${activeTheme.primaryBg} ${activeTheme.primaryHover} text-white font-bold rounded-xl shadow-sm`}
        >
          + Add Payment Account
        </button>
      </form>
    </div>
  );
};
