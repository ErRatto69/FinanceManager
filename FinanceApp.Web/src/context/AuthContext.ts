import { createContext } from 'react';
import type { UserRole } from '../types/user.types';

export interface AuthUser {
    id: number;
    username: string;
    role: UserRole;
}

export interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, user: AuthUser) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);