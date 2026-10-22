'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import Reveal from './Reveal';

const categories = [
  { name: 'Technology', desc: 'AI, hardware, SaaS & futuristic gadgets', icon: '💻', count: '120+ projects' },
  { name: 'Art', desc: 'Digital media, design, films & crafts', icon: '🎨', count: '85+ projects' },
  { name: 'Community', desc: 'Local impact, social good & activism', icon: '🤝', count: '64+ projects' },
  { name: 'Health', desc: 'Wellness, biotech & medical innovations', icon: '🧬', count: '45+ projects' },
  { name: 'Education', desc: 'EdTech, courses & open learning tools', icon: '📚', count: '52+ projects' },
  { name: 'Environment', desc: 'Clean energy, conservation & sustainability', icon: '🌱', count: '78+ projects' },
];

export default function ExploreByCategory() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 bg-slate-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Explore by Category</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Dive into specialized sectors and support groundbreaking initiatives that match your passions.</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <Reveal key={cat.name} delay={idx * 0.08}>
              <motion.div
                whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.01 }}
                className="h-full"
              >
                <Link
                  href={`/campaigns?category=${encodeURIComponent(cat.name)}`}
                  className="group flex flex-col h-full bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-6 flex-grow leading-relaxed">
                    {cat.desc}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-blue-400 font-semibold">
                    <span>{cat.count}</span>
                    <span className="group-hover:translate-x-1 transition-transform">Explore →</span>
                  </div>
                </Link>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
