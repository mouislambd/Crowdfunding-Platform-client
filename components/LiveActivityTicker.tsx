'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const activities = [
  '🎉 Sarah backed Quantum AI Assistant with 50 credits',
  '🚀 New campaign EcoSmart Water Bottle approved',
  '💡 David contributed 100 credits to Solar Rover',
  '🌟 Platform crossed 10,000 active supporters',
  '🔥 Clean Oceans Initiative reached 80% funding goal',
];

export default function LiveActivityTicker() {
  const shouldReduceMotion = useReducedMotion();
  const items = [...activities, ...activities];

  return (
    <div className="bg-slate-900 border-y border-white/10 py-3 overflow-hidden">
      <div className="flex whitespace-nowrap overflow-hidden">
        <motion.div
          animate={shouldReduceMotion ? {} : { x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex gap-12 items-center"
        >
          {items.map((act, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>{act}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
