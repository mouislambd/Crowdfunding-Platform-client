'use client';

'use client';

import React, { useState, useEffect } from 'react';
import Reveal from './Reveal';

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
    const increment = Math.max(1, Math.ceil(value / (duration / 16)));
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
  return (
    <section className="relative py-24 overflow-hidden">
      <video
        src="/mou.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/75 bg-gradient-to-r from-black/80 via-black/70 to-black/80" />
      
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 text-center">
        <Reveal>
          <h2 className="text-3xl font-bold text-white mb-16">Our Impact So Far</h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <Reveal key={index} delay={index * 0.1}>
              <div className="flex flex-col items-center bg-gray-900/40 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-xl">
                <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                <p className="text-gray-300 mt-2 text-lg">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
