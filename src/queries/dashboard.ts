import { api } from "@/lib/axios";

export interface DashboardData {
  totalBalance: number;
  incomeThisMonth: number;
  expenseThisMonth: number;
  netCashFlow: number;
  recentTransactions: any[];
  expensesByCategory: any[];
  chartData: { day: string; balance: number }[];
  aiAdvice?: string;
}

export const dashboardQueries = {
  getSummary: async () => {
    return api.get<any, DashboardData>("/dashboard");
  },
};
