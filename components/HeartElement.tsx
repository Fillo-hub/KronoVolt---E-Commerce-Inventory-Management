"use client";
import Link from "next/link";
import React from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa6";

const HeartElement = ({ wishQuantity }: { wishQuantity: number }) => {
  return (
    <Link
      href="/wishlist"
      title="Lista desideri"
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-700 hover:text-rose-600 hover:bg-rose-50 transition-colors"
    >
      {wishQuantity > 0 ? (
        <FaHeart className="text-lg text-rose-500" />
      ) : (
        <FaRegHeart className="text-lg" />
      )}
      {wishQuantity > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 text-[11px] font-bold bg-rose-500 text-white rounded-full flex justify-center items-center shadow-xs">
          {wishQuantity}
        </span>
      )}
    </Link>
  );
};

export default HeartElement;
