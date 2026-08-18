import { api } from "@/lib/axios";

export const authQueries = {
  login: async (credentials: Record<string, string>) => {
    return api.post<{ accessToken: string }>("/auth/login", credentials);
  },
  
  register: async (userData: Record<string, string>) => {
    return api.post<{ accessToken: string }>("/auth/register", userData);
  },

  logout: async () => {
    return api.post("/auth/logout");
  },

  refresh: async () => {
    return api.post<{ accessToken: string }>("/auth/refresh");
  },

  getProfile: async (): Promise<{ id: string; firstName: string; lastName?: string; email: string; phone?: string; country?: string; currency?: string; language?: string; balance: number }> => {
    return api.get("/users/me") as any;
  },

  updateProfile: async (userData: Record<string, any>) => {
    return api.put("/users/me", userData);
  },

  updatePassword: async (data: Record<string, string>) => {
    return api.put("/users/me/password", data);
  },

  updateNotificationPreferences: async (data: Record<string, any>) => {
    return api.put("/users/me/notifications", data);
  },

  exportData: async () => {
    return api.get("/users/me/export");
  },

  forgotPassword: async (email: string) => {
    return api.post("/auth/forgot-password", { email });
  },

  resetPassword: async (token: string, newPassword: string) => {
    return api.post("/auth/reset-password", { token, newPassword });
  },
};
