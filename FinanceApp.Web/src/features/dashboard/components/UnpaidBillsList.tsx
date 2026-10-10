import React, { useState } from 'react';
import type { UnpaidBillDto } from '../types/dashboard.types';
import { PayNowButton } from '../../transactions/components/PayNowButton';
import { Calendar, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface UnpaidBillsListProps {
    bills: UnpaidBillDto[];
    onPay: (id: number) => Promise<unknown>;
    onEdit: (id: number) => void;
    onDelete: (id: number) => Promise<unknown>;
}

export const UnpaidBillsList: React.FC<UnpaidBillsListProps> = ({
                                                                    bills,
                                                                    onPay,
                                                                    onEdit,
                                                                    onDelete,
                                                                }) => {
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = async (id: number, title: string) => {
        if (!window.confirm(`Delete unpaid bill "${title}"?`)) return;
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
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">Pending Bills</h2>
                </div>
                <span className="text-xs font-medium text-slate-500">{bills.length} due</span>
            </div>

            <div className="p-4 sm:p-5">
                {bills.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm">
                        All caught up! No pending bills or dues.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {bills.map((bill) => (
                            <div
                                key={bill.id}
                                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors space-y-2.5"
                            >
                                {/* Riga 1: Badge + Titolo a sx | Importo a dx */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 border uppercase tracking-wider bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-400">
                      DUE
                    </span>
                                        <span className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                      {bill.title}
                    </span>
                                    </div>

                                    <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">
                      {bill.amount.toFixed(2)} {bill.currency}
                    </span>
                                        {bill.currency === 'EUR' && (
                                            <span className="text-[10px] text-slate-400 block leading-tight">
                        ≈ {bill.amountChf.toFixed(2)} CHF
                      </span>
                                        )}
                                    </div>
                                </div>

                                {/* Riga 2: Categoria + Data e Pulsanti Operativi */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60 gap-2 text-xs">
                                    <div className="flex items-center gap-2 text-slate-400 min-w-0">
                    <span className="font-medium text-slate-600 dark:text-slate-300 truncate max-w-[140px] sm:max-w-none">
                      {bill.categoryName}
                    </span>
                                        <span>•</span>
                                        <span className="inline-flex items-center gap-1 shrink-0 text-amber-600 dark:text-amber-400 font-medium">
                      <Calendar className="w-3 h-3" />
                      Due: {bill.dueDate}
                    </span>
                                    </div>

                                    <div className="flex items-center justify-end gap-1.5 shrink-0 self-end sm:self-auto">
                                        <PayNowButton transactionId={bill.id} onPay={onPay} />
                                        <button
                                            onClick={() => onEdit(bill.id)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                            title="Edit bill"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleDelete(bill.id, bill.title)}
                                            isLoading={deletingId === bill.id}
                                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                            title="Delete bill"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};