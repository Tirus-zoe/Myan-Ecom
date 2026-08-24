import {
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
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

// Helper to remove undefined fields which Firestore rejects
export function sanitizeData<T extends Record<string, any>>(obj: T): T {
  const clean: any = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) {
      if (Array.isArray(obj[key])) {
        clean[key] = obj[key].map((item: any) =>
          typeof item === 'object' && item !== null ? sanitizeData(item) : item
        );
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        clean[key] = sanitizeData(obj[key]);
      } else {
        clean[key] = obj[key];
      }
    }
  });
  return clean;
}

export async function saveToFirestore(collName: string, id: string, data: any) {
  try {
    const cleanData = sanitizeData(data);
    await setDoc(doc(db, collName, id), cleanData, { merge: true });
  } catch (err) {
    console.error(`Firestore save error on ${collName}/${id}:`, err);
  }
}

export async function updateInFirestore(collName: string, id: string, data: any) {
  try {
    const cleanData = sanitizeData(data);
    await updateDoc(doc(db, collName, id), cleanData);
  } catch (err) {
    console.error(`Firestore update error on ${collName}/${id}:`, err);
  }
}

export async function deleteFromFirestore(collName: string, id: string) {
  try {
    await deleteDoc(doc(db, collName, id));
  } catch (err) {
    console.error(`Firestore delete error on ${collName}/${id}:`, err);
  }
}

export async function seedAllCollections(data: {
  vendors?: Vendor[];
  products: Product[];
  categories: Category[];
  banners: PromoBanner[];
  townships: DeliveryTownship[];
  paymentAccounts: PaymentAccount[];
  shopInfo?: ShopInfo;
  shopInfosMap?: Record<string, ShopInfo>;
  orders: Order[];
}): Promise<{ success: boolean; message: string }> {
  try {
    const batch = writeBatch(db);

    if (data.vendors && data.vendors.length > 0) {
      data.vendors.forEach((v) => {
        batch.set(doc(db, 'vendors', v.id), sanitizeData(v), { merge: true });
      });
    }

    data.products.forEach((p) => {
      batch.set(doc(db, 'products', p.id), sanitizeData(p), { merge: true });
    });

    data.categories.forEach((c) => {
      batch.set(doc(db, 'categories', c.id), sanitizeData(c), { merge: true });
    });

    data.banners.forEach((b) => {
      batch.set(doc(db, 'banners', b.id), sanitizeData(b), { merge: true });
    });

    data.townships.forEach((t) => {
      batch.set(doc(db, 'townships', t.id), sanitizeData(t), { merge: true });
    });

    data.paymentAccounts.forEach((pa) => {
      batch.set(doc(db, 'paymentAccounts', pa.id), sanitizeData(pa), { merge: true });
    });

    if (data.shopInfosMap) {
      Object.entries(data.shopInfosMap).forEach(([vId, sInfo]) => {
        batch.set(doc(db, 'shopInfo', vId), sanitizeData(sInfo), { merge: true });
      });
    }
    if (data.shopInfo) {
      batch.set(doc(db, 'shopInfo', data.shopInfo.vendorId || 'main'), sanitizeData(data.shopInfo), { merge: true });
      batch.set(doc(db, 'shopInfo', 'main'), sanitizeData(data.shopInfo), { merge: true });
    }

    data.orders.forEach((o) => {
      batch.set(doc(db, 'orders', o.id), sanitizeData(o), { merge: true });
    });

    await batch.commit();
    return {
      success: true,
      message: `Successfully seeded Firestore with ${data.vendors?.length || 0} vendors, ${data.products.length} products, ${data.categories.length} categories, ${data.banners.length} banners, and ${data.orders.length} orders!`,
    };
  } catch (err: any) {
    console.error('Firestore batch seed error:', err);
    return {
      success: false,
      message: err?.message || 'Failed to sync data to Firestore. Check permissions or network.',
    };
  }
}
