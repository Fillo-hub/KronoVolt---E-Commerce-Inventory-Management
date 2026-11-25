"use client";
import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSortStore } from "@/app/_zustand/sortStore";
import { usePaginationStore } from "@/app/_zustand/paginationStore";
import Link from "next/link";
import { FaRotateLeft, FaSliders, FaStar } from "react-icons/fa6";

interface InputCategory {
  inStock: { text: string; isChecked: boolean };
  outOfStock: { text: string; isChecked: boolean };
  priceFilter: { text: string; value: number };
  ratingFilter: { text: string; value: number };
}

const quickCategories = [
  { label: "Tutti i Prodotti", href: "/shop" },
  { label: "Smartphone 5G", href: "/shop/smart-phones" },
  { label: "Laptop & Ultrabook", href: "/shop/laptops" },
  { label: "Workstation & PC", href: "/shop/computers" },
  { label: "Cuffie & Audio", href: "/shop/headphones" },
  { label: "Auricolari", href: "/shop/earbuds" },
  { label: "Smartwatch", href: "/shop/watches" },
  { label: "Tablet", href: "/shop/tablets" },
  { label: "Fotocamere", href: "/shop/cameras" },
  { label: "Mouse & Accessori", href: "/shop/mouses" },
  { label: "Stampanti", href: "/shop/printers" },
];

const Filters = () => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const { page } = usePaginationStore();
  const { sortBy } = useSortStore();
  const isFirstRender = useRef(true);

  const [inputCategory, setInputCategory] = useState<InputCategory>({
    inStock: { text: "instock", isChecked: true },
    outOfStock: { text: "outofstock", isChecked: true },
    priceFilter: { text: "price", value: 3000 },
    ratingFilter: { text: "rating", value: 0 },
  });

  // Debounced URL update to avoid lag while dragging sliders and skip initial duplicate SSR request
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      params.set("outOfStock", inputCategory.outOfStock.isChecked.toString());
      params.set("inStock", inputCategory.inStock.isChecked.toString());
      params.set("rating", inputCategory.ratingFilter.value.toString());
      params.set("price", inputCategory.priceFilter.value.toString());
      params.set("sort", sortBy);
      params.set("page", page.toString());
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 220);

    return () => clearTimeout(timer);
  }, [inputCategory, sortBy, page, pathname, replace]);

  const handleReset = () => {
    setInputCategory({
      inStock: { text: "instock", isChecked: true },
      outOfStock: { text: "outofstock", isChecked: true },
      priceFilter: { text: "price", value: 3000 },
      ratingFilter: { text: "rating", value: 0 },
    });
  };

  return (
    <aside className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs h-fit space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <FaSliders className="text-blue-600 text-sm" />
          <span>Filtri Catalogo</span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <FaRotateLeft className="text-[10px]" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category quick nav */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          Reparti
        </h4>
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1">
          {quickCategories.map((cat) => {
            const active = pathname === cat.href;
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  active
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div className="border-t border-slate-100 pt-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Disponibilità
        </h4>
        <div className="space-y-2.5">
          <label className="cursor-pointer flex items-center gap-2.5 text-sm text-slate-700 hover:text-slate-900">
            <input
              type="checkbox"
              checked={inputCategory.inStock.isChecked}
              onChange={() =>
                setInputCategory({
                  ...inputCategory,
                  inStock: {
                    text: "instock",
                    isChecked: !inputCategory.inStock.isChecked,
                  },
                })
              }
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium">Disponibili subito</span>
          </label>

          <label className="cursor-pointer flex items-center gap-2.5 text-sm text-slate-700 hover:text-slate-900">
            <input
              type="checkbox"
              checked={inputCategory.outOfStock.isChecked}
              onChange={() =>
                setInputCategory({
                  ...inputCategory,
                  outOfStock: {
                    text: "outofstock",
                    isChecked: !inputCategory.outOfStock.isChecked,
                  },
                })
              }
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium">In riassortimento</span>
          </label>
        </div>
      </div>

      {/* Max Price */}
      <div className="border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Prezzo Massimo
          </h4>
          <span className="text-sm font-extrabold text-blue-600">
            €{inputCategory.priceFilter.value}
          </span>
        </div>
        <input
          type="range"
          min={50}
          max={3000}
          step={50}
          value={inputCategory.priceFilter.value}
          className="w-full accent-blue-600 cursor-pointer"
          onChange={(e) =>
            setInputCategory({
              ...inputCategory,
              priceFilter: {
                text: "price",
                value: Number(e.target.value),
              },
            })
          }
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>€50</span>
          <span>€1500</span>
          <span>€3000</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Valutazione Minima
          </h4>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500">
            <FaStar />
            {inputCategory.ratingFilter.value}+
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={5}
          step={1}
          value={inputCategory.ratingFilter.value}
          onChange={(e) =>
            setInputCategory({
              ...inputCategory,
              ratingFilter: { text: "rating", value: Number(e.target.value) },
            })
          }
          className="w-full accent-amber-500 cursor-pointer"
        />
        <div className="w-full flex justify-between text-[11px] text-slate-400 mt-1 px-0.5">
          <span>Tutti</span>
          <span>1★</span>
          <span>2★</span>
          <span>3★</span>
          <span>4★</span>
          <span>5★</span>
        </div>
      </div>
    </aside>
  );
};

export default Filters;
