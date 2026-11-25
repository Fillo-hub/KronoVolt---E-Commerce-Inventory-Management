"use client";
import React from "react";
import { MdDashboard, MdCategory } from "react-icons/md";
import {
  FaTable,
  FaRegUser,
  FaBagShopping,
  FaStore,
  FaUpload,
  FaArrowUpRightFromSquare,
} from "react-icons/fa6";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Overview & KPI", href: "/admin", icon: MdDashboard },
  { label: "Gestione Ordini", href: "/admin/orders", icon: FaBagShopping },
  { label: "Catalogo Prodotti", href: "/admin/products", icon: FaTable },
  { label: "Importazione CSV", href: "/admin/bulk-upload", icon: FaUpload },
  { label: "Categorie", href: "/admin/categories", icon: MdCategory },
  { label: "Utenti Registrati", href: "/admin/users", icon: FaRegUser },
  { label: "Merchant / Store", href: "/admin/merchant", icon: FaStore },
];

const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="xl:w-64 w-full shrink-0 bg-slate-950 text-slate-300 xl:min-h-[calc(100vh-4rem)] p-4 border-r border-slate-800">
      <div className="px-3 py-2 mb-3">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
          Amministrazione
        </p>
      </div>

      <nav className="flex xl:flex-col gap-1.5 overflow-x-auto pb-2 xl:pb-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Icon className="text-lg shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="hidden xl:block mt-8 pt-6 border-t border-slate-800/80 px-2">
        <Link
          href="/shop"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
        >
          <span>Apri Vetrine Negozio</span>
          <FaArrowUpRightFromSquare className="text-[10px]" />
        </Link>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
