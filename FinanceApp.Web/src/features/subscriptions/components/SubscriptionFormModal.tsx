import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';
import { APP_CATEGORIES } from '../../../types/category.types';
import type { CurrencyType } from '../../../types/user.types';
import type { SubscriptionDto, CreateSubscriptionRequest, UpdateSubscriptionRequest } from '../types/subscription.types';
import type { ProblemDetails } from '../../../types/api.types';
import axios from 'axios';

interface SubscriptionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    subscriptionToEdit?: SubscriptionDto | null;
    onSubmitCreate: (data: CreateSubscriptionRequest) => Promise<unknown>;
    onSubmitUpdate: (id: number, data: UpdateSubscriptionRequest) => Promise<unknown>;
}

export const SubscriptionFormModal: React.FC<SubscriptionFormModalProps> = ({
                                                                                isOpen,
                                                                                onClose,
                                                                                subscriptionToEdit,
                                                                                onSubmitCreate,
                                                                                onSubmitUpdate,
                                                                            }) => {
    const isEditing = !!subscriptionToEdit;

    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState<CurrencyType>('CHF');
    const [renewalDay, setRenewalDay] = useState('1');
    const [categoryId, setCategoryId] = useState('6'); // Default: Abbonamenti & Servizi
    const [isActive, setIsActive] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (subscriptionToEdit) {
            setName(subscriptionToEdit.name);
            setAmount(subscriptionToEdit.amount.toString());
            setCurrency(subscriptionToEdit.currency);
            setRenewalDay(subscriptionToEdit.renewalDay.toString());
            setCategoryId(subscriptionToEdit.categoryId.toString());
            setIsActive(subscriptionToEdit.isActive);
        } else {
            setName('');
            setAmount('');
            setCurrency('CHF');
            setRenewalDay('1');
            setCategoryId('6');
            setIsActive(true);
        }
        setError(null);
    }, [subscriptionToEdit, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const parsedAmount = parseFloat(amount);
        const parsedDay = parseInt(renewalDay, 10);
        const parsedCategory = parseInt(categoryId, 10);

        if (!name.trim() || isNaN(parsedAmount) || parsedAmount < 0) {
            setError('Please provide a valid name and positive amount.');
            return;
        }

        if (isNaN(parsedDay) || parsedDay < 1 || parsedDay > 31) {
            setError('Renewal day must be between 1 and 31.');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            if (isEditing && subscriptionToEdit) {
                await onSubmitUpdate(subscriptionToEdit.id, {
                    name: name.trim(),
                    amount: parsedAmount,
                    currency,
                    renewalDay: parsedDay,
                    categoryId: parsedCategory,
                    isActive,
                });
            } else {
                await onSubmitCreate({
                    name: name.trim(),
                    amount: parsedAmount,
                    currency,
                    renewalDay: parsedDay,
                    categoryId: parsedCategory,
                });
            }
            onClose();
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.data) {
                const problem = err.response.data as ProblemDetails;
                setError(problem.detail || 'Failed to save subscription.');
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
            title={isEditing ? 'Edit Subscription' : 'New Subscription'}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && <Alert message={error} variant="error" />}

                <Input
                    label="Subscription Name"
                    type="text"
                    placeholder="e.g. Netflix, Spotify, Gym"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="Amount"
                        type="number"
                        step="0.01"
                        min="0"
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
                        label="Renewal Day (1-31)"
                        type="number"
                        min="1"
                        max="31"
                        value={renewalDay}
                        onChange={(e) => setRenewalDay(e.target.value)}
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

                {isEditing && (
                    <div className="flex items-center gap-2 pt-1">
                        <input
                            type="checkbox"
                            id="isActiveSub"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="w-4 h-4 text-emerald-600 rounded border-slate-300 dark:border-slate-700"
                        />
                        <label htmlFor="isActiveSub" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Subscription is active (generates monthly bills)
                        </label>
                    </div>
                )}

                <div className="flex justify-end gap-2 mt-3">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        {isEditing ? 'Save Changes' : 'Create Subscription'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};