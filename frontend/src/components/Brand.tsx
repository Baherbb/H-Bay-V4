import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

const Brand = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    
    const brands = [
        {
            name: "Apple",
            image: "images/Apple-Logo.png",
            link: "https://apple.com"
        },
        {
            name: "Dell",
            image: "images/dell-logo.png",
            link: "https://dell.com"
        },
        {
            name: "Rolex",
            image: "images/rolex-logo.png",
            link: "https://rolex.com"
        },
        {
            name: "Lenovo",
            image: "images/lenovo.png",
            link: "https://lenovo.com"
        },
        {
            name: "AMD",
            image: "images/AMD.svg",
            link: "https://amd.com"
        },
        {
            name: "Samsung",
            image: "images/samsung.png",
            link: "https://samsung.com"
        },
        {
            name: "HP",
            image: "images/hp-logo.png",
            link: "https://hp.com"
        },
        {
            name: "Cartier",
            image: "images/cartier.png",
            link: "https://cartier.com"
        },
        {
            name: "ASUS",
            image: "images/asus.png",
            link: "https://asus.com"
        },
        {
            name: "Intel",
            image: "images/intel.png",
            link: "https://intel.com"
        }
    ];

    return (
        <section className="py-12 md:py-24 bg-gradient-to-b from-white via-orange-50/50 to-white">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header Section */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-block">
                        <span className="px-4 py-1.5 bg-orange-100 text-orange-600 text-sm font-medium rounded-full">
                            Our Partners
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                        Trusted by Leading <span className="text-orange-600">Brands</span>
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Join thousands of satisfied customers who rely on our products and services
                    </p>
                    <div className="flex items-center justify-center gap-2">
                        <div className="h-1 w-12 rounded-full bg-orange-200"></div>
                        <div className="h-1 w-12 rounded-full bg-orange-400"></div>
                        <div className="h-1 w-12 rounded-full bg-orange-600"></div>
                    </div>
                </div>

                {/* Brands Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
                    {brands.map((brand, index) => (
                        <div
                            key={index}
                            className="group relative"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <a
                                href={brand.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block h-full"
                            >
                                <div className="relative h-full p-6 md:p-8 bg-white rounded-2xl border border-gray-100 transition-all duration-300 hover:shadow-lg hover:shadow-orange-100/50 hover:border-orange-200 overflow-hidden">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent"></div>
                                    </div>
                                    
                                    {/* Logo Container */}
                                    <div className="relative aspect-video flex items-center justify-center">
                                        <img
                                            src={brand.image}
                                            alt={brand.name}
                                            className="w-4/5 h-4/5 object-contain opacity-60 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110"
                                        />
                                    </div>

                                    {/* Hover Elements */}
                                    <div className={`absolute inset-x-0 bottom-0 p-4 flex items-center justify-center transition-all duration-300 ${hoveredIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/95 rounded-full shadow-sm border border-orange-100">
                                            <span className="text-sm font-medium text-orange-600">
                                                {brand.name}
                                            </span>
                                            <ExternalLink className="w-4 h-4 text-orange-400" />
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="mt-16 text-center">
                    <p className="text-gray-500 text-sm">
                        And many more industry leaders worldwide
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Brand;