import React from "react";

const SectionTitle = ({ title, path }: { title: string; path: string }) => {
  return (
    <div className="bg-slate-950 text-white border-b border-slate-800 py-10 px-4">
      <div className="max-w-screen-2xl mx-auto px-2 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-1.5">
          {path}
        </p>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default SectionTitle;
