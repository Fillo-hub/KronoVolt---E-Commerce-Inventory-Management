"use client";

import React, { useState } from "react";
import { formatCategoryName } from "@/utils/categoryFormating";
import { sanitize, sanitizeHtml } from "@/lib/sanitize";

const ProductTabs = ({ product }: { product: Product }) => {
  const [currentProductTab, setCurrentProductTab] = useState<number>(0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setCurrentProductTab(0)}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
            currentProductTab === 0
              ? "bg-blue-600 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Descrizione e Caratteristiche
        </button>
        <button
          type="button"
          onClick={() => setCurrentProductTab(1)}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
            currentProductTab === 1
              ? "bg-blue-600 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Scheda Tecnica
        </button>
      </div>

      <div className="pt-6">
        {currentProductTab === 0 && (
          <div className="prose max-w-none text-slate-700 leading-relaxed text-sm sm:text-base">
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(product?.description),
              }}
            />
          </div>
        )}

        {currentProductTab === 1 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <th className="py-3.5 px-4 font-semibold text-slate-500 w-1/3 bg-slate-50 rounded-l-lg">
                    Produttore / Brand
                  </th>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {sanitize(product?.manufacturer)}
                  </td>
                </tr>
                <tr>
                  <th className="py-3.5 px-4 font-semibold text-slate-500 bg-slate-50 rounded-l-lg">
                    Categoria
                  </th>
                  <td className="py-3.5 px-4 font-medium text-slate-800 capitalize">
                    {product?.category?.name
                      ? sanitize(formatCategoryName(product?.category?.name))
                      : "Elettronica"}
                  </td>
                </tr>
                <tr>
                  <th className="py-3.5 px-4 font-semibold text-slate-500 bg-slate-50 rounded-l-lg">
                    Codice Identificativo (SKU)
                  </th>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-700">
                    KRV-{product?.id?.toString().slice(0, 8).toUpperCase()}
                  </td>
                </tr>
                <tr>
                  <th className="py-3.5 px-4 font-semibold text-slate-500 bg-slate-50 rounded-l-lg">
                    Garanzia
                  </th>
                  <td className="py-3.5 px-4 font-medium text-emerald-700">
                    24 Mesi Garanzia Ufficiale Italia
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
