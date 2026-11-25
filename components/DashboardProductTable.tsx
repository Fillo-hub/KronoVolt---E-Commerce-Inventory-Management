"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import { sanitize } from "@/lib/sanitize";
import { resolveImageSrc } from "@/lib/image";
import { downloadCsvFile } from "@/lib/csv";
import toast from "react-hot-toast";
import { FaFileCsv, FaMagnifyingGlass, FaPlus } from "react-icons/fa6";

const DashboardProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filterQuery, setFilterQuery] = useState("");

  const fetchProducts = () => {
    apiClient
      .get("/api/products?mode=admin", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleStock = async (product: any) => {
    const nextStock = product.inStock ? 0 : 1;
    try {
      const res = await apiClient.put(`/api/products/${product.id}`, {
        ...product,
        inStock: nextStock,
      });
      if (res.ok) {
        toast.success(
          nextStock
            ? `${product.title} impostato come Disponibile`
            : `${product.title} impostato come Esaurito`
        );
        fetchProducts();
      }
    } catch {
      toast.error("Errore durante l'aggiornamento dello stock");
    }
  };

  const filteredProducts = products.filter((p) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.manufacturer?.toLowerCase().includes(q)
    );
  });

  const handleExportCsv = () => {
    if (filteredProducts.length === 0) {
      toast.error("Nessun prodotto da esportare");
      return;
    }

    downloadCsvFile(
      `prodotti-kronovolt-${new Date().toISOString().slice(0, 10)}.csv`,
      filteredProducts,
      [
        { header: "title", accessor: (p: any) => p.title },
        { header: "price", accessor: (p: any) => p.price },
        { header: "manufacturer", accessor: (p: any) => p.manufacturer || "KronoVolt" },
        { header: "inStock", accessor: (p: any) => (p.inStock ? 1 : 0) },
        { header: "mainImage", accessor: (p: any) => p.mainImage || "product1.webp" },
        { header: "description", accessor: (p: any) => p.description || "" },
        { header: "slug", accessor: (p: any) => p.slug },
        {
          header: "categoryId",
          accessor: (p: any) => p.category?.name || p.categoryId || "smart-phones",
        },
      ],
      ";"
    );
    toast.success(
      `Esportati ${filteredProducts.length} prodotti in CSV multi-colonna!`
    );
  };

  return (
    <div className="flex-1 p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Catalogo Prodotti ({filteredProducts.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Clicca sullo stato disponibilità per cambiarlo istantaneamente o
            esporta la tabella ordinata in CSV per Excel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filtra per nome o brand..."
              className="pl-8 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-blue-600 outline-none w-52"
            />
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <FaFileCsv />
            <span>Esporta CSV (Excel)</span>
          </button>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <FaPlus />
            <span>Aggiungi Prodotto</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3.5 px-5">Prodotto</th>
              <th className="py-3.5 px-4">Categoria</th>
              <th className="py-3.5 px-4">Stato Stock (1-Click)</th>
              <th className="py-3.5 px-4">Prezzo</th>
              <th className="py-3.5 px-5 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.map((product: any) => (
              <tr key={product.id} className="hover:bg-slate-50/80">
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0">
                      <Image
                        width={44}
                        height={44}
                        unoptimized={Boolean(
                          product?.mainImage?.startsWith("http")
                        )}
                        src={resolveImageSrc(product?.mainImage)}
                        alt={sanitize(product?.title) || "Product image"}
                        className="max-h-10 w-auto object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">
                        {sanitize(product?.title)}
                      </div>
                      <div className="text-xs text-slate-500">
                        {sanitize(product?.manufacturer)}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                    {product?.category?.name?.replace(/-/g, " ") || "Tech"}
                  </span>
                </td>

                <td className="py-3.5 px-4">
                  <button
                    type="button"
                    onClick={() => handleToggleStock(product)}
                    title="Clicca per invertire la disponibilità"
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      product?.inStock
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                        : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                    }`}
                  >
                    {product?.inStock ? "● Disponibile" : "○ Esaurito"}
                  </button>
                </td>

                <td className="py-3.5 px-4 font-black text-slate-900">
                  €{product?.price}
                </td>

                <td className="py-3.5 px-5 text-right space-x-2">
                  <Link
                    href={`/product/${product.slug}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Vedi
                  </Link>
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100"
                  >
                    Modifica
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

export default DashboardProductTable;
