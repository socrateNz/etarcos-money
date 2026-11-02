import { api } from "@/lib/axios";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  type: "income" | "expense";
  icon?: any;
  colorClass?: string;
}

export const transactionQueries = {
  getAll: async () => {
    return api.get<any, any[]>("/transactions");
  },
  
  create: async (data: Partial<Transaction>) => {
    return api.post<any, any>("/transactions", data);
  },
  
  update: async ({ id, data }: { id: string | number; data: Record<string, any> }) => {
    return api.patch<any, any>(`/transactions/${id}`, data);
  },

  delete: async (id: string | number) => {
    return api.delete<any, any>(`/transactions/${id}`);
  }
};
