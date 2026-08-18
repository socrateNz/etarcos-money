import { api } from "@/lib/axios";

export interface Budget {
  _id: string;
  categoryId: {
    _id: string;
    name: string;
    icon: string;
    color: string;
  };
  amountLimit: number;
  period: "WEEKLY" | "MONTHLY" | "YEARLY";
  spent: number;
  remaining: number;
  percentageUsed: number;
}

export const budgetQueries = {
  getAll: async () => {
    return api.get<any, Budget[]>("/budgets");
  },
  
  create: async (data: any) => {
    return api.post<any, any>("/budgets", data);
  },
  
  update: async (id: string, data: any) => {
    return api.put<any, any>(`/budgets/${id}`, data);
  },

  delete: async (id: string) => {
    return api.delete<any, any>(`/budgets/${id}`);
  }
};
