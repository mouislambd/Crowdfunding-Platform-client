'use client';

import React, { useState, useEffect, useRef } from 'react';

const stats = [
  { label: 'Campaigns Funded', value: 500, suffix: '+' },
  { label: 'Raised', value: 2, prefix: '$', suffix: 'M+' },
  { label: 'Supporters', value: 10000, suffix: '+' },
  { label: 'Countries Reached', value: 50, suffix: '+' },
];

const Counter = ({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="text-4xl md:text-5xl font-bold text-white">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

const ImpactStats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden">
      <video
        src="/mou.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/70" />
      
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-16">Our Impact So Far</h2>
        {isVisible && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                <p className="text-gray-300 mt-2 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ImpactStats;
