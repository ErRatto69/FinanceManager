import React from 'react';
import { AlertCircle } from 'lucide-react';

interface AlertProps {
    message: string;
    variant?: 'error' | 'warning' | 'info';
}

export const Alert: React.FC<AlertProps> = ({ message, variant = 'error' }) => {
    const styles = {
        error: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/60',
        warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/60',
        info: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/60',
    };

    return (
        <div className={`flex items-center gap-2 p-3 text-sm rounded-lg border ${styles[variant]}`}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{message}</span>
        </div>
    );
};