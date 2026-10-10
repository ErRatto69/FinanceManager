import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';
import { APP_CATEGORIES } from '../../../types/category.types';
import type { CurrencyType } from '../../../types/user.types';
import type {
    TransactionDto,
    CreateTransactionRequest,
    UpdateTransactionRequest,
} from '../types/transaction.types';
import type { ProblemDetails } from '../../../types/api.types';
import axios from 'axios';

interface TransactionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    transactionToEdit?: TransactionDto | null;
    onSubmitCreate: (data: CreateTransactionRequest) => Promise<unknown>;
    onSubmitUpdate: (id: number, data: UpdateTransactionRequest) => Promise<unknown>;
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
                                                                              isOpen,
                                                                              onClose,
                                                                              transactionToEdit,
                                                                              onSubmitCreate,
                                                                              onSubmitUpdate,
                                                                          }) => {
    const isEditing = !!transactionToEdit;
    const todayStr = new Date().toISOString().split('T')[0];

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState<CurrencyType>('CHF');
    const [dueDate, setDueDate] = useState(todayStr);
    const [categoryId, setCategoryId] = useState('7'); // Default: Altro
    const [isPaid, setIsPaid] = useState(false);
    const [paidDate, setPaidDate] = useState(todayStr);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (transactionToEdit) {
            setTitle(transactionToEdit.title);
            setAmount(transactionToEdit.amount.toString());
            setCurrency(transactionToEdit.currency);
            setDueDate(transactionToEdit.dueDate);
            setCategoryId(transactionToEdit.categoryId.toString());
            setIsPaid(transactionToEdit.isPaid);
            setPaidDate(transactionToEdit.paidDate || todayStr);
        } else {
            setTitle('');
            setAmount('');
            setCurrency('CHF');
            setDueDate(todayStr);
            setCategoryId('7');
            setIsPaid(false);
            setPaidDate(todayStr);
        }
        setError(null);
    }, [transactionToEdit, isOpen, todayStr]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const parsedAmount = parseFloat(amount);
        const parsedCategory = parseInt(categoryId, 10);

        if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
            setError('Please provide a valid title and an amount greater than 0.');
            return;
        }

        if (!dueDate) {
            setError('Due date is required.');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            if (isEditing && transactionToEdit) {
                await onSubmitUpdate(transactionToEdit.id, {
                    title: title.trim(),
                    amount: parsedAmount,
                    currency,
                    dueDate,
                    categoryId: parsedCategory,
                    isPaid,
                    paidDate: isPaid ? paidDate : null,
                });
            } else {
                await onSubmitCreate({
                    title: title.trim(),
                    amount: parsedAmount,
                    currency,
                    dueDate,
                    categoryId: parsedCategory,
                    isPaid,
                    paidDate: isPaid ? paidDate : null,
                });
            }
            onClose();
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.data) {
                const problem = err.response.data as ProblemDetails;
                setError(problem.detail || 'Failed to save transaction.');
            } else {
                setError('An unexpected network error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Edit Transaction' : 'New Transaction / Bill'}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && <Alert message={error} variant="error" />}

                <Input
                    label="Title / Description"
                    type="text"
                    placeholder="e.g. Electricity bill, Car insurance, Dinner"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="Amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />

                    <Select
                        label="Currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as CurrencyType)}
                        options={[
                            { value: 'CHF', label: 'CHF (Franc)' },
                            { value: 'EUR', label: 'EUR (Euro)' },
                        ]}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="Due Date"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />

                    <Select
                        label="Category"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        options={APP_CATEGORIES.map((cat) => ({
                            value: cat.id.toString(),
                            label: cat.name,
                        }))}
                    />
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isPaidCheckbox"
                            checked={isPaid}
                            onChange={(e) => setIsPaid(e.target.checked)}
                            className="w-4 h-4 text-emerald-600 rounded border-slate-300 dark:border-slate-700"
                        />
                        <label htmlFor="isPaidCheckbox" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Already paid
                        </label>
                    </div>

                    {isPaid && (
                        <Input
                            label="Paid Date"
                            type="date"
                            value={paidDate}
                            onChange={(e) => setPaidDate(e.target.value)}
                            required
                        />
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-3">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        {isEditing ? 'Save Changes' : 'Create Transaction'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};