import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@rewire/database";

export const dynamic = "force-dynamic";

/**
 * GET /api/conversations
 * List all conversations belonging to the authenticated user.
 */
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversations = await db.conversation.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  return NextResponse.json({ conversations });
}

/**
 * POST /api/conversations
 * Create a new conversation for the authenticated user.
 * Reuses existing empty conversation if one already exists to avoid clutter.
 */
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user already has an empty conversation (no messages yet)
  const existingEmpty = await db.conversation.findFirst({
    where: {
      userId: session.user.id,
      messages: { none: {} },
    },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        take: 1,
      },
    },
  });

  if (existingEmpty) {
    return NextResponse.json({ conversation: existingEmpty }, { status: 200 });
  }

  const conversation = await db.conversation.create({
    data: {
      userId: session.user.id,
    },
    include: {
      messages: {
        take: 1,
      },
    },
  });

  return NextResponse.json({ conversation }, { status: 201 });
}
