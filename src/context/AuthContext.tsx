import React, { createContext, useContext, useState, useEffect } from 'react';
import { Vendor } from '../types';

interface AuthContextType {
  // Super Admin
  isSuperAdmin: boolean;
  superAdminUser: { username: string; name: string } | null;
  loginSuperAdmin: (username: string, password: string) => boolean;
  logoutSuperAdmin: () => void;

  // Vendor Admin
  currentVendor: Vendor | null;
  isVendorAuthenticated: boolean;
  loginVendor: (username: string, password: string, vendors: Vendor[]) => { success: boolean; message?: string };
  impersonateVendor: (vendor: Vendor) => void;
  logoutVendor: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SUPER_ADMIN_SESSION: 'sc_superadmin_session_v1',
  VENDOR_SESSION: 'sc_vendor_session_v1',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.SUPER_ADMIN_SESSION) === 'true';
  });

  const [superAdminUser, setSuperAdminUser] = useState<{ username: string; name: string } | null>(() => {
    const saved = localStorage.getItem('sc_superadmin_user_v1');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentVendor, setCurrentVendor] = useState<Vendor | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VENDOR_SESSION);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (isSuperAdmin) {
      localStorage.setItem(STORAGE_KEYS.SUPER_ADMIN_SESSION, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.SUPER_ADMIN_SESSION);
      localStorage.removeItem('sc_superadmin_user_v1');
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    if (currentVendor) {
      localStorage.setItem(STORAGE_KEYS.VENDOR_SESSION, JSON.stringify(currentVendor));
    } else {
      localStorage.removeItem(STORAGE_KEYS.VENDOR_SESSION);
    }
  }, [currentVendor]);

  const loginSuperAdmin = (username: string, password: string): boolean => {
    // Default superadmin credentials
    if (
      (username.trim().toLowerCase() === 'superadmin' || username.trim().toLowerCase() === 'admin') &&
      password.trim() === 'super123456'
    ) {
      const user = { username: 'superadmin', name: 'Master Super Admin' };
      setIsSuperAdmin(true);
      setSuperAdminUser(user);
      localStorage.setItem('sc_superadmin_user_v1', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logoutSuperAdmin = () => {
    setIsSuperAdmin(false);
    setSuperAdminUser(null);
  };

  const loginVendor = (
    username: string,
    password: string,
    vendors: Vendor[]
  ): { success: boolean; message?: string } => {
    const found = vendors.find(
      (v) =>
        v.username.toLowerCase() === username.trim().toLowerCase() &&
        v.password === password.trim()
    );

    if (!found) {
      return { success: false, message: 'Invalid username or password' };
    }

    if (found.status === 'suspended') {
      return { success: false, message: 'Your vendor account is suspended. Please contact Super Admin.' };
    }

    setCurrentVendor(found);
    return { success: true };
  };

  const impersonateVendor = (vendor: Vendor) => {
    setCurrentVendor(vendor);
  };

  const logoutVendor = () => {
    setCurrentVendor(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isSuperAdmin,
        superAdminUser,
        loginSuperAdmin,
        logoutSuperAdmin,
        currentVendor,
        isVendorAuthenticated: !!currentVendor,
        loginVendor,
        impersonateVendor,
        logoutVendor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
