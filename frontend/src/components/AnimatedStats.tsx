import React, { useState, useEffect, useRef } from 'react';
import { Users, ShoppingCart, Star, Award } from 'lucide-react';

// Custom hook for counting animation
const useCountAnimation = (end: number, duration: number = 2000, isVisible: boolean) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);
  const frameRef = useRef(0);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (!isVisible) return;

    // Reset when end value changes
    countRef.current = 0;
    startTimeRef.current = 0;
    setCount(0);

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      const nextCount = Math.round(end * easeOutQuart);

      if (countRef.current !== nextCount) {
        countRef.current = nextCount;
        setCount(nextCount);
      }

      if (percentage < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration, isVisible]);

  return count;
};

const StatCard = ({ 
  stat, 
  isVisible, 
  index 
}: { 
  stat: {
    icon: React.ReactNode;
    value: number;
    label: string;
    suffix?: string;
    prefix?: string;
    decimals?: number;
  };
  isVisible: boolean;
  index: number;
}) => {
  const animatedValue = useCountAnimation(stat.value, 2000, isVisible);

  return (
    <div 
      className="text-center transform transition-all duration-700 hover:scale-105"
      style={{
        animation: isVisible
          ? `fadeInUp ${0.5 + index * 0.1}s ease-out forwards`
          : 'none',
        opacity: 0,
      }}
    >
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-orange-400/20 rounded-lg backdrop-blur-sm">
          {stat.icon}
        </div>
      </div>
      <div className="text-4xl font-bold mb-2 tracking-tight">
        {stat.prefix}
        {stat.decimals 
          ? animatedValue.toFixed(stat.decimals)
          : animatedValue}
        {stat.suffix}
      </div>
      <div className="text-orange-100 font-medium">
        {stat.label}
      </div>
    </div>
  );
};

const AnimatedStatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: 50000,
      label: "Happy Customers",
      suffix: "+"
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      value: 100000,
      label: "Products Sold",
      suffix: "+"
    },
    {
      icon: <Star className="w-8 h-8" />,
      value: 4.8,
      label: "Average Rating",
      prefix: "",
      decimals: 1
    },
    {
      icon: <Award className="w-8 h-8" />,
      value: 150,
      label: "Awards Won",
      suffix: ""
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="bg-orange-500 py-16 text-white relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-1/4 -top-1/4 w-1/2 h-1/2 bg-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute -left-1/4 -bottom-1/4 w-1/2 h-1/2 bg-orange-600/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              stat={stat}
              isVisible={isVisible}
              index={index}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default AnimatedStatsSection;