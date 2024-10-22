import React from 'react';

const Shipping: React.FC = () => {
    const features = [
        {
        icon: '🚗',
        title: 'Free Standard Delivery',
        description: 'And free returns. See checkout for delivery dates.'
        },
        {
        icon: '🔒',
        title: 'Safe Payment',
        description: 'Pay with the world\'s most popular and secure payment methods.'
        },
        {
        icon: '📞',
        title: '24/7 Help Center',
        description: 'Have a question? Call a Specialist or chat online.'
        }
    ];

    return (
        <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                <div className="text-3xl">{feature.icon}</div>
                <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                </div>
                </div>
            ))}
            </div>
        </div>
        </section>
    );
};

export default Shipping;
