import { useState } from 'react';
import { authService } from '../services/auth.service.ts';
import { AuthModelResponse } from '../models/authModelResponse';
import useLoadingSpinner from "@/modules/core/structure/loading-spinner/hooks/useLoadingSpinner.ts";

export const useAuth = () => {
    const [authData, setAuthData] = useState<AuthModelResponse | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
    const { showLoading, hideLoading } = useLoadingSpinner();

    const login = async (username: string, password: string): Promise<AuthModelResponse> => {
        showLoading();
        try {
            const response = await authService.login({ username, password });
            setAuthData(response);
            setIsAuthenticated(true);
            return response;
        } finally {
            hideLoading();
        }
    };

    const logout = () => {
        authService.logout();
        setAuthData(null);
        setIsAuthenticated(false);
    };

    const refreshToken = async (): Promise<AuthModelResponse> => {
        try {
            const response = await authService.refreshToken();
            setAuthData(response);
            return response;
        } catch (error) {
            setIsAuthenticated(false);
            throw error;
        }
    };

    const getCurrentUser = async <T>(): Promise<T> => {
        return await authService.getCurrentUser<T>();
    };

    return {
        login,
        logout,
        refreshToken,
        getCurrentUser,
        authData,
        isAuthenticated
    };
};