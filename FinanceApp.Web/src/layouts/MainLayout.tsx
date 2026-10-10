import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { MobileTabBar } from './MobileTabBar';

export const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-20 md:pb-6">
                <Outlet />
            </main>
            <MobileTabBar />
        </div>
    );
};