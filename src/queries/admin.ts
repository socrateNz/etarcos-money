import { api } from "@/lib/axios";

export interface AdminStats {
  totalUsers: number;
  newUsers7d: number;
  newUsers30d: number;
  totalAccounts: number;
  totalTransactions: number;
  totalSubscriptions: number;
  totalAiConversations: number;
  volumeByType: { _id: "INCOME" | "EXPENSE" | "TRANSFER"; total: number; count: number }[];
  signupsByDay: { _id: string; count: number }[];
}

export interface AdminUser {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: "USER" | "ADMIN";
  currency: string;
  financialScore: number;
  createdAt: string;
}

export interface AdminUsersResponse {
  data: AdminUser[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export const adminQueries = {
  getStats: async () => {
    return api.get<any, AdminStats>("/admin/stats");
  },
  getUsers: async (params: { page?: number; limit?: number; search?: string }) => {
    return api.get<any, AdminUsersResponse>("/admin/users", { params });
  },
};
