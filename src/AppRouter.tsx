import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { HomePage } from './pages/client/HomePage';
import { CategoryPage } from './pages/client/CategoryPage';
import { CartPage } from './pages/client/CartPage';
import { ShopInfoPage } from './pages/client/ShopInfoPage';
import { ProfilePage } from './pages/client/ProfilePage';
import { VendorLayout } from './pages/vendor/VendorLayout';
import { SuperAdminLayout } from './pages/superadmin/SuperAdminLayout';

function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center selection:bg-emerald-200">
      {/* Mobile-first centered frame */}
      <div className="w-full max-w-md bg-gray-50 min-h-screen shadow-2xl relative flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-x-hidden">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}

function StoreSlugHandler({ children }: { children: React.ReactNode }) {
  const { slug } = useParams<{ slug: string }>();
  const { setActiveVendorBySlug } = useStore();

  useEffect(() => {
    if (slug) {
      setActiveVendorBySlug(slug);
    }
  }, [slug, setActiveVendorBySlug]);

  return <ClientLayout>{children}</ClientLayout>;
}

export default function AppRouter() {
  return (
    <AuthProvider>
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            {/* Client Routes */}
            <Route
              path="/"
              element={
                <ClientLayout>
                  <HomePage />
                </ClientLayout>
              }
            />
            <Route
              path="/store/:slug"
              element={
                <StoreSlugHandler>
                  <HomePage />
                </StoreSlugHandler>
              }
            />
            <Route
              path="/categories"
              element={
                <ClientLayout>
                  <CategoryPage />
                </ClientLayout>
              }
            />
            <Route
              path="/cart"
              element={
                <ClientLayout>
                  <CartPage />
                </ClientLayout>
              }
            />
            <Route
              path="/shop-info"
              element={
                <ClientLayout>
                  <ShopInfoPage />
                </ClientLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <ClientLayout>
                  <ProfilePage />
                </ClientLayout>
              }
            />

            {/* Vendor Admin Routes */}
            <Route path="/vendor" element={<VendorLayout />} />
            <Route path="/admin" element={<VendorLayout />} />

            {/* Super Admin Route */}
            <Route path="/superadmin" element={<SuperAdminLayout />} />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </AuthProvider>
  );
}
