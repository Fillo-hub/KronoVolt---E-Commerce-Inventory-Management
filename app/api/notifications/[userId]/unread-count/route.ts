import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false },
    });
    return NextResponse.json({ unreadCount });
  } catch (error) {
    console.error("GET /api/notifications/[userId]/unread-count error:", error);
    return NextResponse.json({ unreadCount: 0 });
  }
}
