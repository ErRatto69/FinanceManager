import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groceryApi } from '../api/groceryApi';
import { GROCERY_ITEMS_QUERY_KEY } from './useGroceryHub';
import type {
    GroceryItemDto,
    AddGroceryItemRequest,
    UpdateGroceryItemDetailsRequest,
    UpdateProductPriceRequest,
    CheckoutRequest,
} from '../types/grocery.types';

export const useGroceryQuery = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: GROCERY_ITEMS_QUERY_KEY,
        queryFn: groceryApi.getItems,
    });

    const addItemMutation = useMutation({
        mutationFn: (payload: AddGroceryItemRequest) => groceryApi.addItem(payload),
        onSuccess: (savedItem: GroceryItemDto) => {
            queryClient.setQueryData<GroceryItemDto[]>(GROCERY_ITEMS_QUERY_KEY, (old = []) => {
                const filtered = old.filter((i) => i.id !== savedItem.id);
                return [savedItem, ...filtered];
            });
        },
    });

    const toggleMutation = useMutation({
        mutationFn: (id: number) => groceryApi.toggleItem(id),
        onSuccess: (updatedItem: GroceryItemDto) => {
            queryClient.setQueryData<GroceryItemDto[]>(GROCERY_ITEMS_QUERY_KEY, (old = []) =>
                old.map((i) => (i.id === updatedItem.id ? updatedItem : i))
            );
        },
    });

    const updateDetailsMutation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateGroceryItemDetailsRequest }) =>
            groceryApi.updateItemDetails(id, payload),
        onSuccess: (updatedItem: GroceryItemDto) => {
            queryClient.setQueryData<GroceryItemDto[]>(GROCERY_ITEMS_QUERY_KEY, (old = []) =>
                old.map((i) => (i.id === updatedItem.id ? updatedItem : i))
            );
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => groceryApi.deleteItem(id),
        onSuccess: (_, deletedId) => {
            queryClient.setQueryData<GroceryItemDto[]>(GROCERY_ITEMS_QUERY_KEY, (old = []) =>
                old.filter((i) => i.id !== deletedId)
            );
        },
    });

    const updatePriceMutation = useMutation({
        mutationFn: ({ productId, payload }: { productId: number; payload: UpdateProductPriceRequest }) =>
            groceryApi.updateProductPrice(productId, payload),
        onSuccess: (data) => {
            queryClient.setQueryData<GroceryItemDto[]>(GROCERY_ITEMS_QUERY_KEY, (old = []) =>
                old.map((i) => (i.productId === data.productId ? { ...i, unitPrice: data.defaultPrice } : i))
            );
        },
    });

    const checkoutMutation = useMutation({
        mutationFn: (payload: CheckoutRequest) => groceryApi.checkout(payload),
        onSuccess: () => {
            queryClient.setQueryData(GROCERY_ITEMS_QUERY_KEY, []);
            queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['stats'] });
        },
    });

    return {
        ...query,
        addItem: addItemMutation.mutateAsync,
        isAdding: addItemMutation.isPending,
        toggleItem: toggleMutation.mutateAsync,
        updateItemDetails: updateDetailsMutation.mutateAsync,
        deleteItem: deleteMutation.mutateAsync,
        updateProductPrice: updatePriceMutation.mutateAsync,
        checkout: checkoutMutation.mutateAsync,
        isCheckingOut: checkoutMutation.isPending,
    };
};