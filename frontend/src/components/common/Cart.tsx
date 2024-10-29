import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, X } from 'lucide-react';

interface CartProduct {
  id: number;
  name: string;
  variant: string;
  price: number;
  quantity: number;
}

interface CartItemProps {
  product: CartProduct;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
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
          src="/api/placeholder/120/120"
          alt={product.name}
          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-200"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all duration-200" />
      </div>
      
      <div className="flex-1 min-w-0 space-y-1">
        <h3 className="text-lg font-medium text-gray-900 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.variant}</p>
        
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <div className="flex items-center border-2 border-gray-200 rounded-lg shadow-sm hover:border-orange-200 transition-colors duration-200">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => updateQuantity(product.id, product.quantity - 1)}
              className="p-2 hover:text-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={product.quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </motion.button>
            <span className="px-4 py-2 font-medium min-w-[40px] text-center">
              {product.quantity}
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => updateQuantity(product.id, product.quantity + 1)}
              className="p-2 hover:text-orange-500 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </motion.button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => removeItem(product.id)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
      
      <div className="text-right ml-auto mt-2 sm:mt-0">
        <p className="text-lg font-medium text-gray-900">${product.price}</p>
        <p className="text-sm text-gray-500">
          Total: ${(product.price * product.quantity).toFixed(2)}
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

const Cart: React.FC<CartProps> = ({ onClose }) => {
  const [items, setItems] = useState<CartProduct[]>([
    {
      id: 1,
      name: "Wireless Headphones",
      variant: "Black",
      price: 99.99,
      quantity: 1
    },
    {
      id: 2,
      name: "Smart Watch",
      variant: "Silver",
      price: 199.99,
      quantity: 1
    }
  ]);

  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className={`fixed right-0 top-0 h-full w-full sm:w-[28rem] md:w-[32rem] bg-white shadow-2xl overflow-hidden flex flex-col`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white">
          <h2 className="text-2xl font-semibold text-gray-900">Shopping Cart</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50">
          <AnimatePresence>
            {items.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {items.map(item => (
                  <CartItem
                    key={item.id}
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
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="border-t border-gray-200 p-6 bg-white"
          >
            <div className="flex justify-between text-xl font-medium mb-6">
              <span>Subtotal</span>
              <span className="text-orange-600">${total.toFixed(2)}</span>
            </div>
            <div className="space-y-4">
              <Link
                to="/checkout"
                className="block w-full px-6 py-4 text-center rounded-xl text-white bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-1"
                onClick={handleClose}
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/products"
                className="block w-full px-6 py-4 text-center rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-300"
                onClick={handleClose}
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