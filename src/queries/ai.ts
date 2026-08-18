import { api } from "@/lib/axios";

export interface ChatMessage {
  _id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt?: string;
}

export const aiQueries = {
  chat: async (message: string) => {
    return api.post<any, { message: string }>("/ai/chat", { message });
  },
  
  getHistory: async () => {
    return api.get<any, ChatMessage[]>("/ai/history");
  }
};
