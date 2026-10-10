import React, { useState } from 'react';
import { useAuth } from '../../../context/useAuth';
import { authApi } from '../api/authApi';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';
import axios from 'axios';
import type { ProblemDetails } from '../../../types/api.types';

interface LoginFormProps {
    onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !password) {
            setError('Please provide both username and password.');
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            const data = await authApi.login({ username: username.trim(), password });
            login(data.token, data.user);
            onSuccess?.();
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.data) {
                const problem = err.response.data as ProblemDetails;
                setError(problem.detail || 'Authentication failed. Please check your credentials.');
            } else {
                setError('Network error or server unavailable. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            {error && <Alert message={error} variant="error" />}

            <Input
                label="Username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
            />

            <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
            />

            <Button type="submit" isLoading={isSubmitting} className="w-full mt-2">
                Sign in
            </Button>
        </form>
    );
};