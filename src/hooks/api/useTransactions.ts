import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionQueries, QUERY_KEYS } from "@/queries";

export function useTransactions() {
  const queryClient = useQueryClient();

  // Fetch transactions
  const { data: transactions, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.transactions.all,
    queryFn: transactionQueries.getAll,
  });

  // Delete transaction
  const deleteMutation = useMutation({
    mutationFn: transactionQueries.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    },
  });

  // Create transaction
  const createMutation = useMutation({
    mutationFn: transactionQueries.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    },
  });

  return {
    transactions,
    isLoading,
    error,
    createTransaction: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteTransaction: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
