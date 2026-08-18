import { api } from "@/lib/axios";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  country?: string;
  currency?: string;
  language?: string;
  photo?: string;
  balance: number;
}

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

  getProfile: async () => {
    return api.get<any, AuthUser>("/users/me");
  },

  updateProfile: async (userData: Record<string, any>) => {
    return api.put<any, AuthUser>("/users/me", userData);
  },

  updatePhoto: async (base64Image: string) => {
    return api.put<any, AuthUser>("/users/me/photo", { base64Image });
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
