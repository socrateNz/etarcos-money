import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { budgetQueries, QUERY_KEYS } from "@/queries";

export function useBudgets() {
  const queryClient = useQueryClient();

  // Fetch budgets
  const { data: budgets, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.budgets,
    queryFn: budgetQueries.getAll,
  });

  // Create budget
  const createMutation = useMutation({
    mutationFn: budgetQueries.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.budgets });
    },
  });

  // Update budget
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => budgetQueries.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.budgets });
    },
  });

  // Delete budget
  const deleteMutation = useMutation({
    mutationFn: budgetQueries.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.budgets });
    },
  });

  return {
    budgets,
    isLoading,
    error,
    createBudget: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateBudget: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteBudget: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
