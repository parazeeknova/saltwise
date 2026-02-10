import { db } from "@saltwise/db";
import { conversations } from "@saltwise/db/schema";
import { aiLogger } from "@saltwise/logger";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function DELETE(
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
    // Verify ownership and delete
    const deleted = await db
      .delete(conversations)
      .where(and(eq(conversations.id, id), eq(conversations.userId, user.id)))
      .returning({ id: conversations.id });

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: "Conversation not found or not owned" },
        { status: 404 }
      );
    }

    aiLogger.info(
      { conversationId: id, userId: user.id },
      "Conversation deleted"
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    aiLogger.error({ err: error }, "Failed to delete conversation");
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 }
    );
  }
}
