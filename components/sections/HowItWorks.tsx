import React from 'react';
import { Card } from '../ui/Card';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-h1 text-dark mb-8">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-dark/70 mb-6 leading-relaxed">
              Rentify's pretty straightforward:
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* For Account Owners */}
            <Card className="p-8">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-h2 text-dark mb-2">For Account Owners</h3>
                <p className="text-accent font-semibold text-lg">Make Money from Unused Time</p>
              </div>
              <div className="space-y-4">
                <p className="text-dark/80 leading-relaxed">
                  <strong>Not using your premium software for a while?</strong> List your account's available time on Rentify and set your price.
                </p>
                <div className="bg-primary/30 rounded-lg p-4">
                  <p className="text-dark/70 text-sm">
                    Turn your idle subscriptions into income. Set your own rates and rental terms.
                  </p>
                </div>
              </div>
            </Card>

            {/* For Users */}
            <Card className="p-8">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-h2 text-dark mb-2">For Users</h3>
                <p className="text-accent font-semibold text-lg">Access Premium Tools Affordably</p>
              </div>
              <div className="space-y-4">
                <p className="text-dark/80 leading-relaxed">
                  <strong>Browse available accounts by category</strong> - Creative Software, AI Tools, Digital Assets, Gaming and more.
                </p>
                <div className="bg-secondary/30 rounded-lg p-4">
                  <p className="text-dark/70 text-sm">
                    Choose what you need - Access premium accounts for days or weeks at incredibly low prices.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Process Steps */}
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-8">
            <h3 className="text-h2 text-dark text-center mb-8">Simple Process</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">1</div>
                <h4 className="font-semibold text-dark mb-2">Browse & Choose</h4>
                <p className="text-sm text-dark/70">Find the software you need</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">2</div>
                <h4 className="font-semibold text-dark mb-2">Instant Access</h4>
                <p className="text-sm text-dark/70">Get immediate access after payment</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">3</div>
                <h4 className="font-semibold text-dark mb-2">Use & Create</h4>
                <p className="text-sm text-dark/70">Work on your projects</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">4</div>
                <h4 className="font-semibold text-dark mb-2">Return</h4>
                <p className="text-sm text-dark/70">Account returned automatically</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center max-w-4xl mx-auto">
          <p className="text-lg text-dark/70 leading-relaxed">
            Our platform ensures smooth handoffs and clear usage terms, with automatic notifications when the rental period is ending. The streaming-style interface makes discovering available accounts as easy as finding your next binge-worthy show.
          </p>
        </div>
      </div>
    </section>
  );
};