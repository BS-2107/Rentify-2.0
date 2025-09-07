import { Header } from '../../components/layout/Header';
import { Hero } from '../../components/sections/Hero';
import { HowItWorks } from '../../components/sections/HowItWorks';
import { Security } from '../../components/sections/Security';
import { AntiPiracy } from '../../components/sections/AntiPiracy';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Security />
        <AntiPiracy />
      </main>
    </div>
  );
}
