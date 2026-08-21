import { useQuery } from "@tanstack/react-query";
import { adminQueries } from "@/queries";

export function useAdminStats() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: adminQueries.getStats,
  });

  return { stats: data, isLoading, error };
}

export function useAdminUsers(page: number, search: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "users", page, search],
    queryFn: () => adminQueries.getUsers({ page, limit: 20, search: search || undefined }),
    placeholderData: (prev) => prev,
  });

  return { users: data?.data, pagination: data?.pagination, isLoading, error };
}
