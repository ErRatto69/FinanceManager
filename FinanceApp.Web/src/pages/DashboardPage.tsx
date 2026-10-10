import React, { useState } from 'react';
import { useDashboardSummary } from '../features/dashboard/hooks/useDashboardSummary';
import { useTransactionsQuery } from '../features/transactions/hooks/useTransactionsQuery';
import { useSubscriptionsQuery } from '../features/subscriptions/hooks/useSubscriptionsQuery';
import { MonthlySpentKpi } from '../features/dashboard/components/MonthlySpentKpi';
import { UnpaidBillsList } from '../features/dashboard/components/UnpaidBillsList';
import { RecentTransactionsList } from '../features/dashboard/components/RecentTransactionsList';
import { TransactionFormModal } from '../features/transactions/components/TransactionFormModal';
import { TransactionsManagerModal } from '../features/transactions/components/TransactionsManagerModal';
import { SubscriptionFormModal } from '../features/subscriptions/components/SubscriptionFormModal';
import { SubscriptionsManagerModal } from '../features/subscriptions/components/SubscriptionsManagerModal';
import { transactionsApi } from '../features/transactions/api/transactionsApi';
import { Button } from '../components/ui/Button';
import type { TransactionDto } from '../features/transactions/types/transaction.types';
import { Plus, Repeat, ListFilter, Loader2, AlertCircle } from 'lucide-react';

export const DashboardPage: React.FC = () => {
    const { data: summary, isLoading, isError } = useDashboardSummary();
    const { createTransaction, updateTransaction, deleteTransaction, payNow } = useTransactionsQuery();
    const { createSubscription, updateSubscription } = useSubscriptionsQuery();

    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [selectedTxToEdit, setSelectedTxToEdit] = useState<TransactionDto | null>(null);
    const [isAllTransactionsModalOpen, setIsAllTransactionsModalOpen] = useState(false);

    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
    const [isManageSubsModalOpen, setIsManageSubsModalOpen] = useState(false);

    const unpaidTotalChf = summary?.unpaidBills.reduce((acc, b) => acc + b.amountChf, 0) ?? 0;

    const handleOpenCreateTransaction = () => {
        setSelectedTxToEdit(null);
        setIsTransactionModalOpen(true);
    };

    const handleOpenEditById = async (id: number) => {
        try {
            const fullTx = await transactionsApi.getById(id);
            setSelectedTxToEdit(fullTx);
            setIsTransactionModalOpen(true);
        } catch (err) {
            console.error('Failed to load transaction details:', err);
        }
    };

    return (
        <div className="space-y-6">
            {/* Intestazione e Azioni rapide */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="text-sm text-slate-500">
                        Real-time financial overview and expense tracking.
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        variant="secondary"
                        onClick={() => setIsAllTransactionsModalOpen(true)}
                        className="text-xs"
                    >
                        <ListFilter className="w-3.5 h-3.5" />
                        All Transactions
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={() => setIsManageSubsModalOpen(true)}
                        className="text-xs"
                    >
                        <Repeat className="w-3.5 h-3.5" />
                        Subscriptions
                    </Button>

                    <Button
                        onClick={handleOpenCreateTransaction}
                        className="text-xs bg-emerald-600 hover:bg-emerald-700"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        New Transaction
                    </Button>
                </div>
            </div>

            {isLoading && (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
            )}

            {isError && (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>Failed to load financial summary. Please check your network connection.</span>
                </div>
            )}

            {summary && (
                <>
                    <MonthlySpentKpi
                        monthlySpentTotal={summary.monthlySpentTotal}
                        activeSubscriptionsTotal={summary.activeSubscriptionsMonthlyTotal}
                        unpaidBillsTotal={unpaidTotalChf}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <UnpaidBillsList
                            bills={summary.unpaidBills}
                            onPay={payNow}
                            onEdit={handleOpenEditById}
                            onDelete={deleteTransaction}
                        />

                        <RecentTransactionsList
                            transactions={summary.recentTransactions}
                            onEdit={handleOpenEditById}
                            onDelete={deleteTransaction}
                            onViewAll={() => setIsAllTransactionsModalOpen(true)}
                        />
                    </div>
                </>
            )}

            {/* Modale Creazione / Modifica Transazione */}
            <TransactionFormModal
                isOpen={isTransactionModalOpen}
                onClose={() => setIsTransactionModalOpen(false)}
                transactionToEdit={selectedTxToEdit}
                onSubmitCreate={createTransaction}
                onSubmitUpdate={(id, payload) => updateTransaction({ id, payload })}
            />

            {/* Modale Storico Completo di Tutte le Transazioni */}
            <TransactionsManagerModal
                isOpen={isAllTransactionsModalOpen}
                onClose={() => setIsAllTransactionsModalOpen(false)}
                onEdit={(tx) => {
                    setSelectedTxToEdit(tx);
                    setIsTransactionModalOpen(true);
                }}
                onDelete={deleteTransaction}
                onPay={payNow}
            />

            {/* Modale Creazione Abbonamento */}
            <SubscriptionFormModal
                isOpen={isSubscriptionModalOpen}
                onClose={() => setIsSubscriptionModalOpen(false)}
                onSubmitCreate={createSubscription}
                onSubmitUpdate={(id, payload) => updateSubscription({ id, payload })}
            />

            {/* Modale Gestione Abbonamenti */}
            <SubscriptionsManagerModal
                isOpen={isManageSubsModalOpen}
                onClose={() => setIsManageSubsModalOpen(false)}
            />
        </div>
    );
};