import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Heart, ArrowRight, ShoppingCart, Trash2, Package, X, 
  ChevronLeft, ChevronRight, SlidersHorizontal, Star
} from 'lucide-react';
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import { Button } from "../../components/ui/button";
import { Slider } from "../ui/Slider";
import { wishlistService, WishlistItem as WishlistServiceItem, WishlistFilters } from '../../services/wishlist.service';
import axios from 'axios';

interface WishlistProduct {
  id: number;
  name: string;
  price: number;
  image?: string;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  brand?: {
    id: number;
    name: string;
  };
  description?: string;
}

interface WishListProps {
  onClose: () => void;
}

interface WishlistItemProps {
  id: number;
  variant_id: number;
  priority: number;
  added_at: string;
  product: WishlistProduct;
}

interface FilterState extends WishlistFilters {
  stockStatus?: 'all' | 'in_stock' | 'out_stock';
}

const ITEMS_PER_PAGE = 12;
const API_BASE_URL = 'http://localhost:3000/api';

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

const getStockStatus = (stockQuantity: number): WishlistProduct['stockStatus'] => {
  if (stockQuantity === 0) return 'out_of_stock';
  if (stockQuantity < 10) return 'low_stock';
  return 'in_stock';
};

const getStockStatusColor = (status: WishlistProduct['stockStatus']) => ({
  in_stock: 'bg-green-50 text-green-700 border-green-200',
  low_stock: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  out_of_stock: 'bg-red-50 text-red-700 border-red-200'
}[status]);

const getStockStatusText = (status: WishlistProduct['stockStatus']) => ({
  in_stock: 'In Stock',
  low_stock: 'Low Stock',
  out_of_stock: 'Out of Stock'
}[status]);

const PriorityBadge: React.FC<{ priority: number }> = ({ priority }) => {
  const getPriorityColor = (p: number) => {
    if (p >= 8) return 'bg-red-50 text-red-700';
    if (p >= 5) return 'bg-orange-50 text-orange-700';
    return 'bg-blue-50 text-blue-700';
  };

  return (
    <Badge className={`${getPriorityColor(priority)} absolute top-4 left-4`}>
      <Star className="h-3 w-3 mr-1" />
      Priority {priority}
    </Badge>
  );
};

const WishlistItem: React.FC<{
  item: WishlistItemProps;
  onRemove: (variantId: number) => Promise<void>;
  onMoveToCart: (variantId: number) => Promise<void>;
  onUpdatePriority: (variantId: number, priority: number) => Promise<void>;
  index: number;
}> = ({ item, onRemove, onMoveToCart, onUpdatePriority, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const { product, variant_id, priority } = item;
  const addedDate = new Date(item.added_at).toLocaleDateString();

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRemoving(true);
    try {
      await onRemove(variant_id);
    } catch (error) {
      console.error('Failed to remove item:', error);
      setIsRemoving(false);
    }
  };

  const handleMoveToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stockStatus === 'out_of_stock') return;
    try {
      await onMoveToCart(variant_id);
      await onRemove(variant_id);
    } catch (error) {
      console.error('Failed to move item to cart:', error);
    }
  };

  const handlePriorityChange = async (newPriority: number) => {
    try {
      await onUpdatePriority(variant_id, newPriority);
    } catch (error) {
      console.error('Failed to update priority:', error);
    }
  };

  const getStockStatusStyle = (status: string) => {
    return status === 'in_stock' 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <Card className={`transform-gpu ${
      isRemoving ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
    } transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] bg-white rounded-xl overflow-hidden`}>
      <div className="relative group flex flex-col md:flex-row h-full">
        {/* Enhanced Image Section */}
        <div className="relative md:w-1/3 aspect-square md:aspect-auto">
          <img
            src={product.image || "/api/placeholder/400/400"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Priority Badge with enhanced styling */}
          <div className="absolute top-4 left-4 z-10">
            <Select
              value={priority.toString()}
              onValueChange={(value) => handlePriorityChange(parseInt(value))}
            >
              <SelectTrigger className="h-10 px-4 bg-white/95 backdrop-blur-sm hover:bg-white border-orange-200 hover:border-orange-400">
                <Star className="w-5 h-5 mr-2 text-orange-500" />
                <span className="text-orange-700">Priority {priority}</span>
              </SelectTrigger>
              <SelectContent>
                {[...Array(11)].map((_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    Priority {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Enhanced Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="absolute top-4 right-4 h-10 w-10 bg-white/95 backdrop-blur-sm hover:bg-red-50 hover:text-red-600 transition-colors duration-300 z-10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Enhanced Content Section */}
        <div className="md:w-2/3 p-6 flex flex-col justify-between bg-gradient-to-r from-orange-50/50">
          <div className="space-y-4">
            {product.brand && (
              <span className="text-sm font-medium text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                {product.brand.name}
              </span>
            )}
            
            <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
              {product.name}
            </h3>

            <p className="text-gray-600 line-clamp-2">{product.description}</p>

            <div className="flex items-center justify-between mt-4">
              <span className="text-3xl font-bold text-orange-600">
                ${product.price.toFixed(2)}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                getStockStatusStyle(product.stockStatus)
              }`}>
                {product.stockStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Enhanced Action Button */}
          {product.stockStatus !== 'out_of_stock' && (
            <Button 
              onClick={handleMoveToCart}
              className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

const EmptyWishlist: React.FC = () => (
  <div className="text-center py-16 px-6 bg-white rounded-2xl shadow-xl max-w-2xl mx-auto">
    <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-8">
      <Heart className="h-16 w-16 text-orange-500 animate-pulse" />
    </div>
    <h2 className="text-3xl font-semibold text-gray-900 mb-4">Your wishlist is empty</h2>
    <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
      Discover and save your favorite items for later. Start adding items to create your perfect wishlist!
    </p>
    <Link
      to="/products"
      className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300"
    >
      Explore Products
      <ArrowRight className="ml-2 h-5 w-5" />
    </Link>
  </div>
);

const FilterSidebar: React.FC<{
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  priceRange: { min: number; max: number };
}> = ({ filters, onFilterChange, priceRange }) => {
  const [localPriceRange, setLocalPriceRange] = useState([
    filters.minPrice || priceRange.min,
    filters.maxPrice || priceRange.max
  ]);

  const handlePriceChange = (values: number[]) => {
    setLocalPriceRange(values);
    onFilterChange({
      ...filters,
      minPrice: values[0],
      maxPrice: values[1]
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Sort By</h3>
        <Select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onValueChange={(value) => {
            const [sortBy, sortOrder] = value.split('-') as [WishlistFilters['sortBy'], WishlistFilters['sortOrder']];
            onFilterChange({ ...filters, sortBy, sortOrder });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="added_at-DESC">Newest First</SelectItem>
            <SelectItem value="added_at-ASC">Oldest First</SelectItem>
            <SelectItem value="priority-DESC">Highest Priority</SelectItem>
            <SelectItem value="priority-ASC">Lowest Priority</SelectItem>
            <SelectItem value="variant_price-DESC">Price: High to Low</SelectItem>
            <SelectItem value="variant_price-ASC">Price: Low to High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Stock Status</h3>
        <Select
          value={filters.stockStatus}
          onValueChange={(value) => onFilterChange({ ...filters, stockStatus: value as FilterState['stockStatus'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by stock..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="in_stock">In Stock Only</SelectItem>
            <SelectItem value="out_stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Price Range</h3>
        <div className="space-y-4">
          <Slider
            defaultValue={localPriceRange}
            min={priceRange.min}
            max={priceRange.max}
            step={1}
            onValueChange={handlePriceChange}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>${localPriceRange[0]}</span>
            <span>${localPriceRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const WishList: React.FC<WishListProps> = ({ onClose }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [wishlistItems, setWishlistItems] = useState<WishlistItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const navigate = useNavigate();

  const [filters, setFilters] = useState<FilterState>({
    page: 1,
    limit: ITEMS_PER_PAGE,
    sortBy: 'added_at',
    sortOrder: 'DESC',
    stockStatus: 'all',
    minPrice: undefined,
    maxPrice: undefined
  });

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchWishlistItems = useCallback(async () => {
    try {
      setLoading(true);
      const { stockStatus, ...apiFilters } = filters;
      const response = await wishlistService.getWishlistItems(apiFilters);
      
      if (response.items) {
        const formattedItems: WishlistItemProps[] = response.items.map(item => ({
          id: item.id,
          variant_id: item.variant_id,
          priority: item.priority,
          added_at: item.added_at,
          product: {
            id: item.variant.product.id,
            name: item.variant.product.name,
            price: Number(item.variant.price),
            image: item.variant.product.images.find(img => img.is_primary)?.image_url,
            stockStatus: getStockStatus(10),
            brand: item.variant.product.brand,
            description: item.variant.product.description
          }
        }));

        // Apply stock status filter client-side
        const filteredItems = stockStatus === 'all' 
          ? formattedItems
          : formattedItems.filter(item => 
              stockStatus === 'in_stock' 
                ? item.product.stockStatus === 'in_stock'
                : item.product.stockStatus === 'out_of_stock'
            );

        setWishlistItems(filteredItems);
        setTotalPages(response.totalPages || 1);
        
        // Update price range based on actual data
        if (formattedItems.length > 0) {
          const prices = formattedItems.map(item => item.product.price);
          setPriceRange({
            min: Math.floor(Math.min(...prices)),
            max: Math.ceil(Math.max(...prices))
          });
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          navigate('/login', { state: { from: '/wishlist' } });
        } else {
          setError('Failed to load wishlist');
        }
      }
    } finally {
      setLoading(false);
    }
  }, [filters, navigate]);

  const removeFromWishlist = async (variantId: number) => {
    try {
      await wishlistService.removeFromWishlist(variantId);
      await fetchWishlistItems();
      showNotification('Item removed from wishlist');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/login', { state: { from: '/wishlist' } });
      }
      showNotification('Failed to remove item');
      throw error;
    }
  };

  const moveToCart = async (variantId: number) => {
    try {
      await axios.post(
        `${API_BASE_URL}/cart/items`,
        { variant_id: variantId, quantity: 1 },
        { ...getAuthHeader(), withCredentials: true }
      );
      showNotification('Item added to cart');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/login', { state: { from: '/wishlist' } });
      }
      showNotification('Failed to add item to cart');
      throw error;
    }
  };

  const updatePriority = async (variantId: number, priority: number) => {
    try {
      await wishlistService.updateItemPriority(variantId, priority);
      await fetchWishlistItems();
      showNotification('Priority updated successfully');
    } catch (error) {
      showNotification('Failed to update priority');
      throw error;
    }
  };

  const handleFilterChange = (newFilters: FilterState) => {
    const searchParamsObj: Record<string, string> = {
      page: '1',
      limit: newFilters.limit?.toString() || ITEMS_PER_PAGE.toString(),
      sortBy: newFilters.sortBy || 'added_at',
      sortOrder: newFilters.sortOrder || 'DESC',
      stockStatus: newFilters.stockStatus || 'all',
    };

    if (newFilters.minPrice !== undefined) {
      searchParamsObj.minPrice = newFilters.minPrice.toString();
    }
    if (newFilters.maxPrice !== undefined) {
      searchParamsObj.maxPrice = newFilters.maxPrice.toString();
    }

    setFilters(newFilters);
    setCurrentPage(1);
    setSearchParams(searchParamsObj);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setFilters(prev => ({ ...prev, page }));
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', page.toString());
      return newParams;
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: '/wishlist' } });
      return;
    }
    fetchWishlistItems();
  }, [fetchWishlistItems, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      {notification && (
        <Alert className="fixed top-4 right-4 z-50 bg-white/80 backdrop-blur border-orange-200 animate-slideIn">
          <AlertDescription className="flex items-center">
            {notification}
            <button 
              onClick={() => setNotification(null)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </AlertDescription>
        </Alert>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-gray-500">
              {wishlistItems.length} items saved
            </p>
          </div>

          {wishlistItems.length > 0 && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters & Sort
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter & Sort Items</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterSidebar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    priceRange={priceRange}
                  />
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>

        {wishlistItems.length > 0 ? (
          <>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Reduced max-width for larger product cards */}
  {wishlistItems.length > 0 ? (
    <>
      <div className="grid grid-cols-1 gap-8"> {/* Changed to single column */}
          {wishlistItems.map((item, index) => (
            <WishlistItem
              key={item.id}
              item={item}
              onRemove={removeFromWishlist}
              onMoveToCart={moveToCart}
              onUpdatePriority={updatePriority}
              index={index}
            />
          ))}
            </div>
            {/* Rest of the pagination code remains same */}
          </>
        ) : (
          <EmptyWishlist />
        )}
      </div>


            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyWishlist />
        )}
      </div>
    </div>
  );
};

export default WishList;