import React, { useId } from 'react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: SelectOption[];
    error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, error, className = '', ...props }) => {
    const id = useId();

    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                </label>
            )}
            <select
                id={id}
                className={`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-slate-900 
          text-slate-900 dark:text-white placeholder-slate-400
          transition-colors duration-150 outline-none
          focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600
          ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-300 dark:border-slate-700'}
          ${className}`}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
        </div>
    );
};