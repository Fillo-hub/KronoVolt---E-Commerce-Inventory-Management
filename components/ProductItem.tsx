"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { sanitize } from "@/lib/sanitize";
import { resolveImageSrc } from "@/lib/image";
import { useProductStore } from "@/app/_zustand/store";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { useCompareStore } from "@/app/_zustand/compareStore";
import {
  FaBagShopping,
  FaHeart,
  FaRegHeart,
  FaScaleBalanced,
  FaStar,
} from "react-icons/fa6";

const ProductItem = ({
  product,
}: {
  product: Product;
  color?: string;
}) => {
  const { addToCart } = useProductStore();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const { items: compareItems, addToCompare } = useCompareStore();

  const isWishlisted = wishlist.some((item) => item.id === product?.id);
  const isCompared = compareItems.some((item) => item.id === product?.id);
  const isAvailable = Boolean(product?.inStock && product.inStock > 0);
  const rating = Math.min(5, Math.max(1, Number(product?.rating) || 5));

  const handleQuickAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAvailable) {
      toast.error("Prodotto attualmente esaurito");
      return;
    }
    addToCart({
      id: product.id.toString(),
      title: product.title,
      price: product.price,
      image: product.mainImage,
      amount: 1,
      slug: product.slug,
    });
    toast.success(`${sanitize(product.title)} aggiunto al carrello!`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      toast.success("Aggiunto alla lista desideri");
    }
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = addToCompare({
      id: product.id,
      title: product.title,
      price: product.price,
      mainImage: product.mainImage,
      slug: product.slug,
      manufacturer: product.manufacturer || "KronoVolt",
      rating: rating,
      inStock: product.inStock,
      description: product.description || "",
      categoryName: (product as any)?.category?.name || "",
    });
    if (res.added) {
      toast.success("Aggiunto al comparatore tecnico");
    } else if (res.reason === "removed") {
      toast.success("Rimosso dal comparatore");
    } else if (res.reason === "max") {
      toast.error("Puoi confrontare massimo 4 prodotti contemporaneamente");
    }
  };

  return (
    <div className="group relative flex flex-col justify-between w-full rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-blue-500/40 transition-all duration-200 overflow-hidden">
      {/* Top badges & quick actions */}
      <div>
        <div className="relative bg-slate-50/90 group-hover:bg-slate-100/70 transition-colors pt-4 px-4 pb-2 flex flex-col">
          <div className="flex items-center justify-between gap-2 z-10">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-white text-slate-700 border border-slate-200/80 shadow-2xs">
              {sanitize(product?.manufacturer) || "Tech"}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleToggleCompare}
                title={
                  isCompared
                    ? "Rimuovi dal confronto"
                    : "Confronta specifiche"
                }
                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                  isCompared
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:border-indigo-400 hover:text-indigo-600"
                }`}
              >
                <FaScaleBalanced className="text-xs" />
              </button>
              <button
                type="button"
                onClick={handleToggleWishlist}
                title={
                  isWishlisted
                    ? "Rimuovi dai preferiti"
                    : "Salva nei preferiti"
                }
                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                  isWishlisted
                    ? "bg-rose-50 text-rose-500 border-rose-200"
                    : "bg-white text-slate-600 border-slate-200 hover:border-rose-300 hover:text-rose-500"
                }`}
              >
                {isWishlisted ? (
                  <FaHeart className="text-xs" />
                ) : (
                  <FaRegHeart className="text-xs" />
                )}
              </button>
            </div>
          </div>

          {/* Product Thumbnail with proper Next/Image sizing */}
          <Link
            href={`/product/${product.slug}`}
            className="relative flex items-center justify-center h-52 my-2"
          >
            <Image
              src={resolveImageSrc(product.mainImage)}
              width={240}
              height={240}
              sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 240px"
              className="max-h-44 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              alt={sanitize(product?.title) || "Product image"}
            />
          </Link>
        </div>

        {/* Product Info */}
        <div className="p-5 pb-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            {/* Rating */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <FaStar
                  key={idx}
                  className={`text-xs ${
                    idx < rating ? "text-amber-400" : "text-slate-200"
                  }`}
                />
              ))}
              <span className="text-xs font-semibold text-slate-500 ml-1">
                {rating}.0
              </span>
            </div>

            {/* Stock badge */}
            {isAvailable ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Disponibile
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                Esaurito
              </span>
            )}
          </div>

          <Link
            href={`/product/${product.slug}`}
            className="block text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1"
          >
            {sanitize(product.title)}
          </Link>

          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 min-h-[2rem] leading-relaxed">
            {sanitize(product.description) ||
              "Dispositivo elettronico ad alte prestazioni con garanzia ufficiale."}
          </p>
        </div>
      </div>

      {/* Price & Action Footer */}
      <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] text-slate-400 font-medium block">
            Prezzo IVA incl.
          </span>
          <span className="text-xl font-black text-slate-900">
            €{product.price}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/product/${product?.slug}`}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Scheda
          </Link>
          <button
            type="button"
            onClick={handleQuickAddToCart}
            disabled={!isAvailable}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white shadow-xs transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <FaBagShopping />
            <span>Aggiungi</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
