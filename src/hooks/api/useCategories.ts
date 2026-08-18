import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryQueries, QUERY_KEYS } from "@/queries";

export function useCategories() {
  const queryClient = useQueryClient();

  const { data: categories, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: categoryQueries.getAll,
  });

  const createMutation = useMutation({
    mutationFn: categoryQueries.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: categoryQueries.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
    },
  });

  return {
    categories,
    isLoading,
    error,
    createCategory: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteCategory: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
