import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthHook } from '../hooks/use-auth.hook.ts';
import { AuthModelResponse } from '../models/auth.model.response.ts';

interface AuthContextType {
    login: (username: string, password: string) => Promise<AuthModelResponse>;
    logout: () => void;
    isAuthenticated: boolean;
    checkingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const { login, logout, isAuthenticated } = useAuthHook();
    const [checkingAuth, setCheckingAuth] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setCheckingAuth(true);
                if (!isAuthenticated) {
                    navigate('/auth');
                }
            } finally {
                setCheckingAuth(false);
            }
        };

        checkAuth();
    }, [isAuthenticated, navigate]);

    const value = {
        login,
        logout,
        isAuthenticated,
        checkingAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext debe ser usado dentro de un AuthProvider');
    }
    return context;
};