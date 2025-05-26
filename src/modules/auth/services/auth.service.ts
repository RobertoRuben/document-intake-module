import axiosInstance from "@/globals/config/axios-config";
import { AuthRequestModel } from "../models/auth.request.model";
import { AuthResponseModel } from "../models/auth.response.model";
import { camelizeKeys } from "humps";
import { ApiErrorHandler } from "@/globals/exceptions/api-error.handler";
import { TokenCookieUtils } from "@/globals/utils/cookieUtils";

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
      });      const camelCaseResponse = camelizeKeys(response.data) as AuthResponseModel;

      // Store tokens in secure cookies instead of sessionStorage
      TokenCookieUtils.setAccessToken(camelCaseResponse.accessToken);
      TokenCookieUtils.setRefreshToken(camelCaseResponse.refreshToken);

      // Get user information and store role in cookies
      try {
        const userInfo = await this.getCurrentUser<{ roleName?: string }>();
        if (userInfo.roleName) {
          TokenCookieUtils.setUserRole(userInfo.roleName);
        }
      } catch (userError) {
        // Log error but don't fail the login if user info fetch fails
        console.warn('Warning: Could not fetch user role after login:', userError);
      }

      return camelCaseResponse;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "AuthOperationError");
    }
  }  /**
   * Refreshes the access token using refreshToken
   * @param showAlert Whether to show an alert when token expires
   * @returns New access token
   */  async refreshToken(showAlert: boolean = false): Promise<AuthResponseModel> {
    try {
      const refreshToken = TokenCookieUtils.getRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // Show alert if requested
      if (showAlert) {
        const userConfirmed = window.confirm(
          "Su sesión ha expirado. Presione OK para renovar su sesión automáticamente."
        );
        if (!userConfirmed) {
          this.logout();
          throw new Error("Token refresh cancelled by user");
        }
      }

      // Send refresh_token as query parameter (backend expects it as URL parameter)
      const url = `${this.baseEndpoint}/refresh?refresh_token=${encodeURIComponent(refreshToken)}`;

      const response = await axiosInstance.post<unknown>(url, {}, {
        headers: {
          "Content-Type": "application/json",
        },
      });      const camelCaseResponse = camelizeKeys(response.data) as AuthResponseModel;

      // Store refreshed tokens in secure cookies
      TokenCookieUtils.setAccessToken(camelCaseResponse.accessToken);
      TokenCookieUtils.setRefreshToken(camelCaseResponse.refreshToken);

      return camelCaseResponse;
    } catch (error: unknown) {
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
    TokenCookieUtils.clearTokens();
  }
  /**
   * Checks if the user is authenticated
   * @returns True if an access token is stored
   */
  isAuthenticated(): boolean {
    return TokenCookieUtils.hasAccessToken();
  }

  /**
   * Checks if the access token is about to expire (within 5 minutes)
   * @returns True if token will expire soon
   */  isTokenNearExpiry(): boolean {
    try {
      const accessToken = TokenCookieUtils.getAccessToken();
      if (!accessToken) return false;
      
      // Decode JWT payload (without verification, just for reading)
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const expirationTime = payload.exp;
      
      // Check if token expires within 5 minutes (300 seconds)
      return (expirationTime - currentTime) < 300;
    } catch (error) {
      console.warn("⚠️ Error al verificar expiración del token:", error);
      return false;
    }
  }
}

export const authService = new AuthService();