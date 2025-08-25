import { Header } from '../../components/layout/Header';
import { Hero } from '../../components/sections/Hero';
import { HowItWorks } from '../../components/sections/HowItWorks';
import { Security } from '../../components/sections/Security';
import { AntiPiracy } from '../../components/sections/AntiPiracy';
import { Footer } from '../../components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Security />
        <AntiPiracy />
      </main>
      <Footer />
    </div>
  );
}
