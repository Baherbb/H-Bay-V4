import React from 'react';

const Brand: React.FC = () => {
    const brands = Array(10).fill('/api/placeholder/120/60');
    
    return (
        <section className="py-16">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
            {brands.map((brand, index) => (
                <a key={index} href="#" className="block hover:opacity-75 transition-opacity">
                <img src={brand} alt={`Brand ${index + 1}`} className="w-full" />
                </a>
            ))}
            </div>
        </div>
        </section>
    );
};

export default Brand;
