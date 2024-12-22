import api from './api';

interface CartResponse {
    success: boolean;
    data: any;
    message?: string;
    }

    interface AddToCartPayload {
    variant_id: number;
    quantity: number;
    }

    class CartService {
    private baseUrl = '/cart';

    async addToCart(variantId: number, quantity: number = 1) {
        try {
        const response = await api.post<CartResponse>(`${this.baseUrl}/items`, {
            variant_id: variantId,
            quantity
        });
        return response.data;
        } catch (error) {
        throw this.handleError(error);
        }
    }

    async getCart() {
        try {
        const response = await api.get<CartResponse>(this.baseUrl);
        return response.data;
        } catch (error) {
        throw this.handleError(error);
        }
    }

    async updateItemQuantity(variantId: number, quantity: number) {
        try {
        const response = await api.put<CartResponse>(`${this.baseUrl}/items/${variantId}`, {
            quantity
        });
        return response.data;
        } catch (error) {
        throw this.handleError(error);
        }
    }

    async removeItem(variantId: number) {
        try {
        const response = await api.delete<CartResponse>(`${this.baseUrl}/items/${variantId}`);
        return response.data;
        } catch (error) {
        throw this.handleError(error);
        }
    }

    private handleError(error: any) {
        if (error.response) {
        const message = error.response.data.message || 'An error occurred';
        return new Error(message);
        }
        return new Error('Network error occurred');
    }
}

export const cartService = new CartService();