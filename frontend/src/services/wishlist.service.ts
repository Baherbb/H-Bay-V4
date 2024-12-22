import api from './api';

export interface WishlistItem {
    id: number;
    variant_id: number;
    priority: number;
    added_at: string;
    variant: {
        id: number;
        price: number;
        product: {
            id: number;
            name: string;
            price: number;
            description: string;
            images: Array<{
                id: number;
                image_url: string;
                is_primary: boolean;
            }>;
            brand: {
                id: number;
                name: string;
            };
        };
    };
}

export interface WishlistResponse {
    success: boolean;
    items?: WishlistItem[];
    total?: number;
    page?: number;
    totalPages?: number;
    itemsPerPage?: number;
    message?: string;
}

export interface WishlistFilters {
    page?: number;
    limit?: number;
    sortBy?: 'added_at' | 'priority' | 'variant_price';
    sortOrder?: 'ASC' | 'DESC';
    brand?: number;
    category?: number;
    minPrice?: number;
    maxPrice?: number;
}

class WishlistService {
    private baseUrl = '/wishlist';

    async getWishlistItems(filters: WishlistFilters = {}) {
        try {
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined) {
                    queryParams.append(key, value.toString());
                }
            });

            const response = await api.get<WishlistResponse>(
                `${this.baseUrl}?${queryParams.toString()}`
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async addToWishlist(variantId: number, priority: number = 0) {
        try {
            const response = await api.post<WishlistResponse>(
                `${this.baseUrl}/items`,
                { variant_id: variantId, priority }
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async removeFromWishlist(variantId: number) {
        try {
            const response = await api.delete<WishlistResponse>(
                `${this.baseUrl}/items/${variantId}`
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async updateItemPriority(variantId: number, priority: number) {
        try {
            const response = await api.put<WishlistResponse>(
                `${this.baseUrl}/items/${variantId}`,
                { priority }
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async clearWishlist() {
        try {
            const response = await api.delete<WishlistResponse>(this.baseUrl);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async checkItemInWishlist(variantId: number): Promise<boolean> {
        try {
            const response = await this.getWishlistItems();
            return response.items?.some(item => item.variant_id === variantId) ?? false;
        } catch (error) {
            console.error('Error checking wishlist status:', error);
            return false;
        }
    }

    private handleError(error: any): never {
        if (error.response) {
            const message = error.response.data.message || 'An error occurred';
            throw new Error(message);
        }
        throw new Error('Network error occurred');
    }
}

export const wishlistService = new WishlistService();