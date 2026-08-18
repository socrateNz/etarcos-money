import { api } from "@/lib/axios";

export interface Category {
  _id: string;
  name: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  icon?: string;
  color?: string;
}

export const categoryQueries = {
  getAll: async () => {
    return api.get<any, Category[]>("/categories");
  },

  create: async (data: Partial<Category>) => {
    return api.post<any, Category>("/categories", data);
  },

  update: async (id: string, data: Partial<Category>) => {
    return api.put<any, Category>(`/categories/${id}`, data);
  },

  delete: async (id: string) => {
    return api.delete<any, any>(`/categories/${id}`);
  },
};
