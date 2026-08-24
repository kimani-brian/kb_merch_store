Here is the complete, master implementation prompt for building the **KB-MERCH** Next.js (React) frontend application. You can copy and paste this into an AI coding assistant (or hand it to your frontend engineering team) to execute the build step-by-step.

***

```markdown
# Master Implementation Prompt: KB-MERCH Headless Next.js Frontend

You are an expert Senior Frontend Engineer specializing in Next.js (App Router), React, TypeScript, Tailwind CSS, and Headless E-Commerce architecture.

## Project Overview
Build the frontend web application for **KB-MERCH**, a high-end streetwear merchandise store inspired by the raw, industrial, high-contrast drop aesthetic of `whistlindiesel.com`.

The frontend connects to a self-hosted **Odoo 19** backend via REST APIs and Webhooks, and processes customer payments via **Safaricom M-Pesa STK Push**.

---

## Design System & Aesthetic Constraints
- **Brand Aesthetic:** Industrial Streetwear / Limited Drop Culture (Raw, unapologetic, high-contrast, brutalist).
- **Color Palette:**
  - `brand-black`: `#0A0A0A` (Primary background, deep contrast)
  - `brand-white`: `#FFFFFF` (Card surfaces, crisp typography)
  - `brand-gray-dark`: `#1A1A1A` (Borders, inputs, secondary panels)
  - `brand-gray-light`: `#F4F4F4` (Subtle backdrops)
  - `brand-accent-red`: `#E53935` (Drop tags, countdowns, sold-out strike-throughs)
  - `brand-mpesa-green`: `#00A859` (Payment buttons, confirmed badges)
- **Typography:**
  - Display/Headings: Ultra-bold condensed sans-serif (e.g., `Bebas Neue`, `Oswald`, `Space Grotesk`).
  - Body/Metadata: Sharp technical sans-serif or mono (e.g., `Inter`, `Roboto Mono`).
  - Text transforms: Uppercase headers and buttons with wide letter-spacing (`tracking-wider`).
- **UI Elements:** Sharp corners (`rounded-none` or subtle `rounded-xs`), solid 2px borders, instant hover state inversions.

---

## Technical Stack
- **Framework:** Next.js (App Router) + React (TypeScript)
- **Styling:** Tailwind CSS + Lucide React Icons
- **State Management:** Zustand (Client state: Cart Drawer, Checkout, M-Pesa Modal)
- **Data Fetching:** Next.js Server Components, Server Actions & On-Demand ISR
- **Payment Method:** Safaricom M-Pesa STK Push (Phone input -> STK trigger -> Polling loop)

---

## Development Constraints & Rules
- **Strict Execution Loop:** You MUST execute the project phase-by-phase. For each phase, you must strictly follow this exact lifecycle:
  1. **[PLAN]:** Outline components, state schemas, API dependencies, and layout wireframes for the phase.
  2. **[CODE]:** Write clean, production-ready, fully typed TypeScript & React code.
  3. **[RUN]:** Provide the exact CLI commands to run the development server, build steps, or install packages.
  4. **[TEST]:** Provide manual UI test steps and automated component/integration test scripts.
  5. **[REVIEW]:** Perform a code review focusing on responsive design, performance, accessibility, and state hygiene.
  6. **[RETEST / VALIDATION]:** Define acceptance criteria to verify the phase is 100% complete before advancing.
- **Pacing:** Complete **one phase at a time**. Do not proceed to the next phase until the current phase is fully built, tested, and approved.

---

## Phase Breakdown

### Phase 1: Project Scaffold, Design Tokens & Global Layout
* **Scope & Features:**
  - Next.js App Router scaffold with TypeScript and Tailwind CSS configuration.
  - Custom font loading (`Bebas Neue` / `Space Grotesk` / `Inter`) and color tokens.
  - Global `layout.tsx`:
    - `AnnouncementBar`: Continuous marquee ticker with drop notices.
    - `Header`: Sticky navbar with bold **KB-MERCH** branding, dynamic menu placeholder, search trigger, and Cart Drawer badge counter.
    - `Footer`: Industrial newsletter sign-up box, brand statement, copyright, and delivery policy links.
* **Lifecycle to Execute:**
  - **Plan** ➔ **Code** ➔ **Run** ➔ **Test** ➔ **Review** ➔ **Retest**

---

### Phase 2: Dynamic Routing, Home Page & Catalog Showcase
* **Scope & Features:**
  - Odoo API client service layer (`src/services/odooClient.ts`, `routeService.ts`, `catalogService.ts`).
  - Catch-all dynamic route handler (`app/[...slug]/page.tsx`) mapping navigation paths directly from Odoo.
  - **Home Page (`app/page.tsx`):**
    - High-impact Hero Section with "DROP 01 // LIMITED EDITION" and full-width CTA.
    - Category Grid with visual drop tiles (Hoodies, Tees, Caps, Accessories).
    - Trending / Featured Merch Grid.
  - **Catalog Components:**
    - `ProductCard`: High-contrast card with secondary image hover-swap, price in `KES`, and "LIMITED" / "SOLD OUT" badges.
    - `ProductGrid`: 2-column mobile / 4-column desktop responsive grid.
    - `FilterSortBar`: Size selectors (`S, M, L, XL, 2XL`) and sorting options.
* **Lifecycle to Execute:**
  - **Plan** ➔ **Code** ➔ **Run** ➔ **Test** ➔ **Review** ➔ **Retest**

---

### Phase 3: Product Detail Page (PDP) & Image Gallery
* **Scope & Features:**
  - Dynamic product detail route (`app/products/[handle]/page.tsx`).
  - Two-column split layout:
    - **Left Column (`ImageGallery`):** Desktop vertical photo stack; mobile swipe carousel with zoom.
    - **Right Column (Sticky Purchase Block):** Category breadcrumb, massive product title, KES pricing, size variant block selector with out-of-stock strike-throughs, quantity stepper (`[- 1 +]`), and full-width **"ADD TO CART"** CTA with state transitions (Idle, Loading, Added).
    - Collapsible Accordions: Material & Fabric Specs, Sizing Guide, Dispatch Information.
* **Lifecycle to Execute:**
  - **Plan** ➔ **Code** ➔ **Run** ➔ **Test** ➔ **Review** ➔ **Retest**

---

### Phase 4: Real-Time Cart Drawer & Odoo Quotation Sync
* **Scope & Features:**
  - Zustand Store (`useCartStore.ts`) managing slide-over drawer visibility and optimistic UI updates.
  - Secure cookie management for `kb_cart_token` persisting user sessions across browser reloads.
  - Real-time API integration with Odoo Cart Endpoints (`/api/v1/cart/add`, `/api/v1/cart/update`, `/api/v1/cart/remove`).
  - **`CartDrawer` Component:**
    - Slide-over backdrop panel from the right.
    - `FreeShippingBar`: Dynamic progress meter calculating amount left for free delivery.
    - `CartItemRow`: Product thumbnail, variant tag, price, quantity controls, and delete action.
    - Subtotal summary and full-width **"PROCEED TO CHECKOUT ➔"** button.
* **Lifecycle to Execute:**
  - **Plan** ➔ **Code** ➔ **Run** ➔ **Test** ➔ **Review** ➔ **Retest**

---

### Phase 5: Checkout Workflow & M-Pesa STK Push Integration
* **Scope & Features:**
  - Checkout page (`app/checkout/page.tsx`) with a 2-column distraction-free layout:
    - **Left Column:** `ContactDeliveryForm` (Customer Name, Phone, Kenyan County/City, Delivery Address) + Delivery Option Selector.
    - **Right Column:** `OrderSummaryCard` (Itemized list, Subtotal, Delivery Fee, Final Total).
  - **M-Pesa STK Push Component (`MPesaPaymentBox`):**
    - Safaricom M-Pesa branded container with Kenyan phone number input validation (`07XX...` / `01XX...`).
    - Primary action button: **"PAY KES [TOTAL] VIA M-PESA"**.
  - **`STKWaitingModal` Component:**
    - Modal with pulsing phone animation and text: *"Check your phone! Enter your M-Pesa PIN."*
    - 60-second circular countdown timer.
    - Active polling loop querying Odoo backend every 2.5 seconds for payment status (`draft` ➔ `sale` / `paid`).
  - **Order Confirmation Page (`app/checkout/success/page.tsx`):**
    - Success checkmark, Odoo Sales Order Number (e.g., `KB-SO-1042`), M-Pesa Transaction ID, receipt breakdown, and live delivery timeline.
* **Lifecycle to Execute:**
  - **Plan** ➔ **Code** ➔ **Run** ➔ **Test** ➔ **Review** ➔ **Retest**

---

### Phase 6: Webhook Cache Invalidation (ISR) & Performance Audit
* **Scope & Features:**
  - Inbound webhook handler (`app/api/webhooks/odoo/route.ts`):
    - HMAC-SHA256 cryptographic signature verification against shared secret.
    - On-Demand Cache Invalidation (`revalidateTag`, `revalidatePath`) when Odoo pushes catalog, stock, or route changes.
  - End-to-end integration test:
    `User selects size ➔ Cart creates draft in Odoo ➔ User enters M-Pesa number ➔ STK prompt triggers ➔ Payment confirms in Odoo ➔ Frontend redirects to success screen ➔ Inventory drops in Next.js`.
  - Lighthouse performance, SEO meta tags, and mobile responsive audit.
* **Lifecycle to Execute:**
  - **Plan** ➔ **Code** ➔ **Run** ➔ **Test** ➔ **Review** ➔ **Retest**

---

## Instructions to Begin
Acknowledge that you understand the entire design aesthetic, architecture, and Odoo/M-Pesa integration requirements. Then, start immediately with **Phase 1: [PLAN]**.
```