import Link from "next/link";
import React from "react";
import {
  FaLaptopCode,
  FaHeadphonesSimple,
  FaCameraRetro,
  FaMobileScreenButton,
  FaArrowRight,
} from "react-icons/fa6";

const setupPresets = [
  {
    title: "Smart Working & Dev",
    badge: "Produttività",
    description:
      "Ultrabook OLED, workstation multi-core, mouse ergonomici MagSpeed e stampanti EcoTank ad alta resa.",
    href: "/shop/laptops",
    icon: FaLaptopCode,
    accent: "from-blue-600 to-indigo-600",
    lightBg: "bg-blue-50 text-blue-600",
  },
  {
    title: "Audio Hi-Fi & Studio",
    badge: "Acustica",
    description:
      "Cuffie wireless con cancellazione adattiva del rumore (ANC), auricolari Hi-Res 24-bit e speaker 360°.",
    href: "/shop/headphones",
    icon: FaHeadphonesSimple,
    accent: "from-indigo-600 to-purple-600",
    lightBg: "bg-indigo-50 text-indigo-600",
  },
  {
    title: "Creator, Foto & Video",
    badge: "Content Creation",
    description:
      "Mirrorless Full-Frame 4K 60p, stabilizzatori gimbal a 3 assi e desktop con GPU RTX 4070 Ti Super.",
    href: "/shop/cameras",
    icon: FaCameraRetro,
    accent: "from-emerald-600 to-teal-600",
    lightBg: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Mobile & Ecosystem",
    badge: "Mobilità 5G",
    description:
      "Smartphone flagship con fotocamera 200MP, tablet AMOLED con S-Pen e smartwatch in titanio.",
    href: "/shop/smart-phones",
    icon: FaMobileScreenButton,
    accent: "from-amber-500 to-orange-600",
    lightBg: "bg-amber-50 text-amber-600",
  },
];

const IntroducingSection = () => {
  return (
    <section className="py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Guida alla Scelta Rapida
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Scegli la configurazione in base al tuo utilizzo
            </h2>
          </div>
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            <span>Indeciso? Usa il comparatore tecnico</span>
            <FaArrowRight className="text-xs" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {setupPresets.map((preset) => {
            const Icon = preset.icon;
            return (
              <Link
                key={preset.title}
                href={preset.href}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white p-6 shadow-2xs hover:shadow-lg hover:border-blue-500/40 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${preset.lightBg} flex items-center justify-center text-xl`}
                    >
                      <Icon />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-200/70 text-slate-700">
                      {preset.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {preset.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {preset.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>Esplora dispositivi</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default IntroducingSection;
