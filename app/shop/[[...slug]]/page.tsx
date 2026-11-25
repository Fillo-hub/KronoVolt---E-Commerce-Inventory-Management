export const dynamic = "force-dynamic";
export const revalidate = 0;

import Breadcrumb from "@/components/Breadcrumb";
import Filters from "@/components/Filters";
import Pagination from "@/components/Pagination";
import Products from "@/components/Products";
import SortBy from "@/components/SortBy";
import React from "react";
import { sanitize } from "@/lib/sanitize";

const improveCategoryText = (text: string): string => {
  return text.indexOf("-") !== -1 ? text.split("-").join(" ") : text;
};

const ShopPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;

  const categoryTitle =
    awaitedParams?.slug && awaitedParams?.slug[0]?.length > 0
      ? sanitize(improveCategoryText(awaitedParams?.slug[0]))
      : "Catalogo Completo";

  return (
    <div className="bg-slate-50 min-h-screen py-6">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        <Breadcrumb category={categoryTitle} />

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-8 items-start">
          <Filters />

          <div>
            <div className="bg-white rounded-2xl border border-slate-200/90 px-5 py-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 capitalize">
                  {categoryTitle}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Filtra per disponibilità, fascia di prezzo o valutazione e
                  confronta fino a 4 modelli.
                </p>
              </div>
              <SortBy />
            </div>

            <Products
              params={awaitedParams}
              searchParams={awaitedSearchParams}
            />
            <Pagination />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
