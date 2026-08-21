import { useMutation } from "@tanstack/react-query";
import { authQueries } from "@/queries";
import { useUserStore } from "@/stores";

export function useAuth() {
  const { setUser, logout: clearUser } = useUserStore();

  const loginAndLoadProfile = async (accessToken: string) => {
    localStorage.setItem("access_token", accessToken);
    try {
      const user = await authQueries.getProfile();
      setUser(user);
    } catch (err) {
      setUser({ id: "1", firstName: "Utilisateur", email: "user@example.com", balance: 0 });
    }
  };

  const loginMutation = useMutation({
    mutationFn: authQueries.login,
    onSuccess: async (data: any) => {
      await loginAndLoadProfile(data.accessToken);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authQueries.register,
  });

  const verifyOtpMutation = useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) => authQueries.verifyOtp(email, otp),
    onSuccess: async (data: any) => {
      await loginAndLoadProfile(data.accessToken);
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: authQueries.resendOtp,
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
    verifyOtp: verifyOtpMutation.mutateAsync,
    isVerifyingOtp: verifyOtpMutation.isPending,
    resendOtp: resendOtpMutation.mutateAsync,
    isResendingOtp: resendOtpMutation.isPending,
    logout,
  };
}
