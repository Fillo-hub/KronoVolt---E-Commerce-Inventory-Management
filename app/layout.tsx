import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/utils/SessionProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/Providers";
import SessionTimeoutWrapper from "@/components/SessionTimeoutWrapper";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "KronoVolt — High-Performance Tech & Hardware E-Commerce",
  description:
    "Piattaforma e-commerce ad alte prestazioni per elettronica di consumo, workstation, fotografia, audio Hi-Fi e comparazione tecnica.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" data-theme="light" className="scroll-smooth">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white`}
      >
        <SessionProvider>
          <SessionTimeoutWrapper />
          <Header />
          <Providers>
            <main className="flex-1">{children}</main>
          </Providers>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
