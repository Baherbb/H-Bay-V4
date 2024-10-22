import React from 'react';

const Home: React.FC = () => {
    return (
        <div>
        <h1 className="text-3xl font-bold mb-4">Welcome to our E-commerce Store</h1>
        <p>Find the best products at great prices!</p>
        <img 
                src="../../public/logo-dark.png" 
                alt="Hpay Logo"
                className="w-full h-auto object-contain"
            />
        </div>
    );
};

export default Home;