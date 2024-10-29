import React, { useState } from 'react';
import { ShoppingCart, Star, ArrowRight, Tag, Truck, Shield, Clock } from 'lucide-react';
import Hero from '../components/Hero'
// Define types
interface Category {
  id: number;
  name: string;
  image: string;
  count: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  image: string;
  discount: number;
}

// Placeholder data
const categories: Category[] = [
  { id: 1, name: 'Watches', image: '/images/watch.png', count: 24 },
  { id: 2, name: 'Electronics', image: '/images/electronics.png', count: 156 },
  { id: 3, name: 'Accessories', image: '/images/accessories.png', count: 90 },
  { id: 4, name: 'Gadgets', image: '/images/gadgets.png', count: 72 }
];

const featuredProducts: Product[] = [
  {
    id: 1,
    name: 'Smart Watch Pro',
    price: 299.99,
    rating: 4.5,
    image: '/images/watch.png',
    discount: 15
  },
  {
    id: 2,
    name: 'Fitness Tracker',
    price: 199.99,
    rating: 4.8,
    image: '/images/watch2.png',
    discount: 0
  },
  {
    id: 3,
    name: 'Premium Watch',
    price: 399.99,
    rating: 4.7,
    image: '/images/watch3.png',
    discount: 20
  },
  {
    id: 4,
    name: 'Sport Watch',
    price: 249.99,
    rating: 4.6,
    image: '/images/watch4.png',
    discount: 10
  }
];

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div
      className="bg-white rounded-2xl shadow-lg p-4 transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-48 object-contain transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
            {product.discount}% OFF
          </div>
        )}
      </div>
      
      <div className="mt-4 space-y-2">
        <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span className="text-sm text-gray-600">{product.rating}</span>
        </div>
        <div className="flex items-center space-x-2">
          {product.discount > 0 && (
            <span className="text-sm text-gray-500 line-through">${product.price}</span>
          )}
          <span className="text-xl font-bold text-orange-600">
            ${discountedPrice.toFixed(2)}
          </span>
        </div>
        <button className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold transition-all hover:bg-orange-600 flex items-center justify-center space-x-2">
          <ShoppingCart className="w-5 h-5" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => (
  <div className="group relative overflow-hidden rounded-2xl">
    <img
      src={category.image}
      alt={category.name}
      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
    <div className="absolute bottom-4 left-4 text-white">
      <h3 className="text-xl font-bold">{category.name}</h3>
      <p className="text-sm opacity-80">{category.count} Products</p>
    </div>
  </div>
);

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <Hero />

      {/* Categories Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Top Categories</h2>
          <button className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-semibold">
            <span>View All</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
          <button className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-semibold">
            <span>View All</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <Truck className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Free Shipping</h3>
                <p className="text-sm text-gray-600">On orders over $100</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <Tag className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Best Prices</h3>
                <p className="text-sm text-gray-600">Guaranteed price match</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Secure Payment</h3>
                <p className="text-sm text-gray-600">Protected by SSL</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">24/7 Support</h3>
                <p className="text-sm text-gray-600">Dedicated support team</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
     
    </div>
  );
};

export default HomePage;