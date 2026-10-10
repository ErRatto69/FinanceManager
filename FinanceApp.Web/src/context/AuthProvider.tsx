import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext, type AuthUser } from './AuthContext';
import { setupInterceptors } from '../api/apiInterceptors';
import { apiClient } from '../api/apiClient';

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [user, setUser] = useState<AuthUser | null>(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    }, []);

    useEffect(() => {
        setupInterceptors(logout);
    }, [logout]);

    useEffect(() => {
        const verifySession = async () => {
            const savedToken = localStorage.getItem('token');
            if (!savedToken) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await apiClient.get<AuthUser>('/api/auth/me');
                setUser(response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
            } catch {
                logout();
            } finally {
                setIsLoading(false);
            }
        };

        verifySession();
    }, [logout]);

    const login = (newToken: string, newUser: AuthUser) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token && !!user,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};