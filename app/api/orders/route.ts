import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
    const offset = (page - 1) * limit;

    const [orders, totalCount] = await Promise.all([
      prisma.customer_order.findMany({
        skip: offset,
        take: limit,
        orderBy: { dateTime: "desc" },
      }),
      prisma.customer_order.count(),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const corder = await prisma.customer_order.create({
      data: {
        name: String(body.name || "").trim(),
        lastname: String(body.lastname || "").trim(),
        phone: String(body.phone || "").trim(),
        email: String(body.email || "").trim().toLowerCase(),
        company: String(body.company || "").trim(),
        adress: String(body.adress || "").trim(),
        apartment: String(body.apartment || "").trim(),
        postalCode: String(body.postalCode || "").trim(),
        status: String(body.status || "processing").trim(),
        city: String(body.city || "").trim(),
        country: String(body.country || "Italia").trim(),
        orderNotice: body.orderNotice ? String(body.orderNotice).trim() : "",
        total: Math.round(Number(body.total) || 0),
        dateTime: new Date(),
      },
    });

    return NextResponse.json(
      {
        id: corder.id,
        message: "Order created successfully",
        orderNumber: corder.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
