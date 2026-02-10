import { db } from "@saltwise/db";
import { conversations, messages } from "@saltwise/db/schema";
import { aiLogger } from "@saltwise/logger";
import { and, asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    // Verify ownership
    const conversation = await db
      .select()
      .from(conversations)
      .where(and(eq(conversations.id, id), eq(conversations.userId, user.id)))
      .limit(1);

    if (conversation.length === 0) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Fetch messages
    const chatMessages = await db
      .select({
        id: messages.id,
        role: messages.role,
        content: messages.content,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(asc(messages.createdAt));

    // Convert Date objects to ISO strings
    const serializedMessages = chatMessages.map((msg) => ({
      ...msg,
      createdAt: msg.createdAt.toISOString(),
    }));

    return NextResponse.json(serializedMessages);
  } catch (error) {
    aiLogger.error({ err: error }, "Failed to fetch messages");
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
