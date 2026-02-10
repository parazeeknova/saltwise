import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useUser() {
  const query = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
    staleTime: Number.POSITIVE_INFINITY,
  });

  return {
    user: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
  };
}
