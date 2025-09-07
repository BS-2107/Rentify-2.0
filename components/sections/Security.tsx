import React from 'react';

export const Security: React.FC = () => {
  const securityFeatures = [
    "End-to-end encryption for all transactions and personal data",
    "Secure credential management with automatic password resets after rentals",
    "Multi-factor authentication to protect all accounts",
    "Tokenized payment processing that never stores your full card details",
    "Regular security audits by independent cybersecurity firms",
    "Modern web security practices with robust server-side validation",
    "Protection against common vulnerabilities like XSS and CSRF attacks"
  ];

  return (
    <section id="security" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <h2 className="text-h1 text-gray-100 mb-6">
                Secure-ify Your Experience
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Security isn't just a feature for us - it's our foundation. Here's how we keep everything locked down:
              </p>
              
              <ul className="space-y-4">
                {securityFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-accent rounded-full flex items-center justify-center mr-4 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <p className="text-gray-400 mt-8">
                We've built everything using modern web security practices with robust server-side validation and protection against common vulnerabilities like XSS and CSRF attacks.
              </p>
            </div>

            {/* Visual Element */}
            <div className="lg:text-center">
              <div className="bg-gray-700 rounded-2xl p-8 shadow-lg border border-gray-600">
                <div className="text-6xl mb-6">🛡️</div>
                <h2 className="text-h1 text-gray-100 mb-6">
                  Secure-ify Your Experience
                </h2>
                <p className="text-gray-300 mb-6">
                  Your data and accounts are protected with the same security standards used by major financial institutions.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-600 rounded-lg p-4">
                    <div className="text-2xl font-bold text-accent">256-bit</div>
                    <div className="text-sm text-gray-400">Encryption</div>
                  </div>
                  <div className="bg-gray-600 rounded-lg p-4">
                    <div className="text-2xl font-bold text-accent">99.9%</div>
                    <div className="text-sm text-gray-400">Uptime</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};