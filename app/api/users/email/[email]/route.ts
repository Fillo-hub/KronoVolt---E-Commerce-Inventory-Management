import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const { email } = await params;
    const decodedEmail = decodeURIComponent(email);
    const user = await prisma.user.findUnique({
      where: { email: decodedEmail },
      select: { id: true, email: true, role: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/users/email/[email] error:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
