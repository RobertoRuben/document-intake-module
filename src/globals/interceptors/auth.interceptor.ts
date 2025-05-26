import { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { authService } from "@/modules/auth/services/auth.service.ts";

let isRefreshing = false;

type QueueItem = {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
};
let failedQueue: QueueItem[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const setupAuthInterceptors = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        headers: Record<string, string>;
      };
      if (!originalRequest) {
        return Promise.reject(error);
      }
      if (
        error.response?.status === 401 &&
        originalRequest.url?.includes("/auth/refresh")
      ) {
        authService.logout();
        setTimeout(() => {
          window.location.href = "/auth";
        }, 2000);
        return Promise.reject(error);
      }
      if (
        error.response?.status === 401 &&
        !originalRequest.headers["X-Retry"] &&
        authService.isAuthenticated()
      ) {
        if (!isRefreshing) {
          isRefreshing = true;

          return new Promise((resolve, reject) => {
            // Show alert for token expiration and attempt refresh
            authService
              .refreshToken(true)
              .then((response) => {
                isRefreshing = false;
                originalRequest.headers[
                  "Authorization"
                ] = `Bearer ${response.accessToken}`;
                originalRequest.headers["X-Retry"] = "true";

                processQueue(null, response.accessToken);
                resolve(axiosInstance(originalRequest));
              })
              .catch((refreshError) => {
                isRefreshing = false;
                processQueue(refreshError, null);

                // Only redirect to login if the refresh actually failed (not user cancellation)
                if (
                  refreshError?.message !== "Token refresh cancelled by user"
                ) {
                  authService.logout();
                  setTimeout(() => {
                    window.location.href = "/auth";
                  }, 2000);
                }

                reject(refreshError);
              });
          });
        } else {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              originalRequest.headers["X-Retry"] = "true";
              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
