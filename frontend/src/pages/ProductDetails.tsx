import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { productService, Product } from "../services/api.service";
import { 
  Star, ShoppingCart, Package, ArrowLeft, Heart, Share2, ChevronRight 
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cartService } from "../services/cart.service";
import axios from "axios";
import { wishlistService } from "../services/wishlist.service";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Fetch Product Details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        const data = await productService.getProductById(Number(id));
        setProduct(data);
        
        // Set default image and variant
        const primaryImage = data.images?.find(img => img.is_primary)?.image_url || data.images?.[0]?.image_url;
        setSelectedImage(primaryImage || "");
        
        const defaultVariant = data.variants?.[0]?.id;
        setSelectedVariant(defaultVariant || null);
      } catch (error) {
        toast.error("Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Loading and Error States
  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gray-50"
      >
        <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </motion.div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-8 bg-white rounded-xl shadow-lg"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Product Not Found</h2>
          <Link 
            to="/" 
            className="flex items-center justify-center space-x-2 text-orange-500 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Return to Home</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Derived Data
  const selectedVariantData = product.variants?.find(v => v.id === selectedVariant);
  const price = selectedVariantData ? selectedVariantData.price : product.price;

  // Event Handlers
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
  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      setWishlistLoading(true);
      await wishlistService.addToWishlist(product.id);
      setIsInWishlist(true);
      toast.success("Added to wishlist");
    } catch (error) {
      let errorMessage = "Failed to add to wishlist";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleQuantityChange = (value: number) => {
    setQuantity(Math.min(Math.max(value, 1), 10));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-12"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/" 
            className="flex items-center text-orange-500 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Heart 
                className={`w-6 h-6 transition-colors ${
                  isWishlisted 
                    ? 'fill-red-500 text-red-500' 
                    : 'text-gray-600 hover:text-red-500'
                }`} 
              />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Share2 className="w-6 h-6 text-gray-600 hover:text-orange-500" />
            </motion.button>
          </div>
        </div>

        {/* Product Details Container */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8">
            {/* Image Gallery */}
            <div className="space-y-6">
              <AnimatePresence>
                <motion.div 
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center"
                >
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </motion.div>
              </AnimatePresence>

              <div className="grid grid-cols-5 gap-4">
                {product.images?.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(image.image_url)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all
                      ${selectedImage === image.image_url 
                        ? "border-orange-500 shadow-md" 
                        : "border-transparent hover:border-gray-200"
                      }`}
                  >
                    <img
                      src={image.image_url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-8">
              {/* Title & Price */}
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-6">
                  <span className="text-4xl font-bold text-orange-500">
                    ${price.toFixed(2)}
                  </span>
                  <div className="flex items-center bg-orange-50 px-4 py-2 rounded-full">
                    <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                    <span className="ml-2 text-gray-600 font-medium">4.5</span>
                    <span className="ml-2 text-gray-500">(250 reviews)</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Variants Selection */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">Available Variants</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {product.variants.map((variant) => (
                      <motion.button
                        key={variant.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => variant.id !== undefined && setSelectedVariant(variant.id)}
                        className={`p-4 rounded-lg border transition-all
                          ${selectedVariant === variant.id
                            ? "border-orange-500 bg-orange-50 shadow-md"
                            : "border-gray-200 hover:border-orange-300"
                          }`}
                      >
                        <div className="font-semibold text-gray-800">
                          {variant.storage_capacity} / {variant.ram_size}
                        </div>
                        <div className="text-sm text-gray-600">{variant.color}</div>
                        <div className="mt-2 font-bold text-orange-500">
                          ${variant.price.toFixed(2)}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium">Quantity:</span>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                      className="w-16 text-center border-x py-2"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold 
                    hover:bg-orange-600 transition-colors flex items-center justify-center space-x-3"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span>Add to Cart</span>
                  <ChevronRight className="w-5 h-5 opacity-70" />
                </motion.button>
              </div>

              {/* Specifications */}
              {product.specifications && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(
                      ([key, value]) =>
                        value && (
                          <div 
                            key={key} 
                            className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg"
                          >
                            <Package className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-gray-800">
                                {key
                                  .split("_")
                                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                  .join(" ")}
                              </div>
                              <div className="text-gray-600">{value}</div>
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;

