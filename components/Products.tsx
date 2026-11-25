import React from "react";
import ProductItem from "./ProductItem";
import prisma from "@/utils/db";
import Link from "next/link";

const Products = async ({
  params,
  searchParams,
}: {
  params: { slug?: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const inStockChecked =
    searchParams?.inStock === undefined ? true : searchParams.inStock === "true";
  const outOfStockChecked =
    searchParams?.outOfStock === undefined
      ? true
      : searchParams.outOfStock === "true";
  const page = Math.max(1, Number(searchParams?.page) || 1);
  const maxPrice = Number(searchParams?.price) || 3000;
  const minRating = Number(searchParams?.rating) || 0;
  const sortByValue = String(searchParams?.sort || "defaultSort");
  const categorySlug =
    params?.slug && params.slug.length > 0 ? params.slug[0] : null;

  let stockFilter: any = { lte: 1 };
  if (inStockChecked && !outOfStockChecked) stockFilter = { gte: 1 };
  else if (!inStockChecked && outOfStockChecked) stockFilter = { lt: 1 };
  else if (!inStockChecked && !outOfStockChecked) stockFilter = { lt: 0 };

  let orderBy: any = undefined;
  if (sortByValue === "titleAsc") orderBy = { title: "asc" };
  else if (sortByValue === "titleDesc") orderBy = { title: "desc" };
  else if (sortByValue === "lowPrice") orderBy = { price: "asc" };
  else if (sortByValue === "highPrice") orderBy = { price: "desc" };

  let products: any[] = [];

  try {
    products = await prisma.product.findMany({
      skip: (page - 1) * 12,
      take: 12,
      where: {
        price: { lte: maxPrice },
        rating: { gte: minRating },
        inStock: stockFilter,
        ...(categorySlug
          ? {
              category: {
                name: { equals: categorySlug, mode: "insensitive" },
              },
            }
          : {}),
      },
      include: {
        category: {
          select: { name: true },
        },
      },
      ...(orderBy ? { orderBy } : {}),
    });
  } catch (error) {
    console.error("Error fetching products from Prisma:", error);
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
