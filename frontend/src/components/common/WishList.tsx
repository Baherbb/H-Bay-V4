import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, ShoppingCart, Trash2, Package, X, Filter } from 'lucide-react';
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

interface WishlistProduct {
  id: number;
  name: string;
  price: number;
  image?: string;
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  discountPercentage?: number;
}

interface WishlistItemProps {
  product: WishlistProduct;
  removeFromWishlist: (id: number) => void;
  moveToCart: (product: WishlistProduct) => void;
  index: number;
}

const WishlistItem: React.FC<WishlistItemProps> = ({ 
  product, 
  removeFromWishlist, 
  moveToCart,
  index
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRemoving(true);
    setTimeout(() => removeFromWishlist(product.id), 300);
  }, [product.id, removeFromWishlist]);

  const getStockStatusColor = (status?: string) => {
    switch (status) {
      case 'in_stock': return 'text-green-600 bg-green-50 border-green-100';
      case 'low_stock': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'out_of_stock': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  const getStockStatusText = (status?: string) => {
    switch (status) {
      case 'in_stock': return 'In Stock';
      case 'low_stock': return 'Low Stock';
      case 'out_of_stock': return 'Out of Stock';
      default: return 'Checking Stock';
    }
  };

  return (
    <Card 
      className={`group relative border border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-xl transition-all duration-500 ${
        isRemoving ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
      }`}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <CardContent className="p-0">
        <div 
          className="relative cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => product.stockStatus !== 'out_of_stock' && moveToCart(product)}
        >
          <div className="relative overflow-hidden aspect-square rounded-t-lg bg-gray-50">
            <img
              src={product.image || "/api/placeholder/400/400"}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-700 ${
                isHovered ? 'scale-110 blur-[1px]' : 'scale-100'
              }`}
            />
            
            {product.discountPercentage && (
              <div className="absolute top-4 left-4 animate-in fade-in slide-in-from-left-4">
                <Badge className="bg-red-500 text-white border-0 shadow-lg">
                  {product.discountPercentage}% OFF
                </Badge>
              </div>
            )}

            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-500 flex items-center justify-center ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              {product.stockStatus !== 'out_of_stock' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveToCart(product);
                  }}
                  className="px-6 py-3 bg-white text-gray-900 rounded-lg transform -translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-2 hover:bg-orange-500 hover:text-white shadow-xl"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </button>
              )}
            </div>
          </div>

          <button
            onClick={handleRemove}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-white transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100 shadow-lg"
            aria-label="Remove from wishlist"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 text-lg mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-orange-500 transition-colors duration-300">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary"
                className={`${getStockStatusColor(product.stockStatus)} border shadow-sm`}
              >
                <Package className="h-3 w-3 mr-1" />
                {getStockStatusText(product.stockStatus)}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-end gap-2">
            <p className="text-2xl font-semibold text-orange-500">
              ${product.price.toFixed(2)}
            </p>
            {product.discountPercentage && (
              <p className="text-sm text-gray-500 line-through">
                ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EmptyWishlist: React.FC = () => (
  <div className="text-center py-16 px-6 bg-white rounded-2xl shadow-xl max-w-2xl mx-auto border border-gray-100">
    <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
      <Heart className="h-16 w-16 text-orange-500 animate-pulse" />
    </div>
    <h2 className="text-3xl font-semibold text-gray-900 mb-4">Your wishlist is empty</h2>
    <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
      Discover and save your favorite items for later. Start exploring our products!
    </p>
    <Link
      to="/products"
      className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-orange-500/30 transition-all duration-300 text-lg group"
    >
      Explore Products
      <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
    </Link>
  </div>
);

const Wishlist: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [items, setItems] = useState<WishlistProduct[]>([
    {
      id: 1,
      name: "Wireless Earbuds with Active Noise Cancellation",
      price: 79.99,
      stockStatus: 'in_stock',
      discountPercentage: 20
    },
    {
      id: 2,
      name: "Smart Speaker with Voice Assistant",
      price: 149.99,
      stockStatus: 'low_stock'
    },
    {
      id: 3,
      name: "Fitness Tracker with Heart Rate Monitor",
      price: 89.99,
      stockStatus: 'out_of_stock',
      discountPercentage: 15
    }
  ]);
  const [notification, setNotification] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filteredItems = items.filter(item => {
    if (filter === 'in_stock') return item.stockStatus === 'in_stock';
    if (filter === 'out_stock') return item.stockStatus === 'out_of_stock';
    if (filter === 'discounted') return item.discountPercentage !== undefined;
    return true;
  });

  const removeFromWishlist = useCallback((id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
    showNotification("Item removed from wishlist");
  }, []);

  const moveToCart = useCallback((product: WishlistProduct) => {
    removeFromWishlist(product.id);
    showNotification("Item added to cart");
  }, [removeFromWishlist]);

  const showNotification = useCallback((message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 relative">
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
          <Alert className="bg-white/80 backdrop-blur-support border-orange-200 shadow-lg">
            <AlertDescription className="flex items-center gap-2">
              {notification}
              <button 
                onClick={() => setNotification(null)}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-gray-500">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                <Filter className="h-5 w-5 text-gray-400" />
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border-0 bg-transparent focus:ring-0 text-sm text-gray-600"
                >
                  <option value="all">All Items</option>
                  <option value="in_stock">In Stock</option>
                  <option value="out_stock">Out of Stock</option>
                  <option value="discounted">Discounted</option>
                </select>
              </div>
            </div>
          )}
        </div>
        
        {items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <WishlistItem
                  key={item.id}
                  product={item}
                  removeFromWishlist={removeFromWishlist}
                  moveToCart={moveToCart}
                  index={index}
                />
              ))}
            </div>
            {filteredItems.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No items match the selected filter.
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

export default Wishlist;