import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const images = await prisma.image.findMany({
      where: { productID: id },
    });
    return NextResponse.json(images || []);
  } catch (error) {
    console.error("GET /api/images/[id] error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
