"use client";
import React, { useState } from "react";
import QuantityInput from "./QuantityInput";
import AddToCartSingleProductBtn from "./AddToCartSingleProductBtn";
import BuyNowSingleProductBtn from "./BuyNowSingleProductBtn";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { useCompareStore } from "@/app/_zustand/compareStore";
import toast from "react-hot-toast";
import { FaHeart, FaRegHeart, FaScaleBalanced } from "react-icons/fa6";

const SingleProductDynamicFields = ({ product }: { product: Product }) => {
  const [quantityCount, setQuantityCount] = useState<number>(1);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const { items: compareItems, addToCompare } = useCompareStore();

  const isWishlisted = wishlist.some((item) => item.id === product?.id);
  const isCompared = compareItems.some((item) => item.id === product?.id);

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success("Rimosso dalla lista desideri");
    } else {
      addToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.mainImage,
        slug: product.slug,
        stockAvailabillity: product.inStock,
      });
      toast.success("Salvato nella lista desideri");
    }
  };

  const handleToggleCompare = () => {
    const res = addToCompare({
      id: product.id,
      title: product.title,
      price: product.price,
      mainImage: product.mainImage,
      slug: product.slug,
      manufacturer: product.manufacturer || "KronoVolt",
      rating: Number(product.rating) || 5,
      inStock: product.inStock,
      description: product.description || "",
      categoryName: (product as any)?.category?.name || "",
    });
    if (res.added) {
      toast.success("Aggiunto al comparatore tecnico");
    } else if (res.reason === "removed") {
      toast.success("Rimosso dal comparatore");
    } else if (res.reason === "max") {
      toast.error("Massimo 4 prodotti nel comparatore");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <QuantityInput
          quantityCount={quantityCount}
          setQuantityCount={setQuantityCount}
        />

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleToggleWishlist}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isWishlisted
                ? "bg-rose-50 text-rose-600 border-rose-200"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {isWishlisted ? <FaHeart className="text-rose-500" /> : <FaRegHeart />}
            <span>{isWishlisted ? "Nei Preferiti" : "Preferiti"}</span>
          </button>

          <button
            type="button"
            onClick={handleToggleCompare}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isCompared
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <FaScaleBalanced />
            <span>{isCompared ? "In Confronto" : "Confronta"}</span>
          </button>
        </div>
      </div>

      {Boolean(product.inStock) && (
        <div className="flex flex-col sm:flex-row gap-3">
          <AddToCartSingleProductBtn
            quantityCount={quantityCount}
            product={product}
          />
          <BuyNowSingleProductBtn
            quantityCount={quantityCount}
            product={product}
          />
        </div>
      )}
    </div>
  );
};

export default SingleProductDynamicFields;
