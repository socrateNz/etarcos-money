import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  user: {
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
  } | null;
  isAuthenticated: boolean;
  setUser: (user: UserState["user"]) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "tacynt-user-storage",
    }
  )
);
