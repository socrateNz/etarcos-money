import { api } from "@/lib/axios";

export interface Subscription {
  _id: string;
  name: string;
  amount: number;
  currency: string;
  frequency: "WEEKLY" | "MONTHLY" | "YEARLY";
  nextBillingDate: string;
  autoDetected: boolean;
  accountId: { _id: string; name: string; currency: string };
  categoryId?: { _id: string; name: string; icon?: string; color?: string };
}

export const subscriptionQueries = {
  getAll: async () => {
    return api.get<any, Subscription[]>("/subscriptions");
  },

  create: async (data: any) => {
    return api.post<any, Subscription>("/subscriptions", data);
  },

  update: async (id: string, data: any) => {
    return api.put<any, Subscription>(`/subscriptions/${id}`, data);
  },

  delete: async (id: string) => {
    return api.delete<any, any>(`/subscriptions/${id}`);
  },

  apply: async (id: string) => {
    return api.post<any, { subscription: Subscription; transaction: any }>(`/subscriptions/${id}/apply`);
  },
};
