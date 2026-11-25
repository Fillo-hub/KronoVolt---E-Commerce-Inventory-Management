"use client";
import Link from "next/link";
import React from "react";
import { FaBagShopping } from "react-icons/fa6";
import { useProductStore } from "@/app/_zustand/store";

const CartElement = () => {
  const { allQuantity, total } = useProductStore();
  return (
    <Link
      href="/cart"
      title="Carrello"
      className="relative inline-flex items-center gap-2 px-3 h-10 rounded-xl bg-slate-900 hover:bg-blue-600 text-white transition-colors shadow-xs"
    >
      <div className="relative flex items-center">
        <FaBagShopping className="text-base" />
        <span className="ml-1.5 text-xs font-bold bg-white/20 px-1.5 py-0.5 rounded-md">
          {allQuantity}
        </span>
      </div>
      {total > 0 && (
        <span className="hidden sm:inline text-xs font-semibold border-l border-white/20 pl-2">
          €{total}
        </span>
      )}
    </Link>
  );
};

export default CartElement;
