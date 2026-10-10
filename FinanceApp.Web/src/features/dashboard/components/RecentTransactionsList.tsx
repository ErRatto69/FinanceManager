import React, { useState } from 'react';
import type { RecentTransactionDto } from '../types/dashboard.types';
import { canModifyOrDeleteTransaction } from '../../transactions/utils/transactionUtils';
import { CheckCircle2, Calendar, Edit2, Trash2, ListFilter } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface RecentTransactionsListProps {
    transactions: RecentTransactionDto[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => Promise<unknown>;
    onViewAll: () => void;
}

export const RecentTransactionsList: React.FC<RecentTransactionsListProps> = ({
                                                                                  transactions,
                                                                                  onEdit,
                                                                                  onDelete,
                                                                                  onViewAll,
                                                                              }) => {
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = async (id: number, title: string) => {
        if (!window.confirm(`Delete paid transaction "${title}"?`)) return;
        setDeletingId(id);
        try {
            await onDelete(id);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                        Recent Paid Transactions
                    </h2>
                </div>
                <button
                    onClick={onViewAll}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                    <ListFilter className="w-3.5 h-3.5" />
                    View All
                </button>
            </div>

            <div className="p-4 sm:p-5">
                {transactions.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm">
                        No paid transactions recorded yet.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {transactions.map((t) => {
                            const canModify = canModifyOrDeleteTransaction(true, t.paidDate);

                            return (
                                <div
                                    key={t.id}
                                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors space-y-2.5"
                                >
                                    {/* Riga 1: Badge + Titolo a sx | Importo a dx */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 border uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400">
                        PAID
                      </span>
                                            <span className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                        {t.title}
                      </span>
                                        </div>

                                        <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-slate-900 dark:text-white block">
                        {t.amount.toFixed(2)} {t.currency}
                      </span>
                                            {t.currency === 'EUR' && (
                                                <span className="text-[10px] text-slate-400 block leading-tight">
                          ≈ {t.amountChf.toFixed(2)} CHF
                        </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Riga 2: Categoria + Data e Azioni */}
                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                                        <div className="flex items-center gap-2 text-slate-400 min-w-0 flex-1 mr-2">
                      <span className="font-medium text-slate-600 dark:text-slate-300 truncate max-w-[140px] sm:max-w-none">
                        {t.categoryName}
                      </span>
                                            <span>•</span>
                                            <span className="inline-flex items-center gap-1 shrink-0">
                        <Calendar className="w-3 h-3" />
                                                {t.paidDate}
                      </span>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                            {canModify ? (
                                                <>
                                                    <button
                                                        onClick={() => onEdit(t.id)}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                                        title="Edit transaction"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => handleDelete(t.id, t.title)}
                                                        isLoading={deletingId === t.id}
                                                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                                        title="Delete transaction"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <span
                                                    className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded select-none"
                                                    title="Paid transactions from previous months cannot be modified"
                                                >
                          Locked
                        </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};