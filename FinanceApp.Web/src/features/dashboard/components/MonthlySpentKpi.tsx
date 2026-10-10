import React from 'react';
import { DollarSign, Repeat, AlertCircle } from 'lucide-react';

interface MonthlySpentKpiProps {
    monthlySpentTotal: number;
    activeSubscriptionsTotal: number;
    unpaidBillsTotal: number;
}

export const MonthlySpentKpi: React.FC<MonthlySpentKpiProps> = ({
                                                                    monthlySpentTotal,
                                                                    activeSubscriptionsTotal,
                                                                    unpaidBillsTotal,
                                                                }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 1. Speso nel mese corrente */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Spent This Month</span>
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                        <DollarSign className="w-4 h-4" />
                    </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {monthlySpentTotal.toFixed(2)} <span className="text-sm font-medium text-slate-500">CHF</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Paid expenses & grocery checkouts</p>
            </div>

            {/* 2. Fatture da saldare */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Unpaid Bills</span>
                    <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                        <AlertCircle className="w-4 h-4" />
                    </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {unpaidBillsTotal.toFixed(2)} <span className="text-sm font-medium text-slate-500">CHF</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Pending payments requiring settlement</p>
            </div>

            {/* 3. Totale abbonamenti ricorrenti */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Recurrent Monthly</span>
                    <div className="p-2 rounded-xl bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400">
                        <Repeat className="w-4 h-4" />
                    </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {activeSubscriptionsTotal.toFixed(2)} <span className="text-sm font-medium text-slate-500">CHF/mo</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Active subscriptions estimated cost</p>
            </div>
        </div>
    );
};