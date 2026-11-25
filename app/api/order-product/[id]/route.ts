import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const items = await prisma.customer_order_product.findMany({
      where: { customerOrderId: id },
      include: { product: true },
    });
    return NextResponse.json(items || []);
  } catch (error) {
    console.error("GET /api/order-product/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order items" },
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
    await prisma.customer_order_product.deleteMany({
      where: { customerOrderId: id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/order-product/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete order items" },
      { status: 500 }
    );
  }
}
