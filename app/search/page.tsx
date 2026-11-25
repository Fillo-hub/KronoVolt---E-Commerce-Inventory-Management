export const dynamic = "force-dynamic";

import ProductItem from "@/components/ProductItem";
import SectionTitle from "@/components/SectionTitle";
import prisma from "@/utils/db";
import React from "react";
import { sanitize } from "@/lib/sanitize";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ search?: string }>;
}

const SearchPage = async ({ searchParams }: Props) => {
  const sp = await searchParams;
  const q = (sp?.search || "").trim();
  let products: any[] = [];

  try {
    products = await prisma.product.findMany({
      where: q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { manufacturer: { contains: q, mode: "insensitive" } },
              { category: { name: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {},
      include: { category: true },
      take: 24,
    });
  } catch (error) {
    console.error("Error fetching search results from Prisma:", error);
    products = [];
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <SectionTitle
        title={q ? `Risultati per "${sanitize(q)}"` : "Ricerca Prodotti"}
        path="Home / Ricerca"
      />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 pt-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-medium text-slate-600">
            Trovati{" "}
            <span className="font-bold text-slate-900">{products.length}</span>{" "}
            prodotti corrispondenti
          </p>
          <Link
            href="/shop"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Esplora tutto il catalogo →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product: any) => (
              <ProductItem key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <h3 className="text-xl font-bold text-slate-900">
                Nessun risultato trovato per &ldquo;{sanitize(q)}&rdquo;
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                Prova a cercare per marca (es. Samsung, Sony, HP, Canon) o per
                categoria.
              </p>
              <Link
                href="/shop"
                className="inline-block mt-5 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Vai al Catalogo Completo
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
