import { useMutation } from "@tanstack/react-query";
import { authQueries } from "@/queries";
import { useUserStore } from "@/stores";

export function useAuth() {
  const { setUser, logout: clearUser } = useUserStore();

  const loginAndLoadProfile = async (accessToken: string, refreshToken: string) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
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
      await loginAndLoadProfile(data.accessToken, data.refreshToken);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authQueries.register,
  });

  const verifyOtpMutation = useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) => authQueries.verifyOtp(email, otp),
    onSuccess: async (data: any) => {
      await loginAndLoadProfile(data.accessToken, data.refreshToken);
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: authQueries.resendOtp,
  });

  const changePendingEmailMutation = useMutation({
    mutationFn: ({ currentEmail, password, newEmail }: { currentEmail: string; password: string; newEmail: string }) =>
      authQueries.changePendingEmail(currentEmail, password, newEmail),
  });

  const logout = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    try {
      await authQueries.logout(refreshToken);
    } catch (e) {} // Ignore error if token already invalid
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
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
    changePendingEmail: changePendingEmailMutation.mutateAsync,
    isChangingPendingEmail: changePendingEmailMutation.isPending,
    logout,
  };
}
