import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import type { GroceryItemDto, UpdateGroceryItemDetailsRequest } from '../types/grocery.types';

interface EditItemDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: GroceryItemDto | null;
    onSubmit: (id: number, payload: UpdateGroceryItemDetailsRequest) => Promise<unknown>;
}

export const EditItemDetailsModal: React.FC<EditItemDetailsModalProps> = ({
                                                                              isOpen,
                                                                              onClose,
                                                                              item,
                                                                              onSubmit,
                                                                          }) => {
    const [quantity, setQuantity] = useState('1');
    const [unit, setUnit] = useState('pz');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (item) {
            setQuantity(item.quantity.toString());
            setUnit(item.unit);
        }
    }, [item, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!item) return;

        const parsedQty = parseFloat(quantity);
        if (isNaN(parsedQty) || parsedQty <= 0) return;

        setIsLoading(true);
        try {
            await onSubmit(item.id, { quantity: parsedQty, unit });
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Edit: ${item?.productName || ''}`}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="Quantity"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />

                    <Select
                        label="Unit"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        options={[
                            { value: 'pz', label: 'pz (Pieces)' },
                            { value: 'kg', label: 'kg (Kilograms)' },
                            { value: 'g', label: 'g (Grams)' },
                            { value: 'l', label: 'l (Liters)' },
                            { value: 'conf', label: 'conf (Packs)' },
                        ]}
                    />
                </div>

                <div className="flex justify-end gap-2 mt-2">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        Update
                    </Button>
                </div>
            </form>
        </Modal>
    );
};