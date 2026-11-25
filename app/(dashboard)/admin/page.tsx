"use client";
import DashboardSidebar from "@/components/DashboardSidebar";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";
import {
  FaBagShopping,
  FaBoxesStacked,
  FaChartLine,
  FaCircleCheck,
  FaPlus,
  FaTriangleExclamation,
  FaUsers,
} from "react-icons/fa6";

const AdminDashboardPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [categoriesCount, setCategoriesCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes, usrRes, catRes] = await Promise.all([
        apiClient.get("/api/products?mode=admin", { cache: "no-store" }),
        apiClient.get("/api/orders", { cache: "no-store" }),
        apiClient.get("/api/users", { cache: "no-store" }),
        apiClient.get("/api/categories", { cache: "no-store" }),
      ]);

      if (prodRes.ok) {
        const p = await prodRes.json();
        setProducts(Array.isArray(p) ? p : []);
      }
      if (ordRes.ok) {
        const o = await ordRes.json();
        setOrders(Array.isArray(o?.orders) ? o.orders : []);
      }
      if (usrRes.ok) {
        const u = await usrRes.json();
        setUsersCount(Array.isArray(u) ? u.length : 0);
      }
      if (catRes.ok) {
        const c = await catRes.json();
        setCategoriesCount(Array.isArray(c) ? c.length : 0);
      }
    } catch (e) {
      console.error("Failed loading dashboard metrics:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const totalRevenue = orders.reduce(
    (acc, ord) => acc + (Number(ord.total) || 0),
    0
  );
  const avgOrderValue =
    orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const outOfStockProducts = products.filter((p) => !p.inStock || p.inStock <= 0);
  const inStockProducts = products.length - outOfStockProducts.length;

  const handleQuickRestock = async (product: any) => {
    try {
      const res = await apiClient.put(`/api/products/${product.id}`, {
        ...product,
        inStock: 1,
      });
      if (res.ok) {
        toast.success(`${product.title} riportato disponibile!`);
        loadDashboardData();
      } else {
        toast.error("Impossibile aggiornare lo stock");
      }
    } catch {
      toast.error("Errore di rete");
    }
  };

  return (
    <div className="bg-slate-50 flex max-w-screen-2xl mx-auto max-xl:flex-col min-h-screen">
      <DashboardSidebar />

      <div className="flex-1 p-6 sm:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Panoramica Operativa & KPI
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Dati in tempo reale dal database PostgreSQL: ricavi, stato ordini
              e disponibilità di magazzino.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <FaPlus />
              <span>Nuovo Prodotto</span>
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Fatturato Ordini
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FaChartLine />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-3">
              €{totalRevenue.toLocaleString("it-IT")}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Scontrino medio: <strong>€{avgOrderValue}</strong>
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Ordini Registrati
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FaBagShopping />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-3">
              {orders.length}
            </p>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-blue-600 hover:underline mt-1 inline-block"
            >
              Gestisci spedizioni →
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Prodotti & Stock
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FaBoxesStacked />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-3">
              {products.length}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              <span className="text-emerald-600 font-semibold">
                {inStockProducts} disponibili
              </span>{" "}
              • {categoriesCount} categorie
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Utenti & Clienti
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <FaUsers />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-3">
              {usersCount}
            </p>
            <Link
              href="/admin/users"
              className="text-xs font-semibold text-blue-600 hover:underline mt-1 inline-block"
            >
              Gestisci permessi →
            </Link>
          </div>
        </div>

        {/* Recent Orders & Stock Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-slate-900">
                Ultimi Ordini Ricevuti
              </h2>
              <Link
                href="/admin/orders"
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                Vedi tutti →
              </Link>
            </div>

            {loading ? (
              <p className="text-sm text-slate-500 py-6">
                Caricamento ordini...
              </p>
            ) : orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-400">
                      <th className="py-3 pr-4">Codice</th>
                      <th className="py-3 px-4">Cliente</th>
                      <th className="py-3 px-4">Stato</th>
                      <th className="py-3 px-4">Totale</th>
                      <th className="py-3 pl-4 text-right">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.slice(0, 6).map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50">
                        <td className="py-3.5 pr-4 font-mono text-xs font-bold text-slate-900">
                          #{ord.id.slice(0, 14)}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900">
                            {ord.name} {ord.lastname}
                          </p>
                          <p className="text-xs text-slate-500">{ord.city}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 capitalize">
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-black text-slate-900">
                          €{ord.total}
                        </td>
                        <td className="py-3.5 pl-4 text-right">
                          <Link
                            href={`/admin/orders/${ord.id}`}
                            className="text-xs font-bold text-blue-600 hover:underline"
                          >
                            Gestisci
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-500 py-6">
                Nessun ordine presente.
              </p>
            )}
          </div>

          {/* Low Stock / Out of Stock Alert Box */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold text-slate-900">
                  Avvisi Magazzino
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700">
                  {outOfStockProducts.length} esauriti
                </span>
              </div>

              {outOfStockProducts.length > 0 ? (
                <div className="space-y-3">
                  {outOfStockProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {prod.title}
                        </p>
                        <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-0.5">
                          <FaTriangleExclamation /> Esaurito (€{prod.price})
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleQuickRestock(prod)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition-colors cursor-pointer"
                      >
                        Riassortisci
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-center">
                  <FaCircleCheck className="text-2xl text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-emerald-900">
                    Tutti i prodotti sono disponibili!
                  </p>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Nessuna criticità di stock rilevata.
                  </p>
                </div>
              )}
            </div>

            <Link
              href="/admin/products"
              className="mt-6 block w-full text-center py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
            >
              Vai all&apos;Inventario Completo →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
