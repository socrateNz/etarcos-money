import { api } from "@/lib/axios";

export interface AppNotification {
  _id: string;
  title: string;
  body: string;
  type: "ALERT" | "INFO" | "AI_ADVICE";
  isRead: boolean;
  createdAt: string;
}

export const notificationQueries = {
  getAll: async () => {
    return api.get<any, AppNotification[]>("/notifications");
  },

  markAsRead: async (id: string) => {
    return api.patch<any, AppNotification>(`/notifications/${id}`);
  },
};
