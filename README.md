# Multi-Tenant E-Commerce & Catalog Platform

A modern, mobile-first multi-tenant catalog and order management system built with React, TypeScript, Tailwind CSS, and Firestore synchronization.

---

## 🌟 Key Architecture & Capabilities

### 1. Multi-Tenant Hierarchy
- **Super Admin (`/superadmin`)**:
  - Webview-first management interface.
  - Create and manage vendor accounts with custom usernames, passwords, store slugs, and custom domain bindings.
  - Quick action controls (Impersonate vendor into shop manager, view live storefront, suspend/activate vendors, delete vendors).
  - Search & filter by active status or custom domains.
  - Firestore database sync & diagnostics.
- **Vendor Admin (`/vendor` or `/admin`)**:
  - Isolated webview dashboard for each shop owner.
  - Dedicated username & password authentication.
  - Product Catalog (Sub-variants, color badges, stock toggles, discount pricing).
  - Order Processing (Customer orders, payment slip previews, status workflow, Telegram notification hooks).
  - Custom Domain Connection (CNAME / A record instructions with automatic SSL status).
  - Delivery Fees by Township & Payment Accounts.
  - Theme customizer with 8 color palettes.
- **Customer Storefront (`/`, `/?store=:slug`, `/store/:slug`, `/?domain=:customDomain`)**:
  - Dynamic store branding (Shop name, logo, contact phone, social links, theme accent).
  - Interactive product catalog, category filters, real-time cart, and checkout with payment slip upload.

---

## 🔑 Default Demo Credentials

| Role | Route | Username | Password |
|---|---|---|---|
| **Super Admin** | `/superadmin` | `superadmin` | `super123456` |
| **Vendor 1 (Modern Living)** | `/vendor` | `vendor1` | `password123` |
| **Vendor 2 (Bella Glow)** | `/vendor` | `bellaglow` | `bella123456` |
| **Vendor 3 (Khit Thit)** | `/vendor` | `khitthit` | `khit123456` |

---

## 🌐 Custom Domain Setup Guide

Vendors and Super Admins can connect branded domains (e.g., `shop.mybrand.com` or `mybrand.store`).

### DNS Configuration Records:
- **Subdomain (Recommended):**
  - **Type:** `CNAME`
  - **Host / Name:** `shop` or `store`
  - **Value / Target:** `cname.smartcatalog.shop`
- **Apex Domain:**
  - **Type:** `A`
  - **Host / Name:** `@`
  - **Value / Target:** `34.149.208.55`

The platform automatically detects tenant context via:
1. `/?domain=shop.mybrand.com` (Simulated domain routing in preview)
2. `/?store=bella-glow` (Query parameter)
3. `/store/bella-glow` (Path parameter)
4. Window `hostname` mapping in production deployments.

---

## 📁 Modular Directory Structure (< 350 lines/file)

```
src/
├── components/
│   ├── admin/               # Vendor admin settings cards & modals
│   ├── client/              # Storefront items, cart, banner slider
│   ├── layout/              # Navbar (with store switcher) & BottomNav
│   ├── superadmin/          # SuperAdminLogin, VendorCard, VendorModal, DomainSetupModal
│   └── vendor/              # VendorLogin
├── context/
│   ├── AuthContext.tsx      # SuperAdmin & Vendor session management
│   ├── StoreContext.tsx     # Central multi-tenant store context
│   ├── useVendorManager.ts  # Vendor state, switching & CRUD
│   └── useFirestoreListeners.ts # Real-time Firestore sync
├── data/
│   ├── vendors.ts           # Initial vendor seed data
│   └── initialData.ts       # Products, categories, banners, townships, payment accounts
├── pages/
│   ├── client/              # Storefront pages (Home, Category, Cart, ShopInfo)
│   ├── superadmin/          # SuperAdminLayout (Webview-first)
│   └── vendor/              # VendorLayout (Webview-first)
├── services/
│   └── firestoreSync.ts     # Firestore batch sync & collection handlers
└── types.ts                 # Core TypeScript interfaces & enums
```
