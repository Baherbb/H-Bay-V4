import { ChevronDown, X } from "lucide-react";
import {
    Brand,
    Category,
} from "../services/api.service";

interface FilterPanelProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    brands: Brand[];
    filters: FilterState;
    onFilterChange: (key: string, value: string | number) => void;
}

export interface FilterState {
    category: number | "";
    brand: number | "";
    minPrice: number | "";
    maxPrice: number | "";
    tech_category: string;
    sortBy: string;
    sortOrder: "ASC" | "DESC";
}

const FilterPanel: React.FC<FilterPanelProps> = ({
    isOpen,
    onClose,
    categories,
    brands,
    filters,
    onFilterChange,
}) => {
    const activeFiltersCount = Object.values(filters).filter(value => value !== "").length;
    return (
        <div
            className={`
            fixed inset-y-0 left-0 w-96 bg-white shadow-2xl transform transition-transform duration-300
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            z-40
        `}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Filters</h3>
                {activeFiltersCount > 0 && (
                  <span className="text-sm text-gray-500">
                    {activeFiltersCount} active filters
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-orange-50 text-orange-600 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
  
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Price Range */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">Price Range</h4>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice === "" ? "" : filters.minPrice}
                    onChange={(e) =>
                      onFilterChange(
                        "minPrice",
                        e.target.value ? Number(e.target.value) : ""
                      )
                    }
                    className="w-full pl-8 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                </div>
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice === "" ? "" : filters.maxPrice}
                    onChange={(e) =>
                      onFilterChange(
                        "maxPrice",
                        e.target.value ? Number(e.target.value) : ""
                      )
                    }
                    className="w-full pl-8 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                </div>
              </div>
            </div>
  
            {/* Categories */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">Categories</h4>
              <div className="relative">
                <select
                  value={filters.category || ""}
                  onChange={(e) =>
                    onFilterChange(
                      "category",
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  className="w-full appearance-none pl-4 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
  
            {/* Brands */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">Brands</h4>
              <div className="relative">
                <select
                  value={filters.brand || ""}
                  onChange={(e) =>
                    onFilterChange(
                      "brand",
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  className="w-full appearance-none pl-4 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white"
                >
                  <option value="">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
  
            {/* Tech Category */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">Tech Category</h4>
              <div className="relative">
                <select
                  value={filters.tech_category || ""}
                  onChange={(e) => onFilterChange("tech_category", e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white"
                >
                  <option value="">All Tech Categories</option>
                  <option value="mobile">Mobile</option>
                  <option value="laptop">Laptop</option>
                  <option value="desktop">Desktop</option>
                  <option value="accessory">Accessory</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
  
          <div className="p-6 border-t bg-gray-50">
            <button
              onClick={() => onFilterChange("reset", "")}
              className="w-full py-2.5 px-4 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      </div>
    );
};
export default FilterPanel;