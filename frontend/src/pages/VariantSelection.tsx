import { useState } from "react";
import { ProductVariant } from "../services/api.service";

interface VariantSelectionModalProps {
    variants: ProductVariant[];
    onSelect: (variantId: number, quantity: number) => void;
    onClose: () => void;
    isOpen: boolean;
}

export const VariantSelectionModal: React.FC<VariantSelectionModalProps> = ({
    variants,
    onSelect,
    onClose,
    isOpen,
}) => {
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
            Select Product Variant
            </h3>
            <div className="space-y-4">
            {variants.map((variant) => (
                <div
                key={variant.id}
                className="border rounded-lg p-4 space-y-2 hover:border-orange-300 transition-colors"
                >
                <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">
                    {variant.name} - ${variant.price.toFixed(2)}
                    </span>
                    <div className="flex items-center space-x-3">
                    <input
                        type="number"
                        min="1"
                        value={selectedQuantity}
                        onChange={(e) =>
                        setSelectedQuantity(
                            Math.max(1, parseInt(e.target.value) || 1)
                        )
                        }
                        className="w-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                    />
                    <button
                        onClick={() =>
                        variant.id !== undefined
                            ? onSelect(variant.id, selectedQuantity)
                            : null
                        }
                        className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold shadow-md hover:shadow-lg"
                    >
                        Add
                    </button>
                    </div>
                </div>
                </div>
            ))}
            </div>
            <button
            onClick={onClose}
            className="mt-6 w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
            Cancel
            </button>
        </div>
        </div>
    );
};
