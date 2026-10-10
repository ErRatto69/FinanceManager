import { useEffect, useState } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../context/useAuth';
import type { GroceryItemDto } from '../types/grocery.types';

export const GROCERY_ITEMS_QUERY_KEY = ['grocery-items'];

export const useGroceryHub = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const currentToken = localStorage.getItem('token') || token;
        if (!currentToken) return;

        let isMounted = true;

        const connection = new HubConnectionBuilder()
            .withUrl('/hubs/grocery', {
                accessTokenFactory: () => localStorage.getItem('token') || currentToken,
            })
            .withAutomaticReconnect([0, 2000, 5000, 10000])
            .configureLogging(LogLevel.Information)
            .build();

        connection.on('ItemAdded', (newItem: GroceryItemDto) => {
            queryClient.setQueryData<GroceryItemDto[]>(GROCERY_ITEMS_QUERY_KEY, (old = []) => {
                const filtered = old.filter((item) => item.id !== newItem.id);
                return [newItem, ...filtered];
            });
        });

        connection.on('ItemUpdated', (updatedItem: GroceryItemDto) => {
            queryClient.setQueryData<GroceryItemDto[]>(GROCERY_ITEMS_QUERY_KEY, (old = []) =>
                old.map((item) => (item.id === updatedItem.id ? updatedItem : item))
            );
        });

        connection.on('ItemToggled', (id: number, isChecked: boolean) => {
            queryClient.setQueryData<GroceryItemDto[]>(GROCERY_ITEMS_QUERY_KEY, (old = []) =>
                old.map((item) => (item.id === id ? { ...item, isChecked } : item))
            );
        });

        connection.on('ItemDeleted', (id: number) => {
            queryClient.setQueryData<GroceryItemDto[]>(GROCERY_ITEMS_QUERY_KEY, (old = []) =>
                old.filter((item) => item.id !== id)
            );
        });

        connection.on('ListCleared', () => {
            queryClient.setQueryData<GroceryItemDto[]>(GROCERY_ITEMS_QUERY_KEY, []);
            queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['stats'] });
        });

        connection.on('ProductPriceUpdated', (productId: number, newPrice: number) => {
            queryClient.setQueryData<GroceryItemDto[]>(GROCERY_ITEMS_QUERY_KEY, (old = []) =>
                old.map((item) =>
                    item.productId === productId ? { ...item, unitPrice: newPrice } : item
                )
            );
        });

        connection.onreconnecting(() => {
            if (isMounted) setIsConnected(false);
        });

        connection.onreconnected(() => {
            if (isMounted) setIsConnected(true);
        });

        connection.onclose(() => {
            if (isMounted) setIsConnected(false);
        });

        connection
            .start()
            .then(() => {
                if (isMounted) {
                    setIsConnected(true);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    console.error('SignalR Hub Connection Error:', err);
                    setIsConnected(false);
                }
            });

        return () => {
            isMounted = false;
            connection.stop().catch(() => {});
        };
    }, [token, queryClient]);

    return { isConnected };
};