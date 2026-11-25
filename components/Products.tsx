import React from "react";
import ProductItem from "./ProductItem";
import apiClient from "@/lib/api";
import Link from "next/link";

const Products = async ({
  params,
  searchParams,
}: {
  params: { slug?: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const inStockNum =
    searchParams?.inStock === undefined
      ? 1
      : searchParams?.inStock === "true"
      ? 1
      : 0;
  const outOfStockNum =
    searchParams?.outOfStock === undefined
      ? 1
      : searchParams?.outOfStock === "true"
      ? 1
      : 0;
  const page = searchParams?.page ? Number(searchParams?.page) : 1;

  let stockMode: string = "lte";
  if (inStockNum === 1) stockMode = "equals";
  if (outOfStockNum === 1) stockMode = "lt";
  if (inStockNum === 1 && outOfStockNum === 1) stockMode = "lte";
  if (inStockNum === 0 && outOfStockNum === 0) stockMode = "gt";

  let products: any[] = [];

  try {
    const data = await apiClient.get(
      `/api/products?filters[price][$lte]=${
        searchParams?.price || 3000
      }&filters[rating][$gte]=${
        Number(searchParams?.rating) || 0
      }&filters[inStock][$${stockMode}]=1&${
        params?.slug && params.slug.length > 0
          ? `filters[category][$equals]=${params.slug[0]}&`
          : ""
      }sort=${searchParams?.sort || "defaultSort"}&page=${page}`
    );

    if (data.ok) {
      const result = await data.json();
      products = Array.isArray(result) ? result : [];
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    products = [];
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.length > 0 ? (
        products.map((product: any) => (
          <ProductItem key={product.id} product={product} />
        ))
      ) : (
        <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <h3 className="text-lg font-bold text-slate-900">
            Nessun prodotto trovato con i filtri selezionati
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Prova ad aumentare il budget massimo o esplora un altro reparto.
          </p>
          <Link
            href="/shop"
            className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            Mostra tutti i prodotti
          </Link>
        </div>
      )}
    </div>
  );
};

export default Products;
