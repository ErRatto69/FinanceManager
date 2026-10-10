import React, { useState, useMemo } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { MonthSelector } from '../../stats/components/MonthSelector';
import { useTransactionsQuery } from '../hooks/useTransactionsQuery';
import { canModifyOrDeleteTransaction } from '../utils/transactionUtils';
import { PayNowButton } from './PayNowButton';
import type { TransactionDto } from '../types/transaction.types';
import { Search, Loader2, Edit2, Trash2, Calendar, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface TransactionsManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEdit: (tx: TransactionDto) => void;
    onDelete: (id: number) => Promise<unknown>;
    onPay: (id: number) => Promise<unknown>;
}

export const TransactionsManagerModal: React.FC<TransactionsManagerModalProps> = ({
                                                                                      isOpen,
                                                                                      onClose,
                                                                                      onEdit,
                                                                                      onDelete,
                                                                                      onPay,
                                                                                  }) => {
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());

    const { data: transactions, isLoading } = useTransactionsQuery({
        month: selectedMonth,
        year: selectedYear,
    });

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const filteredTransactions = useMemo(() => {
        if (!transactions) return [];

        return transactions.filter((t) => {
            const matchesSearch =
                t.title.toLowerCase().includes(search.toLowerCase()) ||
                t.categoryName.toLowerCase().includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === 'all'
                    ? true
                    : statusFilter === 'paid'
                        ? t.isPaid
                        : !t.isPaid;

            return matchesSearch && matchesStatus;
        });
    }, [transactions, search, statusFilter]);

    const monthTotalChf = useMemo(() => {
        if (!transactions) return 0;
        return transactions.reduce((acc, t) => acc + t.amountChf, 0);
    }, [transactions]);

    const handleDelete = async (id: number, title: string) => {
        if (!window.confirm(`Delete transaction "${title}"?`)) return;
        setDeletingId(id);
        try {
            await onDelete(id);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Monthly Transactions"
            maxWidth="2xl"
        >
            <div className="space-y-4">
                {/* Barra di Navigazione Mese e Totale */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                    <MonthSelector
                        month={selectedMonth}
                        year={selectedYear}
                        onChange={(m, y) => {
                            setSelectedMonth(m);
                            setSelectedYear(y);
                        }}
                    />

                    <div className="text-left sm:text-right">
            <span className="text-[11px] text-slate-400 block font-medium uppercase tracking-wider">
              Month Total ({transactions?.length ?? 0} items)
            </span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
              {monthTotalChf.toFixed(2)} CHF
            </span>
                    </div>
                </div>

                {/* Filtri di Ricerca e Stato */}
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by title or category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-8 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-emerald-600 transition-colors"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-2.5 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 self-start sm:self-auto">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                                statusFilter === 'all'
                                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setStatusFilter('paid')}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                                statusFilter === 'paid'
                                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            Paid
                        </button>
                        <button
                            onClick={() => setStatusFilter('unpaid')}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                                statusFilter === 'unpaid'
                                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            Due
                        </button>
                    </div>
                </div>

                {/* Lista Transazioni */}
                <div className="max-h-[55vh] overflow-y-auto space-y-2.5 pr-1">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 text-sm">
                            No transactions found for this period.
                        </div>
                    ) : (
                        filteredTransactions.map((t) => {
                            const canModify = canModifyOrDeleteTransaction(t.isPaid, t.paidDate);

                            return (
                                <div
                                    key={t.id}
                                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors space-y-2.5"
                                >
                                    {/* Riga Superiore: Badge + Titolo | Importo */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 border uppercase tracking-wider ${
                              t.isPaid
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-400'
                          }`}
                      >
                        {t.isPaid ? 'PAID' : 'DUE'}
                      </span>

                                            <span className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                        {t.title}
                      </span>
                                        </div>

                                        <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-slate-900 dark:text-white block">
                        {t.amount.toFixed(2)} {t.currency}
                      </span>
                                            {t.currency === 'EUR' && (
                                                <span className="text-[10px] text-slate-400 block leading-tight">
                          ≈ {t.amountChf.toFixed(2)} CHF
                        </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Riga Inferiore: Dettagli estesi e Azioni */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60 gap-2 text-xs">
                                        <div className="flex items-center gap-2 text-slate-400 min-w-0">
                      <span className="font-medium text-slate-600 dark:text-slate-300 truncate max-w-[150px] sm:max-w-none">
                        {t.categoryName}
                      </span>
                                            <span>•</span>
                                            <span className="inline-flex items-center gap-1 shrink-0">
                        <Calendar className="w-3 h-3" />
                                                {t.isPaid ? `Paid: ${t.paidDate}` : `Due: ${t.dueDate}`}
                      </span>
                                        </div>

                                        <div className="flex items-center justify-end gap-1.5 shrink-0 self-end sm:self-auto">
                                            {!t.isPaid && <PayNowButton transactionId={t.id} onPay={onPay} />}

                                            {canModify ? (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            onEdit(t);
                                                            onClose();
                                                        }}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                                        title="Edit transaction"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => handleDelete(t.id, t.title)}
                                                        isLoading={deletingId === t.id}
                                                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                                        title="Delete transaction"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <span
                                                    className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded select-none"
                                                    title="Paid transactions from previous months cannot be modified"
                                                >
                          Locked
                        </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </Modal>
    );
};