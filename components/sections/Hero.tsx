'use client';

import React from 'react';
import { Button } from '../ui/Button';

export const Hero: React.FC = () => {
  return (
    <section className="pt-24 pb-20 bg-gradient-to-br from-primary via-secondary to-primary relative overflow-hidden bg-pattern">
      {/* Enhanced background decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl floating-animation"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl floating-animation" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">

          {/* Enhanced Badge */}
          <div className="inline-flex items-center px-6 py-3 modern-card mb-8 slide-in-up">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
            <span className="text-sm font-semibold text-dark">100+ Premium Tools Available</span>
            <span className="ml-3 px-2 py-1 bg-accent/20 rounded-full text-xs font-bold text-accent">LIVE</span>
          </div>

          {/* Enhanced Main Headline */}
          <h1 className="text-5xl md:text-7xl font-black text-dark mb-8 leading-tight fade-in">
            Rent Premium Software
            <br />
            <span className="gradient-text bg-gradient-to-r from-accent to-dark bg-clip-text text-transparent">Starting ₹29/Hour</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-dark/70 max-w-4xl mx-auto mb-12 leading-relaxed">
            Access Adobe Creative Suite, ChatGPT Plus, Figma Pro & thousands more without expensive subscriptions
          </p>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 scale-in">
            <a href="/browse" className="group">
              <button className="btn-primary px-12 py-5 text-lg font-bold flex items-center gap-3 group-hover:gap-4 transition-all">
                <span className="text-2xl">🚀</span>
                Browse Tools
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </a>
            <a href="/list-account" className="group">
              <button className="btn-secondary px-12 py-5 text-lg font-bold flex items-center gap-3 group-hover:gap-4 transition-all">
                <span className="text-2xl">💰</span>
                List Your Account
              </button>
            </a>
          </div>

          {/* Enhanced Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto slide-in-up">
            <div className="text-center modern-card p-8 group">
              <div className="text-3xl font-black text-accent mb-2 group-hover:scale-110 transition-transform">2,500+</div>
              <div className="text-sm font-medium text-dark/70">Premium Tools</div>
              <div className="w-8 h-1 bg-accent/30 rounded-full mx-auto mt-3 group-hover:bg-accent transition-colors"></div>
            </div>
            <div className="text-center modern-card p-8 group">
              <div className="text-3xl font-black text-accent mb-2 group-hover:scale-110 transition-transform">₹29</div>
              <div className="text-sm font-medium text-dark/70">Starting Price</div>
              <div className="w-8 h-1 bg-accent/30 rounded-full mx-auto mt-3 group-hover:bg-accent transition-colors"></div>
            </div>
            <div className="text-center modern-card p-8 group">
              <div className="text-3xl font-black text-accent mb-2 group-hover:scale-110 transition-transform">24/7</div>
              <div className="text-sm font-medium text-dark/70">Instant Access</div>
              <div className="w-8 h-1 bg-accent/30 rounded-full mx-auto mt-3 group-hover:bg-accent transition-colors"></div>
            </div>
            <div className="text-center modern-card p-8 group">
              <div className="text-3xl font-black text-accent mb-2 group-hover:scale-110 transition-transform">10K+</div>
              <div className="text-sm font-medium text-dark/70">Happy Users</div>
              <div className="w-8 h-1 bg-accent/30 rounded-full mx-auto mt-3 group-hover:bg-accent transition-colors"></div>
            </div>
          </div>

          {/* Enhanced Popular Tools Showcase */}
          <div className="text-center fade-in">
            <div className="inline-flex items-center gap-2 mb-8">
              <span className="text-lg font-bold text-dark/80">Popular Tools Available Now</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">TRENDING</span>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-5xl mx-auto">
              {[
                { name: 'Adobe Photoshop', price: '₹59/hr', logo: '/logos/Photoshop.png' },
                { name: 'Adobe Illustrator', price: '₹55/hr', logo: '/logos/Illustrator.png' },
                { name: 'Adobe After Effects', price: '₹69/hr', logo: '/logos/After effects.PNG' },
                { name: 'Figma Pro', price: '₹35/hr', logo: '/logos/Figma.png' },
                { name: 'AutoCAD', price: '₹69/hr', logo: '/logos/AutoCAD.png' },
                { name: 'Sketch', price: '₹39/hr', logo: '/logos/Sketch.png' }
              ].map((tool, index) => (
                <div key={index} className="modern-card p-5 text-center group cursor-pointer" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="w-14 h-14 mx-auto mb-3 flex items-center justify-center bg-gradient-to-br from-accent/10 to-dark/10 rounded-2xl group-hover:scale-110 transition-transform">
                    <img
                      src={tool.logo}
                      alt={tool.name}
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        // Fallback to emoji if image fails
                        e.currentTarget.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'text-2xl';
                        fallback.textContent = tool.name.includes('Adobe') ? '🎨' :
                          tool.name.includes('ChatGPT') ? '🤖' :
                            tool.name.includes('Figma') ? '🎯' :
                              tool.name.includes('AutoCAD') ? '📐' : '⚡';
                        e.currentTarget.parentNode!.appendChild(fallback);
                      }}
                    />
                  </div>
                  <div className="text-xs font-bold text-dark mb-1 group-hover:text-accent transition-colors">{tool.name}</div>
                  <div className="text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded-full">{tool.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};