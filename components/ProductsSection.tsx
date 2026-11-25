import React from "react";
import ProductItem from "./ProductItem";
import Heading from "./Heading";
import prisma from "@/utils/db";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

const ProductsSection = async () => {
  let products: any[] = [];

  try {
    products = await prisma.product.findMany({
      take: 12,
      include: {
        category: {
          select: { name: true },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching products from Prisma:", error);
    products = [];
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        <Heading
          title="Prodotti in Evidenza"
          subtitle="Selezionati per prestazioni, affidabilità e rapporto qualità/prezzo. Aggiungi al carrello o confronta le schede tecniche."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product: any) => (
              <ProductItem key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center text-slate-500 py-12 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-base font-medium">
                Nessun prodotto disponibile al momento nel database.
              </p>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            <span>Vedi Tutto il Catalogo e Filtri Avanzati</span>
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
