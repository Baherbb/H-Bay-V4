import React from 'react';

const Instagram: React.FC = () => {
    const instagramPosts = Array(4).fill('/api/placeholder/300/300');

    return (
        <section className="py-16">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Follow us on Instagram</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {instagramPosts.map((post, index) => (
                <div key={index} className="relative group overflow-hidden">
                <img 
                    src={post} 
                    alt={`Instagram Post ${index + 1}`} 
                    className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <a 
                    href="https://www.instagram.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center"
                >
                    <img 
                    src="/api/placeholder/24/24" 
                    alt="Instagram Icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                </a>
                </div>
            ))}
            </div>
        </div>
        </section>
    );
};

export default Instagram;
