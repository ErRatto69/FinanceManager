import React from 'react';

interface ProgressBarProps {
    progress: number;
    color?: string;
    className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color, className = '' }) => {
    const clampedProgress = Math.min(100, Math.max(0, progress));

    return (
        <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden ${className}`}>
            <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                    width: `${clampedProgress}%`,
                    backgroundColor: color || '#10B981',
                }}
            />
        </div>
    );
};