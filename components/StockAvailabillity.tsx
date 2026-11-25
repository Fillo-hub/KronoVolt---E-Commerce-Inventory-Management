import React from "react";
import { FaCheck, FaXmark } from "react-icons/fa6";

const StockAvailabillity = ({
  inStock,
}: {
  stock?: number;
  inStock: number;
}) => {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Stato:
      </span>
      {inStock >= 1 ? (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <FaCheck className="text-[11px]" />
          Disponibilità Immediata
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <FaXmark className="text-[11px]" />
          Attualmente Esaurito
        </span>
      )}
    </div>
  );
};

export default StockAvailabillity;
