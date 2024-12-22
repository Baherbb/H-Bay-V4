import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useProductSearch } from "../hooks/useProductSearch";
import { useNavigate } from "react-router-dom";

interface SearchAutocompleteProps {
    onSearch?: (query: string) => void;
    className?: string;
    placeholder?: string;
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
    onSearch,
    className = "",
    placeholder = "Search products...",
}) => {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const [hasResults, setHasResults] = useState(false);
    const [inputHeight, setInputHeight] = useState(0);

    const { suggestions, loading, error, debouncedSearch } = useProductSearch();

    // Prevent UI jumping
    useEffect(() => {
        if (inputRef.current) {
            setInputHeight(inputRef.current.offsetHeight);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (suggestions.length > 0) {
            setHasResults(true);
        } else {
            setHasResults(false);
        }
    }, [suggestions]);

    useEffect(() => {
        if (query.trim() && !hasResults) {
            debouncedSearch({
                search: query,
                limit: 5,
            });
        } else if (!query.trim()) {
            setIsOpen(false);
        }
    }, [query, debouncedSearch, hasResults]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        setIsOpen(!!value.trim());
        // Reset hasResults when input changes
        if (value !== query) {
            setHasResults(false);
        }
    };

    const handleSuggestionClick = (suggestion: any) => {
        // Clear the input and reset states when clicking a suggestion
        setQuery("");
        setIsOpen(false);
        setHasResults(false);
        navigate(`/products/${suggestion.id}`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            if (onSearch) {
                onSearch(query);
            }
            // Clear the input and reset states when submitting
            setQuery("");
            setIsOpen(false);
            setHasResults(false);
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <form onSubmit={handleSubmit} style={{ height: inputHeight || 'auto' }}>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onFocus={() => query.trim() && setIsOpen(true)}
                        placeholder={placeholder}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-colors duration-200 ${className}`}
                    />
                    {loading && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500" />
                        </div>
                    )}
                </div>
            </form>

            {isOpen && suggestions.length > 0 && (
                <div className="absolute w-full bg-white mt-1 rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                        <button
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full text-left px-4 py-2 hover:bg-orange-50 focus:bg-orange-50 focus:outline-none transition-colors duration-200"
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-gray-800">{suggestion.name}</span>
                                <span className="text-orange-500 font-medium">
                                    {suggestion.price !== null
                                        ? `$${suggestion.price.toFixed(2)}`
                                        : 'Contact for price'}
                                </span>
                            </div>
                            {suggestion.model_number && (
                                <span className="text-sm text-gray-500">
                                    Model: {suggestion.model_number}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {error && (
                <div className="absolute w-full mt-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg">
                    {error}
                </div>
            )}
        </div>
    );
};
