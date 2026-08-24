Here is the complete **System Design & Architecture Blueprint** for the **KB-MERCH** Next.js (React) frontend application.

---

# 1. Frontend System Architecture Overview

The frontend is built using **Next.js (App Router)** to combine **static pre-rendering (for high performance and SEO)** with **real-time client-side interactivity (for the Cart Drawer and M-Pesa STK Push)**.

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     CLIENT (BROWSER)                                        │
│                                                                                             │
│  [ Dynamic Route Pages ]       [ Interactive PDP ]            [ Real-time Cart Drawer ]     │
│  (Next.js Server Components)   (Size / Variant Selector)      (Zustand / Client State)      │
│                                           │                               │                 │
│                                           ▼                               ▼                 │
│                              [ M-Pesa Checkout Flow ] ◄───────────────────┘                 │
│                              (STK Prompt & Polling Modal)                                   │
└───────────────────────────────────────────┬─────────────────────────────────────────────────┘
                                            │
                                            ▼ HTTPS / Server Actions
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 NEXT.JS EDGE / NODE RUNTIME                                 │
│                                                                                             │
│  ┌───────────────────────────────┐                  ┌────────────────────────────────────┐  │
│  │     Data Fetching & ISR       │                  │       Next.js API Handlers         │  │
│  │ - Fetch Dynamic Routes        │                  │ - Webhook: /api/webhooks/odoo      │  │
│  │ - Fetch Catalog & PDP         │                  │   (HMAC verification & ISR purge)  │  │
│  │ - Static Page Cache (Tags)    │                  │ - Backend-For-Frontend (BFF) Proxy │  │
│  └───────────────┬───────────────┘                  └──────────────────┬─────────────────┘  │
└──────────────────┼─────────────────────────────────────────────────────┼────────────────────┘
                   │                                                     │
                   │ REST / JSON (Signed Requests)                       │ Inbound Webhooks
                   ▼                                                     ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                  ODOO 19 ERP BACKEND                                        │
│  - Navigation Routes API          - Real-Time Cart Controller   - Outbox Webhook Dispatcher │
│  - Product & Catalog API          - M-Pesa Daraja Gateway       - Order & Auto-Invoice Flow │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

# 2. Frontend Data Flows & State Pipelines

### Flow 1: Dynamic Route & Catalog Resolution (Server-Side + ISR)
1. When a user visits any URL (e.g., `/shop`, `/collections/hoodies`, `/drop-01`), the Next.js catch-all router (`[...slug]`) requests route configuration from Odoo.
2. Next.js fetches the catalog data using cache tags (e.g., `tags: ['catalog', 'navigation']`).
3. The page is statically rendered and served instantly via CDN.
4. **Cache Invalidation:** When an admin edits a price, category, or menu in Odoo, Odoo’s Outbox sends an HMAC-signed webhook to `/api/webhooks/odoo`, triggering Next.js to silently revalidate the cache.

---

### Flow 2: Cart Session & Mutation Pipeline
```text
[ User clicks "ADD TO CART" (Size: L, Qty: 1) ]
                      │
                      ▼
[ Read 'kb_cart_token' from Secure Cookie ]
  ├── If Token Exists ──► Send Token + Product Variant ID to Odoo Cart API
  └── If No Token ─────► Odoo creates new draft 'sale.order', generates Token
                      │
                      ▼
[ Odoo calculates subtotal, taxes, and shipping ]
                      │
                      ▼
[ Next.js updates global Cart Store (Zustand) ]
                      │
                      ▼
[ Slide-over Cart Drawer opens with updated item count and totals ]
```

---

### Flow 3: Checkout & M-Pesa STK Push Polling Loop
```text
[ Customer fills Delivery Info & Phone Number (07XX XXX XXX) ]
                      │
                      ▼
[ Clicks "PAY VIA M-PESA" ]
                      │
                      ▼
[ Next.js calls Odoo Payment Endpoint ]
                      │
                      ▼
[ Odoo triggers Safaricom Daraja STK Push to Customer Phone ]
                      │
                      ▼
[ Frontend opens "STK Push Waiting Modal" (60s Countdown Timer) ]
                      │
                      ▼ (Polling Loop every 2.5 seconds)
[ Frontend queries Odoo: "Is Order #KB-SO-0042 Paid?" ]
                      │
        ┌─────────────┴─────────────┐
        │                           │
  [ Payment Confirmed ]       [ Pending / Timeout / Cancelled ]
        │                           │
        ▼                           ▼
[ Clear Cart Token Cookie ]   [ Stop Timer & Show Error Message ]
[ Redirect to /order/success] [ "Payment Failed / PIN Cancelled - Retry" ]
```

---

# 3. Next.js Folder Structure (App Router Standard)

```text
kb-merch-frontend/
├── public/
│   ├── images/                     # Fallback badges, icons, M-Pesa logo
│   └── fonts/                      # Custom streetwear display fonts (e.g., Bebas Neue, Space Grotesk)
│
├── src/
│   ├── app/                        # Next.js App Router (Pages & Layouts)
│   │   ├── layout.tsx              # Root Layout: Header, Marquee, CartDrawer, Footer
│   │   ├── page.tsx                # Home Page (Drop Banner, Featured Grid, Video Hero)
│   │   │
│   │   ├── products/
│   │   │   └── [handle]/           # Product Detail Page (PDP)
│   │   │       ├── page.tsx
│   │   │       └── loading.tsx
│   │   │
│   │   ├── checkout/               # Checkout & M-Pesa Payment Page
│   │   │   ├── page.tsx
│   │   │   └── success/
│   │   │       └── page.tsx        # Order Confirmation & Receipt Screen
│   │   │
│   │   ├── [...slug]/              # Catch-All Dynamic Route (Odoo Menu / Categories)
│   │   │   └── page.tsx
│   │   │
│   │   └── api/                    # Server Route Handlers
│   │       ├── webhooks/
│   │       │   └── odoo/route.ts   # Inbound webhook for ISR cache purge
│   │       └── cart/route.ts       # Cart session proxy
│   │
│   ├── components/                 # Modular UI Components
│   │   ├── global/
│   │   │   ├── AnnouncementBar.tsx # Top scrolling marquee ticker
│   │   │   ├── Header.tsx          # Sticky brutalist navbar with logo & triggers
│   │   │   ├── NavigationMenu.tsx  # Dynamic dropdown/menu builder from Odoo
│   │   │   └── Footer.tsx          # Industrial footer with newsletter & links
│   │   │
│   │   ├── catalog/
│   │   │   ├── ProductCard.tsx     # High-contrast product card with hover-swap image
│   │   │   ├── ProductGrid.tsx     # Responsive catalog grid (2-col mobile, 4-col desktop)
│   │   │   └── FilterSortBar.tsx   # Size pills & sorting controls
│   │   │
│   │   ├── product/
│   │   │   ├── ImageGallery.tsx    # Multi-angle photo stack & zoom
│   │   │   ├── SizeSelector.tsx    # Block variant buttons (S, M, L, XL, 2XL)
│   │   │   ├── QuantitySelector.tsx# Stepper input [- 1 +]
│   │   │   └── AddToCartCTA.tsx    # High-impact full-width action button
│   │   │
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx      # Slide-out panel overlay
│   │   │   ├── CartItemRow.tsx     # Item thumbnail, variant tag, qty adjuster
│   │   │   └── FreeShippingBar.tsx # Dynamic delivery threshold progress bar
│   │   │
│   │   └── checkout/
│   │       ├── ContactDeliveryForm.tsx # Address and county selector
│   │       ├── OrderSummaryCard.tsx    # Breakdown of items, taxes, shipping
│   │       ├── MPesaPaymentBox.tsx     # Phone input + STK trigger
│   │       └── STKWaitingModal.tsx     # Pulsing PIN countdown & status poller
│   │
│   ├── stores/                     # Client-Side State Management (Zustand)
│   │   ├── useCartStore.ts         # Cart drawer visibility, items count, subtotals
│   │   └── useCheckoutStore.ts     # Customer details, M-Pesa polling state
│   │
│   ├── services/                   # Odoo API Client & Data Fetchers
│   │   ├── odooClient.ts           # Centralized HTTP client (auth, headers, HMAC)
│   │   ├── catalogService.ts       # Fetch products, categories, stock
│   │   ├── routeService.ts         # Fetch dynamic navigation trees
│   │   └── paymentService.ts       # Initiate STK push & query payment status
│   │
│   ├── types/                      # TypeScript Interfaces
│   │   ├── odoo.d.ts               # Odoo API response structures
│   │   ├── cart.d.ts               # Cart line item and quotation schemas
│   │   └── product.d.ts            # Product, variant, image schemas
│   │
│   └── styles/
│       └── globals.css             # Tailwind directives, custom font imports, dark theme
│
├── tailwind.config.ts              # Custom colors (Pitch Black, M-Pesa Green, Flame Red)
└── next.config.ts                  # Image domains (Odoo host), headers, rewrites
```

---

# 4. Main Components & UI Breakdown

### 1. Global & Navigation Components
* **`AnnouncementBar`:** High-contrast marquee ticker at the top of the viewport displaying delivery notices and limited-edition drop alerts.
* **`Header`:** Sticky, minimal layout featuring the bold **KB-MERCH** wordmark, menu triggers, search overlay toggle, and the cart icon with dynamic badge count.
* **`CartDrawer`:** Right-side slide-over panel with dark overlay backdrop. Displays live line items, quantity controls, delivery progress meter, subtotal, and the "Proceed to Checkout" button.

### 2. Catalog & Product Components
* **`ProductCard`:** High-contrast card with aspect-ratio-locked image, second-image fade on hover, "LIMITED DROP" / "SOLD OUT" corner badges, and formatted Kenyan Shilling pricing (`KES X,XXX`).
* **`ImageGallery`:** Desktop vertical thumbnail strip + sticky primary view; mobile touch swipe carousel with full-screen zoom capability.
* **`SizeSelector`:** Industrial rectangular variant buttons (`S`, `M`, `L`, `XL`, `2XL`). Out-of-stock sizes feature a diagonal strike-through and are disabled.
* **`AddToCartCTA`:** Full-width bold button. Transitions between *Idle*, *Loading (Spinner)*, and *Added (Checkmark)* states.

### 3. Checkout & Payment Components
* **`ContactDeliveryForm`:** Form handling customer name, phone number, Kenyan County/City selection, and physical drop-off notes.
* **`MPesaPaymentBox`:** Form block with Safaricom branding, phone input (`07XX...` / `01XX...`), and the primary action button (`PAY KES [TOTAL] VIA M-PESA`).
* **`STKWaitingModal`:** Overlay activated once STK is initiated. Features:
  * Phone graphic with pulsing signal animation.
  * Message: *"Check your phone! Enter your M-Pesa PIN."*
  * 60-second circular countdown timer.
  * Automatic retry / cancellation button if prompt fails to appear.

### 4. Order Confirmation Component
* **`OrderConfirmationView`:** Displayed upon successful payment receipt from Odoo.
  * Green checkmark animation.
  * Official Odoo Sales Order Number (e.g., `KB-SO-1042`).
  * M-Pesa Transaction Code (e.g., `SKD893J4LK`).
  * Live delivery tracking timeline: `[ Order Placed ] ──► [ Warehouse Packing ] ──► [ Dispatched ] ──► [ Delivered ]`.

---

# 5. Client State vs. Server State Architecture

| State Type | Management Tool | Description |
| :--- | :--- | :--- |
| **Catalog & Navigation** | Next.js Server Components + Fetch Cache | Pre-rendered on server; purged on-demand via Odoo webhooks. |
| **Cart Token** | Encrypted HTTP Cookie (`kb_cart_token`) | Persists the Odoo draft quotation session across browser restarts. |
| **Cart UI State** | Zustand (`useCartStore`) | Controls Cart Drawer open/close state, optimistic item additions, and badge counters. |
| **M-Pesa Checkout State** | Zustand (`useCheckoutStore`) | Manages STK push initiation, countdown timer, polling interval, and error alerts. |
| **Active Variant / Size** | React Local State (`useState`) | Tracks currently selected size/color on individual Product Detail Pages. |

---

# 6. Styling System Configuration (Tailwind Tokens)

* **Colors:**
  * `brand-black`: `#0A0A0A`
  * `brand-white`: `#FFFFFF`
  * `brand-gray-dark`: `#1A1A1A`
  * `brand-gray-light`: `#F4F4F4`
  * `brand-accent-red`: `#E53935` (Drop alerts / Sold out)
  * `brand-mpesa-green`: `#00A859` (Payment action / Confirmed status)
* **Fonts:**
  * `font-display`: Condensed bold headline font (e.g., *Bebas Neue*, *Oswald*)
  * `font-body`: Clean sans-serif (e.g., *Inter*, *Space Grotesk*)
* **Borders & Radii:**
  * `rounded-none` or `rounded-xs` (sharp corners, strictly industrial)
  * `border-2 border-black` (strong high-contrast containment)