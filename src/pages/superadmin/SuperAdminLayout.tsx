import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Plus,
  LogOut,
  Globe,
  Store,
  RefreshCw,
  SlidersHorizontal,
  ExternalLink,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { SuperAdminLogin } from '../../components/superadmin/SuperAdminLogin';
import { VendorCard } from '../../components/superadmin/VendorCard';
import { VendorModal } from '../../components/superadmin/VendorModal';
import { DomainSetupModal } from '../../components/superadmin/DomainSetupModal';
import { Vendor } from '../../types';

export const SuperAdminLayout: React.FC = () => {
  const { isSuperAdmin, logoutSuperAdmin, impersonateVendor } = useAuth();
  const {
    vendors,
    addVendor,
    updateVendor,
    deleteVendor,
    toggleVendorStatus,
    updateVendorDomain,
    seedAllToFirestore,
    isFirestoreSyncing,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'suspended' | 'custom_domain'>('all');
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [domainModalVendor, setDomainModalVendor] = useState<Vendor | null>(null);
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!isSuperAdmin) {
    return <SuperAdminLogin />;
  }

  // Filter vendors
  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.customDomain && v.customDomain.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterTab === 'active') return v.status === 'active';
    if (filterTab === 'suspended') return v.status === 'suspended';
    if (filterTab === 'custom_domain') return !!v.customDomain;
    return true;
  });

  const handleCreateVendor = () => {
    setEditingVendor(null);
    setIsVendorModalOpen(true);
  };

  const handleEditVendor = (v: Vendor) => {
    setEditingVendor(v);
    setIsVendorModalOpen(true);
  };

  const handleSaveVendor = async (data: any) => {
    if (editingVendor) {
      await updateVendor({ ...editingVendor, ...data });
      showToast(`Updated ${data.shopName}`);
    } else {
      const created = await addVendor(data);
      showToast(`Created vendor ${created.shopName}`);
    }
  };

  const handleDeleteVendor = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vendor account? This cannot be undone.')) {
      await deleteVendor(id);
      showToast('Vendor deleted');
    }
  };

  const handleConfigureDomain = (vendor: Vendor) => {
    setDomainModalVendor(vendor);
    setIsDomainModalOpen(true);
  };

  const handleImpersonate = (vendor: Vendor) => {
    impersonateVendor(vendor);
    window.location.href = '/vendor';
  };

  const handleSyncFirestore = async () => {
    const res = await seedAllToFirestore();
    showToast(res.message);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center selection:bg-indigo-500 selection:text-white">
      {/* Mobile-first Webview Canvas */}
      <div className="w-full max-w-md bg-slate-900 min-h-screen shadow-2xl relative flex flex-col border-x border-slate-800 text-slate-100">
        {/* Top App Bar */}
        <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-bold shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-bold text-white tracking-tight">Super Admin</h1>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-semibold px-1.5 py-0.2 rounded border border-indigo-500/30">
                  Webview
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Vendor Management & Domains</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleSyncFirestore}
              title="Sync to Firestore"
              className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isFirestoreSyncing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={logoutSuperAdmin}
              title="Logout"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4" />
            {toastMessage}
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 flex-1 space-y-4 overflow-x-hidden">
          {/* Action Row & Search */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search vendor, domain, slug..."
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <button
                onClick={handleCreateVendor}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors shrink-0 shadow-sm shadow-indigo-600/30"
              >
                <Plus className="w-4 h-4" />
                Add Vendor
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-[11px]">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  filterTab === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({vendors.length})
              </button>
              <button
                onClick={() => setFilterTab('active')}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  filterTab === 'active'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Active ({vendors.filter((v) => v.status === 'active').length})
              </button>
              <button
                onClick={() => setFilterTab('custom_domain')}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  filterTab === 'custom_domain'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Custom Domains ({vendors.filter((v) => v.customDomain).length})
              </button>
              <button
                onClick={() => setFilterTab('suspended')}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  filterTab === 'suspended'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Suspended ({vendors.filter((v) => v.status === 'suspended').length})
              </button>
            </div>
          </div>

          {/* Vendors List */}
          <div className="space-y-3">
            {filteredVendors.length === 0 ? (
              <div className="text-center py-12 px-4 bg-slate-800/40 rounded-2xl border border-slate-800">
                <Store className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-slate-300">No vendors found</h3>
                <p className="text-xs text-slate-500 mt-1">Try adjusting your search or add a new vendor.</p>
                <button
                  onClick={handleCreateVendor}
                  className="mt-4 px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
                >
                  Create Vendor
                </button>
              </div>
            ) : (
              filteredVendors.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                  onEdit={handleEditVendor}
                  onDelete={handleDeleteVendor}
                  onToggleStatus={toggleVendorStatus}
                  onConfigureDomain={handleConfigureDomain}
                  onImpersonate={handleImpersonate}
                />
              ))
            )}
          </div>
        </div>

        {/* Bottom Quick Navigation */}
        <footer className="sticky bottom-0 z-20 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400">
          <a
            href="/vendor"
            className="flex items-center gap-1.5 text-slate-300 hover:text-indigo-400 transition-colors"
          >
            <Store className="w-4 h-4 text-indigo-400" />
            <span>Vendor Admin</span>
          </a>
          <a
            href="/"
            className="flex items-center gap-1.5 text-slate-300 hover:text-indigo-400 transition-colors"
          >
            <span>Customer Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </footer>

        {/* Modals */}
        <VendorModal
          isOpen={isVendorModalOpen}
          onClose={() => setIsVendorModalOpen(false)}
          onSave={handleSaveVendor}
          initialVendor={editingVendor}
        />

        <DomainSetupModal
          isOpen={isDomainModalOpen}
          onClose={() => setIsDomainModalOpen(false)}
          vendor={domainModalVendor}
          onSaveDomain={updateVendorDomain}
        />
      </div>
    </div>
  );
};
