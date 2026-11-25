"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import apiClient from "@/lib/api";
import {
  FaBoxOpen,
  FaCheck,
  FaMagnifyingGlass,
  FaPrint,
  FaTruckFast,
  FaClock,
} from "react-icons/fa6";

function OrdersTrackerContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [orderIdInput, setOrderIdInput] = useState(initialId || "ORD-2026-8841");
  const [order, setOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrderDetails = async (idToFetch: string) => {
    const cleanId = idToFetch.trim().replace(/^#/, "");
    if (!cleanId) return;

    setLoading(true);
    setError("");
    try {
      const [ordRes, itemsRes] = await Promise.all([
        apiClient.get(`/api/orders/${cleanId}`),
        apiClient.get(`/api/order-product/${cleanId}`),
      ]);

      if (!ordRes.ok) {
        setOrder(null);
        setOrderItems([]);
        setError(
          `Nessun ordine trovato con codice "${cleanId}". Verifica l'ID ordine.`
        );
        return;
      }

      const ordData = await ordRes.json();
      setOrder(ordData);

      if (itemsRes.ok) {
        const itemsData = await itemsRes.json();
        setOrderItems(Array.isArray(itemsData) ? itemsData : []);
      } else {
        setOrderItems([]);
      }
    } catch {
      setError("Errore durante il recupero dell'ordine.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("kronovolt-recent-orders") || "[]"
      );
      const defaults = ["ORD-2026-8841", "ORD-2026-9102", "ORD-2026-9350"];
      const merged = Array.from(new Set([...saved, ...defaults]));
      setRecentOrders(merged);
    } catch {
      setRecentOrders(["ORD-2026-8841", "ORD-2026-9102", "ORD-2026-9350"]);
    }

    fetchOrderDetails(initialId || "ORD-2026-8841");
  }, [initialId]);

  const getStepIndex = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "delivered" || s === "completed") return 3;
    if (s === "shipped") return 2;
    if (s === "processing" || s === "confirmed") return 1;
    return 0;
  };

  const steps = [
    { label: "Ordine Ricevuto", desc: "Confermato a sistema" },
    { label: "In Preparazione", desc: "Verifica e imballaggio" },
    { label: "In Consegna", desc: "Affidato al corriere express" },
    { label: "Consegnato", desc: "Recapitato a destinazione" },
  ];

  const currentStep = order ? getStepIndex(order.status) : 0;

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pt-10 space-y-8">
      {/* Lookup Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Cerca Stato Spedizione e Ricevuta
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Inserisci il codice ordine ricevuto al checkout oppure seleziona
              uno degli ordini recenti qui sotto.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchOrderDetails(orderIdInput);
            }}
            className="flex items-center gap-2 w-full md:w-auto"
          >
            <div className="relative flex-1 md:w-72">
              <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                placeholder="Es. ORD-2026-8841"
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer shrink-0"
            >
              {loading ? "Ricerca..." : "Traccia"}
            </button>
          </form>
        </div>

        {/* Quick Order Pills */}
        {recentOrders.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-400">
              Ordini rapidi / Demo:
            </span>
            {recentOrders.map((oid) => (
              <button
                key={oid}
                type="button"
                onClick={() => {
                  setOrderIdInput(oid);
                  fetchOrderDetails(oid);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold border transition-colors cursor-pointer ${
                  order?.id === oid
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                #{oid.slice(0, 14)}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-6 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Order Details Card */}
      {order && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-2xs space-y-8">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Ordine #{order.id}
                </span>
                <span className="text-xs text-slate-400">
                  {order.dateTime
                    ? new Date(order.dateTime).toLocaleDateString("it-IT", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "Oggi"}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                Intestato a {order.name} {order.lastname}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {order.company} • {order.email} • {order.phone}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                <FaPrint />
                <span>Stampa Ricevuta</span>
              </button>
            </div>
          </div>

          {/* 4-Step Visual Progress Tracker */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-5">
              Stato Avanzamento Spedizione
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {steps.map((step, index) => {
                const completed = index <= currentStep;
                const active = index === currentStep;
                return (
                  <div
                    key={step.label}
                    className={`p-4 rounded-2xl border transition-all ${
                      active
                        ? "bg-blue-50/70 border-blue-500 shadow-xs"
                        : completed
                        ? "bg-emerald-50/40 border-emerald-200"
                        : "bg-slate-50 border-slate-200 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          completed
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {completed ? <FaCheck /> : index + 1}
                      </span>
                      {active && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-white px-2 py-0.5 rounded-full border border-blue-200">
                          Stato Attuale
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-slate-900">
                      {step.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items & Address Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
            <div className="lg:col-span-7 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Articoli Ordinati ({orderItems.length})
              </h4>
              {orderItems.length > 0 ? (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                  {orderItems.map((item: any) => (
                    <div
                      key={item.id}
                      className="p-4 flex items-center justify-between gap-4 bg-white"
                    >
                      <div className="flex items-center gap-3.5">
                        <Image
                          src={
                            item.product?.mainImage
                              ? `/${item.product.mainImage}`
                              : "/product_placeholder.jpg"
                          }
                          width={56}
                          height={56}
                          alt={item.product?.title || "Prodotto"}
                          className="w-14 h-14 object-contain rounded-lg bg-slate-50 p-1"
                        />
                        <div>
                          <Link
                            href={`/product/${item.product?.slug || ""}`}
                            className="text-sm font-bold text-slate-900 hover:text-blue-600"
                          >
                            {item.product?.title || "Dispositivo Tech"}
                          </Link>
                          <p className="text-xs text-slate-500">
                            Quantità: {item.quantity} × €{item.product?.price}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-slate-900">
                        €{(item.product?.price || 0) * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl">
                  Dettaglio righe ordine registrato nel riepilogo contabile.
                </p>
              )}
            </div>

            <div className="lg:col-span-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recapito & Riepilogo
              </h4>
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4 text-sm">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">
                    Indirizzo di Consegna
                  </p>
                  <p className="font-bold text-slate-900 mt-1">
                    {order.adress}, {order.apartment}
                  </p>
                  <p className="text-slate-600">
                    {order.postalCode} {order.city} ({order.country})
                  </p>
                </div>

                {order.orderNotice && (
                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-xs text-slate-400 font-semibold uppercase">
                      Note per il Corriere
                    </p>
                    <p className="text-slate-700 mt-0.5">{order.orderNotice}</p>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-700">
                    Totale Ordine
                  </span>
                  <span className="text-2xl font-black text-blue-600">
                    €{order.total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SectionTitle
        title="Tracciamento Ordini & Ricevute"
        path="Home / Servizio Clienti / Traccia Ordine"
      />
      <Suspense
        fallback={
          <div className="max-w-screen-xl mx-auto p-12 text-center text-slate-500">
            Caricamento tracciamento ordini...
          </div>
        }
      >
        <OrdersTrackerContent />
      </Suspense>
    </div>
  );
}
