import React from "react";
import CategoryItem from "./CategoryItem";
import Image from "next/image";
import { categoryMenuList } from "@/lib/utils";
import Heading from "./Heading";

const CategoryMenu = () => {
  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200/70">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        <Heading
          title="Esplora per Categoria"
          subtitle="Accedi rapidamente a tutte le linee di prodotto con disponibilità aggiornata in tempo reale."
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categoryMenuList.map((item) => (
            <CategoryItem title={item.title} key={item.id} href={item.href}>
              <Image
                src={item.src}
                width={40}
                height={40}
                alt={item.title}
                className="w-9 h-9 object-contain"
              />
            </CategoryItem>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryMenu;
