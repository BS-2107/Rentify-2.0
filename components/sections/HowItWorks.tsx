import React from 'react';
import { Card } from '../ui/Card';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-h1 text-gray-100 mb-8">Rent-ify Process</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              Rentify's pretty straightforward:
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* For Account Owners */}
            <Card className="p-8 bg-gray-700 border-gray-600">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-h2 text-gray-100 mb-2">For Account Owners</h3>
                <p className="text-accent font-semibold text-lg">Make Money from Unused Time</p>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  <strong>Not using your premium software for a while?</strong> List your account's available time on Rentify and set your price.
                </p>
                <div className="bg-gray-600/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">
                    Turn your idle subscriptions into income. Set your own rates and rental terms.
                  </p>
                </div>
              </div>
            </Card>

            {/* For Users */}
            <Card className="p-8 bg-gray-700 border-gray-600">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-h2 text-gray-100 mb-2">For Users</h3>
                <p className="text-accent font-semibold text-lg">Access Premium Tools Affordably</p>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  <strong>Browse available accounts by category</strong> - Creative Software, AI Tools, Digital Assets, Gaming and more.
                </p>
                <div className="bg-gray-600/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">
                    Choose what you need - Access premium accounts for days or weeks at incredibly low prices.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Process Steps */}
          <div className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-2xl p-8">
            <h3 className="text-h2 text-gray-100 text-center mb-8">Simple Process</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">1</div>
                <h4 className="font-semibold text-gray-100 mb-2">Browse & Choose</h4>
                <p className="text-sm text-gray-400">Find the software you need</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">2</div>
                <h4 className="font-semibold text-gray-100 mb-2">Instant Access</h4>
                <p className="text-sm text-gray-400">Get immediate access after payment</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">3</div>
                <h4 className="font-semibold text-gray-100 mb-2">Use & Create</h4>
                <p className="text-sm text-gray-400">Work on your projects</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">4</div>
                <h4 className="font-semibold text-gray-100 mb-2">Return</h4>
                <p className="text-sm text-gray-400">Account returned automatically</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center max-w-4xl mx-auto">
          <p className="text-lg text-gray-300 leading-relaxed">
            Our platform ensures smooth handoffs and clear usage terms, with automatic notifications when the rental period is ending. The streaming-style interface makes discovering available accounts as easy as finding your next binge-worthy show.
          </p>
        </div>
      </div>
    </section>
  );
};