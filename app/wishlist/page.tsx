"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import SectionTitle from "@/components/SectionTitle";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { useProductStore } from "@/app/_zustand/store";
import {
  FaBagShopping,
  FaHeart,
  FaTrashCan,
  FaArrowRight,
} from "react-icons/fa6";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlistStore();
  const { addToCart } = useProductStore();

  const handleMoveToCart = (item: ProductInWishlist) => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      amount: 1,
      slug: item.slug,
    });
    removeFromWishlist(item.id);
    toast.success(`${item.title} spostato nel carrello!`);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SectionTitle
        title="La Tua Lista Desideri"
        path="Home / Preferiti"
      />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 pt-10">
        {wishlist.length > 0 ? (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <p className="text-sm font-semibold text-slate-600">
                Hai <span className="font-bold text-slate-900">{wishlist.length}</span>{" "}
                prodotti salvati nei preferiti
              </p>
              <button
                type="button"
                onClick={() => {
                  clearWishlist();
                  toast.success("Lista desideri svuotata");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <FaTrashCan />
                <span>Svuota Lista</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                      className="h-44 bg-slate-50 rounded-xl flex items-center justify-center p-4 mb-4"
                    >
                      <Image
                        src={
                          item.image
                            ? `/${item.image}`
                            : "/product_placeholder.jpg"
                        }
                        width={160}
                        height={160}
                        alt={item.title}
                        className="max-h-36 w-auto object-contain"
                      />
                    </Link>
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-base font-bold text-slate-900 hover:text-blue-600 line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xl font-black text-slate-900 mt-1">
                      €{item.price}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleMoveToCart(item)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
                    >
                      <FaBagShopping />
                      <span>Sposta nel Carrello</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        removeFromWishlist(item.id);
                        toast.success("Rimosso dai preferiti");
                      }}
                      className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                      title="Rimuovi"
                    >
                      <FaTrashCan className="text-xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-2xs">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-2xl mx-auto mb-4">
              <FaHeart />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              La tua lista desideri è vuota
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Salva i tuoi prodotti preferiti cliccando sull&apos;icona a forma di
              cuore sulle schede prodotto per ritrovarli rapidamente.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
            >
              <span>Esplora il Catalogo</span>
              <FaArrowRight className="text-xs" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
