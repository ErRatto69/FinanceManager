import React, { useState } from 'react';
import type { TransactionDto } from '../types/transaction.types';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { PayNowButton } from './PayNowButton';
import { Calendar, Trash2, Edit2, Repeat } from 'lucide-react';

interface TransactionItemProps {
    transaction: TransactionDto;
    onEdit?: (transaction: TransactionDto) => void;
    onDelete?: (id: number) => Promise<unknown>;
    onPay?: (id: number) => Promise<unknown>;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
                                                                    transaction,
                                                                    onEdit,
                                                                    onDelete,
                                                                    onPay,
                                                                }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm(`Delete transaction "${transaction.title}"?`)) return;

        setIsDeleting(true);
        try {
            await onDelete?.(transaction.id);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
            <div className="flex items-center gap-3">
                <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-xs shrink-0 ${
                        transaction.isPaid
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/50 text-amber-600 dark:text-amber-400'
                    }`}
                >
                    {transaction.isPaid ? 'PAID' : 'DUE'}
                </div>

                <div>
                    <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-white text-sm">
              {transaction.title}
            </span>
                        {transaction.subscriptionId && (
                            <Badge variant="info">
                                <Repeat className="w-2.5 h-2.5 mr-1 inline" />
                                Subscription
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>{transaction.categoryName}</span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3" />
                            {transaction.isPaid ? `Paid: ${transaction.paidDate}` : `Due: ${transaction.dueDate}`}
            </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="text-right">
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {transaction.amount.toFixed(2)} {transaction.currency}
          </span>
                    {transaction.currency === 'EUR' && (
                        <p className="text-[11px] text-slate-400">
                            ≈ {transaction.amountChf.toFixed(2)} CHF
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-1.5 pl-2 border-l border-slate-100 dark:border-slate-800">
                    {!transaction.isPaid && onPay && (
                        <PayNowButton transactionId={transaction.id} onPay={onPay} />
                    )}

                    {onEdit && (
                        <Button
                            variant="ghost"
                            onClick={() => onEdit(transaction)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            title="Edit transaction"
                        >
                            <Edit2 className="w-4 h-4" />
                        </Button>
                    )}

                    {onDelete && (
                        <Button
                            variant="ghost"
                            onClick={handleDelete}
                            isLoading={isDeleting}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            title="Delete transaction"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};