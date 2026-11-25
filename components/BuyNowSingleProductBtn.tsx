"use client";
import { useProductStore } from "@/app/_zustand/store";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FaBolt } from "react-icons/fa6";

const BuyNowSingleProductBtn = ({
  product,
  quantityCount,
}: SingleProductBtnProps) => {
  const router = useRouter();
  const { addToCart } = useProductStore();

  const handleBuyNow = () => {
    addToCart({
      id: product?.id.toString(),
      title: product?.title,
      price: product?.price,
      image: product?.mainImage,
      amount: quantityCount,
      slug: product?.slug,
    });
    toast.success("Reindirizzamento al checkout...");
    router.push("/checkout");
  };
  return (
    <button
      type="button"
      onClick={handleBuyNow}
      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer"
    >
      <FaBolt className="text-amber-400" />
      <span>Acquista Ora</span>
    </button>
  );
};

export default BuyNowSingleProductBtn;
