import axios from 'axios';

export interface Product {
    default_variant_id: number;
    id: number;
    name: string;
    description: string;
    price: number;
    category_id: number;
    brand_id: number;
    model_number?: string;
    release_date?: string;
    warranty_info?: string;
    tech_category?: string;
    weight?: number;
    dimensions?: string;
    created_at: string;
    updated_at: string;
    
    
    category?: Category;
    brand?: Brand;
    specifications?: ProductSpecification;
    variants?: ProductVariant[];
    images?: ProductImage[];
    compatibility?: ProductCompatibility[];
}

export interface ProductVariant {
    id?: number;
    product_id: number;
    name: Product["name"];
    sku: string;
    color?: string;
    storage_capacity?: string;
    ram_size?: string;
    cellular?: string;
    price: number;
    stock_quantity: number;
    created_at: string;
    updated_at: string;
    images?: ProductImage[];
}

export interface ProductImage {
    id?: number;
    product_id?: number;
    variant_id?: number | null;
    image_url: string;
    is_primary: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface ProductSpecification {
    id?: number;
    product_id: number;
    processor?: string;
    ram?: string;
    storage?: string;
    display_size?: string;
    display_resolution?: string;
    battery_capacity?: string;
    operating_system?: string;
    camera_specs?: string;
    connectivity?: string;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
    parent_category_id?: number;
    created_at: Date;
    updated_at: Date;
}

export interface Brand {
    id: number;
    name: string;
    logo_url?: string;
    description?: string;
    created_at: Date;
    updated_at: Date;
}

export interface ProductCompatibility {
    id: number;
    product_id: number;
    compatible_with_id: number;
    created_at: Date;
    compatibleWith?: {
        id: number;
        name: string;
    };
}


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const transformProduct = (product: any): Product => {
    const data = product.dataValues || product;

    return {
        id: data.id,
        name: data.name,
        description: data.description,
        price: Number(data.price),
        default_variant_id: data.default_variant_id || null,
        category_id: data.category_id || ((data.category?.dataValues || data.category) || {}).id || 0,
        brand_id: data.brand_id || ((data.brand?.dataValues || data.brand) || {}).id || 0,
        created_at: data.created_at || new Date(),
        updated_at: data.updated_at || new Date(),
        images: (data.images || []).map((img: any) => ({
            image_url: (img.dataValues || img).image_url,
            is_primary: (img.dataValues || img).is_primary || false
        })),
        category: {
            id: ((data.category?.dataValues || data.category) || {}).id || 0,
            name: ((data.category?.dataValues || data.category) || {}).name || '',
            description: ((data.category?.dataValues || data.category) || {}).description || '',
            parent_category_id: ((data.category?.dataValues || data.category) || {}).parent_category_id || null,
            created_at: ((data.category?.dataValues || data.category) || {}).created_at || new Date(),
            updated_at: ((data.category?.dataValues || data.category) || {}).updated_at || new Date()
        },
        brand: {
            id: ((data.brand?.dataValues || data.brand) || {}).id || 0,
            name: ((data.brand?.dataValues || data.brand) || {}).name || '',
            logo_url: ((data.brand?.dataValues || data.brand) || {}).logo_url || '',
            description: ((data.brand?.dataValues || data.brand) || {}).description || '',
            created_at: ((data.brand?.dataValues || data.brand) || {}).created_at || new Date(),
            updated_at: ((data.brand?.dataValues || data.brand) || {}).updated_at || new Date()
        },
        specifications: (data.specifications?.dataValues || data.specifications || {}),
        variants: (data.variants || []).map((variant: any) => {
            const variantData = variant.dataValues || variant;
            return {
                id: variantData.id,
                color: variantData.color || '',
                storage_capacity: variantData.storage_capacity || '',
                ram_size: variantData.ram_size || '',
                price: Number(variantData.price) || 0,
                stock_quantity: variantData.stock_quantity || 0
            };
        })
    };
};

export const productService = {
    getProducts: async (params?: {
        search?: string;
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'ASC' | 'DESC';
        category?: number;
        brand?: number;
        minPrice?: number;
        maxPrice?: number;
        tech_category?: string;
    }) => {
        try {
            const response = await api.get('/products/search', { params });
            return {
                products: (response.data.data || []).map(transformProduct),
                pagination: response.data.pagination || {
                    page: 1,
                    limit: 10,
                    total: 0,
                    totalPages: 0
                }
            };
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },
    createProduct: async (productData: Partial<Product>) => {
        try {
            const response = await api.post('/products', {
                ...productData,
                variants: productData.variants?.map(variant => ({
                    ...variant,
                    id: undefined
                })),
                images: productData.images?.map((image, index) => ({
                    image_url: image.image_url,
                    is_primary: image.is_primary,
                    display_order: index + 1,
                    variant_id: null, 
                    created_at: new Date().toISOString()
                }))
            });
            return transformProduct(response.data);
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },
    
    
    updateProduct: async (id: number, productData: Partial<Product>) => {
        try {
            const response = await api.put(`/products/${id}`, {
                ...productData,
                variants: productData.variants?.map(variant => ({
                    ...variant,
                    // Keep the id if it exists (for existing variants)
                    id: variant.id
                })),
                images: productData.images?.map((image, index) => ({
                    image_url: image.image_url,
                    is_primary: image.is_primary,
                    display_order: index + 1,
                    variant_id: null,
                    updated_at: new Date().toISOString()
                }))                
            });
            return transformProduct(response.data);
        } catch (error) {
            console.error(`Error updating product ${id}:`, error);
            throw error;
        }
    },
    
    deleteProduct: async (id: number) => {
        try {
            await api.delete(`/products/${id}`);
            return true;
        } catch (error) {
            console.error(`Error deleting product ${id}:`, error);
            throw error;
        }
    },

    getSortedProducts: async (params?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'ASC' | 'DESC';
        category?: number;
        brand?: number;
        minPrice?: number;
        maxPrice?: number;
        tech_category?: string;
    }) => {
        try {
            const response = await api.get('/products/sorted', { params });
            return {
                products: (response.data.products || []).map(transformProduct),
                total: response.data.total,
                page: response.data.page,
                totalPages: response.data.totalPages
            };
        } catch (error) {
            console.error('Error fetching sorted products:', error);
            throw error;
        }
    },

    getProductById: async (id: number) => {
        try {
            const response = await api.get(`/products/${id}`);
            return transformProduct(response.data);
        } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            throw error;
        }
    }
};

export const categoryService = {
    getCategories: async () => {
        try {
            const response = await api.get('/categories');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },
    getAllBrands: async (): Promise<Brand[]> => {
        try {
            const response = await api.get('/brands');
            return response.data;
        } catch (error) {
            console.error('Error fetching brands:', error);
            throw error;
        }
    },
    getCategoryById: async (id: number) => {
        try {
            const response = await api.get(`/categories/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching category ${id}:`, error);
            throw error;
        }
    }
};
