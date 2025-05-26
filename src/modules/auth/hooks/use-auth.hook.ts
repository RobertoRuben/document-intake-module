import { useState } from "react";
import { authService } from "../services/auth.service";
import { AuthResponseModel } from "../models/auth.response.model";
import useLoadingSpinnerHook from "@/modules/core/structure/loading-spinner/hooks/use-loading-spinner.hook";
import { AppOperationError } from "@/globals/exceptions/api-error.handler";

export const useAuthHook = () => {
  const [authData, setAuthData] = useState<AuthResponseModel | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    authService.isAuthenticated()
  );
  const [error, setError] = useState<string | null>(null);
  const { showLoading, hideLoading } = useLoadingSpinnerHook();

  const login = async (
    username: string,
    password: string
  ): Promise<AuthResponseModel> => {
    showLoading();
    setError(null);

    try {
      const response = await authService.login({ username, password });
      setAuthData(response);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      let errorMessage = "Error durante el proceso de autenticación";

      if (err instanceof AppOperationError) {
        errorMessage = err.details || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      throw err;
    } finally {
      hideLoading();
    }
  };
  const logout = () => {
    authService.logout();
    setAuthData(null);
    setIsAuthenticated(false);
    setError(null);
  };
  const refreshToken = async (
    showAlert: boolean = false
  ): Promise<AuthResponseModel> => {
    setError(null);

    try {
      const response = await authService.refreshToken(showAlert);
      setAuthData(response);
      return response;
    } catch (err) {
      let errorMessage = "Error al renovar el token de autenticación";

      if (err instanceof AppOperationError) {
        errorMessage = err.details || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
        if (err.message !== "Token refresh cancelled by user") {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }

      setError(errorMessage);
      throw err;
    }
  };

  const getCurrentUser = async <T>(): Promise<T> => {
    setError(null);

    try {
      return await authService.getCurrentUser<T>();
    } catch (err) {
      let errorMessage = "Error al obtener información del usuario actual";

      if (err instanceof AppOperationError) {
        errorMessage = err.details || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      throw err;
    }
  };

  return {
    login,
    logout,
    refreshToken,
    getCurrentUser,
    authData,
    isAuthenticated,
    error,
  };
};
