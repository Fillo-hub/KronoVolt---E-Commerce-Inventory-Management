import Link from "next/link";
import React from "react";
import { FaHouse, FaChevronRight } from "react-icons/fa6";

const Breadcrumb = ({ category }: { category?: string }) => {
  return (
    <nav className="py-4 text-xs sm:text-sm text-slate-500 flex items-center gap-2 flex-wrap">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 hover:text-blue-600 font-medium transition-colors"
      >
        <FaHouse className="text-xs" />
        <span>Home</span>
      </Link>
      <FaChevronRight className="text-[10px] text-slate-400" />
      <Link
        href="/shop"
        className="hover:text-blue-600 font-medium transition-colors"
      >
        Catalogo
      </Link>
      <FaChevronRight className="text-[10px] text-slate-400" />
      <span className="font-semibold text-slate-900 capitalize">
        {category || "Tutti i prodotti"}
      </span>
    </nav>
  );
};

export default Breadcrumb;
