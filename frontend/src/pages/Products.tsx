import React, { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X, ArrowUpDown, } from "lucide-react";
import { toast } from "react-hot-toast";
import  FilterPanel, { FilterState } from '../components/FilterPanel';
import { ProductCard } from "./ProductCard";
import {
    Product,
    productService,
    categoryService,
    Brand,
    Category,
} from "../services/api.service";

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        category: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        tech_category: "",
        sortBy: "name",
        sortOrder: "ASC",
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
            const [categoriesData, brandsData] = await Promise.all([
                categoryService.getCategories(),
                categoryService.getAllBrands(),
            ]);
            setCategories(categoriesData);
            setBrands(brandsData);
            } catch (error) {
            console.error("Error fetching initial data:", error);
            toast.error("Failed to load filters");
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [filters, pagination.page]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = {
            page: pagination.page,
            limit: pagination.limit,
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
            category: filters.category || undefined,
            brand: filters.brand || undefined,
            minPrice: filters.minPrice || undefined,
            maxPrice: filters.maxPrice || undefined,
            tech_category: filters.tech_category || undefined,
            };

        const response = await productService.getProducts(params);
        setProducts(response.products);
        setPagination(response.pagination);
        } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
        } finally {
        setLoading(false);
        }
    };

    const handleFilterChange = (key: string, value: string | number) => {
        if (key === "reset") {
            setFilters({
            category: "",
            brand: "",
            minPrice: "",
            maxPrice: "",
            tech_category: "",
            sortBy: "name",
            sortOrder: "ASC",
            });
            setShowFilters(false);
        } else {
            setFilters((prev) => ({ ...prev, [key]: value }));
        }
        setPagination((prev) => ({ ...prev, page: 1 }));
        };
    
        const toggleSort = (field: string) => {
        setFilters((prev) => ({
        ...prev,
        sortBy: field,
        sortOrder: prev.sortBy === field && prev.sortOrder === "ASC" ? "DESC" : "ASC",
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm sticky top-0 z-30">
            <div className="container mx-auto px-6 py-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-gray-800">Our Products</h1>
                    <p className="text-gray-500">
                    {pagination.total} products available
                    </p>
                </div>
    
                {/* Filter Controls */}
                <div className="flex items-center gap-4">
                    <button
                    onClick={() => setShowFilters(true)}
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {Object.values(filters).filter(value => value !== "").length > 0 && (
                        <span className="ml-1 px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-600 rounded-full">
                        {Object.values(filters).filter(value => value !== "").length}
                        </span>
                    )}
                    </button>
                </div>
                </div>
    
                {/* Sort Controls */}
                <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium text-gray-500">Sort by:</span>
                <button
                    onClick={() => toggleSort("name")}
                    className={`px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                    filters.sortBy === "name" ? "text-orange-600" : ""
                    }`}
                >
                    Name
                    <ArrowUpDown className="w-4 h-4" />
                </button>
                <button
                    onClick={() => toggleSort("price")}
                    className={`px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                    filters.sortBy === "price" ? "text-orange-600" : ""
                    }`}
                >
                    Price
                    <ArrowUpDown className="w-4 h-4" />
                </button>
                </div>
    
                {/* Active Filters */}
                {Object.values(filters).some(value => value !== "") && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {Object.entries(filters).map(([key, value]) => {
                    if (value === "") return null;
                    return (
                        <span
                        key={key}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                        {key}: {value}
                        <button
                            onClick={() => handleFilterChange(key, "")}
                            className="hover:bg-gray-200 rounded-full p-0.5"
                        >
                            <X className="h-3 w-3" />
                        </button>
                        </span>
                    );
                    })}
                </div>
                )}
            </div>
            </div>
    
            {/* Main Content */}
            <div className="container mx-auto px-6 py-8">
            {loading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
                </div>
            ) : (
                <>
                {products.length === 0 ? (
                    <div className="w-full p-12 bg-white rounded-lg shadow-sm">
                    <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
                        <Search className="w-8 h-8 text-orange-500" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-700">
                        No products found
                    </h2>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Try adjusting your filters or search criteria to find what you're looking for
                    </p>
                    <button
                        onClick={() => handleFilterChange("reset", "")}
                        className="mt-4 px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Reset All Filters
                    </button>
                    </div>
                </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                )}
            </>
            )}

            {/* Pagination */}
            {products.length > 0 && (
            <div className="mt-12 flex justify-center items-center gap-4">
                <button
                onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page <= 1}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:hover:bg-white"
                >
                Previous
                </button>
                <div className="flex items-center gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                    (page) => (
                    <button
                        key={page}
                        className={`w-10 h-10 rounded-lg ${
                        pagination.page === page
                            ? "bg-orange-500 text-white hover:bg-orange-600"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() =>
                        setPagination((prev) => ({ ...prev, page }))
                        }
                    >
                        {page}
                    </button>
                    )
                )}
                </div>
                <button
                onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={pagination.page >= pagination.totalPages}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:hover:bg-white"
                >
                Next
                </button>
            </div>
            )}
        </div>

        <FilterPanel
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            categories={categories}
            brands={brands}
            filters={filters}
            onFilterChange={handleFilterChange}
        />

        {showFilters && (
            <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setShowFilters(false)}
            />
        )}
        </div>
    );
};
export default ProductsPage;
