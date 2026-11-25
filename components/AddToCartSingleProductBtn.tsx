"use client";
import React from "react";
import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";
import { FaBagShopping } from "react-icons/fa6";

const AddToCartSingleProductBtn = ({
  product,
  quantityCount,
}: SingleProductBtnProps) => {
  const { addToCart } = useProductStore();

  const handleAddToCart = () => {
    addToCart({
      id: product?.id.toString(),
      title: product?.title,
      price: product?.price,
      image: product?.mainImage,
      amount: quantityCount,
      slug: product?.slug,
    });
    toast.success("Prodotto aggiunto al carrello!");
  };
  return (
    <button
      type="button"
      onClick={handleAddToCart}
      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all cursor-pointer"
    >
      <FaBagShopping />
      <span>Aggiungi al Carrello</span>
    </button>
  );
};

export default AddToCartSingleProductBtn;
