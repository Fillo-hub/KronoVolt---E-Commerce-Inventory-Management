"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import SectionTitle from "@/components/SectionTitle";
import { useCompareStore, CompareProduct } from "@/app/_zustand/compareStore";
import { useProductStore } from "@/app/_zustand/store";
import apiClient from "@/lib/api";
import {
  FaBagShopping,
  FaCheck,
  FaPlus,
  FaScaleBalanced,
  FaStar,
  FaTrashCan,
  FaTrophy,
  FaXmark,
} from "react-icons/fa6";

export default function ComparePage() {
  const { items, addToCompare, removeFromCompare, clearCompare } =
    useCompareStore();
  const { addToCart } = useProductStore();
  const [catalog, setCatalog] = useState<any[]>([]);

  useEffect(() => {
    apiClient
      .get("/api/products?mode=admin")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setCatalog(data);
      })
      .catch(() => {});
  }, []);

  const lowestPrice =
    items.length > 0 ? Math.min(...items.map((i) => i.price)) : 0;

  const handleAddToCart = (item: CompareProduct) => {
    if (!item.inStock) {
      toast.error("Prodotto attualmente esaurito");
      return;
    }
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.mainImage,
      amount: 1,
      slug: item.slug,
    });
    toast.success(`${item.title} aggiunto al carrello!`);
  };

  const handleQuickAddFromCatalog = (prod: any) => {
    const res = addToCompare({
      id: prod.id,
      title: prod.title,
      price: prod.price,
      mainImage: prod.mainImage,
      slug: prod.slug,
      manufacturer: prod.manufacturer || "KronoVolt",
      rating: Number(prod.rating) || 5,
      inStock: prod.inStock,
      description: prod.description || "",
      categoryName: prod.category?.name || "",
    });
    if (res.added) toast.success(`${prod.title} aggiunto al confronto`);
    else if (res.reason === "max")
      toast.error("Puoi confrontare massimo 4 prodotti");
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SectionTitle
        title="Comparatore Specifiche Tecniche"
        path="Home / Strumenti / Confronta Dispositivi"
      />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 pt-10">
        {items.length > 0 ? (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
                  <FaScaleBalanced />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Confronto attivo ({items.length}/4 dispositivi)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Il sistema evidenzia automaticamente il prezzo più basso e le
                    specifiche chiave.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  clearCompare();
                  toast.success("Confronto azzerato");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <FaTrashCan />
                <span>Svuota Confronto</span>
              </button>
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-6 w-52 bg-slate-50/70 text-xs font-bold uppercase tracking-wider text-slate-400 align-top">
                      Dispositivo
                    </th>
                    {items.map((item) => {
                      const isCheapest =
                        items.length > 1 && item.price === lowestPrice;
                      return (
                        <th
                          key={item.id}
                          className="p-6 align-top border-l border-slate-100 min-w-[230px]"
                        >
                          <div className="relative flex flex-col items-center text-center">
                            <button
                              type="button"
                              onClick={() => removeFromCompare(item.id)}
                              className="absolute top-0 right-0 w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                              title="Rimuovi"
                            >
                              <FaXmark className="text-xs" />
                            </button>

                            {isCheapest && (
                              <span className="mb-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <FaTrophy className="text-amber-500" />
                                Miglior Prezzo
                              </span>
                            )}

                            <Link
                              href={`/product/${item.slug}`}
                              className="h-36 flex items-center justify-center my-2"
                            >
                              <Image
                                src={
                                  item.mainImage
                                    ? `/${item.mainImage}`
                                    : "/product_placeholder.jpg"
                                }
                                width={130}
                                height={130}
                                alt={item.title}
                                className="max-h-32 w-auto object-contain"
                              />
                            </Link>

                            <Link
                              href={`/product/${item.slug}`}
                              className="text-sm font-bold text-slate-900 hover:text-blue-600 line-clamp-2 mt-2"
                            >
                              {item.title}
                            </Link>

                            <p className="text-2xl font-black text-slate-900 mt-2">
                              €{item.price}
                            </p>

                            <button
                              type="button"
                              onClick={() => handleAddToCart(item)}
                              disabled={!item.inStock}
                              className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white transition-colors cursor-pointer"
                            >
                              <FaBagShopping />
                              <span>Aggiungi al Carrello</span>
                            </button>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  <tr>
                    <td className="p-4 px-6 font-semibold text-slate-500 bg-slate-50/70">
                      Produttore
                    </td>
                    {items.map((item) => (
                      <td
                        key={item.id}
                        className="p-4 px-6 font-bold text-slate-800 border-l border-slate-100 text-center"
                      >
                        {item.manufacturer}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 px-6 font-semibold text-slate-500 bg-slate-50/70">
                      Valutazione
                    </td>
                    {items.map((item) => (
                      <td
                        key={item.id}
                        className="p-4 px-6 border-l border-slate-100 text-center"
                      >
                        <div className="inline-flex items-center gap-1 font-bold text-amber-500">
                          <FaStar />
                          <span>{item.rating}.0 / 5</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 px-6 font-semibold text-slate-500 bg-slate-50/70">
                      Disponibilità
                    </td>
                    {items.map((item) => (
                      <td
                        key={item.id}
                        className="p-4 px-6 border-l border-slate-100 text-center"
                      >
                        {item.inStock ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                            <FaCheck /> Immediata
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full">
                            Esaurito
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 px-6 font-semibold text-slate-500 bg-slate-50/70">
                      Specifiche Tecniche
                    </td>
                    {items.map((item) => (
                      <td
                        key={item.id}
                        className="p-4 px-6 text-xs text-slate-600 leading-relaxed border-l border-slate-100 align-top"
                      >
                        {item.description}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 px-6 font-semibold text-slate-500 bg-slate-50/70">
                      Garanzia & Spedizione
                    </td>
                    {items.map((item) => (
                      <td
                        key={item.id}
                        className="p-4 px-6 text-xs font-medium text-slate-700 border-l border-slate-100 text-center"
                      >
                        24 Mesi Ufficiale •{" "}
                        {item.price >= 99
                          ? "Spedizione Gratuita"
                          : "Spedizione €5"}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center max-w-2xl mx-auto shadow-2xs">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mx-auto mb-4">
              <FaScaleBalanced />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Nessun dispositivo nel comparatore
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Seleziona fino a 4 prodotti qui sotto oppure clicca sull&apos;icona
              bilancia presente su ogni scheda prodotto nel catalogo.
            </p>
          </div>
        )}

        {/* Quick Selector from Catalog */}
        {items.length < 4 && catalog.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-extrabold text-slate-900 mb-4">
              Aggiungi rapidamente dispositivi al confronto ({4 - items.length}{" "}
              slot disponibili)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {catalog
                .filter((p) => !items.some((i) => i.id === p.id))
                .slice(0, 8)
                .map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-3 shadow-2xs hover:border-indigo-400 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Image
                        src={
                          prod.mainImage
                            ? `/${prod.mainImage}`
                            : "/product_placeholder.jpg"
                        }
                        width={48}
                        height={48}
                        alt={prod.title}
                        className="w-12 h-12 object-contain shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {prod.title}
                        </p>
                        <p className="text-xs font-extrabold text-blue-600">
                          €{prod.price}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleQuickAddFromCatalog(prod)}
                      className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                      title="Aggiungi al confronto"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
