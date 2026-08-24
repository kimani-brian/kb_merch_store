import type { Metadata } from "next";
import "./globals.css";
import AnnouncementBar from "@/components/global/AnnouncementBar";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import CartHydration from "@/components/cart/CartHydration";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "KB-MERCH // Limited Drop Culture",
    template: "%s // KB-MERCH",
  },
  description:
    "KB-MERCH — High-end limited drop streetwear. Raw. Unapologetic. Once it's gone, it's gone.",
  openGraph: {
    type: "website",
    siteName: "KB-MERCH",
    title: "KB-MERCH // Limited Drop Culture",
    description:
      "Limited drop streetwear from Nairobi. Pay via M-Pesa. No restocks.",
  },
  twitter: {
    card: "summary_large_image",
    title: "KB-MERCH // Limited Drop Culture",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        {/* Theme bootstrap: runs before first paint to prevent a flash.
            Preference: saved choice > LIGHT (brand default for new visitors). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('kb-theme');if(t!=='dark'){document.documentElement.classList.add('light')}}catch(e){document.documentElement.classList.add('light')}})()`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-brand-black font-body text-brand-white antialiased">
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        {/* Hydrates the cart store from the Odoo session on first paint */}
        <CartHydration />      </body>
    </html>
  );
}
