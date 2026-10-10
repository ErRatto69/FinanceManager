import React, { useState } from 'react';
import type { GroceryItemDto } from '../types/grocery.types';
import { Button } from '../../../components/ui/Button';
import { Trash2, Edit2, Tag } from 'lucide-react';

interface GroceryItemRowProps {
    item: GroceryItemDto;
    onToggle: (id: number) => Promise<unknown>;
    onEditDetails: (item: GroceryItemDto) => void;
    onEditPrice: (item: GroceryItemDto) => void;
    onDelete: (id: number) => Promise<unknown>;
}

export const GroceryItemRow: React.FC<GroceryItemRowProps> = ({
                                                                  item,
                                                                  onToggle,
                                                                  onEditDetails,
                                                                  onEditPrice,
                                                                  onDelete,
                                                              }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const totalLinePrice = item.unitPrice > 0 ? item.quantity * item.unitPrice : 0;

    return (
        <div
            onClick={() => onToggle(item.id)}
            className={`flex items-center justify-between p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                item.isChecked
                    ? 'bg-slate-100/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-60'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs'
            }`}
        >
            {/* Checkbox Touch-Friendly e Titolo */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${
                        item.isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                >
                    {item.isChecked && (
                        <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none">
                            <path
                                d="M2.5 6L5 8.5L9.5 3.5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
            <span
                className={`font-semibold text-sm truncate ${
                    item.isChecked
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-white'
                }`}
            >
              {item.productName}
            </span>
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/60 shrink-0">
              {item.quantity} {item.unit}
            </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <span>By {item.addedByUsername}</span>
                        {item.unitPrice > 0 && (
                            <>
                                <span>•</span>
                                <span>{item.unitPrice.toFixed(2)} CHF/{item.unit}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Importo riga & comandi */}
            <div className="flex items-center gap-2 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                {totalLinePrice > 0 && (
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 text-right pr-1">
            {totalLinePrice.toFixed(2)} CHF
          </span>
                )}

                <div className="flex items-center gap-0.5">
                    <button
                        onClick={() => onEditDetails(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit quantity and unit"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                        onClick={() => onEditPrice(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Set catalog price"
                    >
                        <Tag className="w-3.5 h-3.5" />
                    </button>

                    <Button
                        variant="ghost"
                        onClick={async () => {
                            setIsDeleting(true);
                            try {
                                await onDelete(item.id);
                            } finally {
                                setIsDeleting(false);
                            }
                        }}
                        isLoading={isDeleting}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Delete item"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};