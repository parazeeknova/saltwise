"use client";

// biome-ignore lint/performance/noNamespaceImport: skip
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@saltwise/ui/components/dialog";
import { ChatInterface } from "@/components/chat/chat-interface";
import { ChatTabs } from "@/components/chat/chat-tabs";
import { useChatStore } from "@/hooks/use-chat-store";

export function ChatDialog() {
  const { isOpen, setOpen } = useChatStore();

  return (
    <Dialog onOpenChange={setOpen} open={isOpen}>
      <DialogContent
        className="flex h-[85vh] w-[90vw] max-w-5xl flex-col gap-0 overflow-hidden border-2 border-emerald-500/20 p-0 sm:rounded-2xl"
        showCloseButton={false}
      >
        <VisuallyHidden.Root>
          <DialogTitle>Salty Chat Assistant</DialogTitle>
        </VisuallyHidden.Root>

        <div className="flex-none">
          <ChatTabs />
        </div>

        <div className="flex min-h-0 flex-1 flex-col bg-background">
          <ChatInterface />
        </div>
      </DialogContent>
    </Dialog>
  );
}
