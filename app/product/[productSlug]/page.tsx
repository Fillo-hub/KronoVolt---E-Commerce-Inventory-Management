import StockAvailabillity from "@/components/StockAvailabillity";
import ProductTabs from "@/components/ProductTabs";
import SingleProductDynamicFields from "@/components/SingleProductDynamicFields";
import apiClient from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import {
  FaChevronRight,
  FaHouse,
  FaShieldHalved,
  FaStar,
  FaTruckFast,
  FaRotateLeft,
} from "react-icons/fa6";
import { sanitize } from "@/lib/sanitize";

interface ImageItem {
  imageID: string;
  productID: string;
  image: string;
}

interface SingleProductPageProps {
  params: Promise<{ productSlug: string }>;
}

const SingleProductPage = async ({ params }: SingleProductPageProps) => {
  const paramsAwaited = await params;

  const data = await apiClient.get(`/api/slugs/${paramsAwaited?.productSlug}`);
  if (!data.ok) {
    notFound();
  }
  const product = await data.json();

  if (!product || product.error) {
    notFound();
  }

  let images: ImageItem[] = [];
  if (product.id) {
    try {
      const imagesData = await apiClient.get(`/api/images/${product.id}`);
      if (imagesData.ok) {
        const parsed = await imagesData.json();
        images = Array.isArray(parsed) ? parsed : [];
      }
    } catch {
      images = [];
    }
  }

  const rating = Math.min(5, Math.max(1, Number(product?.rating) || 5));

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Breadcrumb */}
        <nav className="mb-6 text-xs sm:text-sm text-slate-500 flex items-center gap-2 flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 hover:text-blue-600 font-medium"
          >
            <FaHouse className="text-xs" />
            <span>Home</span>
          </Link>
          <FaChevronRight className="text-[10px] text-slate-400" />
          <Link href="/shop" className="hover:text-blue-600 font-medium">
            Catalogo
          </Link>
          {product?.category?.name && (
            <>
              <FaChevronRight className="text-[10px] text-slate-400" />
              <Link
                href={`/shop/${product.category.name}`}
                className="hover:text-blue-600 font-medium capitalize"
              >
                {product.category.name.replace(/-/g, " ")}
              </Link>
            </>
          )}
          <FaChevronRight className="text-[10px] text-slate-400" />
          <span className="font-semibold text-slate-900 truncate max-w-xs">
            {sanitize(product?.title)}
          </span>
        </nav>

        {/* Main Product Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Image Gallery */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full aspect-square max-w-md rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-8">
              <Image
                src={
                  product?.mainImage
                    ? `/${product?.mainImage}`
                    : "/product_placeholder.jpg"
                }
                width={420}
                height={420}
                priority
                alt={sanitize(product?.title) || "Product image"}
                className="max-h-80 w-auto object-contain"
              />
            </div>

            {images.length > 0 && (
              <div className="flex justify-center mt-4 flex-wrap gap-2.5">
                {images.map((imageItem: ImageItem, key: number) => (
                  <div
                    key={imageItem.imageID + key}
                    className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center"
                  >
                    <Image
                      src={`/${imageItem.image}`}
                      width={72}
                      height={72}
                      alt="Product view"
                      className="max-h-16 w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Details */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/60">
                  {sanitize(product?.manufacturer) || "KronoVolt"}
                </span>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <FaStar
                      key={idx}
                      className={`text-sm ${
                        idx < rating ? "text-amber-400" : "text-slate-200"
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-slate-600 ml-1">
                    {rating}.0 / 5.0
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {sanitize(product?.title)}
              </h1>

              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                {sanitize(product?.description)}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 font-medium block">
                  Prezzo finale (IVA 22% inclusa)
                </span>
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  €{product?.price}
                </span>
              </div>
              <StockAvailabillity stock={94} inStock={product?.inStock} />
            </div>

            <SingleProductDynamicFields product={product} />

            {/* Guarantees */}
            <div className="pt-5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <FaTruckFast className="text-blue-600 text-base shrink-0" />
                <span>Spedizione Express 24/48h</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FaShieldHalved className="text-emerald-600 text-base shrink-0" />
                <span>Garanzia Ufficiale 24 Mesi</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FaRotateLeft className="text-indigo-600 text-base shrink-0" />
                <span>Reso Gratuito entro 30 giorni</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specs Tabs */}
        <div className="mt-8">
          <ProductTabs product={product} />
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
