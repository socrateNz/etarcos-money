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
  role?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export const authQueries = {
  login: async (credentials: Record<string, string>) => {
    return api.post<TokenPair>("/auth/login", credentials);
  },

  register: async (userData: Record<string, string>) => {
    return api.post<{ id: string; email: string; requiresVerification: boolean }>("/auth/register", userData);
  },

  verifyOtp: async (email: string, otp: string) => {
    return api.post<TokenPair>("/auth/verify-otp", { email, otp });
  },

  resendOtp: async (email: string) => {
    return api.post("/auth/resend-otp", { email });
  },

  changePendingEmail: async (currentEmail: string, password: string, newEmail: string) => {
    return api.post<any, { email: string }>("/auth/change-pending-email", { currentEmail, password, newEmail });
  },

  logout: async (refreshToken: string | null) => {
    return api.post("/auth/logout", { refreshToken });
  },

  refresh: async (refreshToken: string) => {
    return api.post<TokenPair>("/auth/refresh", { refreshToken });
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

  exportData: async (params?: { format?: "json" | "pdf"; startDate?: string; endDate?: string }) => {
    return api.get("/users/me/export", {
      params,
      responseType: params?.format === "pdf" ? "blob" : "json",
    });
  },

  forgotPassword: async (email: string) => {
    return api.post("/auth/forgot-password", { email });
  },

  resetPassword: async (token: string, newPassword: string) => {
    return api.post("/auth/reset-password", { token, newPassword });
  },
};
