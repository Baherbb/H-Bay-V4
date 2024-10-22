import React, { useState, useEffect } from 'react';

const Hero: React.FC = () => {
  const images = [
    '/images/watch.png',
    '/images/watch2.png',
    '/images/watch3.png',
    '/images/watch4.png',
    '/images/watch5.png',
    '/images/watch6.png',
    '/images/tesla.png'

  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[700px] w-full bg-[#00005A] max-lg:h-[900px] max-md:h-[750px] overflow-hidden">
      <div className="grid grid-cols-3 items-center justify-items-center px-10 gap-x-10 max-w-screen-2xl mx-auto h-full max-lg:grid-cols-1 max-lg:py-10 max-lg:gap-y-10">
        <div className="flex flex-col gap-y-5 max-lg:order-last col-span-2">
          <h1 className="text-6xl text-white font-bold mb-3 max-xl:text-5xl max-md:text-4xl max-sm:text-3xl">
            #1 in the Market
          </h1>
          <p className="text-white max-sm:text-sm">
          Your Ultimate Tech Destination: From Smartwatches to Luxury Cars, Explore the Best in Innovation and Style!
          </p>
          <div className="flex gap-x-1 max-lg:flex-col max-lg:gap-y-1">
            <button className="bg-white text-[#00005A] font-bold px-12 py-3 max-lg:text-xl max-sm:text-lg hover:bg-gray-100">
              Shop NOW
            </button>
            
          </div>
        </div>
        <div className="relative w-full h-full">
          {images.map((img, index) => (
            <img
              key={img}
              src={`${process.env.PUBLIC_URL}${img}`}
              alt={`smart watch ${index + 1}`}
              className={`
                absolute top-1/2 -translate-y-1/2 
                max-md:w-[300px] max-md:h-[300px] max-sm:h-[250px] max-sm:w-[250px] w-auto h-auto
                transition-all duration-500 ease-in-out
                ${index === currentImageIndex ? 'opacity-100 right-0' : 'opacity-0 -right-full'}
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;