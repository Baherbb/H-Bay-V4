import React, { useState } from 'react';
import { ChevronUp } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
    }

    const FAQ: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    const faqs: FAQItem[] = [
        {
        question: 'Can you recommend a budget-friendly wireless router?',
        answer: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literat from making it over years old. Richard McClintock a Latin from a Lorem.'
        },
        {
        question: 'Do you have any portable chargers?',
        answer: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literat from making it over years old. Richard McClintock a Latin from a Lorem.'
        },
        {
        question: 'What is the warranty period for the latest model ?',
        answer: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literat from making it over years old. Richard McClintock a Latin from a Lorem.'
        }
    ];

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="py-16">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <img 
                src="/api/placeholder/600/600" 
                alt="FAQ Banner" 
                className="w-full h-full object-cover transform scale-130"
                />
            </div>
            <div>
                <h2 className="text-3xl font-bold mb-5">Frequently Asked Questions</h2>
                <p className="text-gray-600 mb-8">
                Nam vel augue sit amet ligula tincidunt blandit sed sed neque. Morbi vulputate augue malesuada mi viverra blandit.
                </p>
                <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-300">
                    <button
                        onClick={() => toggleAccordion(index)}
                        className={`flex justify-between items-center w-full p-4 text-left ${
                        activeIndex === index ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                        }`}
                    >
                        <span className="text-lg font-semibold">{faq.question}</span>
                        <ChevronUp 
                        className={`transform transition-transform ${
                            activeIndex === index ? 'rotate-180' : ''
                        }`}
                        />
                    </button>
                    {activeIndex === index && (
                        <div className="p-4 bg-white">
                        <p className="text-gray-600">{faq.answer}</p>
                        </div>
                    )}
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