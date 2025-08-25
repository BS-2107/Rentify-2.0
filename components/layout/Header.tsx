'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { useCart } from '../../lib/CartContext';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-white/30 z-50 shadow-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Enhanced Logo */}
          <div className="flex items-center group">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-dark rounded-xl mr-3 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-dark bg-clip-text text-transparent">Rentify</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-dark hover:text-accent transition-colors"
            >
              How It Works
            </button>
            <a href="/list-account" className="text-dark hover:text-accent transition-colors">
              List Account
            </a>
            <button
              onClick={() => scrollToSection('security')}
              className="text-dark hover:text-accent transition-colors"
            >
              Security
            </button>
            <button
              onClick={() => scrollToSection('anti-piracy')}
              className="text-dark hover:text-accent transition-colors"
            >
              Why Choose Us
            </button>
          </nav>

          {/* Cart, Login & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="/cart" className="relative p-2 text-dark hover:text-accent transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M20 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2-2v4m16 0H4" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </a>

            <a href="/browse">
              <button className="btn-primary px-6 py-2.5 text-sm font-semibold">Get Started</button>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-dark"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-left text-dark hover:text-accent transition-colors"
              >
                How It Works
              </button>
              <a href="/list-account" className="text-left text-dark hover:text-accent transition-colors">
                List Account
              </a>
              <button
                onClick={() => scrollToSection('security')}
                className="text-left text-dark hover:text-accent transition-colors"
              >
                Security
              </button>
              <button
                onClick={() => scrollToSection('anti-piracy')}
                className="text-left text-dark hover:text-accent transition-colors"
              >
                Why Choose Us
              </button>
              <div className="space-y-3">
                <a href="/cart" className="flex items-center justify-center w-full p-3 text-dark hover:text-accent transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M20 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2-2v4m16 0H4" />
                  </svg>
                  Cart ({cartItemCount})
                </a>

                <a href="/browse">
                  <Button variant="primary" className="w-full">Get Started</Button>
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};