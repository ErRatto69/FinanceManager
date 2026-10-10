import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import type { GroceryItemDto, UpdateProductPriceRequest } from '../types/grocery.types';

interface EditProductPriceModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: GroceryItemDto | null;
    onSubmit: (productId: number, payload: UpdateProductPriceRequest) => Promise<unknown>;
}

export const EditProductPriceModal: React.FC<EditProductPriceModalProps> = ({
                                                                                isOpen,
                                                                                onClose,
                                                                                item,
                                                                                onSubmit,
                                                                            }) => {
    const [price, setPrice] = useState('0.00');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (item) {
            setPrice(item.unitPrice.toString());
        }
    }, [item, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!item) return;

        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice < 0) return;

        setIsLoading(true);
        try {
            await onSubmit(item.productId, { price: parsedPrice });
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Set Price for: ${item?.productName || ''}`}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <p className="text-xs text-slate-500">
                    Updating this price saves it to the product catalog memory for future lists.
                </p>

                <Input
                    label="Catalog Unit Price (CHF)"
                    type="number"
                    step="0.05"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />

                <div className="flex justify-end gap-2 mt-2">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        Save Price
                    </Button>
                </div>
            </form>
        </Modal>
    );
};