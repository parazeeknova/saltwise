"use client";

import { HistoryIcon } from "lucide-react";
import { useConversations } from "@/hooks/use-ai-chat";
import { useChatStore } from "@/hooks/use-chat-store";

export function RecentChats() {
  const { data: conversations, isLoading } = useConversations();
  const { setActiveConversation, setOpen } = useChatStore();

  const handleOpenChat = (id: string) => {
    setActiveConversation(id);
    setOpen(true);
  };

  // Only show the 3 most recent
  const recentConversations = conversations?.slice(0, 3);

  if (isLoading || !recentConversations || recentConversations.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="flex items-center gap-1.5 text-muted-foreground/60 text-xs">
        <HistoryIcon className="size-3" />
        Jump back in
      </span>
      {recentConversations.map((chat, i) => (
        <button
          className="group/pill fade-in slide-in-from-bottom-2 inline-flex animate-in items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 fill-mode-forwards px-3 py-1 font-medium text-primary text-xs shadow-sm backdrop-blur-sm transition-all duration-500 hover:border-primary/40 hover:bg-primary/10 hover:shadow-md active:scale-95"
          key={chat.id}
          onClick={() => handleOpenChat(chat.id)}
          style={{ animationDelay: `${i * 100}ms` }}
          type="button"
        >
          <span className="max-w-[150px] truncate">
            {chat.title || "New Conversation"}
          </span>
        </button>
      ))}
    </div>
  );
}
