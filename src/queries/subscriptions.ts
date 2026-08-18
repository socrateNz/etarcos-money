import { api } from "@/lib/axios";

export interface Subscription {
  _id: string;
  name: string;
  amount: number;
  currency: string;
  frequency: "WEEKLY" | "MONTHLY" | "YEARLY";
  nextBillingDate: string;
  autoDetected: boolean;
  category?: string;
}

export const subscriptionQueries = {
  getAll: async () => {
    return api.get<any, Subscription[]>("/subscriptions");
  },

  create: async (data: Partial<Subscription>) => {
    return api.post<any, Subscription>("/subscriptions", data);
  },

  update: async (id: string, data: Partial<Subscription>) => {
    return api.put<any, Subscription>(`/subscriptions/${id}`, data);
  },

  delete: async (id: string) => {
    return api.delete<any, any>(`/subscriptions/${id}`);
  },
};
