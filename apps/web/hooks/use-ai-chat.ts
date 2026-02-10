import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export function useConversations() {
  const { user } = useUser();

  return useQuery({
    queryKey: ["conversations", user?.id],
    queryFn: async () => {
      const res = await fetch("/api/ai/conversations");
      if (!res.ok) {
        throw new Error("Failed to fetch conversations");
      }
      return res.json() as Promise<Conversation[]>;
    },
    enabled: !!user,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useChatMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!conversationId) {
        return [];
      }
      const res = await fetch(
        `/api/ai/conversations/${conversationId}/messages`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch messages");
      }
      return res.json() as Promise<Message[]>;
    },
    enabled: !!conversationId,
    staleTime: Number.POSITIVE_INFINITY, // Messages are immutable, so we can cache them indefinitely (unless cleared)
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      const res = await fetch(`/api/ai/conversations/${conversationId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete conversation");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
