import { api } from "@/lib/axios";

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  color?: string;
  icon?: string;
  _id?: string; // MongoDB object ID
}

export const accountQueries = {
  getAll: async (): Promise<Account[]> => {
    return api.get<any, Account[]>("/accounts");
  },

  create: async (data: Partial<Account>): Promise<Account> => {
    return api.post<any, Account>("/accounts", data);
  },

  update: async (id: string, data: Partial<Account>): Promise<Account> => {
    return api.put<any, Account>(`/accounts/${id}`, data);
  },

  delete: async (id: string): Promise<any> => {
    return api.delete<any, any>(`/accounts/${id}`);
  },
};
