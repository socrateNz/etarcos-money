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

  const applyMutation = useMutation({
    mutationFn: subscriptionQueries.apply,
    onSuccess: () => {
      // A transaction was created and an account balance changed, so refresh everything downstream too.
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subscriptions });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
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
    applySubscription: applyMutation.mutateAsync,
    isApplying: applyMutation.isPending,
    applyingId: applyMutation.variables,
  };
}
