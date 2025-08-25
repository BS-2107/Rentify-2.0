'use client';

import React, { useState } from 'react';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { Button } from '../../../components/ui/Button';

export default function ListAccountPage() {
  const [formData, setFormData] = useState({
    software: '',
    accountType: '',
    duration: '',
    price: '',
    description: '',
    features: [''],
    contactEmail: '',
    contactPhone: '',
    availability: 'immediate',
    terms: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const softwareOptions = [
    'Adobe Photoshop',
    'Adobe Illustrator', 
    'Adobe After Effects',
    'Adobe Premiere Pro',
    'Adobe InDesign',
    'Adobe XD',
    'Adobe Lightroom',
    'Figma Pro',
    'Sketch',
    'Canva Pro',
    'ChatGPT Plus',
    'Claude Pro',
    'Midjourney',
    'AutoCAD',
    'Cinema 4D',
    'Final Cut Pro',
    'DaVinci Resolve Studio',
    'Microsoft Office 365',
    'Notion Pro',
    'Slack Pro',
    'Other'
  ];

  const accountTypes = [
    'Personal Account',
    'Business Account', 
    'Student Account',
    'Team Account',
    'Enterprise Account'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Account listing submitted successfully! We will review and contact you within 24 hours.');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-dark mb-2">Software Details</h2>
              <p className="text-dark/70">Tell us about the software account you want to list</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-dark mb-3">
                  Software/Tool *
                </label>
                <select
                  value={formData.software}
                  onChange={(e) => handleInputChange('software', e.target.value)}
                  className="modern-input w-full"
                  required
                >
                  <option value="">Select Software</option>
                  {softwareOptions.map(software => (
                    <option key={software} value={software}>{software}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-3">
                  Account Type *
                </label>
                <select
                  value={formData.accountType}
                  onChange={(e) => handleInputChange('accountType', e.target.value)}
                  className="modern-input w-full"
                  required
                >
                  <option value="">Select Account Type</option>
                  {accountTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-dark mb-3">
                  Rental Duration *
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="modern-input w-full"
                  required
                >
                  <option value="">Select Duration</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-3">
                  Price per Hour (₹) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="e.g., 59"
                  className="modern-input w-full"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-3">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your account, what's included, any special features..."
                rows={4}
                className="modern-input w-full resize-none"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-dark mb-2">Features & Benefits</h2>
              <p className="text-dark/70">List the key features and benefits of your account</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-3">
                Account Features *
              </label>
              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="e.g., Full access to premium templates"
                      className="modern-input flex-1"
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="btn-secondary px-4 py-2 text-sm"
                >
                  + Add Feature
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-3">
                Availability *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: 'immediate', label: 'Available Now', desc: 'Ready for immediate rental' },
                  { value: 'scheduled', label: 'Scheduled', desc: 'Available at specific times' },
                  { value: 'on-demand', label: 'On Demand', desc: 'Available upon request' }
                ].map(option => (
                  <label key={option.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="availability"
                      value={option.value}
                      checked={formData.availability === option.value}
                      onChange={(e) => handleInputChange('availability', e.target.value)}
                      className="sr-only"
                    />
                    <div className={`modern-card p-4 text-center transition-all ${
                      formData.availability === option.value 
                        ? 'ring-2 ring-accent bg-accent/5' 
                        : 'hover:shadow-lg'
                    }`}>
                      <div className="font-semibold text-dark mb-1">{option.label}</div>
                      <div className="text-sm text-dark/70">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-dark mb-2">Contact Information</h2>
              <p className="text-dark/70">How can renters contact you?</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-dark mb-3">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  placeholder="your@email.com"
                  className="modern-input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-3">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="modern-input w-full"
                />
              </div>
            </div>

            <div className="modern-card p-6 bg-blue-50/50">
              <h3 className="font-semibold text-dark mb-3 flex items-center">
                <span className="text-2xl mr-2">🔒</span>
                Privacy & Security
              </h3>
              <ul className="space-y-2 text-sm text-dark/70">
                <li>• Your contact information is only shared with verified renters</li>
                <li>• We use secure payment processing for all transactions</li>
                <li>• Account credentials are automatically reset after each rental</li>
                <li>• 24/7 monitoring to prevent misuse</li>
              </ul>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-dark mb-2">Review & Submit</h2>
              <p className="text-dark/70">Please review your listing before submitting</p>
            </div>

            <div className="modern-card p-6">
              <h3 className="text-xl font-bold text-dark mb-4">Listing Summary</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-dark mb-2">Software Details</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Software:</span> {formData.software}</p>
                    <p><span className="font-medium">Account Type:</span> {formData.accountType}</p>
                    <p><span className="font-medium">Duration:</span> {formData.duration}</p>
                    <p><span className="font-medium">Price:</span> ₹{formData.price}/hour</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-dark mb-2">Contact & Availability</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Email:</span> {formData.contactEmail}</p>
                    <p><span className="font-medium">Phone:</span> {formData.contactPhone || 'Not provided'}</p>
                    <p><span className="font-medium">Availability:</span> {formData.availability}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-dark mb-2">Description</h4>
                <p className="text-sm text-dark/70">{formData.description}</p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-dark mb-2">Features</h4>
                <ul className="text-sm text-dark/70 space-y-1">
                  {formData.features.filter(f => f.trim()).map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="modern-card p-6 bg-green-50/50">
              <h3 className="font-semibold text-dark mb-3 flex items-center">
                <span className="text-2xl mr-2">✅</span>
                What happens next?
              </h3>
              <ul className="space-y-2 text-sm text-dark/70">
                <li>• We'll review your listing within 24 hours</li>
                <li>• You'll receive an email confirmation once approved</li>
                <li>• Your account will be listed on our platform</li>
                <li>• You'll start receiving rental requests from verified users</li>
              </ul>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={formData.terms}
                onChange={(e) => handleInputChange('terms', e.target.checked)}
                className="mr-3"
                required
              />
              <label htmlFor="terms" className="text-sm text-dark/70">
                I agree to the <a href="#" className="text-accent hover:underline">Terms of Service</a> and <a href="#" className="text-accent hover:underline">Privacy Policy</a>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-primary bg-pattern">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Page Header */}
            <div className="text-center mb-12 fade-in">
              <h1 className="text-5xl font-black text-dark mb-4">
                List Your <span className="bg-gradient-to-r from-accent to-dark bg-clip-text text-transparent">Account</span>
              </h1>
              <p className="text-xl text-dark/70 leading-relaxed mx-auto" style={{ maxWidth: '600px' }}>
                Earn money by renting out your premium software accounts to verified users
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div key={i} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      i + 1 <= currentStep 
                        ? 'bg-accent text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {i + 1}
                    </div>
                    {i < totalSteps - 1 && (
                      <div className={`w-16 h-1 mx-2 transition-all ${
                        i + 1 < currentStep ? 'bg-accent' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center text-sm text-dark/70">
                Step {currentStep} of {totalSteps}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="modern-card p-8 mb-8">
                {renderStep()}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`btn-secondary px-6 py-3 ${
                    currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Previous
                </button>

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary px-6 py-3"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!formData.terms}
                    className={`btn-primary px-8 py-3 ${
                      !formData.terms ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Submit Listing
                  </button>
                )}
              </div>
            </form>

            {/* Benefits Section */}
            <div className="mt-16 grid md:grid-cols-3 gap-6">
              <div className="modern-card p-6 text-center">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="font-bold text-dark mb-2">Earn Extra Income</h3>
                <p className="text-sm text-dark/70">Make money from accounts you're not using 24/7</p>
              </div>
              <div className="modern-card p-6 text-center">
                <div className="text-3xl mb-3">🔒</div>
                <h3 className="font-bold text-dark mb-2">Secure & Safe</h3>
                <p className="text-sm text-dark/70">All renters are verified and monitored</p>
              </div>
              <div className="modern-card p-6 text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-bold text-dark mb-2">Easy Management</h3>
                <p className="text-sm text-dark/70">Simple dashboard to manage your listings</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}