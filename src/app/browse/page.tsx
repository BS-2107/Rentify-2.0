import { Header } from '../../../components/layout/Header';
import { BrowseHero } from '../../../components/sections/BrowseHero';
import { ToolsGrid } from '../../../components/sections/ToolsGrid';

export default function BrowsePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main>
        <BrowseHero />
        <ToolsGrid />
      </main>
    </div>
  );
}