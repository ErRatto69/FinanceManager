import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Wallet, LayoutDashboard, ShoppingCart, BarChart3, Users, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            isActive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
        }`;

    return (
        <header className="sticky top-0 z-30 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                        <Wallet className="w-6 h-6" />
                        <span className="text-slate-900 dark:text-white">FinanceManager</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-1">
                        {user?.role !== 'Basic' && (
                            <>
                                <NavLink to="/" end className={navLinkClass}>
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </NavLink>
                                <NavLink to="/stats" className={navLinkClass}>
                                    <BarChart3 className="w-4 h-4" />
                                    Statistics
                                </NavLink>
                            </>
                        )}

                        <NavLink to="/grocery" className={navLinkClass}>
                            <ShoppingCart className="w-4 h-4" />
                            Grocery List
                        </NavLink>

                        {user?.role === 'Admin' && (
                            <NavLink to="/admin/users" className={navLinkClass}>
                                <Users className="w-4 h-4" />
                                Users
                            </NavLink>
                        )}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {user?.username.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-medium text-slate-900 dark:text-white leading-tight">
                {user?.username}
              </span>
                            <span className="text-[10px] text-slate-500 font-mono uppercase">{user?.role}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        title="Log out"
                        className="p-2 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </header>
    );
};