import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import type { UserRole } from '../types/user.types';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        const fallbackPath = user.role === 'Basic' ? '/grocery' : '/';
        return <Navigate to={fallbackPath} replace />;
    }

    return <Outlet />;
};