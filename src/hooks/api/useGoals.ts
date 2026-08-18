import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { goalQueries, QUERY_KEYS } from "@/queries";

export function useGoals() {
  const queryClient = useQueryClient();

  // Fetch goals
  const { data: goals, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.goals,
    queryFn: goalQueries.getAll,
  });

  // Create goal
  const createMutation = useMutation({
    mutationFn: goalQueries.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.goals });
    },
  });

  // Update goal
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => goalQueries.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.goals });
    },
  });

  // Delete goal
  const deleteMutation = useMutation({
    mutationFn: goalQueries.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.goals });
    },
  });

  return {
    goals,
    isLoading,
    error,
    createGoal: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateGoal: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteGoal: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
