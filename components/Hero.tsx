import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  FaArrowRight,
  FaBolt,
  FaCheck,
  FaScaleBalanced,
  FaShieldHalved,
  FaTruckFast,
} from "react-icons/fa6";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white border-b border-slate-800">
      {/* Subtle radial glow background */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-blue-600/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-0 w-[520px] h-[520px] rounded-full bg-indigo-600/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-6">
              <FaBolt className="text-amber-400" />
              <span>Flagship Collection 2026 • Prestazioni Certificate</span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Tecnologia progettata per{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
                chi crea e lavora.
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Scopri workstation ad alte prestazioni, smartphone in titanio,
              fotocamere Full-Frame e audio Hi-Fi con cancellazione del rumore.
              Confronta le specifiche tecniche fianco a fianco e scegli il
              dispositivo perfetto per il tuo setup.
            </p>

            {/* Primary CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm sm:text-base shadow-lg shadow-blue-600/25 transition-all"
              >
                <span>Esplora il Catalogo</span>
                <FaArrowRight className="text-xs" />
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-sm sm:text-base transition-all"
              >
                <FaScaleBalanced className="text-blue-400" />
                <span>Confronta Specifiche</span>
              </Link>
              <Link
                href="/product/smart-watch-demo"
                className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                Scopri Galaxy Watch Ultra →
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-10 pt-8 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <FaTruckFast />
                </div>
                <div>
                  <p className="font-semibold text-white">Consegna Express</p>
                  <p className="text-slate-400">24/48h tracciata in tutta Italia</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <FaShieldHalved />
                </div>
                <div>
                  <p className="font-semibold text-white">Garanzia 24 Mesi</p>
                  <p className="text-slate-400">Assistenza ufficiale certificata</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                  <FaCheck />
                </div>
                <div>
                  <p className="font-semibold text-white">Comparatore Tecnico</p>
                  <p className="text-slate-400">Analisi rapporto qualità/prezzo</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Product Showcase Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  In Evidenza
                </span>
                <span className="text-xs font-semibold text-slate-400">
                   Titanio Grado 4 • Dual GPS
                </span>
              </div>

              <div className="relative flex items-center justify-center py-4">
                <Image
                  src="/watch-for-banner.png"
                  width={300}
                  height={300}
                  priority
                  alt="Galaxy Watch Ultra 47mm LTE Titanium"
                  className="w-60 h-60 sm:w-72 sm:h-72 object-contain drop-shadow-[0_20px_35px_rgba(59,130,246,0.35)] hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                    Samsung Wearable
                  </p>
                  <h2 className="text-lg font-bold text-white">
                    Galaxy Watch Ultra 47mm LTE
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    100h autonomia • Vetro Zaffiro • 10 ATM
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-black text-white">€589</p>
                  <Link
                    href="/product/smart-watch-demo"
                    className="inline-block mt-1 text-xs font-semibold text-blue-400 hover:text-blue-300"
                  >
                    Dettagli →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
