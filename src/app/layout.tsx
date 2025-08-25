import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "../../lib/CartContext";

export const metadata: Metadata = {
  title: "Rentify - Rent Premium Software at Rock-Bottom Prices",
  description: "Connect with software account owners to rent premium tools and AI software at affordable prices. Safe, legitimate, and instant access to the tools you need.",
  keywords: "software rental, premium tools, AI software, Adobe, subscription sharing, affordable software",
  authors: [{ name: "Rentify" }],
  openGraph: {
    title: "Rentify - Rent Premium Software at Rock-Bottom Prices",
    description: "Connect with software account owners to rent premium tools and AI software at affordable prices.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rentify - Rent Premium Software at Rock-Bottom Prices",
    description: "Connect with software account owners to rent premium tools and AI software at affordable prices.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
