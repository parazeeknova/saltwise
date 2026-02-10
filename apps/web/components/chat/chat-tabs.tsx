"use client";

import { DialogClose } from "@saltwise/ui/components/dialog";
import { ScrollArea } from "@saltwise/ui/components/scroll-area";
import { cn } from "@saltwise/ui/lib/utils";
import { format } from "date-fns";
import { PlusIcon, XIcon } from "lucide-react";
import { useConversations, useDeleteConversation } from "@/hooks/use-ai-chat";
import { useChatStore } from "@/hooks/use-chat-store";

export function ChatTabs() {
  const { data: conversations, isLoading } = useConversations();
  const { activeConversationId, setActiveConversation, startNewChat } =
    useChatStore();
  const { mutate: deleteConversation, isPending: isDeleting } =
    useDeleteConversation();

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // biome-ignore lint/suspicious/noAlert: simple confirmation
    if (confirm("Are you sure you want to delete this conversation?")) {
      deleteConversation(id, {
        onSuccess: () => {
          if (activeConversationId === id) {
            startNewChat();
          }
        },
      });
    }
  };

  return (
    <div className="flex w-full items-center border-border/40 border-b bg-muted/10 px-2 pt-2 backdrop-blur-xl">
      <ScrollArea className="no-scrollbar w-full whitespace-nowrap">
        <div className="-mb-px flex items-center gap-1.5">
          {(() => {
            if (isLoading) {
              return (
                <div className="flex gap-2">
                  {[1, 2, 3].map((id) => (
                    <div
                      className="h-9 w-32 animate-pulse rounded-t-lg bg-muted/20"
                      key={id}
                    />
                  ))}
                </div>
              );
            }

            const chatList = conversations || [];

            return (
              <>
                {chatList.map((chat) => (
                  <div className="group relative" key={chat.id}>
                    <button
                      className={cn(
                        "relative flex h-9 min-w-35 max-w-50 items-center gap-2 rounded-t-lg border-x border-t px-3 font-medium text-xs transition-all",
                        activeConversationId === chat.id
                          ? "z-10 border-emerald-500/30 bg-background text-foreground shadow-sm ring-1 ring-b-0 ring-emerald-500/5 ring-inset"
                          : "border-emerald-500/10 bg-transparent text-muted-foreground hover:border-emerald-500/20 hover:bg-emerald-500/5 hover:text-foreground"
                      )}
                      onClick={() => setActiveConversation(chat.id)}
                      type="button"
                    >
                      <div className="flex w-full flex-col items-start gap-0.5 overflow-hidden text-left">
                        <span className="w-full truncate pr-4">
                          {chat.title || "New Conversation"}
                        </span>
                        <span className="text-[0.6rem] text-muted-foreground/50 opacity-80">
                          {format(new Date(chat.createdAt), "MMM d, h:mm a")}
                        </span>
                      </div>
                    </button>

                    {/* Delete Button - only visible on hover */}
                    <button
                      className={cn(
                        "absolute top-1/2 right-1.5 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100",
                        isDeleting && "cursor-not-allowed opacity-50"
                      )}
                      disabled={isDeleting}
                      onClick={(e) => handleDelete(e, chat.id)}
                      type="button"
                    >
                      <XIcon className="size-3" />
                    </button>
                  </div>
                ))}

                {/* New Chat Button */}
                <button
                  className="flex size-8 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-all hover:bg-white/40 hover:text-foreground dark:hover:bg-white/5"
                  onClick={() => startNewChat()}
                  title="New Chat"
                  type="button"
                >
                  <PlusIcon className="size-4" />
                </button>
              </>
            );
          })()}
        </div>
      </ScrollArea>

      {/* Dialog Close Button - Rightmost */}
      <div className="ml-2 flex items-center border-border/20 border-l pb-2 pl-2">
        <DialogClose className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive">
          <XIcon className="size-4" />
        </DialogClose>
      </div>
    </div>
  );
}
