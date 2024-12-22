import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Check, X } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { Product, ProductVariant } from '../services/api.service';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { cartService } from "../services/cart.service";
import axios from "axios";
import { wishlistService } from "../services/wishlist.service";
import { VariantSelectionModal } from "./VariantSelection";

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showVariantModal, setShowVariantModal] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [wishlistStatus, setWishlistStatus] = useState<'default' | 'added' | 'error'>('default');
    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);

    const primaryImage = product.images?.find(img => img.is_primary)?.image_url
        || product.images?.[0]?.image_url
        || '/placeholder-product.png';

    useEffect(() => {
        const checkWishlistStatus = async () => {
            if (product.default_variant_id) {
                const isInList = await wishlistService.checkItemInWishlist(product.default_variant_id);
                setIsInWishlist(isInList);
                setWishlistStatus(isInList ? 'added' : 'default');
            }
        };
        checkWishlistStatus();
    }, [product.default_variant_id]);

    const handleVariantSelection = async (
        variantId: number,
        selectedQuantity: number
    ) => {
        setSelectedVariantId(variantId);
        try {
            setIsLoading(true);
            await cartService.addToCart(variantId, selectedQuantity);
            toast.success("Product added to cart successfully");
            setShowVariantModal(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to add product to cart");
        } finally {
            setIsLoading(false);
        }
    };       

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!product.variants?.length && !product.default_variant_id) {
            toast.error("Product is not available for purchase");
            return;
        }

        if (product.variants && product.variants.length > 1) {
            setShowVariantModal(true);
            return;
        }

        try {
            setIsLoading(true);
            const variantId = product.variants?.[0]?.id || product.default_variant_id;

            if (!variantId) {
                throw new Error("No variant available");
            }

            await cartService.addToCart(variantId, quantity);
            toast.success("Product added to cart successfully");
        } catch (error) {
            let errorMessage = "Failed to add product to cart";
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            toast.error(errorMessage);
            console.error("Error adding to cart:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleCardClick = (e: React.MouseEvent) => {
        // Only navigate if the click wasn't on a button or input
        const target = e.target as HTMLElement;
        if (!target.closest('button') && !target.closest('input')) {
            navigate(`/products/${product.id}`);
        }
    };
    const handleWishlistAction = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        const variantId = product.default_variant_id || product.variants?.[0]?.id;
        
        if (!variantId) {
            toast.error("Product variant not available");
            return;
        }
    
        const selectedVariant = product.variants?.find(v => v.id === variantId);
        
        try {
            setWishlistLoading(true);
            
            if (isInWishlist) {
                await wishlistService.removeFromWishlist(variantId);
                setIsInWishlist(false);
                setWishlistStatus('default');
                toast.success("Removed from wishlist");
            } else {
                await wishlistService.addToWishlist(variantId);
                setIsInWishlist(true);
                setWishlistStatus('added');
                toast.success("Added to wishlist");
            }
        } catch (error) {
            console.error('Wishlist action error:', error);
            setWishlistStatus('error');
            toast.error(error instanceof Error ? error.message : "Failed to update wishlist");
            
            setTimeout(() => {
                setWishlistStatus('default');
            }, 2000);
        } finally {
            setWishlistLoading(false);
        }
    }
    const wishlistButtonVariants = {
        default: { 
            scale: 1, 
            backgroundColor: '#ffffff', 
            color: wishlistLoading ? '#9ca3af' : '#6b7280' 
        },
        added: { 
            scale: 1.1, 
            backgroundColor: '#fecaca', 
            color: '#ef4444' 
        },
        error: { 
            scale: 1.1, 
            backgroundColor: '#fee2e2', 
            color: '#dc2626' 
        }
    };


    return (
        <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-lg p-4 transition-all duration-300 hover:shadow-xl cursor-pointer group relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
    >
        <motion.button
            key="wishlist-button"
            initial="default"
            animate={wishlistStatus}
            variants={wishlistButtonVariants}
            onClick={handleWishlistAction}
            disabled={wishlistLoading}
            className={`absolute top-4 right-4 p-3 rounded-full 
                shadow-md hover:shadow-lg transition-all duration-300 
                group-hover:scale-110 z-10 flex items-center justify-center
                ${wishlistLoading ? "opacity-50" : ""}`}
        >
            <AnimatePresence mode="wait">
                {wishlistStatus === 'default' && (
                    <motion.div 
                        key="default-heart"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                    >
                        <Heart 
                            className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} 
                        />
                    </motion.div>
                )}
                {wishlistStatus === 'added' && (
                    <motion.div 
                        key="added-heart"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="text-red-500"
                    >
                        <Check className="w-5 h-5" />
                    </motion.div>
                )}
                {wishlistStatus === 'error' && (
                    <motion.div 
                        key="error-heart"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="text-red-600"
                    >
                        <X className="w-5 h-5" />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
            
            <div className="relative overflow-hidden rounded-xl">
                <motion.img
                    src={primaryImage}
                    alt={product.name}
                    transition={{ duration: 0.5 }}
                    className={`w-full h-48 object-contain transition-transform duration-500 group-hover:scale-110 ${
                        isHovered ? 'scale-110' : 'scale-100'
                    }`}
                />
            </div>
            
            <div className="mt-4 space-y-3">
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {product.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 h-12">{product.description}</p>
                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-orange-600">
                        ${product.price.toFixed(2)}
                    </span>
                    {!showVariantModal && (
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="w-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                    />
                    )}
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddToCart}
                    disabled={
                        isLoading ||
                        (!product.variants?.length && !product.default_variant_id)
                    }
                    className="w-full bg-orange-500 text-white py-2.5 rounded-lg font-semibold
                        transition-all hover:bg-orange-600 flex items-center justify-center
                        space-x-2 disabled:opacity-50 group"
                >
                    <ShoppingCart className="w-5 h-5 group-hover:animate-bounce" />
                    <span>{isLoading ? 'Adding...' : 'Add to Cart'}</span>
                </motion.button>
            </div>
            <VariantSelectionModal
                variants={product.variants || []}
                onSelect={handleVariantSelection}
                onClose={() => setShowVariantModal(false)}
                isOpen={showVariantModal}
            />
        </motion.div>
    );
};