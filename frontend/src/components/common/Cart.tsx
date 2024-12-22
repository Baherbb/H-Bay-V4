import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, X } from 'lucide-react';
import { cartService } from '../../services/cart.service';

interface CartData {
  id: number;
  user_id: number;
  cartItems: CartItem[];
  created_at?: Date;
  updated_at?: Date;
}

interface CartItem {
  variant: {
    id: number;
    product: {
      id: number;
      name: string;
      price: number;
      images: Array<{
        id: number;
        url: string;
        is_primary: boolean;
      }>;
      brand?: {
        id: number;
        name: string;
      };
      description?: string;
    };
    name: string;
  };
  quantity: number;
  added_at?: Date;
}

interface CartItemProps {
  product: CartItem;
  updateQuantity: (variantId: number, quantity: number) => void;
  removeItem: (variantId: number) => void;
}

interface CartProps {
  onClose: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ product, updateQuantity, removeItem }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-6 border-b border-gray-100"
    >
      <div className="relative group">
        <img
          src={product.variant.product.images.find(img => img.is_primary)?.url || '/placeholder.jpg'}
          alt={product.variant.product.name}
          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-200"
        />
      </div>
      
      <div className="flex-1 min-w-0 space-y-1">
        <h3 className="text-lg font-medium text-gray-900 truncate">
          {product.variant.product.name}
        </h3>
        <p className="text-sm text-gray-500">{product.variant.name}</p>
        
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <div className="flex items-center border-2 border-gray-200 rounded-lg">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => updateQuantity(product.variant.id, product.quantity - 1)}
              className="p-2 hover:text-orange-500 transition-colors disabled:opacity-50"
              disabled={product.quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </motion.button>
            <span className="px-4 py-2 font-medium">{product.quantity}</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => updateQuantity(product.variant.id, product.quantity + 1)}
              className="p-2 hover:text-orange-500 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </motion.button>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => removeItem(product.variant.id)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
      
      <div className="text-right ml-auto">
        <p className="text-lg font-medium text-gray-900">
          ${product.variant.product.price}
        </p>
        <p className="text-sm text-gray-500">
          Total: ${(product.variant.product.price * product.quantity).toFixed(2)}
        </p>
      </div>
    </motion.div>
  );
};

const EmptyCart: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-12"
  >
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
    >
      <ShoppingCart className="h-12 w-12 text-orange-500" />
    </motion.div>
    <h2 className="text-2xl font-medium text-gray-900 mb-3">Your cart is empty</h2>
    <p className="text-gray-500 mb-8">Looks like you haven't added anything yet</p>
    <Link
      to="/products"
      className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-white bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-1"
    >
      Start Shopping
      <ArrowRight className="ml-2 h-5 w-5" />
    </Link>
  </motion.div>
);

const LoadingState: React.FC = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
  </div>
);

const Cart: React.FC<CartProps> = ({ onClose }) => {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const API_URL = 'http://localhost:3000/api';
  const handleCheckout = async () => {
    if (!cartData?.cartItems?.length) {
      setCheckoutError('Your cart is empty');
      return;
    }

    try {
      setIsCheckingOut(true);
      setCheckoutError(null);

      // Calculate total amount
      const total = cartData.cartItems.reduce(
        (sum, item) => sum + (item.variant.product.price * item.quantity),
        0
      );

      // Prepare order data
      const orderData = {
        user_id: cartData.user_id,
        total_amount: total,
        items: cartData.cartItems.map(item => ({
          variant_id: item.variant.id,
          quantity: item.quantity,
          price_at_time: item.variant.product.price
        }))
      };

      // Create order
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create order');
      }

      if (result.success && result.data?.id) {
        // Clear the cart after successful order creation (optional)
        // await cartService.clearCart();
        
        // Navigate to payment page
        navigate(`/payment/${result.data.id}`);
        onClose();
      } else {
        throw new Error('Order creation failed: Invalid response format');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutError(error instanceof Error ? error.message : 'Failed to process checkout');
    } finally {
      setIsCheckingOut(false);
    }
  };
  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await cartService.getCart();
      console.log('Cart Response:', response);

      if (response.success && response.data) {
        // Transform the data structure if needed
        const transformedData = {
          ...response.data,
          cartItems: response.data.cartItems?.map((item: any) => ({
            ...item,
            variant: {
              ...item.variant,
              product: {
                ...item.variant.product,
                images: item.variant.product.images?.map((img: any) => ({
                  ...img,
                  url: img.image_url || img.url // Handle both image_url and url fields
                }))
              }
            }
          }))
        };
        
        setCartData(transformedData);
        console.log('Transformed Cart Data:', transformedData);
      } else {
        setError('Failed to fetch cart data');
      }
    } catch (err) {
      console.error('Cart fetch error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (variantId: number, newQuantity: number) => {
    try {
      await cartService.updateItemQuantity(variantId, newQuantity);
      await fetchCart();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const removeItem = async (variantId: number) => {
    try {
      await cartService.removeItem(variantId);
      await fetchCart();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cartData?.cartItems?.reduce(
    (sum, item) => sum + (item.variant.product.price * item.quantity),
    0
  ) || 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed right-0 top-0 h-full w-full sm:w-[28rem] md:w-[32rem] bg-white shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-medium text-gray-900">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto px-6">
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <div className="text-center text-red-500 p-4">{error}</div>
          ) : (
            <AnimatePresence>
              {cartData?.cartItems?.length ? (
                <div className="divide-y divide-gray-100">
                  {cartData.cartItems.map((item: CartItem) => (
                    <CartItem
                      key={item.variant.id}
                      product={item}
                      updateQuantity={updateQuantity}
                      removeItem={removeItem}
                    />
                  ))}
                </div>
              ) : (
                <EmptyCart />
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        {cartData && cartData?.cartItems && cartData.cartItems.length > 0 && (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-t border-gray-200 p-6 bg-white"
      >
        <div className="flex justify-between text-xl font-medium mb-6">
          <span>Subtotal</span>
          <span className="text-orange-600">${total.toFixed(2)}</span>
        </div>
        
        {checkoutError && (
          <div className="mb-4 text-red-500 text-sm text-center">
            {checkoutError}
          </div>
        )}
        
        <div className="space-y-4">
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className={`block w-full px-6 py-4 text-center rounded-xl text-white 
              ${isCheckingOut 
                ? 'bg-orange-400 cursor-not-allowed' 
                : 'bg-orange-500 hover:bg-orange-600 hover:shadow-orange-500/30 hover:-translate-y-1'
              } 
              shadow-lg transition-all duration-300 transform`}
          >
            {isCheckingOut ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </div>
            ) : (
              'Proceed to Checkout'
            )}
          </button>

          <Link
            to="/products"
            className="block w-full px-6 py-4 text-center rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-300"
            onClick={onClose}
          >
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    )}
      </motion.div>
    </motion.div>
  );
};

export default Cart;

