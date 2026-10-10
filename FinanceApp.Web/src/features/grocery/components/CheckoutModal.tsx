import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { ShoppingBag } from 'lucide-react';
import type { CheckoutRequest } from '../types/grocery.types';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    estimatedTotal: number;
    checkedCount: number;
    onSubmit: (payload: CheckoutRequest) => Promise<unknown>;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
                                                                isOpen,
                                                                onClose,
                                                                estimatedTotal,
                                                                checkedCount,
                                                                onSubmit,
                                                            }) => {
    const [actualTotal, setActualTotal] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setActualTotal(estimatedTotal > 0 ? estimatedTotal.toFixed(2) : '');
        }
    }, [isOpen, estimatedTotal]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const parsedTotal = parseFloat(actualTotal);
        if (isNaN(parsedTotal) || parsedTotal < 0) return;

        setIsLoading(true);
        try {
            await onSubmit({ actualTotal: parsedTotal });
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Complete Grocery Checkout">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                Estimated Total
              </span>
                            <span className="text-xs text-slate-500">{checkedCount} items checked</span>
                        </div>
                    </div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
            {estimatedTotal.toFixed(2)} CHF
          </span>
                </div>

                <p className="text-xs text-slate-500">
                    Enter the final receipt total. This will create a paid transaction named "Spesa Supermercato" in your finances and clear the grocery list for everyone.
                </p>

                <Input
                    label="Receipt Total Paid (CHF)"
                    type="number"
                    step="0.05"
                    min="0"
                    placeholder="0.00"
                    value={actualTotal}
                    onChange={(e) => setActualTotal(e.target.value)}
                    required
                    autoFocus
                />

                <div className="flex justify-end gap-2 mt-2">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                        Confirm & Save Expense
                    </Button>
                </div>
            </form>
        </Modal>
    );
};