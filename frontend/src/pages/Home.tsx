import React, { useEffect, useState } from 'react';
import { ArrowRight, Truck, Tag, Shield, Clock, Mail } from 'lucide-react';
import {Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import { productService, categoryService, Product, Category } from '../services/api.service';
import CategoryCard from '../components/CategoryCard';
import { toast } from 'react-hot-toast';
import { ProductCard } from './ProductCard';

const HomePage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                
                const categoriesData = await categoryService.getCategories();
                
                const productsResponse = await productService.getProducts({
                    limit: 8,
                    sortBy: 'created_at',
                    sortOrder: 'DESC'
                });

                setCategories(categoriesData);
                setFeaturedProducts(productsResponse.products);
            } catch (err) {
                setError('Failed to load data');
                toast.error('Failed to load content', {
                    style: {
                        background: '#FF6B6B',
                        color: 'white',
                    }
                });
                console.error('Error fetching ', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Hero />
            
            {/* Categories Section */}
            <motion.section 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="py-16 px-4 max-w-7xl mx-auto"
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Top Categories</h2>
                    <Link 
                        to="/products" 
                        className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-semibold group"
                    >
                        <span>View All</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map(category => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </div>
            </motion.section>

            {/* Featured Products Section */}
            <motion.section 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="py-16 px-4 max-w-7xl mx-auto"
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
                    <Link 
                        to="/products" 
                        className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-semibold group"
                    >
                        <span>View All</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </motion.section>

            {/* Features Section */}
            <motion.section 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-orange-50 py-16"
            >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { 
                                icon: Truck, 
                                title: "Free Shipping", 
                                description: "On orders over $100" 
                            },
                            { 
                                icon: Tag, 
                                title: "Best Prices", 
                                description: "Guaranteed price match" 
                            },
                            { 
                                icon: Shield, 
                                title: "Secure Payment", 
                                description: "Protected by SSL" 
                            },
                            { 
                                icon: Clock, 
                                title: "24/7 Support", 
                                description: "Dedicated support team" 
                            }
                        ].map(({ icon: Icon, title, description }, index) => (
                            <motion.div 
                                key={title}
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="flex items-center space-x-4 hover:scale-105 transition-transform"
                            >
                                <div className="bg-orange-100 p-3 rounded-full">
                                    <Icon className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">{title}</h3>
                                    <p className="text-sm text-gray-600">{description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

export default HomePage;