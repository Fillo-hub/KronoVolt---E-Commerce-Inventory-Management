"use client";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import HeaderTop from "./HeaderTop";
import SearchInput from "./SearchInput";
import Link from "next/link";
import CartElement from "./CartElement";
import NotificationBell from "./NotificationBell";
import HeartElement from "./HeartElement";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { useCompareStore } from "@/app/_zustand/compareStore";
import {
  FaBars,
  FaXmark,
  FaScaleBalanced,
  FaBoxOpen,
  FaMicrochip,
  FaGaugeHigh,
} from "react-icons/fa6";

const Header = () => {
  const { data: session }: any = useSession();
  const pathname = usePathname();
  const { wishQuantity } = useWishlistStore();
  const { items: compareItems } = useCompareStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    toast.success("Disconnessione effettuata!");
    setTimeout(() => signOut({ callbackUrl: "/" }), 500);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Catalogo", href: "/shop" },
    { name: "Smartphone", href: "/shop/smart-phones" },
    { name: "Laptop & PC", href: "/shop/laptops" },
    { name: "Audio Hi-Fi", href: "/shop/headphones" },
    { name: "Confronta", href: "/compare", badge: compareItems.length },
    { name: "Traccia Ordine", href: "/orders" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <HeaderTop />

      {!pathname.startsWith("/admin") ? (
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
          {/* Main Header Row */}
          <div className="h-20 flex items-center justify-between gap-4 lg:gap-8">
            {/* Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
                <FaMicrochip className="text-xl" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                  KRONO<span className="text-blue-600">VOLT</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">
                  Tech & Electronics
                </span>
              </div>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:block flex-1 max-w-xl">
              <SearchInput />
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <NotificationBell />

              {/* Compare Button */}
              <Link
                href="/compare"
                title="Confronta prodotti"
                className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
              >
                <FaScaleBalanced className="text-lg" />
                {compareItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 text-[11px] font-bold bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xs">
                    {compareItems.length}
                  </span>
                )}
              </Link>

              {/* Orders Button */}
              <Link
                href="/orders"
                title="I miei ordini"
                className="relative hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
              >
                <FaBoxOpen className="text-lg" />
              </Link>

              <HeartElement wishQuantity={wishQuantity} />
              <CartElement />

              {/* Mobile Menu Trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <FaXmark className="text-xl" />
                ) : (
                  <FaBars className="text-xl" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <SearchInput />
          </div>

          {/* Secondary Desktop Navigation Bar */}
          <nav className="hidden lg:flex items-center justify-between py-2.5 border-t border-slate-100 text-sm">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-1.5 rounded-lg font-medium transition-all inline-flex items-center gap-1.5 ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.badge ? (
                      <span className="px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-indigo-600 text-white">
                        {link.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-600 font-medium transition-colors"
              >
                <FaGaugeHigh className="text-blue-600" />
                <span>Dashboard Admin</span>
              </Link>
            </div>
          </nav>

          {/* Mobile Drawer Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-3 border-t border-slate-100 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  {link.badge ? (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-indigo-600 text-white">
                      {link.badge}
                    </span>
                  ) : null}
                </Link>
              ))}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-semibold text-blue-600 hover:bg-blue-50 flex items-center gap-2"
              >
                <FaGaugeHigh />
                <span>Pannello Admin</span>
              </Link>
            </div>
          )}
        </div>
      ) : (
        /* Admin Header */
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-sm">
                <FaMicrochip className="text-lg" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900">
                  KRONO<span className="text-blue-600">VOLT</span>
                </span>
                <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-slate-900 text-white rounded-md">
                  Admin Console
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              ← Torna al Negozio
            </Link>
            <NotificationBell />
            {session?.user && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
