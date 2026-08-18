import { useMutation } from "@tanstack/react-query";
import { authQueries } from "@/queries";
import { useUserStore } from "@/stores";

export function useAuth() {
  const { setUser, logout: clearUser } = useUserStore();

  const loginMutation = useMutation({
    mutationFn: authQueries.login,
    onSuccess: async (data: any) => {
      localStorage.setItem("access_token", data.accessToken);
      try {
        const user = await authQueries.getProfile();
        setUser(user);
      } catch (err) {
        setUser({ id: "1", firstName: "Utilisateur", email: "user@example.com", balance: 0 });
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: authQueries.register,
    onSuccess: (data: any) => {
      localStorage.setItem("access_token", data.accessToken);
      setUser({ id: "1", firstName: "Utilisateur", email: "user@example.com", balance: 0 });
    },
  });

  const logout = async () => {
    try {
      await authQueries.logout();
    } catch (e) {} // Ignore error if token already invalid
    localStorage.removeItem("access_token");
    clearUser();
  };

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout,
  };
}
