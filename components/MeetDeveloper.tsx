'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Reveal from './Reveal';

const techStack = [
  'Next.js',
  'TypeScript',
  'Tailwind CSS',
  'Express',
  'MongoDB',
  'Better Auth',
  'Framer Motion',
];

export default function MeetDeveloper() {
  const shouldReduceMotion = useReducedMotion();
  const [imageError, setImageError] = useState(false);

  return (
    <section className="py-20 bg-slate-950 text-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Meet the Developer</h2>
            <p className="text-gray-400 max-w-xl mx-auto">The engineering mind behind the FundRise platform architecture and experience.</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          {/* TODO: Replace photo at /developer.jpg with official developer headshot */}
          <div className="bg-slate-900/80 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center gap-8 mb-8 relative z-10">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-blue-500/30 shadow-xl shrink-0 bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white">
                {!imageError ? (
                  <img
                    src="/developer.jpg"
                    alt="Mou"
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span>M</span>
                )}
              </div>
              <div className="text-center md:text-left">
                <div className="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-semibold mb-2">
                  Lead Full-Stack Engineer
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Built by Mou</h3>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                  Full-stack developer who designed, built and deployed FundRise end to end.
                </p>
              </div>
            </div>

            {/* Tech stack chips with staggered float */}
            <div className="mb-10 relative z-10">
              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-4">Core Technology Stack</p>
              <div className="flex flex-wrap gap-2.5">
                {techStack.map((tech, idx) => (
                  <motion.span
                    key={tech}
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
                    className="px-4 py-2 rounded-xl bg-slate-950/70 border border-white/10 text-sm font-medium text-blue-300 shadow-md"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start relative z-10 pt-6 border-t border-white/10">
              <motion.a
                whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="https://github.com/mouislambd/Crowdfunding-Platform-client"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <span>GitHub Repository</span>
              </motion.a>
              <motion.a
                whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="#"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all flex items-center gap-2"
              >
                <span>Live Site</span>
              </motion.a>
              {/* TODO: Replace "#" with actual LinkedIn profile URL */}
              <motion.a
                whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="#"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all flex items-center gap-2"
              >
                <span>LinkedIn</span>
              </motion.a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
