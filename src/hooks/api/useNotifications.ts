import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationQueries, QUERY_KEYS } from "@/queries";

export function useNotifications() {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.notifications,
    queryFn: notificationQueries.getAll,
  });

  const markAsReadMutation = useMutation({
    mutationFn: notificationQueries.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications });
    },
  });

  return {
    notifications,
    isLoading,
    error,
    markAsRead: markAsReadMutation.mutate,
  };
}
