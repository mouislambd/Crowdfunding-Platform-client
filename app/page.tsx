'use client';

import dynamic from 'next/dynamic';
import Hero from '../components/Hero';
import TopFundedCampaigns from '../components/TopFundedCampaigns';
import ScrollProgress from '../components/ScrollProgress';

const skeleton = (name: string) => (
  <div className="py-20 bg-slate-950 flex items-center justify-center text-gray-500 text-sm animate-pulse">
    Loading {name}...
  </div>
);


const ExploreByCategory = dynamic(() => import('../components/ExploreByCategory'), {
  ssr: false,
  loading: () => skeleton('Explore by Category'),
});

const HowItWorks = dynamic(() => import('../components/HowItWorks'), {
  ssr: false,
  loading: () => skeleton('How It Works'),
});

const ChooseYourRole = dynamic(() => import('../components/ChooseYourRole'), {
  ssr: false,
  loading: () => skeleton('Choose Your Role'),
});

const CampaignLifecycle = dynamic(() => import('../components/CampaignLifecycle'), {
  ssr: false,
  loading: () => skeleton('Campaign Lifecycle'),
});

const WhyChooseUs = dynamic(() => import('../components/WhyChooseUs'), {
  ssr: false,
  loading: () => skeleton('Why Choose Us'),
});

const CreditCalculator = dynamic(() => import('../components/CreditCalculator'), {
  ssr: false,
  loading: () => skeleton('Credit Calculator'),
});

const ImpactStats = dynamic(() => import('../components/ImpactStats'), {
  ssr: false,
  loading: () => skeleton('Impact Stats'),
});

const EndingSoon = dynamic(() => import('../components/EndingSoon'), {
  ssr: false,
  loading: () => skeleton('Ending Soon'),
});

const Testimonials = dynamic(() => import('../components/Testimonials'), {
  ssr: false,
  loading: () => skeleton('Testimonials'),
});

const PaymentMethods = dynamic(() => import('../components/PaymentMethods'), {
  ssr: false,
  loading: () => skeleton('Payment Methods'),
});

const FAQ = dynamic(() => import('../components/FAQ'), {
  ssr: false,
  loading: () => skeleton('FAQ'),
});

const ProsAndCons = dynamic(() => import('../components/ProsAndCons'), {
  ssr: false,
  loading: () => skeleton('Pros & Cons'),
});

const Newsletter = dynamic(() => import('../components/Newsletter'), {
  ssr: false,
  loading: () => skeleton('Newsletter'),
});

const CallToAction = dynamic(() => import('../components/CallToAction'), {
  ssr: false,
  loading: () => skeleton('Call to Action'),
});


export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <ScrollProgress />
      <Hero />
      <TopFundedCampaigns />
      <ExploreByCategory />
      <HowItWorks />
      <ChooseYourRole />
      <CampaignLifecycle />
      <WhyChooseUs />
      <CreditCalculator />
      <ImpactStats />
      <EndingSoon />
      <Testimonials />
      <PaymentMethods />
      <FAQ />
      <ProsAndCons />
      <Newsletter />
      <CallToAction />
    </main>
  );
}
