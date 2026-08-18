import { useQuery } from "@tanstack/react-query";
import { insightsQueries, QUERY_KEYS } from "@/queries";

export function useInsights() {
  const financialHealth = useQuery({
    queryKey: QUERY_KEYS.insights.financialHealth,
    queryFn: insightsQueries.getFinancialHealth,
  });

  const forecast = useQuery({
    queryKey: QUERY_KEYS.insights.forecast,
    queryFn: insightsQueries.getForecast,
  });

  const fraud = useQuery({
    queryKey: QUERY_KEYS.insights.fraud,
    queryFn: insightsQueries.getFraud,
  });

  return {
    financialHealth: financialHealth.data,
    forecast: forecast.data,
    fraud: fraud.data,
    isLoading: financialHealth.isLoading || forecast.isLoading || fraud.isLoading,
  };
}
