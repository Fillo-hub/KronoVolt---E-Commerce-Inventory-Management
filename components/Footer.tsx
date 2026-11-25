import Link from "next/link";
import React from "react";
import { FaMicrochip, FaShieldHalved, FaTruckFast, FaHeadset } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      {/* Top Value Bar */}
      <div className="border-b border-slate-800/80">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <FaTruckFast className="text-lg" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Spedizione Rapida Assicurata</h3>
              <p className="text-xs text-slate-400">Gratuita per ordini superiori a 99€ in tutta Italia</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <FaShieldHalved className="text-lg" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Garanzia Ufficiale 24 Mesi</h3>
              <p className="text-xs text-slate-400">Prodotti originali certificati con assistenza dedicata</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <FaHeadset className="text-lg" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Supporto Tecnico Specializzato</h3>
              <p className="text-xs text-slate-400">Consulenza pre e post-vendita per aziende e privati</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white">
                <FaMicrochip className="text-lg" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                KRONO<span className="text-blue-500">VOLT</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-slate-400 max-w-sm leading-relaxed">
              Piattaforma e-commerce ad alte prestazioni specializzata in hardware,
              elettronica di consumo, fotografia e soluzioni per lo smart working.
              Include comparatore tecnico e tracciamento ordini in tempo reale.
            </p>
            <div className="mt-5 text-xs text-slate-500 space-y-1">
              <p>KronoVolt Official Store • Via Torino 45, 20123 Milano (MI)</p>
              <p>Tel: +39 02 9475 8210 • Email: support@kronovolt.com</p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Reparti Tech
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/shop/smart-phones" className="hover:text-white transition-colors">
                  Smartphone 5G
                </Link>
              </li>
              <li>
                <Link href="/shop/laptops" className="hover:text-white transition-colors">
                  Laptop & Ultrabook
                </Link>
              </li>
              <li>
                <Link href="/shop/computers" className="hover:text-white transition-colors">
                  Workstation & PC
                </Link>
              </li>
              <li>
                <Link href="/shop/headphones" className="hover:text-white transition-colors">
                  Cuffie & Audio ANC
                </Link>
              </li>
              <li>
                <Link href="/shop/cameras" className="hover:text-white transition-colors">
                  Fotocamere Mirrorless
                </Link>
              </li>
            </ul>
          </div>

          {/* Strumenti Utili */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Strumenti Utili
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">
                  Comparatore Specifiche
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Traccia il tuo Ordine
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition-colors">
                  Lista Desideri
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Carrello Acquisti
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  Catalogo Completo
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Admin */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Area Riservata
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Accedi al Profilo
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Crea Nuovo Account
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Console Amministratore →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} KronoVolt Commerce Platform. Tutti i diritti riservati.</p>
          <p>Next.js 15 • Node.js & Express • PostgreSQL & Prisma</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
