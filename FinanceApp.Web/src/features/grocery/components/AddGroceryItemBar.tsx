import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search } from 'lucide-react';
import { groceryApi } from '../api/groceryApi';
import type { GroceryProductDto, AddGroceryItemRequest } from '../types/grocery.types';

interface AddGroceryItemBarProps {
    onAdd: (payload: AddGroceryItemRequest) => Promise<unknown>;
}

export const AddGroceryItemBar: React.FC<AddGroceryItemBarProps> = ({ onAdd }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [unit, setUnit] = useState('pz');
    const [suggestions, setSuggestions] = useState<GroceryProductDto[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!name.trim() || name.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const results = await groceryApi.getCatalogProducts(name.trim());
                setSuggestions(results);
                setShowSuggestions(results.length > 0);
            } catch {
                setSuggestions([]);
            }
        }, 250);

        return () => clearTimeout(timer);
    }, [name]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectSuggestion = (product: GroceryProductDto) => {
        setName(product.name);
        setShowSuggestions(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const parsedQty = parseFloat(quantity);
        setIsSubmitting(true);
        setShowSuggestions(false);

        try {
            await onAdd({
                productName: name.trim(),
                quantity: isNaN(parsedQty) || parsedQty <= 0 ? 1 : parsedQty,
                unit: unit.trim() || 'pz',
            });
            setName('');
            setQuantity('1');
            setUnit('pz');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div ref={containerRef} className="relative w-full">
            <form
                onSubmit={handleSubmit}
                className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs"
            >
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Add product (e.g. Latte, Pane)..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-3 pr-2 py-2 text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                        required
                    />
                </div>

                <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-14 px-1.5 py-2 text-sm text-center bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
                    title="Quantity"
                />

                <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-16 px-1 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                    <option value="pz">pz</option>
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="l">l</option>
                    <option value="conf">conf</option>
                </select>

                <button
                    type="submit"
                    disabled={isSubmitting || !name.trim()}
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white transition-colors cursor-pointer disabled:opacity-50"
                    title="Add product"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </form>

            {/* Autocomplete Catalogo Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-40 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg max-h-48 overflow-y-auto overflow-x-hidden p-1">
                    {suggestions.map((p) => (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => handleSelectSuggestion(p)}
                            className="w-full flex items-center justify-between p-2 rounded-lg text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <Search className="w-3.5 h-3.5 text-slate-400" />
                                <span className="font-medium text-slate-900 dark:text-white">{p.name}</span>
                            </div>
                            {p.defaultPrice > 0 && (
                                <span className="text-xs text-slate-400">{p.defaultPrice.toFixed(2)} CHF</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};