import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
    const id = useId();

    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                </label>
            )}
            <input
                id={id}
                className={`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-slate-900 
          text-slate-900 dark:text-white placeholder-slate-400
          transition-colors duration-150 outline-none
          focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600
          ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-300 dark:border-slate-700'}
          ${className}`}
                {...props}
            />
            {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
        </div>
    );
};