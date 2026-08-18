import { api } from "@/lib/axios";

export interface Goal {
  _id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export const goalQueries = {
  getAll: async () => {
    return api.get<any, Goal[]>("/goals");
  },

  create: async (data: { name: string; targetAmount: number; targetDate: string }) => {
    return api.post<any, any>("/goals", data);
  },
  
  update: async (id: string, data: any) => {
    return api.put<any, any>(`/goals/${id}`, data);
  },

  delete: async (id: string) => {
    return api.delete<any, any>(`/goals/${id}`);
  }
};
