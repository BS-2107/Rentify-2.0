import { Header } from '../../../components/layout/Header';
import { BrowseHero } from '../../../components/sections/BrowseHero';
import { ToolsGrid } from '../../../components/sections/ToolsGrid';
import { Footer } from '../../../components/layout/Footer';

export default function BrowsePage() {
  return (
    <div className="min-h-screen bg-primary">
      <Header />
      <main>
        <BrowseHero />
        <ToolsGrid />
      </main>
      <Footer />
    </div>
  );
}