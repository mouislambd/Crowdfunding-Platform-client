import Hero from "../components/Hero";
import TopFundedCampaigns from "../components/TopFundedCampaigns";
import Testimonials from "../components/Testimonials";
import HowItWorks from "../components/HowItWorks";
import ImpactStats from "../components/ImpactStats";

export default function Home() {
  return (
    <main>
      <Hero />
      <TopFundedCampaigns />
      <Testimonials />
      <HowItWorks />
      <ImpactStats />
    </main>
  );
}
