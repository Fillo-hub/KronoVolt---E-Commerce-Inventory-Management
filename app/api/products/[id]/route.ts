import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(body.merchantId !== undefined ? { merchantId: body.merchantId } : {}),
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.mainImage !== undefined ? { mainImage: body.mainImage } : {}),
        ...(body.slug !== undefined ? { slug: body.slug } : {}),
        ...(body.price !== undefined ? { price: Math.round(Number(body.price)) } : {}),
        ...(body.rating !== undefined ? { rating: Number(body.rating) } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.manufacturer !== undefined ? { manufacturer: body.manufacturer } : {}),
        ...(body.categoryId !== undefined ? { categoryId: body.categoryId } : {}),
        ...(body.inStock !== undefined ? { inStock: Number(body.inStock) } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PUT /api/products/[id] error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const related = await prisma.customer_order_product.findFirst({
      where: { productId: id },
    });

    if (related) {
      return NextResponse.json(
        { error: "Cannot delete product referenced by existing orders" },
        { status: 400 }
      );
    }

    await prisma.product.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
