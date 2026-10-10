import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
            <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">404</h1>
            <p className="text-slate-500 mb-6 text-sm">The requested page does not exist.</p>
            <Link
                to="/"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
                Back to Home
            </Link>
        </div>
    );
};