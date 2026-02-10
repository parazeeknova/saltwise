import { create } from "zustand";

interface ChatState {
  isOpen: boolean;
  activeConversationId: string | null;
  initialMessage: string | null;
  setOpen: (isOpen: boolean) => void;
  setActiveConversation: (id: string | null) => void;
  setInitialMessage: (message: string | null) => void;
  startNewChat: (initialMessage?: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  activeConversationId: null,
  initialMessage: null,
  setOpen: (isOpen) => set({ isOpen }),
  setActiveConversation: (id) => set({ activeConversationId: id }),
  setInitialMessage: (message) => set({ initialMessage: message }),
  startNewChat: (initialMessage) =>
    set({
      activeConversationId: null,
      initialMessage: initialMessage ?? null,
      isOpen: true,
    }),
}));
