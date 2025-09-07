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
          <h1 className="text-5xl md:text-7xl font-black text-gray-100 mb-8 leading-tight fade-in">
            Browse-ify <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">Premium Software</span>
          </h1>

          {/* Description */}
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-xl text-gray-300 leading-relaxed text-center">
              Discover thousands of premium tools available for rent. From creative software to AI tools, find exactly what you need at unbeatable prices.
            </p>
          </div>

          {/* Enhanced Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 slide-in-up">
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${activeCategory === category
                  ? 'bg-gradient-to-r from-accent to-accent-light text-white shadow-xl transform scale-105'
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600 hover:shadow-lg hover:-translate-y-1 backdrop-blur-sm border border-gray-600'
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
              <div className="text-sm font-medium text-gray-300">Available Tools</div>
              <div className="w-8 h-1 bg-accent/30 rounded-full mx-auto mt-3 group-hover:bg-accent transition-colors"></div>
            </div>
            <div className="modern-card p-8 group">
              <div className="text-3xl font-black text-accent mb-2 group-hover:scale-110 transition-transform">₹29-69</div>
              <div className="text-sm font-medium text-gray-300">Hourly Rates</div>
              <div className="w-8 h-1 bg-accent/30 rounded-full mx-auto mt-3 group-hover:bg-accent transition-colors"></div>
            </div>
            <div className="modern-card p-8 group">
              <div className="text-3xl font-black text-accent mb-2 group-hover:scale-110 transition-transform">24/7</div>
              <div className="text-sm font-medium text-gray-300">Instant Access</div>
              <div className="w-8 h-1 bg-accent/30 rounded-full mx-auto mt-3 group-hover:bg-accent transition-colors"></div>
            </div>
            <div className="modern-card p-8 group">
              <div className="text-3xl font-black text-accent mb-2 group-hover:scale-110 transition-transform">100%</div>
              <div className="text-sm font-medium text-gray-300">Secure</div>
              <div className="w-8 h-1 bg-accent/30 rounded-full mx-auto mt-3 group-hover:bg-accent transition-colors"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};