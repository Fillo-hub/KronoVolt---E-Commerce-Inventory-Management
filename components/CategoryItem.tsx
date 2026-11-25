import Link from "next/link";
import React, { type ReactNode } from "react";

interface CategoryItemProps {
  children: ReactNode;
  title: string;
  href: string;
}

const CategoryItem = ({ title, children, href }: CategoryItemProps) => {
  return (
    <Link href={href} className="group block">
      <div className="flex flex-col items-center justify-center gap-y-3 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-500/40 hover:-translate-y-0.5 transition-all duration-200">
        <div className="w-14 h-14 rounded-xl bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
          {children}
        </div>
        <h3 className="font-semibold text-sm sm:text-base text-slate-800 group-hover:text-blue-600 transition-colors text-center">
          {title}
        </h3>
      </div>
    </Link>
  );
};

export default CategoryItem;
