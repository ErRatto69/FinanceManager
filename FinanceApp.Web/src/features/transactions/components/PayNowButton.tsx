import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { CheckCircle2 } from 'lucide-react';

interface PayNowButtonProps {
    transactionId: number;
    onPay: (id: number) => Promise<unknown>;
}

export const PayNowButton: React.FC<PayNowButtonProps> = ({ transactionId, onPay }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsLoading(true);
        try {
            await onPay(transactionId);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="primary"
            onClick={handleClick}
            isLoading={isLoading}
            className="text-xs py-1 px-2.5 h-7 bg-emerald-600 hover:bg-emerald-700"
            title="Mark as paid now"
        >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Pay Now
        </Button>
    );
};