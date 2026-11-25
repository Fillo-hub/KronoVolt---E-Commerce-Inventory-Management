"use client";
import React from "react";
import { useSortStore } from "@/app/_zustand/sortStore";

const SortBy = () => {
  const { sortBy, changeSortBy } = useSortStore();

  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="sort-select"
        className="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap"
      >
        Ordina per:
      </label>
      <select
        id="sort-select"
        defaultValue={sortBy}
        onChange={(e) => changeSortBy(e.target.value)}
        className="py-2 px-3 text-sm font-medium rounded-xl border border-slate-200 bg-white text-slate-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/15 outline-none cursor-pointer shadow-2xs"
        name="sort"
      >
        <option value="defaultSort">Consigliati</option>
        <option value="lowPrice">Prezzo: crescente</option>
        <option value="highPrice">Prezzo: decrescente</option>
        <option value="titleAsc">Nome: A - Z</option>
        <option value="titleDesc">Nome: Z - A</option>
      </select>
    </div>
  );
};

export default SortBy;
