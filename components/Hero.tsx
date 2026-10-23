'use client';

'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
      videoRef.current.play().catch((err) => {
        console.log("Autoplay prevented:", err);
      });
    }
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-slate-950">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/mou.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Light Overlay & Bottom Gradient */}
      <div className="absolute inset-0 bg-black/15" />
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-slate-950 to-transparent" />

      {/* Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl drop-shadow-lg"
        >
          Empower Dreams, Fund the Future.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="mb-8 max-w-2xl text-lg sm:text-xl md:text-2xl text-gray-200 drop-shadow-md"
        >
          Join a community dedicated to bringing innovative ideas and building projects to life.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          className="flex flex-col gap-4 sm:flex-row drop-shadow-md"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link href="/campaigns" className="inline-block rounded-2xl bg-indigo-600/80 backdrop-blur-md border border-white/10 px-8 py-3 text-lg font-semibold text-white transition-all shadow-lg hover:bg-indigo-600">
              Explore Campaigns
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link href="/dashboard/add-campaign" className="inline-block rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3 text-lg font-semibold text-white transition-all hover:bg-white/20">
              Start a Campaign
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
