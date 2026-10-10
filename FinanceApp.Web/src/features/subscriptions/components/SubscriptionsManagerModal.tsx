import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { SubscriptionRow } from './SubscriptionRow';
import { SubscriptionFormModal } from './SubscriptionFormModal';
import { useSubscriptionsQuery } from '../hooks/useSubscriptionsQuery';
import type { SubscriptionDto } from '../types/subscription.types';
import { Plus, Loader2 } from 'lucide-react';

interface SubscriptionsManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SubscriptionsManagerModal: React.FC<SubscriptionsManagerModalProps> = ({
                                                                                        isOpen,
                                                                                        onClose,
                                                                                    }) => {
    const { data: subscriptions, isLoading, createSubscription, updateSubscription, deleteSubscription } =
        useSubscriptionsQuery();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionDto | null>(null);

    const handleOpenCreate = () => {
        setSelectedSubscription(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (sub: SubscriptionDto) => {
        setSelectedSubscription(sub);
        setIsFormOpen(true);
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Subscriptions & Recurrent Bills">
                <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500">
              Manage automatic monthly recurring payments.
            </span>
                        <Button onClick={handleOpenCreate} className="text-xs py-1.5 px-3">
                            <Plus className="w-3.5 h-3.5" />
                            Add
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                        </div>
                    ) : !subscriptions || subscriptions.length === 0 ? (
                        <div className="text-center py-8 text-sm text-slate-500">
                            No subscriptions found. Create your first subscription!
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                            {subscriptions.map((sub) => (
                                <SubscriptionRow
                                    key={sub.id}
                                    subscription={sub}
                                    onEdit={handleOpenEdit}
                                    onDelete={deleteSubscription}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </Modal>

            <SubscriptionFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                subscriptionToEdit={selectedSubscription}
                onSubmitCreate={createSubscription}
                onSubmitUpdate={(id, data) => updateSubscription({ id, payload: data })}
            />
        </>
    );
};