import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminQueries } from "@/queries";

export function useAdminStats() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: adminQueries.getStats,
  });

  return { stats: data, isLoading, error };
}

export function useAdminUsers(page: number, search: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "users", page, search],
    queryFn: () => adminQueries.getUsers({ page, limit: 20, search: search || undefined }),
    placeholderData: (prev) => prev,
  });

  const deleteMutation = useMutation({
    mutationFn: adminQueries.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });

  return {
    users: data?.data,
    pagination: data?.pagination,
    isLoading,
    error,
    deleteUser: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deletingId: deleteMutation.variables,
  };
}

export function useBroadcasts(page: number) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "broadcasts", page],
    queryFn: () => adminQueries.getBroadcasts({ page, limit: 10 }),
    placeholderData: (prev) => prev,
  });

  const sendTestMutation = useMutation({
    mutationFn: adminQueries.sendTestBroadcast,
  });

  const sendMutation = useMutation({
    mutationFn: adminQueries.sendBroadcast,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "broadcasts"] });
    },
  });

  return {
    broadcasts: data?.data,
    pagination: data?.pagination,
    isLoading,
    sendTest: sendTestMutation.mutateAsync,
    isSendingTest: sendTestMutation.isPending,
    send: sendMutation.mutateAsync,
    isSending: sendMutation.isPending,
  };
}
