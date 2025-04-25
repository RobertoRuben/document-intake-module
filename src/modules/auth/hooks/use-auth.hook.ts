import { useState } from 'react';
import { authService } from '../services/auth.service.ts';
import { AuthResponseModel } from '../models/auth.response.model.ts';
import useLoadingSpinnerHook from "@/modules/core/structure/loading-spinner/hooks/use-loading-spinner.hook.ts";

export const useAuthHook = () => {
    const [authData, setAuthData] = useState<AuthResponseModel | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
    const { showLoading, hideLoading } = useLoadingSpinnerHook();

    const login = async (username: string, password: string): Promise<AuthResponseModel> => {
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

    const refreshToken = async (): Promise<AuthResponseModel> => {
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