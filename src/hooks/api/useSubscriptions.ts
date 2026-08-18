import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionQueries, QUERY_KEYS } from "@/queries";

export function useSubscriptions() {
  const queryClient = useQueryClient();

  const { data: subscriptions, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.subscriptions,
    queryFn: subscriptionQueries.getAll,
  });

  const createMutation = useMutation({
    mutationFn: subscriptionQueries.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subscriptions });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: subscriptionQueries.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subscriptions });
    },
  });

  return {
    subscriptions,
    isLoading,
    error,
    createSubscription: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteSubscription: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
