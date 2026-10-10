import React, { useState } from 'react';
import type { SubscriptionDto } from '../types/subscription.types';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Edit2, Trash2 } from 'lucide-react';

interface SubscriptionRowProps {
    subscription: SubscriptionDto;
    onEdit: (subscription: SubscriptionDto) => void;
    onDelete: (id: number) => Promise<unknown>;
}

export const SubscriptionRow: React.FC<SubscriptionRowProps> = ({
                                                                    subscription,
                                                                    onEdit,
                                                                    onDelete,
                                                                }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm(`Delete subscription "${subscription.name}"?`)) return;

        setIsDeleting(true);
        try {
            await onDelete(subscription.id);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors gap-2.5 sm:gap-3">
            {/* Intestazione e Dettagli */}
            <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900/50 flex flex-col items-center justify-center text-pink-600 dark:text-pink-400 shrink-0 font-bold leading-none">
                    <span className="text-[8px] uppercase tracking-wider text-pink-400 dark:text-pink-500 font-semibold">DAY</span>
                    <span className="text-sm font-bold">{subscription.renewalDay}</span>
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-900 dark:text-white text-sm truncate">
              {subscription.name}
            </span>
                        {!subscription.isActive && <Badge variant="neutral">Paused</Badge>}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                        <span className="truncate">{subscription.categoryName}</span>
                        <span>•</span>
                        <span className="shrink-0">Day {subscription.renewalDay} of month</span>
                    </div>
                </div>
            </div>

            {/* Importo e Azioni */}
            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/60">
                <div className="text-left sm:text-right">
          <span className="text-sm font-bold text-slate-900 dark:text-white block">
            {subscription.amount.toFixed(2)} {subscription.currency}
          </span>
                    {subscription.currency === 'EUR' && (
                        <span className="text-[11px] text-slate-400 block leading-tight">
              ≈ {(subscription.amount * 0.95).toFixed(2)} CHF
            </span>
                    )}
                </div>

                <div className="flex items-center gap-1 pl-2 border-l border-slate-100 dark:border-slate-800">
                    <Button
                        variant="ghost"
                        onClick={() => onEdit(subscription)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title="Edit subscription"
                    >
                        <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={handleDelete}
                        isLoading={isDeleting}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Delete subscription"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};