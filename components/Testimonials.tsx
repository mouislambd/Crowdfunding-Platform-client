'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Campaign Creator',
    quote: 'FundRise made launching my tech project incredibly seamless. The community support was overwhelming!',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    name: 'Mark Thompson',
    role: 'Supporter',
    quote: 'I love discovering innovative ideas here. Backing projects is straightforward and transparent.',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Campaign Creator',
    quote: 'The tools provided helped me reach my funding goal in record time. Truly a game-changer.',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    name: 'David Chen',
    role: 'Supporter',
    quote: 'A fantastic platform for meaningful investment. I feel connected to every project I support.',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
  {
    name: 'Aisha Khan',
    role: 'Campaign Creator',
    quote: 'The best crowdfunding platform I have used. User-friendly interface and great reach.',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    name: 'James Wilson',
    role: 'Supporter',
    quote: 'I have funded five projects so far and have had a great experience every single time.',
    avatar: 'https://i.pravatar.cc/150?img=6',
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-2">What Our Community Says</h2>
        <p className="text-gray-400 text-center mb-10">Hear from our amazing creators and supporters.</p>
        
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {testimonials.map((t, index) => (
            <SwiperSlide key={index}>
              <div className="bg-gray-950 p-8 rounded-xl h-full flex flex-col items-center text-center">
                <img src={t.avatar} alt={t.name} className="w-20 h-20 rounded-full mb-6 border-2 border-blue-600" />
                <p className="text-gray-300 italic mb-6">"{t.quote}"</p>
                <h4 className="font-semibold text-white">{t.name}</h4>
                <p className="text-blue-400 text-sm">{t.role}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
