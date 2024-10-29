import React from 'react';
import { ChevronUp, Truck, ShieldCheck, HeadphonesIcon, Instagram as InstagramIcon } from 'lucide-react';

const Shipping = () => {
    const features = [
      {
        icon: <Truck className="w-8 h-8" />,
        title: 'Free Standard Delivery',
        description: 'Free shipping on all orders over $50. Fast and reliable delivery to your doorstep.'
      },
      {
        icon: <ShieldCheck className="w-8 h-8" />,
        title: 'Safe Payment',
        description: 'Secure transactions with industry-standard encryption and multiple payment options.'
      },
      {
        icon: <HeadphonesIcon className="w-8 h-8" />,
        title: '24/7 Help Center',
        description: 'Round-the-clock customer support via chat, phone, or email.'
      }
    ];
  
    return (
      <section className="py-20 bg-orange-500 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose H-BaY</h2>
            <div className="h-1 w-20 bg-white mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group p-8 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full bg-white/20 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-orange-100">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

export default Shipping;
