"use client";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import Link from "next/link";
import React from "react";

export const WishlistModule = () => {
  const { wishlist } = useWishlistStore();
  return (
    <div className="max-w-screen-2xl mx-auto py-8 text-center">
      <p className="text-sm text-slate-600">
        {wishlist.length} articoli nella{" "}
        <Link href="/wishlist" className="text-blue-600 font-bold underline">
          Lista Desideri
        </Link>
      </p>
    </div>
  );
};
