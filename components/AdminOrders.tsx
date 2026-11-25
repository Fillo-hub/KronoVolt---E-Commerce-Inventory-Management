"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/api";
import { downloadCsvFile } from "@/lib/csv";
import toast from "react-hot-toast";
import { FaFileCsv } from "react-icons/fa6";

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get("/api/orders", {
        cache: "no-store",
      });
      const data = await response.json();
      setOrders(Array.isArray(data?.orders) ? data.orders : []);
    } catch {}
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) =>
    statusFilter === "all"
      ? true
      : (o.status || "").toLowerCase() === statusFilter
  );

  const handleExportOrdersCsv = () => {
    if (filteredOrders.length === 0) {
      toast.error("Nessun ordine da esportare");
      return;
    }

    downloadCsvFile(
      `ordini-kronovolt-${new Date().toISOString().slice(0, 10)}.csv`,
      filteredOrders,
      [
        { header: "ID Ordine", accessor: (o) => o.id },
        {
          header: "Data",
          accessor: (o) =>
            o.dateTime
              ? new Date(Date.parse(o.dateTime)).toLocaleDateString("it-IT")
              : "",
        },
        { header: "Nome", accessor: (o) => o.name },
        { header: "Cognome", accessor: (o) => o.lastname },
        { header: "Azienda", accessor: (o) => o.company },
        { header: "Email", accessor: (o) => o.email },
        { header: "Telefono", accessor: (o) => o.phone },
        { header: "Indirizzo", accessor: (o) => `${o.adress} ${o.apartment || ""}`.trim() },
        { header: "CAP", accessor: (o) => o.postalCode },
        { header: "Citta", accessor: (o) => o.city },
        { header: "Nazione", accessor: (o) => o.country },
        { header: "Stato", accessor: (o) => o.status },
        { header: "Totale EUR", accessor: (o) => o.total },
        { header: "Note", accessor: (o) => o.orderNotice || "" },
      ],
      ";"
    );
    toast.success(
      `Esportati ${filteredOrders.length} ordini in CSV multi-colonna!`
    );
  };

  return (
    <div className="flex-1 p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Gestione Ordini ({filteredOrders.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitora gli ordini ricevuti, aggiorna lo stato di spedizione o
            esporta il report contabile in CSV per Excel.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {["all", "processing", "shipped", "delivered", "cancelled"].map(
              (st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                    statusFilter === st
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {st === "all" ? "Tutti" : st}
                </button>
              )
            )}
          </div>

          <button
            type="button"
            onClick={handleExportOrdersCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <FaFileCsv />
            <span>Esporta CSV (Excel)</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3.5 px-5">Order ID</th>
              <th className="py-3.5 px-4">Cliente & Località</th>
              <th className="py-3.5 px-4">Stato</th>
              <th className="py-3.5 px-4">Totale</th>
              <th className="py-3.5 px-4">Data</th>
              <th className="py-3.5 px-5 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.map((order) => (
              <tr key={order?.id} className="hover:bg-slate-50/80">
                <td className="py-3.5 px-5 font-mono text-xs font-bold text-slate-900">
                  #{order?.id}
                </td>

                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900">
                    {order?.name} {order?.lastname}
                  </div>
                  <div className="text-xs text-slate-500">
                    {order?.city} ({order?.country}) • {order?.email}
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 capitalize">
                    {order?.status}
                  </span>
                </td>

                <td className="py-3.5 px-4 font-black text-slate-900">
                  €{order?.total}
                </td>

                <td className="py-3.5 px-4 text-xs text-slate-500">
                  {order?.dateTime
                    ? new Date(Date.parse(order.dateTime)).toLocaleDateString(
                        "it-IT"
                      )
                    : "-"}
                </td>

                <td className="py-3.5 px-5 text-right space-x-2">
                  <Link
                    href={`/orders?id=${order?.id}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Tracking
                  </Link>
                  <Link
                    href={`/admin/orders/${order?.id}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100"
                  >
                    Dettagli
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
