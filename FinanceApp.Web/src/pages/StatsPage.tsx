import React, { useState } from 'react';
import { useStatsQuery } from '../features/stats/hooks/useStatsQuery';
import { MonthSelector } from '../features/stats/components/MonthSelector';
import { CategorySpendingItem } from '../features/stats/components/CategorySpendingItem';
import { BarChart3, DollarSign, Layers, Loader2, AlertCircle } from 'lucide-react';

export const StatsPage: React.FC = () => {
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());

    const { data: stats, isLoading, isError } = useStatsQuery(selectedMonth, selectedYear);

    const totalTransactionsCount = stats?.categories.reduce((acc, c) => acc + c.transactionCount, 0) ?? 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Monthly Statistics
                    </h1>
                    <p className="text-sm text-slate-500">
                        Breakdown of paid expenses and categorization analysis.
                    </p>
                </div>

                <MonthSelector
                    month={selectedMonth}
                    year={selectedYear}
                    onChange={(m, y) => {
                        setSelectedMonth(m);
                        setSelectedYear(y);
                    }}
                />
            </div>

            {isLoading && (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
            )}

            {isError && (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>Failed to load statistics for this period. Check your network connection.</span>
                </div>
            )}

            {stats && (
                <>
                    {/* KPI Riepilogo Mese */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                            <div className="flex items-center justify-between text-slate-500 mb-2">
                                <span className="text-xs font-semibold uppercase tracking-wider">Total Spent</span>
                                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                                    <DollarSign className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {stats.totalSpent.toFixed(2)} <span className="text-sm font-medium text-slate-500">CHF</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Paid expenditures in selected month</p>
                        </div>

                        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                            <div className="flex items-center justify-between text-slate-500 mb-2">
                                <span className="text-xs font-semibold uppercase tracking-wider">Active Categories</span>
                                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                                    <Layers className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {stats.categories.length}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Categories with registered expenses</p>
                        </div>

                        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                            <div className="flex items-center justify-between text-slate-500 mb-2">
                                <span className="text-xs font-semibold uppercase tracking-wider">Transactions</span>
                                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                                    <BarChart3 className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {totalTransactionsCount}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Total movements included</p>
                        </div>
                    </div>

                    {/* Ripartizione Categorie */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
                        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                                Category Spending Breakdown
                            </h2>
                            <span className="text-xs text-slate-400">Sorted by highest expenditure</span>
                        </div>

                        <div className="p-4 sm:p-5">
                            {stats.categories.length === 0 ? (
                                <div className="text-center py-12 text-slate-400 text-sm">
                                    No expenses recorded for this month.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {stats.categories.map((cat) => (
                                        <CategorySpendingItem key={cat.categoryId} item={cat} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};