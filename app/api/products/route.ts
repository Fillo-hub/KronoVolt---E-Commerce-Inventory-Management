import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode") || "";

    if (mode === "admin") {
      const products = await prisma.product.findMany({
        include: { category: { select: { name: true } } },
      });
      return NextResponse.json(products);
    }

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const maxPrice = Number(searchParams.get("filters[price][$lte]")) || 3000;
    const minRating = Number(searchParams.get("filters[rating][$gte]")) || 0;
    const category = searchParams.get("filters[category][$equals]");
    const sort = searchParams.get("sort") || "defaultSort";

    let orderBy: any = undefined;
    if (sort === "titleAsc") orderBy = { title: "asc" };
    else if (sort === "titleDesc") orderBy = { title: "desc" };
    else if (sort === "lowPrice") orderBy = { price: "asc" };
    else if (sort === "highPrice") orderBy = { price: "desc" };

    const products = await prisma.product.findMany({
      skip: (page - 1) * 12,
      take: 12,
      where: {
        price: { lte: maxPrice },
        rating: { gte: minRating },
        ...(category
          ? { category: { name: { equals: category, mode: "insensitive" } } }
          : {}),
      },
      include: { category: { select: { name: true } } },
      ...(orderBy ? { orderBy } : {}),
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      merchantId,
      slug,
      title,
      mainImage,
      price,
      description,
      manufacturer,
      categoryId,
      inStock,
    } = body;

    if (!title || !slug || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields: title, slug, categoryId" },
        { status: 400 }
      );
    }

    let resolvedMerchantId = merchantId;
    if (!resolvedMerchantId) {
      const firstMerchant = await prisma.merchant.findFirst();
      resolvedMerchantId = firstMerchant?.id || "1";
    }

    const product = await prisma.product.create({
      data: {
        merchantId: resolvedMerchantId,
        slug,
        title,
        mainImage: mainImage || "product1.webp",
        price: Math.round(Number(price) || 0),
        rating: 5,
        description: description || "",
        manufacturer: manufacturer || "KronoVolt",
        categoryId,
        inStock: Number(inStock) > 0 ? 1 : 0,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
