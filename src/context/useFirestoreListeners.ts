import React, { useEffect, useRef } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import {
  Vendor,
  Product,
  Category,
  PromoBanner,
  DeliveryTownship,
  PaymentAccount,
  ShopInfo,
  Order,
} from '../types';
import {
  initialVendors,
  initialProducts,
  initialCategories,
  initialBanners,
  initialTownships,
  initialPaymentAccounts,
  initialShopInfoMap,
  initialOrders,
} from '../data/initialData';

interface UseFirestoreListenersProps {
  setVendors?: React.Dispatch<React.SetStateAction<Vendor[]>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setBanners: React.Dispatch<React.SetStateAction<PromoBanner[]>>;
  setTownships: React.Dispatch<React.SetStateAction<DeliveryTownship[]>>;
  setShopInfosMap?: React.Dispatch<React.SetStateAction<Record<string, ShopInfo>>>;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setPaymentAccounts: React.Dispatch<React.SetStateAction<PaymentAccount[]>>;
  setIsSyncing: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export function useFirestoreListeners({
  setVendors,
  setProducts,
  setCategories,
  setBanners,
  setTownships,
  setShopInfosMap,
  setOrders,
  setPaymentAccounts,
  setIsSyncing,
  setError,
}: UseFirestoreListenersProps) {
  // Store callbacks in refs to avoid re-subscribing on every render
  const callbacksRef = useRef({
    setVendors,
    setProducts,
    setCategories,
    setBanners,
    setTownships,
    setShopInfosMap,
    setOrders,
    setPaymentAccounts,
    setIsSyncing,
    setError,
  });

  useEffect(() => {
    callbacksRef.current = {
      setVendors,
      setProducts,
      setCategories,
      setBanners,
      setTownships,
      setShopInfosMap,
      setOrders,
      setPaymentAccounts,
      setIsSyncing,
      setError,
    };
  });

  useEffect(() => {
    const unsubVendors = onSnapshot(
      collection(db, 'vendors'),
      (snapshot) => {
        if (callbacksRef.current.setVendors) {
          if (!snapshot.empty) {
            const fsVendors = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Vendor));
            // Merge initial vendors with Firestore data and add custom vendors
            const merged = [
              ...initialVendors.map((iv) => {
                const found = fsVendors.find((fv) => fv.id === iv.id);
                return found ? { ...iv, ...found } : iv;
              }),
              ...fsVendors.filter((fv) => !initialVendors.some((iv) => iv.id === fv.id)),
            ];
            callbacksRef.current.setVendors(merged);
          } else {
            callbacksRef.current.setVendors(initialVendors);
          }
        }
      },
      (err) => callbacksRef.current.setError?.(err.message)
    );

    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        if (!snapshot.empty) {
          const fsProducts = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
          const merged = [
            ...initialProducts.map((ip) => {
              const found = fsProducts.find((fp) => fp.id === ip.id);
              return found ? { ...ip, ...found } : ip;
            }),
            ...fsProducts.filter((fp) => !initialProducts.some((ip) => ip.id === fp.id)),
          ];
          callbacksRef.current.setProducts(merged);
        } else {
          callbacksRef.current.setProducts(initialProducts);
        }
      },
      (err) => callbacksRef.current.setError?.(err.message)
    );

    const unsubCategories = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        if (!snapshot.empty) {
          const fsCategories = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
          const merged = [
            ...initialCategories.map((ic) => {
              const found = fsCategories.find((fc) => fc.id === ic.id);
              return found ? { ...ic, ...found } : ic;
            }),
            ...fsCategories.filter((fc) => !initialCategories.some((ic) => ic.id === fc.id)),
          ];
          callbacksRef.current.setCategories(merged);
        } else {
          callbacksRef.current.setCategories(initialCategories);
        }
      },
      (err) => callbacksRef.current.setError?.(err.message)
    );

    const unsubBanners = onSnapshot(
      collection(db, 'banners'),
      (snapshot) => {
        if (!snapshot.empty) {
          const fsBanners = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as PromoBanner));
          const merged = [
            ...initialBanners.map((ib) => {
              const found = fsBanners.find((fb) => fb.id === ib.id);
              return found ? { ...ib, ...found } : ib;
            }),
            ...fsBanners.filter((fb) => !initialBanners.some((ib) => ib.id === fb.id)),
          ];
          callbacksRef.current.setBanners(merged);
        } else {
          callbacksRef.current.setBanners(initialBanners);
        }
      },
      (err) => callbacksRef.current.setError?.(err.message)
    );

    const unsubTownships = onSnapshot(
      collection(db, 'townships'),
      (snapshot) => {
        if (!snapshot.empty) {
          const fsTownships = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as DeliveryTownship));
          const merged = [
            ...initialTownships.map((it) => {
              const found = fsTownships.find((ft) => ft.id === it.id);
              return found ? { ...it, ...found } : it;
            }),
            ...fsTownships.filter((ft) => !initialTownships.some((it) => it.id === ft.id)),
          ];
          callbacksRef.current.setTownships(merged);
        } else {
          callbacksRef.current.setTownships(initialTownships);
        }
      },
      (err) => callbacksRef.current.setError?.(err.message)
    );

    const unsubShopInfo = onSnapshot(
      collection(db, 'shopInfo'),
      (snapshot) => {
        if (callbacksRef.current.setShopInfosMap) {
          const map: Record<string, ShopInfo> = { ...initialShopInfoMap };
          if (!snapshot.empty) {
            snapshot.docs.forEach((d) => {
              map[d.id] = { id: d.id, ...(d.data() as object) } as unknown as ShopInfo;
            });
          }
          callbacksRef.current.setShopInfosMap((prev) => ({ ...initialShopInfoMap, ...prev, ...map }));
        }
      },
      (err) => callbacksRef.current.setError?.(err.message)
    );

    const unsubOrders = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        if (!snapshot.empty) {
          const fsOrders = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
          const merged = [
            ...initialOrders.map((io) => {
              const found = fsOrders.find((fo) => fo.id === io.id);
              return found ? { ...io, ...found } : io;
            }),
            ...fsOrders.filter((fo) => !initialOrders.some((io) => io.id === fo.id)),
          ];
          callbacksRef.current.setOrders(merged);
        } else {
          callbacksRef.current.setOrders(initialOrders);
        }
      },
      (err) => callbacksRef.current.setError?.(err.message)
    );

    const unsubPayments = onSnapshot(
      collection(db, 'paymentAccounts'),
      (snapshot) => {
        if (!snapshot.empty) {
          const fsPayments = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as PaymentAccount));
          const merged = [
            ...initialPaymentAccounts.map((ip) => {
              const found = fsPayments.find((fp) => fp.id === ip.id);
              return found ? { ...ip, ...found } : ip;
            }),
            ...fsPayments.filter((fp) => !initialPaymentAccounts.some((ip) => ip.id === fp.id)),
          ];
          callbacksRef.current.setPaymentAccounts(merged);
        } else {
          callbacksRef.current.setPaymentAccounts(initialPaymentAccounts);
        }
      },
      (err) => callbacksRef.current.setError?.(err.message)
    );

    return () => {
      unsubVendors();
      unsubProducts();
      unsubCategories();
      unsubBanners();
      unsubTownships();
      unsubShopInfo();
      unsubOrders();
      unsubPayments();
    };
  }, []);
}
