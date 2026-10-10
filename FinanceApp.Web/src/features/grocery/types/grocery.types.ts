export interface GroceryItemDto {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    isChecked: boolean;
    addedByUserId: number;
    addedByUsername: string;
}

export interface GroceryProductDto {
    id: number;
    name: string;
    defaultPrice: number;
}

export interface AddGroceryItemRequest {
    productName: string;
    quantity?: number;
    unit?: string;
}

export interface UpdateGroceryItemDetailsRequest {
    quantity: number;
    unit: string;
}

export interface UpdateProductPriceRequest {
    price: number;
}

export interface CheckoutRequest {
    actualTotal: number;
}