"use client";
import { usePaginationStore } from "@/app/_zustand/paginationStore";
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const Pagination = () => {
  const { page, incrementPage, decrementPage } = usePaginationStore();
  return (
    <div className="flex justify-center items-center gap-2 py-12">
      <button
        type="button"
        disabled={page <= 1}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-sm font-semibold text-slate-700 transition-colors cursor-pointer disabled:cursor-not-allowed shadow-2xs"
        onClick={() => decrementPage()}
      >
        <FaChevronLeft className="text-xs" />
        <span>Precedente</span>
      </button>
      <span className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-xs">
        Pagina {page}
      </span>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
        onClick={() => incrementPage()}
      >
        <span>Successiva</span>
        <FaChevronRight className="text-xs" />
      </button>
    </div>
  );
};

export default Pagination;
