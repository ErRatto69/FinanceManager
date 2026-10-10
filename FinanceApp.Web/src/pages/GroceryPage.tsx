import React, { useState, useMemo } from 'react';
import { useGroceryQuery } from '../features/grocery/hooks/useGroceryQuery';
import { useGroceryHub } from '../features/grocery/hooks/useGroceryHub';
import { AddGroceryItemBar } from '../features/grocery/components/AddGroceryItemBar';
import { GroceryItemRow } from '../features/grocery/components/GroceryItemRow';
import { EditItemDetailsModal } from '../features/grocery/components/EditItemDetailsModal';
import { EditProductPriceModal } from '../features/grocery/components/EditProductPriceModal';
import { CheckoutModal } from '../features/grocery/components/CheckoutModal';
import { Button } from '../components/ui/Button';
import type { GroceryItemDto } from '../features/grocery/types/grocery.types';
import { ShoppingCart, ShoppingBag, Wifi, WifiOff, Loader2, AlertCircle } from 'lucide-react';

export const GroceryPage: React.FC = () => {
    const { isConnected } = useGroceryHub();
    const {
        data: items,
        isLoading,
        isError,
        addItem,
        toggleItem,
        updateItemDetails,
        deleteItem,
        updateProductPrice,
        checkout,
    } = useGroceryQuery();

    const [detailsItem, setDetailsItem] = useState<GroceryItemDto | null>(null);
    const [priceItem, setPriceItem] = useState<GroceryItemDto | null>(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // Suddivisione tra da comprare e già nel carrello
    const { uncheckedItems, checkedItems, estimatedTotal } = useMemo(() => {
        const unchecked: GroceryItemDto[] = [];
        const checked: GroceryItemDto[] = [];
        let total = 0;

        (items || []).forEach((item) => {
            if (item.isChecked) {
                checked.push(item);
            } else {
                unchecked.push(item);
            }
            if (item.unitPrice > 0) {
                total += item.quantity * item.unitPrice;
            }
        });

        return { uncheckedItems: unchecked, checkedItems: checked, estimatedTotal: total };
    }, [items]);

    return (
        <div className="space-y-5 max-w-3xl mx-auto">
            {/* Header con indicatore Real-Time SignalR */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <ShoppingCart className="w-6 h-6 text-emerald-600" />
                        Grocery List
                    </h1>
                    <p className="text-xs text-slate-500">Live collaborative shopping list</p>
                </div>

                <div className="flex items-center gap-2">
                    <div
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                            isConnected
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60'
                                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60'
                        }`}
                    >
                        {isConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                        <span>{isConnected ? 'Live Sync' : 'Reconnecting...'}</span>
                    </div>
                </div>
            </div>

            {/* Barra di Inserimento */}
            <AddGroceryItemBar onAdd={addItem} />

            {/* Box Riepilogo Costi & Checkout */}
            {items && items.length > 0 && (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <div>
                        <span className="text-xs text-slate-400 block font-medium">Estimated Total</span>
                        <span className="text-base font-bold text-slate-900 dark:text-white">
              {estimatedTotal.toFixed(2)} CHF
            </span>
                    </div>

                    <Button
                        onClick={() => setIsCheckoutOpen(true)}
                        className="text-xs py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700"
                    >
                        <ShoppingBag className="w-4 h-4 mr-1.5" />
                        Checkout ({checkedItems.length}/{items.length})
                    </Button>
                </div>
            )}

            {/* Caricamento / Errori */}
            {isLoading && (
                <div className="flex justify-center items-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
            )}

            {isError && (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>Failed to load grocery list. Verify network connection.</span>
                </div>
            )}

            {/* Lista Articoli */}
            {items && (
                <div className="space-y-5">
                    {items.length === 0 ? (
                        <div className="text-center py-14 bg-white dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                            <ShoppingCart className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Your grocery list is empty!
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                Type an item in the input bar above to add it.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Da Comprare */}
                            {uncheckedItems.length > 0 && (
                                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
                    To Buy ({uncheckedItems.length})
                  </span>
                                    <div className="space-y-2">
                                        {uncheckedItems.map((item) => (
                                            <GroceryItemRow
                                                key={item.id}
                                                item={item}
                                                onToggle={toggleItem}
                                                onEditDetails={setDetailsItem}
                                                onEditPrice={setPriceItem}
                                                onDelete={deleteItem}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Nel Carrello (Checked) */}
                            {checkedItems.length > 0 && (
                                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
                    In Cart ({checkedItems.length})
                  </span>
                                    <div className="space-y-2">
                                        {checkedItems.map((item) => (
                                            <GroceryItemRow
                                                key={item.id}
                                                item={item}
                                                onToggle={toggleItem}
                                                onEditDetails={setDetailsItem}
                                                onEditPrice={setPriceItem}
                                                onDelete={deleteItem}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Modali Ausiliari */}
            <EditItemDetailsModal
                isOpen={!!detailsItem}
                onClose={() => setDetailsItem(null)}
                item={detailsItem}
                onSubmit={async (id, payload) => updateItemDetails({ id, payload })}
            />

            <EditProductPriceModal
                isOpen={!!priceItem}
                onClose={() => setPriceItem(null)}
                item={priceItem}
                onSubmit={async (productId, payload) => updateProductPrice({ productId, payload })}
            />

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                estimatedTotal={estimatedTotal}
                checkedCount={checkedItems.length}
                onSubmit={checkout}
            />
        </div>
    );
};