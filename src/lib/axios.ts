import axios from "axios";
import { useUserStore } from "@/stores";
import { API_BASE_URL } from "@/config";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Separate, interceptor-free client for the refresh call itself — using
// `api` here would recurse back into the response interceptor below.
const refreshClient = axios.create({ baseURL: API_BASE_URL });

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const forceLogout = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  useUserStore.getState().logout();
  window.location.href = "/login";
};

// Shared across concurrent 401s so a burst of requests triggers exactly one
// refresh call instead of one per request.
let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const storedRefreshToken = localStorage.getItem("refresh_token");
      if (!storedRefreshToken) {
        throw new Error("No refresh token available");
      }
      const { data } = await refreshClient.post("/auth/refresh", { refreshToken: storedRefreshToken });
      const { accessToken, refreshToken } = data.data;
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      return accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    // Unwrap the { success, data } format if it exists
    if (response.data && response.data.success !== undefined && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    // A 401 from these means "wrong credentials for this action", not "your
    // session expired" — let the calling page show its own error instead of
    // hijacking it with a refresh attempt + forced redirect.
    const isCredentialCheck =
      originalRequest?.url?.includes("/auth/login") || originalRequest?.url?.includes("/auth/change-pending-email");

    if (error.response?.status !== 401 || isCredentialCheck || typeof window === "undefined") {
      return Promise.reject(error);
    }

    if (originalRequest?._retry) {
      forceLogout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    try {
      const newAccessToken = await refreshAccessToken();
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      forceLogout();
      return Promise.reject(refreshError);
    }
  }
);
