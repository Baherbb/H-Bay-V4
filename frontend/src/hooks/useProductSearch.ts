import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';
// import { Product } from '../services/api.service';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000'; 



export interface Product {
    id: string;
    name: string;
    price: number | null;
    model_number?: string;
}

interface ProductSearchParams {
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    tech_category?: string;
}

interface SearchResponse {
    data: Product[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export const useProductSearch = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const cancelTokenSource = useRef<any>(null);

  const searchProducts = async (params: ProductSearchParams) => {
    try {
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel('New search initiated');
      }
      
      cancelTokenSource.current = axios.CancelToken.source();
      
      setLoading(true);
      setError(null);

      if (!params.search?.trim() && params.limit === 5) {
        setSuggestions([]);
        return [];
      }

      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await axios.get<SearchResponse>(
        `${API_BASE_URL}/api/products/search?${queryParams}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 8000,
          cancelToken: cancelTokenSource.current.token
        }
      );

      // Ensure the data conforms to the Product interface
      const validatedData: Product[] = response.data.data.map(product => ({
        ...product,
        price: typeof product.price === 'number' && !isNaN(product.price) 
          ? product.price 
          : null
      }));

      if (params.limit === 5) {
        setSuggestions(validatedData);
      } else {
        setProducts(validatedData);
        setPagination(response.data.pagination);
      }

      return validatedData;

    } catch (err) {
      if (axios.isCancel(err)) {
        // Request was cancelled, don't show error
        return [];
      }

      let errorMessage = 'An error occurred while searching products';
      
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          errorMessage = 'Search request timed out. Please try again.';
        } else if (err.response?.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment.';
        } else if (err.response) {
          errorMessage = err.response.data?.message || 'Server error occurred';
        } else if (err.request) {
          errorMessage = 'Unable to reach the server. Please check your connection.';
        }
      }
      
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Increase debounce time to prevent too many requests
  const debouncedSearch = debounce(searchProducts, 500);

  // Cleanup
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel('Component unmounted');
      }
    };
  }, []);

  return {
    products,
    suggestions,
    loading,
    error,
    pagination,
    searchProducts,
    debouncedSearch,
};
};