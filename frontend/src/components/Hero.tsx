import React, { useState, useEffect } from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';

const Hero = () => {
  const images = [
    '/images/watch.png',
    '/images/watch2.png',
    '/images/watch3.png',
    '/images/watch4.png',
    '/images/watch5.png',
    '/images/watch6.png',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-500 to-orange-700 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNCAtMTQgMTQgNi4yNjggMTQgMTQtNi4yNjggMTQtMTQgMTR6Ii8+PC9nPjwvc3ZnPg==')] opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen">
        <div className="grid lg:grid-cols-2 gap-12 items-center h-full py-12">
          {/* Content Section */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
            <div className="space-y-4">
              <span className="inline-block px-4 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                Premium Quality
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                #1 in the Market
              </h1>
              <p className="text-xl text-orange-50 max-w-lg">
                Your Ultimate Tech Destination: From Smartwatches to Luxury Cars, Explore the Best in Innovation and Style!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group flex items-center justify-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg transition-all hover:bg-orange-50 hover:shadow-lg">
                Shop Now
                <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
              </button>
              <button className="group flex items-center justify-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all hover:bg-orange-700 hover:shadow-lg">
                Learn More
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Image Navigation Dots */}
            <div className="flex gap-2 pt-8">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-white scale-125' : 'bg-orange-200 hover:bg-orange-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Image Section */}
          <div className="relative h-full flex items-center justify-center">
            {images.map((img, index) => (
              <img
                key={img}
                src={img}
                alt={`smart watch ${index + 1}`}
                className={`
                  absolute w-full max-w-lg
                  transition-all duration-700 ease-in-out
                  ${index === currentImageIndex 
                    ? 'opacity-100 translate-x-0 scale-100' 
                    : 'opacity-0 translate-x-full scale-95'
                  }
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;