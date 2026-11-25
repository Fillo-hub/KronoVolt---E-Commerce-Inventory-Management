import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET() {
  try {
    const merchants = await prisma.merchant.findMany({
      include: { products: true },
    });
    return NextResponse.json(merchants);
  } catch (error) {
    console.error("GET /api/merchants error:", error);
    return NextResponse.json(
      { error: "Failed to fetch merchants" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const merchant = await prisma.merchant.create({
      data: {
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        address: body.address || null,
        description: body.description || null,
        status: body.status || "ACTIVE",
      },
    });
    return NextResponse.json(merchant, { status: 201 });
  } catch (error) {
    console.error("POST /api/merchants error:", error);
    return NextResponse.json(
      { error: "Failed to create merchant" },
      { status: 500 }
    );
  }
}
