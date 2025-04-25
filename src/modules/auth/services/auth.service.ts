import axiosInstance from "../../../globals/config/axios-config.ts";
import { AuthRequestModel } from "../models/auth.request.model.ts";
import { AuthResponseModel } from "../models/auth.response.model.ts";
import { camelizeKeys, decamelizeKeys } from "humps";

/**
 * Service for managing user authentication
 */
export class AuthService {
    /**
     * Authenticates the user and obtains tokens
     * @param credentials User credentials
     * @returns Authentication response with tokens
     */
    async login(credentials: AuthRequestModel): Promise<AuthResponseModel> {
        const formData = new URLSearchParams();
        formData.append("username", credentials.username);
        formData.append("password", credentials.password);

        const response = await axiosInstance.post<unknown>("/auth/login", formData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        const camelCaseResponse = camelizeKeys(response.data) as AuthResponseModel;

        sessionStorage.setItem("accessToken", camelCaseResponse.accessToken);
        sessionStorage.setItem("refreshToken", camelCaseResponse.refreshToken);

        return camelCaseResponse;
    }

    /**
     * Refreshes the access token using refreshToken
     * @returns New access token
     */
    async refreshToken(): Promise<AuthResponseModel> {
        const refreshToken = sessionStorage.getItem("refreshToken");

        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        const payload = decamelizeKeys({ refreshToken });

        const response = await axiosInstance.post<unknown>("/auth/refresh", payload);

        const camelCaseResponse = camelizeKeys(response.data) as AuthResponseModel;

        sessionStorage.setItem("accessToken", camelCaseResponse.accessToken);
        sessionStorage.setItem("refreshToken", camelCaseResponse.refreshToken);

        return camelCaseResponse;
    }

    /**
     * Gets information about the currently authenticated user
     * @returns Current user data
     */
    async getCurrentUser<T>(): Promise<T> {
        const response = await axiosInstance.get<unknown>("/auth/me");
        return camelizeKeys(response.data) as T;
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