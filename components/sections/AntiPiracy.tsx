import React from 'react';
import { Button } from '../ui/Button';

export const AntiPiracy: React.FC = () => {
  const benefits = [
    {
      title: "Makes use of accounts that would otherwise sit idle",
      description: "Transform unused subscriptions into income opportunities"
    },
    {
      title: "Provides users with safe, fully-functional software at prices anyone can afford",
      description: "No compromised features or hidden malware risks"
    },
    {
      title: "Includes proper support and community help",
      description: "Get real assistance when you need it, not silence"
    },
    {
      title: "Eliminates legal and security risks of pirated software",
      description: "Sleep peacefully knowing you're using legitimate software"
    }
  ];

  return (
    <section id="anti-piracy" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-h1 text-dark mb-8">Fighting Digital Piracy</h2>
          
          <div className="text-left mb-12">
            <p className="text-lg text-dark/80 mb-6">
              Let's talk straight - software piracy hurts everyone. It hurts developers who pour their hearts into creating amazing tools. It hurts legitimate users who end up paying more. And honestly, it hurts pirates too - with malware risks, no support, and the constant worry about legal issues.
            </p>
            
            <p className="text-lg text-dark/80 mb-8">
              <strong>Rentify offers a better way.</strong> We've created an affordable, legitimate alternative that:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-left shadow-sm">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-dark mb-2">{benefit.title}</h3>
                    <p className="text-dark/70">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h3 className="text-h2 text-dark mb-4">The Smart Alternative</h3>
            <p className="text-lg text-dark/80 mb-6">
              By making premium tools accessible at fair prices, we're addressing the root cause of piracy - not just treating the symptoms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg">Join the Movement</Button>
              <Button variant="secondary" size="lg">Learn More</Button>
            </div>
          </div>

          <p className="text-dark/70 italic">
            "Choose legitimate software access. Choose security. Choose Rentify."
          </p>
        </div>
      </div>
    </section>
  );
};