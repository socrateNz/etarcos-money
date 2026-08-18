import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiQueries, QUERY_KEYS } from "@/queries";

export function useAi() {
  const queryClient = useQueryClient();

  const { data: history, isLoading: isHistoryLoading } = useQuery({
    queryKey: QUERY_KEYS.ai.history,
    queryFn: aiQueries.getHistory,
  });

  const chatMutation = useMutation({
    mutationFn: aiQueries.chat,
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
