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
  
  delete: async (id: string | number) => {
    return api.delete<any, any>(`/transactions/${id}`);
  }
};
