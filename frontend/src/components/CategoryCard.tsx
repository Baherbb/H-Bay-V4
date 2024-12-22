import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  image_url?: string;
  count?: number;
}

const CategoryCard: React.FC<{ category: Category }> = ({ category }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        {category.image_url ? (
          <>
            {/* Loading Skeleton */}
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            
            <img
              src={category.image_url}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onLoad={(e) => {
                const target = e.target as HTMLElement;
                target.previousElementSibling?.remove(); // Remove skeleton after load
              }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image Available</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5">
        <div className="flex justify-between items-center">
          <div className="space-y-1.5">
            <h3 className="font-semibold text-lg text-gray-800 group-hover:text-orange-500 transition-colors">
              {category.name}
            </h3>
            <p className="text-sm text-gray-600">
              {category.count} {category.count === 1 ? 'Product' : 'Products'}
            </p>
          </div>
          
          <button 
            className="p-2.5 rounded-full bg-orange-50 text-orange-500 transition-all duration-300 
                      group-hover:bg-orange-500 group-hover:text-white transform group-hover:scale-110"
            aria-label={`View ${category.name} category`}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
