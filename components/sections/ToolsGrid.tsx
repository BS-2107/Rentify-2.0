'use client';

import React, { useRef } from 'react';
import { ToolCard } from '../ui/ToolCard';

export const ToolsGrid: React.FC = () => {
  const creativeRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<HTMLDivElement>(null);
  const devRef = useRef<HTMLDivElement>(null);
  const designRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const productivityRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 320;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const creativeTools = [
    { name: 'Adobe Photoshop', price: '₹59/hr', rating: 4.9, users: '2.1k', category: 'Photo Editing', available: true },
    { name: 'Adobe Illustrator', price: '₹55/hr', rating: 4.8, users: '1.8k', category: 'Vector Design', available: true },
    { name: 'Adobe After Effects', price: '₹69/hr', rating: 4.9, users: '1.5k', category: 'Motion Graphics', available: true },
    { name: 'Adobe Premiere Pro', price: '₹65/hr', rating: 4.8, users: '2.3k', category: 'Video Editing', available: true },
    { name: 'Adobe InDesign', price: '₹49/hr', rating: 4.7, users: '900', category: 'Layout Design', available: false },
    { name: 'Adobe XD', price: '₹39/hr', rating: 4.6, users: '1.2k', category: 'UI/UX Design', available: true },
    { name: 'Adobe Lightroom', price: '₹35/hr', rating: 4.8, users: '1.7k', category: 'Photo Editing', available: true },
    { name: 'Cinema 4D', price: '₹69/hr', rating: 4.9, users: '800', category: '3D Modeling', available: true }
  ];

  const aiTools = [
    { name: 'ChatGPT Plus', price: '₹29/hr', rating: 4.9, users: '5.2k', category: 'AI Assistant', available: true },
    { name: 'Midjourney', price: '₹39/hr', rating: 4.8, users: '3.1k', category: 'AI Art', available: true },
    { name: 'Claude Pro', price: '₹32/hr', rating: 4.7, users: '2.8k', category: 'AI Assistant', available: true },
    { name: 'Runway ML', price: '₹59/hr', rating: 4.6, users: '1.9k', category: 'AI Video', available: true },
    { name: 'Jasper AI', price: '₹45/hr', rating: 4.5, users: '2.2k', category: 'AI Writing', available: false },
    { name: 'Copy.ai', price: '₹35/hr', rating: 4.4, users: '1.8k', category: 'AI Writing', available: true },
    { name: 'Stable Diffusion', price: '₹49/hr', rating: 4.7, users: '2.5k', category: 'AI Art', available: true },
    { name: 'GitHub Copilot', price: '₹29/hr', rating: 4.8, users: '4.1k', category: 'AI Coding', available: true }
  ];

  const devTools = [
    { name: 'JetBrains IntelliJ', price: '₹39/hr', rating: 4.8, users: '3.2k', category: 'IDE', available: true },
    { name: 'Visual Studio Pro', price: '₹45/hr', rating: 4.7, users: '2.8k', category: 'IDE', available: true },
    { name: 'Sublime Text', price: '₹29/hr', rating: 4.6, users: '1.9k', category: 'Text Editor', available: true },
    { name: 'Docker Desktop', price: '₹35/hr', rating: 4.5, users: '2.1k', category: 'DevOps', available: true },
    { name: 'Postman Pro', price: '₹32/hr', rating: 4.7, users: '3.5k', category: 'API Testing', available: false },
    { name: 'MongoDB Atlas', price: '₹42/hr', rating: 4.6, users: '1.7k', category: 'Database', available: true },
    { name: 'Figma Pro', price: '₹35/hr', rating: 4.9, users: '4.2k', category: 'Design Tool', available: true },
    { name: 'Sketch', price: '₹39/hr', rating: 4.5, users: '1.8k', category: 'Design Tool', available: true }
  ];

  const designTools = [
    { name: 'Figma Professional', price: '₹35/hr', rating: 4.9, users: '4.8k', category: 'UI/UX Design', available: true },
    { name: 'Sketch', price: '₹39/hr', rating: 4.7, users: '2.1k', category: 'UI Design', available: true },
    { name: 'Canva Pro', price: '₹29/hr', rating: 4.6, users: '3.9k', category: 'Graphic Design', available: true },
    { name: 'Framer', price: '₹42/hr', rating: 4.8, users: '1.5k', category: 'Web Design', available: true },
    { name: 'InVision', price: '₹35/hr', rating: 4.4, users: '1.2k', category: 'Prototyping', available: false },
    { name: 'Principle', price: '₹39/hr', rating: 4.5, users: '800', category: 'Animation', available: true },
    { name: 'Zeplin', price: '₹32/hr', rating: 4.3, users: '1.1k', category: 'Handoff', available: true },
    { name: 'Marvel App', price: '₹35/hr', rating: 4.2, users: '900', category: 'Prototyping', available: true }
  ];

  const videoTools = [
    { name: 'Final Cut Pro', price: '₹59/hr', rating: 4.8, users: '2.3k', category: 'Video Editing', available: true },
    { name: 'DaVinci Resolve Studio', price: '₹49/hr', rating: 4.9, users: '1.8k', category: 'Color Grading', available: true },
    { name: 'Adobe Premiere Pro', price: '₹65/hr', rating: 4.8, users: '3.1k', category: 'Video Editing', available: true },
    { name: 'Motion', price: '₹42/hr', rating: 4.6, users: '1.2k', category: 'Motion Graphics', available: true },
    { name: 'Compressor', price: '₹35/hr', rating: 4.5, users: '800', category: 'Video Compression', available: false },
    { name: 'FCPX Plugins Bundle', price: '₹39/hr', rating: 4.7, users: '1.5k', category: 'Plugins', available: true },
    { name: 'Luma Fusion', price: '₹29/hr', rating: 4.4, users: '900', category: 'Mobile Editing', available: true },
    { name: 'Filmora Pro', price: '₹39/hr', rating: 4.3, users: '1.7k', category: 'Video Editing', available: true }
  ];

  const productivityTools = [
    { name: 'Microsoft Office 365', price: '₹32/hr', rating: 4.7, users: '5.8k', category: 'Office Suite', available: true },
    { name: 'Notion Pro', price: '₹29/hr', rating: 4.8, users: '3.2k', category: 'Productivity', available: true },
    { name: 'Slack Pro', price: '₹29/hr', rating: 4.6, users: '4.1k', category: 'Communication', available: true },
    { name: 'Zoom Pro', price: '₹32/hr', rating: 4.5, users: '3.8k', category: 'Video Calls', available: true },
    { name: 'Trello Gold', price: '₹29/hr', rating: 4.4, users: '2.9k', category: 'Project Management', available: false },
    { name: 'Asana Premium', price: '₹32/hr', rating: 4.6, users: '2.1k', category: 'Task Management', available: true },
    { name: 'Dropbox Plus', price: '₹29/hr', rating: 4.3, users: '3.5k', category: 'Cloud Storage', available: true },
    { name: 'LastPass Premium', price: '₹29/hr', rating: 4.7, users: '2.8k', category: 'Password Manager', available: true }
  ];

  const ToolSection = ({ 
    title, 
    tools, 
    scrollRef 
  }: { 
    title: string; 
    tools: any[]; 
    scrollRef: React.RefObject<HTMLDivElement>;
  }) => (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-h2 text-dark">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(scrollRef, 'left')}
            className="p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all duration-300 hover:shadow-lg"
          >
            <svg className="w-5 h-5 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll(scrollRef, 'right')}
            className="p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all duration-300 hover:shadow-lg"
          >
            <svg className="w-5 h-5 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tools.map((tool, index) => (
          <ToolCard key={index} tool={tool} />
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <ToolSection title="🎨 Creative Software" tools={creativeTools} scrollRef={creativeRef} />
          <ToolSection title="🤖 AI Tools" tools={aiTools} scrollRef={aiRef} />
          <ToolSection title="💻 Development Tools" tools={devTools} scrollRef={devRef} />
          <ToolSection title="🎯 Design Tools" tools={designTools} scrollRef={designRef} />
          <ToolSection title="🎬 Video & Motion" tools={videoTools} scrollRef={videoRef} />
          <ToolSection title="📊 Productivity" tools={productivityTools} scrollRef={productivityRef} />
        </div>
      </div>
    </section>
  );
};