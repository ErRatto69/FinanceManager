import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { LayoutDashboard, ShoppingCart, BarChart3, Users } from 'lucide-react';

export const MobileTabBar: React.FC = () => {
    const { user } = useAuth();

    const tabClass = ({ isActive }: { isActive: boolean }) =>
        `flex flex-col items-center justify-center flex-1 py-2 text-[10px] font-medium transition-colors ${
            isActive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
        }`;

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md pb-safe">
            <div className="flex items-center justify-around h-14">
                {user?.role !== 'Basic' && (
                    <>
                        <NavLink to="/" end className={tabClass}>
                            <LayoutDashboard className="w-5 h-5 mb-0.5" />
                            Home
                        </NavLink>
                        <NavLink to="/stats" className={tabClass}>
                            <BarChart3 className="w-5 h-5 mb-0.5" />
                            Stats
                        </NavLink>
                    </>
                )}

                <NavLink to="/grocery" className={tabClass}>
                    <ShoppingCart className="w-5 h-5 mb-0.5" />
                    Grocery
                </NavLink>

                {user?.role === 'Admin' && (
                    <NavLink to="/admin/users" className={tabClass}>
                        <Users className="w-5 h-5 mb-0.5" />
                        Users
                    </NavLink>
                )}
            </div>
        </nav>
    );
};