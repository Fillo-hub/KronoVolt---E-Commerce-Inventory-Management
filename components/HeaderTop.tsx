"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import {
  FaHeadphones,
  FaRegEnvelope,
  FaRegUser,
  FaShieldHalved,
  FaTruckFast,
  FaRightFromBracket,
  FaGaugeHigh,
} from "react-icons/fa6";

const HeaderTop = () => {
  const { data: session }: any = useSession();

  const handleLogout = () => {
    toast.success("Disconnessione effettuata!");
    setTimeout(() => signOut({ callbackUrl: "/" }), 500);
  };

  return (
    <div className="bg-slate-950 text-slate-300 text-xs border-b border-slate-800/80">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 h-10 flex items-center justify-between gap-4">
        {/* Left info */}
        <div className="flex items-center gap-5 overflow-x-auto whitespace-nowrap">
          <span className="inline-flex items-center gap-1.5 text-slate-300 font-medium">
            <FaTruckFast className="text-blue-400" />
            <span>Spedizione gratuita sopra 99€</span>
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5 text-slate-400">
            <FaShieldHalved className="text-emerald-400" />
            <span>Garanzia Ufficiale 24 Mesi</span>
          </span>
          <a
            href="tel:+390294758210"
            className="hidden sm:inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <FaHeadphones className="text-blue-400" />
            <span>+39 02 9475 8210</span>
          </a>
          <a
            href="mailto:support@kronovolt.com"
            className="hidden lg:inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <FaRegEnvelope className="text-blue-400" />
            <span>support@kronovolt.com</span>
          </a>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4 whitespace-nowrap">
          <Link
            href="/orders"
            className="hover:text-white transition-colors font-medium hidden sm:inline"
          >
            Traccia Ordine
          </Link>
          <Link
            href="/compare"
            className="hover:text-white transition-colors font-medium hidden sm:inline"
          >
            Confronta Tech
          </Link>
          <span className="hidden sm:inline text-slate-700">|</span>

          {!session ? (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 hover:text-white font-medium transition-colors"
              >
                <FaRegUser className="text-blue-400" />
                <span>Accedi</span>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600 hover:text-white font-medium transition-all"
              >
                Registrati
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {session.user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 hover:bg-indigo-600 hover:text-white font-semibold transition-all"
                >
                  <FaGaugeHigh className="text-xs" />
                  <span>Admin Panel</span>
                </Link>
              )}
              <span className="text-slate-300 font-medium truncate max-w-[160px]">
                {session.user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 font-medium transition-colors cursor-pointer"
              >
                <FaRightFromBracket />
                <span>Esci</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderTop;
