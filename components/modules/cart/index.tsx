"use client";

import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import {
  FaArrowRight,
  FaBagShopping,
  FaCheck,
  FaTrashCan,
  FaTruckFast,
  FaXmark,
} from "react-icons/fa6";
import QuantityInputCart from "@/components/QuantityInputCart";
import { sanitize } from "@/lib/sanitize";
import { resolveImageSrc } from "@/lib/image";

export const CartModule = () => {
  const { products, removeFromCart, clearCart, total } = useProductStore();

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    toast.success("Prodotto rimosso dal carrello");
  };

  const freeShippingThreshold = 99;
  const shippingCost = total === 0 || total >= freeShippingThreshold ? 0 : 5;
  const taxEstimate = Math.round(total * 0.22);

  if (products.length === 0) {
    return (
      <div className="mt-8 bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-2xs">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mx-auto mb-4">
          <FaBagShopping />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">
          Il tuo carrello è vuoto
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Esplora il nostro catalogo di elettronica o usa il comparatore tecnico
          per trovare il dispositivo ideale.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
        >
          <span>Inizia lo Shopping</span>
          <FaArrowRight className="text-xs" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-10">
      <section aria-labelledby="cart-heading" className="lg:col-span-7 space-y-4">
        {/* Free shipping indicator */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm">
            <FaTruckFast className="text-blue-600 text-lg shrink-0" />
            {total >= freeShippingThreshold ? (
              <span className="font-semibold text-emerald-700">
                Hai sbloccato la <strong>Spedizione Express Gratuita</strong>!
              </span>
            ) : (
              <span className="text-slate-700">
                Aggiungi ancora{" "}
                <strong>€{freeShippingThreshold - total}</strong> per la
                spedizione gratuita.
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              clearCart();
              toast.success("Carrello svuotato");
            }}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1 cursor-pointer shrink-0"
          >
            <FaTrashCan />
            <span>Svuota</span>
          </button>
        </div>

        <ul
          role="list"
          className="divide-y divide-slate-200 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs"
        >
          {products.map((product) => (
            <li key={product.id} className="flex p-5 sm:p-6 gap-5 items-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center shrink-0">
                <Image
                  width={110}
                  height={110}
                  src={resolveImageSrc(product?.image)}
                  alt={product.title}
                  className="max-h-24 w-auto object-contain"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      <Link
                        href={
                          product.slug ? `/product/${product.slug}` : "/shop"
                        }
                        className="hover:text-blue-600 transition-colors"
                      >
                        {sanitize(product.title)}
                      </Link>
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-emerald-700 inline-flex items-center gap-1">
                      <FaCheck className="text-[10px]" /> Disponibilità
                      immediata
                    </p>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(product.id)}
                    type="button"
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Rimuovi articolo"
                  >
                    <FaXmark className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <QuantityInputCart product={product} />
                  <p className="text-lg font-black text-slate-900">
                    €{product.price * product.amount}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Order summary */}
      <section
        aria-labelledby="summary-heading"
        className="mt-8 rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 lg:col-span-5 lg:mt-0 shadow-2xs sticky top-28"
      >
        <h2
          id="summary-heading"
          className="text-lg font-extrabold text-slate-900"
        >
          Riepilogo Ordine
        </h2>

        <dl className="mt-6 space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-slate-600">Subtotale articoli</dt>
            <dd className="font-bold text-slate-900">€{total}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <dt className="text-slate-600">Spedizione Corriere Express</dt>
            <dd className="font-bold text-emerald-700">
              {shippingCost === 0 ? "Gratuita" : `€${shippingCost}`}
            </dd>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <dt className="text-slate-600">IVA inclusa (22%)</dt>
            <dd className="font-medium text-slate-500">€{taxEstimate}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 pt-4">
            <dt className="text-base font-extrabold text-slate-900">
              Totale Ordine
            </dt>
            <dd className="text-2xl font-black text-blue-600">
              €{total + shippingCost}
            </dd>
          </div>
        </dl>

        <div className="mt-6 space-y-3">
          <Link
            href="/checkout"
            className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all"
          >
            <span>Procedi al Checkout</span>
            <FaArrowRight className="text-xs" />
          </Link>
          <Link
            href="/shop"
            className="w-full inline-flex justify-center items-center rounded-xl bg-slate-100 hover:bg-slate-200 px-6 py-3 text-xs font-bold text-slate-700 transition-colors"
          >
            Continua lo Shopping
          </Link>
        </div>
      </section>
    </div>
  );
};
