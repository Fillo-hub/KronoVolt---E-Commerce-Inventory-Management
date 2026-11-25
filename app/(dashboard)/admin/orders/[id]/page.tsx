"use client";
import DashboardSidebar from "@/components/DashboardSidebar";
import apiClient from "@/lib/api";
import { resolveImageSrc } from "@/lib/image";
import { isValidEmailAddressFormat } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface OrderProduct {
  id: string;
  customerOrderId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    slug: string;
    title: string;
    mainImage: string;
    price: number;
    rating: number;
    description: string;
    manufacturer: string;
    inStock: number;
    categoryId: string;
  };
}

const AdminSingleOrder = () => {
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const [order, setOrder] = useState<Order>({
    id: "",
    adress: "",
    apartment: "",
    company: "",
    dateTime: "",
    email: "",
    lastname: "",
    name: "",
    phone: "",
    postalCode: "",
    city: "",
    country: "",
    orderNotice: "",
    status: "processing",
    total: 0,
  });
  const params = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    const fetchOrderData = async () => {
      const response = await apiClient.get(`/api/orders/${params?.id}`);
      if (response.ok) {
        const data: Order = await response.json();
        setOrder(data);
      }
    };

    const fetchOrderProducts = async () => {
      const response = await apiClient.get(`/api/order-product/${params?.id}`);
      if (response.ok) {
        const data: OrderProduct[] = await response.json();
        setOrderProducts(Array.isArray(data) ? data : []);
      }
    };

    if (params?.id) {
      fetchOrderData();
      fetchOrderProducts();
    }
  }, [params?.id]);

  const updateOrder = async () => {
    if (
      !order?.name?.trim() ||
      !order?.lastname?.trim() ||
      !order?.phone?.trim() ||
      !order?.email?.trim() ||
      !order?.company?.trim() ||
      !order?.adress?.trim() ||
      !order?.apartment?.trim() ||
      !order?.city?.trim() ||
      !order?.country?.trim() ||
      !order?.postalCode?.trim()
    ) {
      toast.error("Compila tutti i campi obbligatori dell'ordine");
      return;
    }

    if (!isValidEmailAddressFormat(order.email)) {
      toast.error("Formato email non valido");
      return;
    }

    try {
      const response = await apiClient.put(`/api/orders/${order.id}`, order);
      if (response.ok) {
        toast.success("Ordine aggiornato con successo!");
      } else {
        const err = await response.json().catch(() => ({}));
        toast.error(err.error || "Errore durante l'aggiornamento dell'ordine");
      }
    } catch {
      toast.error("Errore di rete durante l'aggiornamento");
    }
  };

  const deleteOrder = async () => {
    try {
      await apiClient.delete(`/api/order-product/${order?.id}`);
      await apiClient.delete(`/api/orders/${order?.id}`);
      toast.success("Ordine eliminato con successo");
      router.push("/admin/orders");
    } catch {
      toast.error("Errore durante l'eliminazione dell'ordine");
    }
  };

  return (
    <div className="bg-slate-50 flex justify-start max-w-screen-2xl mx-auto min-h-screen max-xl:flex-col">
      <DashboardSidebar />
      <div className="flex-1 p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Dettaglio Ordine #{order?.id}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Gestione Ordine Cliente
            </h1>
          </div>
          <Link
            href="/admin/orders"
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100"
          >
            ← Torna agli Ordini
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Nome
              </label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                value={order?.name || ""}
                onChange={(e) => setOrder({ ...order, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Cognome
              </label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                value={order?.lastname || ""}
                onChange={(e) =>
                  setOrder({ ...order, lastname: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Stato Spedizione
              </label>
              <select
                className="w-full px-3.5 py-2.5 text-sm font-bold rounded-xl border border-blue-300 bg-blue-50 text-blue-800"
                value={order?.status || "processing"}
                onChange={(e) =>
                  setOrder({
                    ...order,
                    status: e.target.value as any,
                  })
                }
              >
                <option value="pending">Pending (In attesa)</option>
                <option value="processing">Processing (In lavorazione)</option>
                <option value="shipped">Shipped (Spedito)</option>
                <option value="delivered">Delivered (Consegnato)</option>
                <option value="cancelled">Cancelled (Annullato)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                value={order?.email || ""}
                onChange={(e) => setOrder({ ...order, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Telefono
              </label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                value={order?.phone || ""}
                onChange={(e) => setOrder({ ...order, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Azienda / Riferimento
              </label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                value={order?.company || ""}
                onChange={(e) =>
                  setOrder({ ...order, company: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Indirizzo
              </label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                value={order?.adress || ""}
                onChange={(e) => setOrder({ ...order, adress: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Interno / Scala
              </label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                value={order?.apartment || ""}
                onChange={(e) =>
                  setOrder({ ...order, apartment: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                CAP
              </label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                value={order?.postalCode || ""}
                onChange={(e) =>
                  setOrder({ ...order, postalCode: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Città
              </label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                value={order?.city || ""}
                onChange={(e) => setOrder({ ...order, city: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Nazione
              </label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                value={order?.country || ""}
                onChange={(e) =>
                  setOrder({ ...order, country: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Note Ordine
            </label>
            <textarea
              rows={2}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
              value={order?.orderNotice || ""}
              onChange={(e) =>
                setOrder({ ...order, orderNotice: e.target.value })
              }
            />
          </div>

          {/* Ordered items */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Prodotti nell&apos;ordine ({orderProducts.length})
            </h3>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {orderProducts.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={resolveImageSrc(item?.product?.mainImage)}
                      alt={item?.product?.title || "Prodotto"}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-contain bg-slate-50 rounded-lg p-1"
                    />
                    <div>
                      <Link
                        href={`/product/${item?.product?.slug}`}
                        className="text-sm font-bold text-slate-900 hover:text-blue-600"
                      >
                        {item?.product?.title}
                      </Link>
                      <p className="text-xs text-slate-500">
                        €{item?.product?.price} × {item?.quantity} pz.
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-slate-900">
                    €{(item?.product?.price || 0) * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 block">
                Totale Ordine Registrato
              </span>
              <span className="text-2xl font-black text-blue-600">
                €{order?.total}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={updateOrder}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Salva Modifiche Ordine
              </button>
              <button
                type="button"
                onClick={deleteOrder}
                className="px-5 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors cursor-pointer"
              >
                Elimina Ordine
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSingleOrder;
