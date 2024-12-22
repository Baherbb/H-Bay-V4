import React from "react";

interface ProductProps {
  product: {
    id: number;
    name: string;
    price: number;
    category: string;
    brand: string;
    imageUrl: string;
  };
  onClick?: () => void;
}



const ProductCard: React.FC<ProductProps> = ({ product, onClick }) => {
  return (
    <div
      className="border rounded shadow-lg p-4 transition duration-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-1 bg-white"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder-image.jpg";
          }}
        />
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-bold truncate text-gray-800">
          {product.name}
        </h3>
        <div className="space-y-1">
          <p className="text-sm text-gray-600 flex items-center">
            <span className="font-medium">Category:</span>
            <span className="ml-1">{product.category}</span>
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <span className="font-medium">Brand:</span>
            <span className="ml-1">{product.brand}</span>
          </p>
        </div>
        <p className="text-lg font-semibold text-orange-600">
          ${product.price.toFixed(2)}
        </p>
      </div>

      <div className="mt-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <button
          className="w-full bg-orange-500 text-white py-2 px-4 rounded 
                             hover:bg-orange-600 transition duration-300 
                             focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
