import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET() {
  try {
    const productOrders = await prisma.customer_order_product.findMany({
      include: { product: true, customerOrder: true },
    });
    return NextResponse.json(productOrders);
  } catch (error) {
    console.error("GET /api/order-product error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { customerOrderId, productId, quantity } = await request.json();
    const orderProduct = await prisma.customer_order_product.create({
      data: {
        customerOrderId,
        productId,
        quantity: Math.max(1, parseInt(quantity, 10) || 1),
      },
    });
    return NextResponse.json(orderProduct, { status: 201 });
  } catch (error) {
    console.error("POST /api/order-product error:", error);
    return NextResponse.json(
      { error: "Failed to create order product" },
      { status: 500 }
    );
  }
}
