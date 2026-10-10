import { apiClient } from '../../../api/apiClient';
import type {
    GroceryItemDto,
    GroceryProductDto,
    AddGroceryItemRequest,
    UpdateGroceryItemDetailsRequest,
    UpdateProductPriceRequest,
    CheckoutRequest,
} from '../types/grocery.types';

export const groceryApi = {
    getItems: async (): Promise<GroceryItemDto[]> => {
        const response = await apiClient.get<GroceryItemDto[]>('/api/grocery');
        return response.data;
    },

    addItem: async (payload: AddGroceryItemRequest): Promise<GroceryItemDto> => {
        const response = await apiClient.post<GroceryItemDto>('/api/grocery', payload);
        return response.data;
    },

    toggleItem: async (id: number): Promise<GroceryItemDto> => {
        const response = await apiClient.patch<GroceryItemDto>(`/api/grocery/${id}/toggle`);
        return response.data;
    },

    updateItemDetails: async (
        id: number,
        payload: UpdateGroceryItemDetailsRequest
    ): Promise<GroceryItemDto> => {
        const response = await apiClient.patch<GroceryItemDto>(`/api/grocery/${id}/details`, payload);
        return response.data;
    },

    deleteItem: async (id: number): Promise<void> => {
        await apiClient.delete(`/api/grocery/${id}`);
    },

    updateProductPrice: async (
        productId: number,
        payload: UpdateProductPriceRequest
    ): Promise<{ productId: number; defaultPrice: number }> => {
        const response = await apiClient.patch<{ productId: number; defaultPrice: number }>(
            `/api/grocery/products/${productId}/price`,
            payload
        );
        return response.data;
    },

    checkout: async (payload: CheckoutRequest): Promise<{ message: string }> => {
        const response = await apiClient.post<{ message: string }>('/api/grocery/checkout', payload);
        return response.data;
    },

    getCatalogProducts: async (search?: string): Promise<GroceryProductDto[]> => {
        const params = search ? { search } : {};
        const response = await apiClient.get<GroceryProductDto[]>('/api/grocery/products', { params });
        return response.data;
    },

    deleteCatalogProduct: async (id: number): Promise<void> => {
        await apiClient.delete(`/api/grocery/products/${id}`);
    },
};