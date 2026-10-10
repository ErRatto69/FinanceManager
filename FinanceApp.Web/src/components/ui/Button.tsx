import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
                                                  children,
                                                  variant = 'primary',
                                                  isLoading = false,
                                                  disabled,
                                                  className = '',
                                                  ...props
                                              }) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm',
        secondary: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100',
        danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm',
        ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {children}
        </button>
    );
};