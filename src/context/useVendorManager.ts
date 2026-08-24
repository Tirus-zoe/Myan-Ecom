import { useState, useEffect, useCallback, useMemo } from 'react';
import { Vendor } from '../types';
import { initialVendors } from '../data/initialData';
import { saveToFirestore, deleteFromFirestore } from '../services/firestoreSync';

const STORAGE_KEYS = {
  VENDORS: 'sc_vendors_list_v1',
  ACTIVE_VENDOR_SLUG: 'sc_active_vendor_slug_v1',
};

export function useVendorManager() {
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VENDORS);
    if (!saved) return initialVendors;
    try {
      const parsed: Vendor[] = JSON.parse(saved);
      const initialIds = new Set(initialVendors.map((v) => v.id));
      const customVendors = parsed.filter((v) => !initialIds.has(v.id));
      // Update any existing initial vendors with latest data, keep custom
      return [...initialVendors, ...customVendors];
    } catch {
      return initialVendors;
    }
  });

  const [activeVendorSlug, setActiveVendorSlug] = useState<string>(() => {
    // Check URL parameters for ?store=slug or ?domain=customdomain.com
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const storeParam = urlParams.get('store');
      if (storeParam) return storeParam;

      const domainParam = urlParams.get('domain');
      if (domainParam) {
        return domainParam;
      }

      // Check hostname for custom domain matching
      const hostname = window.location.hostname.toLowerCase();
      const savedVendors: Vendor[] = (() => {
        try {
          const s = localStorage.getItem(STORAGE_KEYS.VENDORS);
          return s ? JSON.parse(s) : initialVendors;
        } catch {
          return initialVendors;
        }
      })();
      const matchedByDomain = savedVendors.find(
        (v) => v.customDomain && v.customDomain.toLowerCase() === hostname
      );
      if (matchedByDomain) return matchedByDomain.slug;
    }

    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_VENDOR_SLUG);
    return saved || 'smart-living';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_VENDOR_SLUG, activeVendorSlug);
  }, [activeVendorSlug]);

  const activeVendor: Vendor = useMemo(() => {
    return (
      vendors.find(
        (v) =>
          v.slug.toLowerCase() === activeVendorSlug.toLowerCase() ||
          (v.customDomain && v.customDomain.toLowerCase() === activeVendorSlug.toLowerCase())
      ) ||
      vendors[0] ||
      initialVendors[0]
    );
  }, [vendors, activeVendorSlug]);

  const setActiveVendorBySlug = useCallback(
    (slugOrDomain: string) => {
      const clean = slugOrDomain.trim().toLowerCase();
      const target = vendors.find(
        (v) =>
          v.slug.toLowerCase() === clean ||
          (v.customDomain && v.customDomain.toLowerCase() === clean)
      );
      const resolvedSlug = target ? target.slug : clean;
      setActiveVendorSlug((prev) => (prev.toLowerCase() === resolvedSlug.toLowerCase() ? prev : resolvedSlug));
    },
    [vendors]
  );

  const addVendor = useCallback(async (vendorData: Omit<Vendor, 'id' | 'createdAt'>): Promise<Vendor> => {
    const cleanSlug = vendorData.slug.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const newVendor: Vendor = {
      ...vendorData,
      id: `vdr-${Date.now()}`,
      slug: cleanSlug,
      createdAt: new Date().toISOString().split('T')[0],
      domainStatus: vendorData.customDomain ? (vendorData.domainStatus || 'active') : 'not_configured',
    };

    setVendors((prev) => [newVendor, ...prev]);
    await saveToFirestore('vendors', newVendor.id, newVendor);
    return newVendor;
  }, []);

  const updateVendor = useCallback(async (updated: Vendor) => {
    setVendors((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    await saveToFirestore('vendors', updated.id, updated);
  }, []);

  const deleteVendor = useCallback(async (id: string) => {
    setVendors((prev) => prev.filter((v) => v.id !== id));
    await deleteFromFirestore('vendors', id);
  }, []);

  const toggleVendorStatus = useCallback(
    async (id: string) => {
      const target = vendors.find((v) => v.id === id);
      if (!target) return;
      const nextStatus: 'active' | 'suspended' = target.status === 'active' ? 'suspended' : 'active';
      await updateVendor({ ...target, status: nextStatus });
    },
    [vendors, updateVendor]
  );

  const updateVendorDomain = useCallback(
    async (
      vendorId: string,
      customDomain: string,
      status: 'active' | 'pending' | 'not_configured' = 'active'
    ) => {
      const target = vendors.find((v) => v.id === vendorId);
      if (!target) return;
      const updated: Vendor = {
        ...target,
        customDomain: customDomain.trim().toLowerCase(),
        domainStatus: customDomain.trim() ? status : 'not_configured',
      };
      await updateVendor(updated);
    },
    [vendors, updateVendor]
  );

  return {
    vendors,
    setVendors,
    activeVendor,
    setActiveVendorBySlug,
    addVendor,
    updateVendor,
    deleteVendor,
    toggleVendorStatus,
    updateVendorDomain,
  };
}
