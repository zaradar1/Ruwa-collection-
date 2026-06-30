<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# RuWa Verse

**A premium ethnic wear e-commerce boutique — built with React, TypeScript, Firebase & Tailwind CSS**

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat&logo=firebase)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38BFF8?style=flat&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=flat&logo=vite)

</div>

---

## Overview

RuWa Verse is a full-stack ethnic fashion boutique web app offering Sarees, Lehengas, Kurtis, and more. It features a customer-facing storefront, a fully authenticated user experience, and a comprehensive admin control panel — all in a single React SPA.

---

## Features

### Storefront
| Page | Route | Description |
|---|---|---|
| Home | `/` | Hero banner, new arrivals, featured products |
| Shop | `/shop` | Full product catalogue with search, sort & category filter |
| New Arrivals | `/new-arrivals` | Products marked as new |
| Sarees | `/sarees` | Filtered catalogue — Sarees |
| Lehengas | `/lehengas` | Filtered catalogue — Lehengas |
| Kurtis | `/kurtis` | Filtered catalogue — Kurtis |
| Product Detail | `/product/:id` | Images, sizes, colours, reviews, add to cart |
| Cart & Checkout | `/checkout` | Multi-step checkout with address & payment |
| Order Detail | `/order/:id` | Live tracking progress bar, shipping info |

### Support Pages
| Page | Route |
|---|---|
| Help Center | `/help-center` |
| Shipping & Returns | `/shipping-returns` |
| Size Guide | `/size-guide` |
| Contact Us | `/contact` |

### User Account
- Google OAuth & Email/Password sign-up and login
- Profile settings (name, phone, language)
- Saved delivery addresses (add, delete, set default)
- Order history with live status tracking
- Wishlist management

### Admin Panel (`/admin` — admin role required)
Six-section sidebar dashboard:

| Section | Capabilities |
|---|---|
| **Overview** | KPI cards, revenue bar chart, recent orders, top products, quick-action buttons |
| **Orders** | Filter by status, search, inline status updates (Pending → Shipped → Delivered → Cancel), tracking modal |
| **Products** | Add / edit / delete products, low-stock alerts, image URL preview |
| **Users** | Full user database, role management (admin / user), edit name & phone, send password reset emails |
| **Design Studio** | Plug-and-play site builder with live mini-preview — hero banner, announcement bar (toggle on/off), 4 color themes, layout section toggles, footer tagline. Config stored in localStorage + Firestore |
| **Settings** | Admin profile edit, change password (re-authentication flow), send reset link, session info |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion (`motion/react`) |
| Backend / Auth | Firebase (Auth + Firestore) |
| Icons | Lucide React |
| Notifications | React Hot Toast |

---

## Project Structure

```
src/
├── components/         # Shared UI components & contexts
│   ├── AdminContext.tsx
│   ├── AppProvider.tsx
│   ├── AuthContext.tsx
│   ├── AuthModal.tsx
│   ├── CartContext.tsx
│   ├── CartDrawer.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   ├── ProductContext.tsx
│   ├── SiteConfigContext.tsx
│   └── WishlistContext.tsx
├── pages/              # Route-level page components
│   ├── AdminDashboard.tsx
│   ├── CheckoutPage.tsx
│   ├── ContactUsPage.tsx
│   ├── HelpCenterPage.tsx
│   ├── HomePage.tsx
│   ├── OrderDetailsPage.tsx
│   ├── ProductDetailsPage.tsx
│   ├── ShippingReturnsPage.tsx
│   ├── ShopPage.tsx
│   ├── SizeGuidePage.tsx
│   ├── SystemDesignPage.tsx
│   └── UserDashboard.tsx
├── services/           # Firebase & business logic
│   ├── firebase.ts
│   ├── orderService.ts
│   ├── paymentService.ts
│   ├── productService.ts
│   ├── recommendationService.ts
│   ├── siteConfigService.ts
│   └── userService.ts
├── types.ts            # Shared TypeScript types
├── constants.ts        # Mock data & category constants
├── App.tsx             # Router + layout shell
└── main.tsx            # Entry point
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project with Firestore and Authentication enabled

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Firestore Database** and **Authentication** (Google + Email/Password)
3. Copy your config into `src/services/firebase-applet-config.json`:

```json
{
  "apiKey": "...",
  "authDomain": "...",
  "projectId": "...",
  "storageBucket": "...",
  "messagingSenderId": "...",
  "appId": "..."
}
```

4. To grant admin access, set a user's `role` field to `"admin"` in the Firestore `users` collection.

### Build for Production

```bash
npm run build
```

---

## Firestore Collections

| Collection | Purpose |
|---|---|
| `users` | User profiles, roles, addresses |
| `orders` | Order records with status & tracking |
| `products` | Product catalogue |
| `siteConfig` | Design Studio settings (hero, theme, layout) |

---

## Design Studio

Admins can customise the live site from the **Design Studio** tab in the admin panel without touching code:

- **Hero Banner** — image URL, headline, subheading, CTA button text
- **Announcement Bar** — toggle on/off, custom message
- **Color Theme** — choose from Rose Boutique, Royal Purple, Golden Amber, or Emerald Silk
- **Layout Controls** — show/hide New Arrivals and Featured sections
- **Footer** — update tagline and logo text

Changes are saved to localStorage immediately and synced to Firestore for persistence across devices.

---

## License

MIT © RuWa Verse
