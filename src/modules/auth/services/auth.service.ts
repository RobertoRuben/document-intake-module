import axiosInstance from "@/globals/config/axios-config";
import { AuthRequestModel } from "../models/auth.request.model";
import { AuthResponseModel } from "../models/auth.response.model";
import { camelizeKeys, decamelizeKeys } from "humps";
import { ApiErrorHandler } from "@/globals/exceptions/api-error.handler";

/**
 * Service for managing user authentication
 */
export class AuthService {
  private readonly baseEndpoint = "/auth";

  /**
   * Authenticates the user and obtains tokens
   * @param credentials User credentials
   * @returns Authentication response with tokens
   */
  async login(credentials: AuthRequestModel): Promise<AuthResponseModel> {
    try {
      const formData = new URLSearchParams();
      formData.append("username", credentials.username);
      formData.append("password", credentials.password);

      const response = await axiosInstance.post<unknown>(`${this.baseEndpoint}/login`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const camelCaseResponse = camelizeKeys(response.data) as AuthResponseModel;

      sessionStorage.setItem("accessToken", camelCaseResponse.accessToken);
      sessionStorage.setItem("refreshToken", camelCaseResponse.refreshToken);

      return camelCaseResponse;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "AuthOperationError");
    }
  }

  /**
   * Refreshes the access token using refreshToken
   * @returns New access token
   */
  async refreshToken(): Promise<AuthResponseModel> {
    try {
      const refreshToken = sessionStorage.getItem("refreshToken");

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const payload = decamelizeKeys({ refreshToken });

      const response = await axiosInstance.post<unknown>(`${this.baseEndpoint}/refresh`, payload);

      const camelCaseResponse = camelizeKeys(response.data) as AuthResponseModel;

      sessionStorage.setItem("accessToken", camelCaseResponse.accessToken);
      sessionStorage.setItem("refreshToken", camelCaseResponse.refreshToken);

      return camelCaseResponse;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "AuthOperationError");
    }
  }

  /**
   * Gets information about the currently authenticated user
   * @returns Current user data
   */
  async getCurrentUser<T>(): Promise<T> {
    try {
      const response = await axiosInstance.get<unknown>(`${this.baseEndpoint}/me`);
      return camelizeKeys(response.data) as T;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "AuthOperationError");
    }
  }

  /**
   * Logs the user out
   */
  logout(): void {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
  }

  /**
   * Checks if the user is authenticated
   * @returns True if an access token is stored
   */
  isAuthenticated(): boolean {
    return Boolean(sessionStorage.getItem("accessToken"));
  }
}

export const authService = new AuthService();