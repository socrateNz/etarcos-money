export const QUERY_KEYS = {
  user: ["user"] as const,
  dashboard: ["dashboard"] as const,
  transactions: {
    all: ["transactions"] as const,
    list: (filters: Record<string, any>) => ["transactions", "list", filters] as const,
    detail: (id: string) => ["transactions", "detail", id] as const,
  },
  budgets: ["budgets"] as const,
  goals: ["goals"] as const,
  ai: {
    chat: ["ai", "chat"] as const,
    history: ["ai", "history"] as const,
  },
  accounts: ["accounts"] as const,
  categories: ["categories"] as const,
  subscriptions: ["subscriptions"] as const,
  notifications: ["notifications"] as const,
  insights: {
    financialHealth: ["insights", "financial-health"] as const,
    forecast: ["insights", "forecast"] as const,
    fraud: ["insights", "fraud"] as const,
  },
};
