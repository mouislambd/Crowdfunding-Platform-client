'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import Reveal from './Reveal';

const categories = [
  {
    name: 'Technology',
    desc: 'AI, hardware, SaaS & futuristic gadgets',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    count: '120+ projects',
  },
  {
    name: 'Art',
    desc: 'Digital media, design, films & crafts',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    count: '85+ projects',
  },
  {
    name: 'Community',
    desc: 'Local impact, social good & activism',
    image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=600&q=80',
    count: '64+ projects',
  },
  {
    name: 'Health',
    desc: 'Wellness, biotech & medical innovations',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
    count: '45+ projects',
  },
  {
    name: 'Education',
    desc: 'EdTech, courses & open learning tools',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80',
    count: '52+ projects',
  },
  {
    name: 'Environment',
    desc: 'Clean energy, conservation & sustainability',
    image: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=600&q=80',
    count: '78+ projects',
  },
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
                  className="group flex flex-col h-full bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-blue-500/15 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <div className="absolute bottom-3 left-4 px-3 py-1 rounded-full bg-blue-600/90 text-white text-xs font-semibold shadow">
                      {cat.count}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-6 flex-grow leading-relaxed">
                      {cat.desc}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-blue-400 font-semibold">
                      <span>Browse projects</span>
                      <span className="group-hover:translate-x-1 transition-transform">Explore →</span>
                    </div>
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
