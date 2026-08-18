import { useQuery } from "@tanstack/react-query";
import { dashboardQueries, QUERY_KEYS } from "@/queries";

export function useDashboard() {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard,
    queryFn: dashboardQueries.getSummary,
  });
}
