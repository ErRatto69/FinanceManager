import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { AuthLayout } from '../layouts/AuthLayout';
import { LoginForm } from '../features/auth/components/LoginForm';
import { Wallet } from 'lucide-react';

export const LoginPage: React.FC = () => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && isAuthenticated && user) {
            // Basic users go directly to grocery list; Admin and Standard to dashboard
            const targetPath = user.role === 'Basic' ? '/grocery' : '/';
            navigate(targetPath, { replace: true });
        }
    }, [isAuthenticated, isLoading, user, navigate]);

    return (
        <AuthLayout>
            <div className="flex flex-col items-center gap-2 mb-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                    <Wallet className="w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Finance Manager
                </h1>
                <p className="text-xs text-slate-500">Sign in to access your finances and grocery list</p>
            </div>

            <LoginForm
                onSuccess={() => {
                    // Handled by useEffect on authentication state change
                }}
            />
        </AuthLayout>
    );
};