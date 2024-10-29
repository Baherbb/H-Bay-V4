import React, { useState } from 'react';
import { ChevronUp, MessageCircle, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Can you recommend a budget-friendly wireless router?',
      answer: 'We offer several budget-friendly wireless routers that provide excellent performance. Our top recommendations include models from trusted brands that offer great value without compromising on essential features like coverage and speed.'
    },
    {
      question: 'Do you have any portable chargers?',
      answer: 'Yes, we stock a wide range of portable chargers from various brands. Our selection includes different capacities to suit your needs, from compact 5000mAh power banks to high-capacity 20000mAh models with fast charging capabilities.'
    },
    {
      question: 'What is the warranty period for the latest model?',
      answer: 'Most of our products come with a standard 1-year manufacturer warranty. However, specific models may have extended warranty options. We also offer additional protection plans for extra peace of mind.'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/90 to-black/70 mix-blend-multiply"></div>
              <img 
                src="images/faq-orange.jpg"
                alt="FAQ Banner" 
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h1 className="text-4xl font-bold text-white mb-4">Need Help?</h1>
                <p className="text-orange-50 mb-6">We're here to assist you with any questions you might have.</p>
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors">
                    <MessageCircle size={20} />
                    <span>Live Chat</span>
                  </button>
                  <button className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                    <Phone size={20} />
                    <span>Call Us</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-orange-500 rounded-lg -z-10 hidden lg:block"></div>
          </div>

          {/* Right Column */}
          <div>
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="h-1 w-20 bg-orange-500 mb-8"></div>
            <p className="text-gray-600 mb-8">
              Find answers to common questions about our products, services, and policies. Can't find what you're looking for? Contact our support team.
            </p>

            {/* FAQ Items */}
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-lg overflow-hidden border border-gray-200 hover:border-orange-200 transition-colors"
                >
                  <button
                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                    className={`flex justify-between items-center w-full p-4 text-left transition-all duration-300 ${
                      activeIndex === index 
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg' 
                        : 'bg-white text-gray-800 hover:bg-orange-50'
                    }`}
                    aria-expanded={activeIndex === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span className="text-lg font-medium pr-8">{faq.question}</span>
                    <ChevronUp 
                      className={`transform transition-transform duration-300 ${
                        activeIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {activeIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        id={`faq-answer-${index}`}
                      >
                        <div className="p-4 bg-white border-t border-gray-100">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;