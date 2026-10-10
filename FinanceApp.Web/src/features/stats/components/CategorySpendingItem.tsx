import React from 'react';
import type { CategorySpendingDto } from '../types/stats.types';
import { ProgressBar } from '../../../components/ui/ProgressBar';

interface CategorySpendingItemProps {
    item: CategorySpendingDto;
}

export const CategorySpendingItem: React.FC<CategorySpendingItemProps> = ({ item }) => {
    return (
        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors space-y-2.5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                    />
                    <div>
            <span className="font-semibold text-slate-900 dark:text-white text-sm block">
              {item.categoryName}
            </span>
                        <span className="text-xs text-slate-400">
              {item.transactionCount} {item.transactionCount === 1 ? 'transaction' : 'transactions'}
            </span>
                    </div>
                </div>

                <div className="text-right">
          <span className="text-sm font-bold text-slate-900 dark:text-white block">
            {item.totalAmount.toFixed(2)} CHF
          </span>
                    <span className="text-xs font-semibold text-slate-500">
            {item.percentage.toFixed(1)}%
          </span>
                </div>
            </div>

            <ProgressBar progress={item.percentage} color={item.color} />
        </div>
    );
};