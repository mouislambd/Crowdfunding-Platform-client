'use client';

import React, { useRef, useEffect } from 'react';

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/mou.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white animate-in fade-in duration-1000">
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Empower Dreams, Fund the Future.
        </h1>
        <p className="mb-8 max-w-2xl text-lg sm:text-xl md:text-2xl text-gray-200">
          Join a community dedicated to bringing innovative ideas and building projects to life.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <button className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition hover:bg-blue-700">
            Explore Campaigns
          </button>
          <button className="rounded-lg bg-white px-8 py-3 text-lg font-semibold text-blue-600 transition hover:bg-gray-100">
            Start a Campaign
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
