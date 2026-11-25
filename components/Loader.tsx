import React from "react";

export const Loader = () => {
  return (
    <div className="flex items-center justify-center h-[100px]">
      <div className="w-8 h-8 rounded-full border-3 border-slate-200 border-t-blue-600 animate-spin" />
    </div>
  );
};
