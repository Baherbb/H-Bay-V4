import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import BrandSection from './Brand';
import ShippingSection from './Shipping';
import FAQSection from './FAQ';
import InstagramSection from './Instagram';

const About: React.FC = () => {
    return (
        <main className="main-wrapper">
            {/* Breadcrumb Section */}
            <section className="py-4 border-b">
                <div className="container mx-auto px-4">
                    <div className="flex items-center">
                        <ul className="flex items-center space-x-2">
                            <li className="flex items-center">
                                <Link to="/" className="text-gray-600 hover:text-gray-800">Home</Link>
                                <span className="mx-2 text-gray-400">/</span>
                            </li>
                            <li>
                                <span className="text-red-500">About</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="md:w-1/2">
                            <h2 className="text-4xl font-bold mb-4">Our Story</h2>
                            <div className="text-gray-600 uppercase mb-6">WHERE TECHNOLOGY MEETS PASSION</div>
                            <p className="text-gray-700 mb-4">
                                At Our Story, we believe that technology has the power to create meaningful
                                experiences. We're a passionate team of electronics who are dedicated to
                                providing high-quality products that enhance your everyday life.
                            </p>
                            <p className="text-gray-700">
                                Our journey began with a shared vision to bridge the gap between cutting-edge
                                technology. With this vision in mind, we embarked on a mission to redefine the
                                way people interact with technology.
                            </p>
                        </div>
                        <div className="md:w-1/2">
                            <img 
                                src="/api/placeholder/600/400" 
                                alt="Happy woman using laptop" 
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Who We Are Section */}
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="md:w-1/2 order-2 md:order-1">
                            <img 
                                src="/api/placeholder/600/400" 
                                alt="Woman using smartphone" 
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                        <div className="md:w-1/2 order-1 md:order-2">
                            <h2 className="text-3xl font-bold mb-4">Who We Are ?</h2>
                            <div className="text-gray-600 uppercase mb-6">ELECTRONICS INNOVATORS</div>
                            <p className="text-gray-700 mb-4">
                                At Our Story, we are a team of passionate innovators in the world of electronics.
                                With a shared love for technology and a drive to create exceptional products, we
                                strive to make a positive impact on the way people live and interact with the world
                                around them.
                            </p>
                            <p className="text-gray-700">
                                Our team consists of dedicated engineers, designers, and technologists who bring
                                their expertise and creativity to every project. We're united by a common goal: to
                                push the boundaries of what is possible and deliver cutting-edge electronics that
                                exceed expectations.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Include other sections */}
            <BrandSection />
            <ShippingSection />
            <FAQSection />
            <InstagramSection />

            {/* Back to top button */}
            <div className="fixed bottom-8 right-8">
                <button className="bg-black text-white p-2 rounded-full">
                    <ArrowUp size={24} />
                </button>
            </div>
        </main>
    );
};

export default About;