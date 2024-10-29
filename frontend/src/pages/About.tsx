import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ChevronRight, ShoppingBag, Users, Globe, Award } from 'lucide-react';
import BrandSection from '../components/Brand';
import ShippingSection from '../components/Shipping';
import FAQSection from '../components/FAQ';
import AnimatedStats from '../components/AnimatedStats'

const About = () => {
  // Scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Stats data
  const stats = [
    { icon: <ShoppingBag className="w-8 h-8" />, value: '10K+', label: 'Products' },
    { icon: <Users className="w-8 h-8" />, value: '50K+', label: 'Customers' },
    { icon: <Globe className="w-8 h-8" />, value: '25+', label: 'Countries' },
    { icon: <Award className="w-8 h-8" />, value: '15+', label: 'Years' }
  ];

  return (
    <main className="bg-gray-50">
      {/* Hero Section with Breadcrumb */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-700 relative text-white py-20">
        <div className="absolute inset-0"></div>
        <div className="container mx-auto px-4 relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About H-BaY</h1>
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link to="/home" className="hover:text-orange-200 transition-colors">
                  Home
                </Link>
              </li>
              <ChevronRight className="w-4 h-4" />
              <li className="font-medium">About</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <div className="relative">
                <img 
                  src="images/success-Photoroom.png" 
                  alt="Our Story" 
                  className="rounded-lg shadow-xl w-full"
                />
                <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-orange-500 rounded-lg -z-10"></div>
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <div className="h-1 w-20 bg-orange-500 mb-6"></div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                At H-BaY, we believe that technology has the power to transform lives. 
                Our journey began with a simple vision: to make high-quality electronics 
                accessible to everyone while providing exceptional service.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we're proud to serve customers worldwide, offering a carefully 
                curated selection of electronics that combine innovation, quality, 
                and value.
              </p>
            </div>
          </div>
        </div>
      </section>

      <AnimatedStats/>
      

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
            <div className="md:w-1/2">
              <div className="relative">
                <img 
                  src="images/shopping.png" 
                  alt="Our Mission" 
                  className="rounded-lg shadow-xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-orange-500 rounded-lg -z-10"></div>
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <div className="h-1 w-20 bg-orange-500 mb-6"></div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our mission is to revolutionize the way people experience technology. 
                We strive to provide innovative solutions that enhance daily life while 
                maintaining the highest standards of customer service.
              </p>
              <ul className="space-y-4">
                {['Quality Products', 'Customer First', 'Innovation', 'Sustainability'].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Include other sections */}
      <BrandSection />
      <ShippingSection />
      <FAQSection />
     

      {/* Back to top button */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors duration-300"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </main>
  );
};

export default About;