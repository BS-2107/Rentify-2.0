'use client';

import React, { useState } from 'react';

export const BrowseHero: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Tools');

  const categories = [
    'All Tools',
    'Creative Software',
    'AI Tools',
    'Development',
    'Design',
    'Video Editing',
    'Gaming',
    'Productivity'
  ];

  return (
    <section className="pt-24 pb-20 bg-gradient-to-br from-primary via-secondary to-primary relative overflow-hidden bg-pattern">
      {/* Enhanced background decorative elements */}
      <div className="absolute top-10 left-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl floating-animation"></div>
      <div className="absolute bottom-10 right-20 w-80 h-80 bg-secondary/15 rounded-full blur-3xl floating-animation" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">

          {/* Enhanced Title */}
          <h1 className="text-5xl md:text-7xl font-black text-dark mb-8 leading-tight fade-in">
            Browse <span className="bg-gradient-to-r from-accent to-dark bg-clip-text text-transparent">Premium Software</span>
          </h1>

          {/* Description */}
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-xl text-dark/70 leading-relaxed text-center">
              Discover thousands of premium tools available for rent. From creative software to AI tools, find exactly what you need at unbeatable prices.
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="max-w-2xl mx-auto mb-12 scale-in">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for Adobe, Figma, ChatGPT, AutoCAD, Blender..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="modern-input w-full px-6 py-5 text-lg shadow-2xl"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-3 bg-gradient-to-r from-accent to-dark text-white rounded-xl hover:scale-110 transition-all duration-300 shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Enhanced Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 slide-in-up">
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${activeCategory === category
                  ? 'bg-gradient-to-r from-accent to-dark text-white shadow-xl transform scale-105'
                  : 'bg-white/90 text-dark hover:bg-white hover:shadow-lg hover:-translate-y-1 backdrop-blur-sm'
                  }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto fade-in">
            <div className="modern-card p-8 group">
              <div className="text-3xl font-black text-accent mb-2 group-hover:scale-110 transition-transform">100+</div>
              <div className="text-sm font-medium text-dark/70">Available Tools</div>
              <div className="w-8 h-1 bg-accent/30 rounded-full mx-auto mt-3 group-hover:bg-accent transition-colors"></div>
            </div>
            <div className="modern-card p-8 group">
              <div className="text-3xl font-black text-accent mb-2 group-hover:scale-110 transition-transform">₹29-69</div>
              <div className="text-sm font-medium text-dark/70">Hourly Rates</div>
              <div className="w-8 h-1 bg-accent/30 rounded-full mx-auto mt-3 group-hover:bg-accent transition-colors"></div>
            </div>
            <div className="modern-card p-8 group">
              <div className="text-3xl font-black text-accent mb-2 group-hover:scale-110 transition-transform">24/7</div>
              <div className="text-sm font-medium text-dark/70">Instant Access</div>
              <div className="w-8 h-1 bg-accent/30 rounded-full mx-auto mt-3 group-hover:bg-accent transition-colors"></div>
            </div>
            <div className="modern-card p-8 group">
              <div className="text-3xl font-black text-accent mb-2 group-hover:scale-110 transition-transform">100%</div>
              <div className="text-sm font-medium text-dark/70">Secure</div>
              <div className="w-8 h-1 bg-accent/30 rounded-full mx-auto mt-3 group-hover:bg-accent transition-colors"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};