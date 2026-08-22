import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiQueries, QUERY_KEYS } from "@/queries";

export function useAi() {
  const queryClient = useQueryClient();

  const { data: history, isLoading: isHistoryLoading } = useQuery({
    queryKey: QUERY_KEYS.ai.history,
    queryFn: aiQueries.getHistory,
  });

  const chatMutation = useMutation({
    mutationFn: (message: string) => {
      // The AI assistant is explicitly excluded from the app's offline
      // support: a message queued while offline and replayed hours later,
      // out of context, would be more confusing than just failing now.
      if (!navigator.onLine) {
        return Promise.reject(new Error("L'assistant IA nécessite une connexion internet."));
      }
      return aiQueries.chat(message);
    },
    // Attempt immediately and fail fast instead of the app-wide default of
    // pausing until back online (see providers/query-provider.tsx).
    networkMode: "always",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ai.history });
    },
  });

  return {
    history,
    isHistoryLoading,
    sendMessage: chatMutation.mutateAsync,
    isSending: chatMutation.isPending,
  };
}
