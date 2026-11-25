"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { sanitize } from "@/lib/sanitize";
import { FaMagnifyingGlass } from "react-icons/fa6";

const SearchInput = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const router = useRouter();

  const searchProducts = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (!trimmed) {
      router.push("/shop");
      return;
    }
    const sanitizedSearch = sanitize(trimmed);
    router.push(`/search?search=${encodeURIComponent(sanitizedSearch)}`);
  };

  return (
    <form className="relative flex w-full items-center" onSubmit={searchProducts}>
      <div className="relative w-full">
        <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Cerca smartphone, laptop OLED, Sony, RTX..."
          className="w-full pl-10 pr-24 py-2.5 text-sm bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200/90 focus:border-blue-600 focus:ring-3 focus:ring-blue-500/15 outline-none transition-all"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
        >
          Cerca
        </button>
      </div>
    </form>
  );
};

export default SearchInput;
