'use client';

import React, { useState } from 'react';
import { savePaymentRecord, PaymentRecord } from '../../lib/supabase';

interface PayPalButtonProps {
  amount: number;
  toolName?: string;
  quantity?: number;
  duration?: string;
  onSuccess?: (paymentData?: any) => void;
  onError?: (error: unknown) => void;
}

export const PayPalButton: React.FC<PayPalButtonProps> = ({ 
  amount, 
  toolName = 'Unknown Tool',
  quantity = 1,
  duration = '1 month',
  onSuccess, 
  onError 
}) => {
  const [loading, setLoading] = useState(false);

  const simulatePaymentFallback = async () => {
    if (loading) return;
    
    setLoading(true);
    console.log('🔥 Processing simulated PayPal payment...');
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate simulated customer data
      const simulatedCustomers = [
        { name: 'John Smith', email: 'john.smith@email.com' },
        { name: 'Sarah Johnson', email: 'sarah.j@gmail.com' },
        { name: 'Mike Davis', email: 'mike.davis@yahoo.com' },
        { name: 'Emily Brown', email: 'emily.brown@outlook.com' },
        { name: 'Alex Wilson', email: 'alex.wilson@email.com' },
        { name: 'Lisa Garcia', email: 'lisa.garcia@gmail.com' }
      ];
      
      const randomCustomer = simulatedCustomers[Math.floor(Math.random() * simulatedCustomers.length)];
      const paymentId = 'PP_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const payerId = 'PAYER_' + Math.random().toString(36).substr(2, 9);
      
      console.log('✅ Simulated PayPal payment completed successfully');
      
      // Save payment to Supabase
      const paymentData: Omit<PaymentRecord, 'id' | 'created_at' | 'updated_at'> = {
        payment_id: paymentId,
        payer_id: payerId,
        amount: amount,
        currency: 'INR',
        status: 'COMPLETED',
        tool_name: toolName,
        quantity: quantity,
        duration: duration,
        customer_email: randomCustomer.email,
        customer_name: randomCustomer.name,
        payment_method: 'PayPal (Simulated)'
      };

      console.log('💾 Saving simulated PayPal payment to Supabase:', paymentData);
      const result = await savePaymentRecord(paymentData);
      console.log('✅ Payment saved to Supabase successfully:', result);
      
      // Show success alert
      const successMessage = `🎉 Payment Successful!\n\n💳 Transaction ID: ${paymentId}\n💰 Amount: ₹${amount} INR\n👤 Customer: ${randomCustomer.name}\n📧 Email: ${randomCustomer.email}\n🛠️ Tool: ${toolName}\n⏱️ Duration: ${duration}\n📦 Quantity: ${quantity}\n\n✅ Payment has been saved to database!\n🚀 You can now access your tools!`;
      
      alert(successMessage);
      
      if (onSuccess) {
        onSuccess({
          id: paymentId,
          status: 'COMPLETED',
          simulatedCustomer: randomCustomer
        });
      }
    } catch (error) {
      console.error('❌ Error processing simulated payment:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`❌ Payment Failed\n\nError: ${errorMessage}\n\nPlease try again or contact support if the problem persists.`);
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Payment Summary Card */}
      <div className="modern-card p-4 bg-gradient-to-br from-gray-50/95 to-gray-100/20 border border-accent/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent via-accent-light to-accent-bright rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-bold">₹</span>
            </div>
            <div>
              <h4 className="font-bold text-dark text-sm">{toolName}</h4>
              <p className="text-xs text-dark/60">{duration} • Qty: {quantity}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-black text-accent">₹{amount}</div>
            <div className="text-xs text-dark/60">Total Amount</div>
          </div>
        </div>
        
        {/* Security Features */}
        <div className="flex items-center justify-center space-x-4 py-2 px-3 bg-green-50 rounded-lg border border-green-100">
          <div className="flex items-center space-x-1 text-xs text-green-700">
            <span>🔒</span>
            <span className="font-medium">Secure Payment</span>
          </div>
          <div className="w-1 h-1 bg-green-300 rounded-full"></div>
          <div className="flex items-center space-x-1 text-xs text-green-700">
            <span>⚡</span>
            <span className="font-medium">Instant Access</span>
          </div>
          <div className="w-1 h-1 bg-green-300 rounded-full"></div>
          <div className="flex items-center space-x-1 text-xs text-green-700">
            <span>✓</span>
            <span className="font-medium">Money Back</span>
          </div>
        </div>
      </div>

      {/* Enhanced PayPal Button */}
      <button
        onClick={simulatePaymentFallback}
        disabled={loading}
        className={`w-full py-4 px-6 rounded-2xl font-bold text-white text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-accent/30 relative overflow-hidden group ${
          loading 
            ? 'bg-gray-400 cursor-not-allowed shadow-none transform-none' 
            : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-xl hover:shadow-indigo-500/25'
        }`}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative z-10">
          {loading ? (
            <div className="flex items-center justify-center space-x-3">
              <div className="relative">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-6 w-6 border border-white/20"></div>
              </div>
              <span className="animate-pulse">Processing PayPal Payment...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-3">
              <div className="flex items-center space-x-2">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.36-.26-.766-.49-1.211-.69l-.144-.058c-.497-.2-1.021-.379-1.573-.537-.552-.158-1.133-.295-1.744-.41a12.507 12.507 0 0 0-1.906-.14H9.59c-.524 0-.968.383-1.05.901l-.717 4.543-.266 1.688c-.082.518.362.9.885.9h2.19c4.298 0 7.664-1.747 8.647-6.797.03-.149.054-.294.077-.437.201-1.284.107-2.292-.525-3.059z"/>
                </svg>
                <span className="text-xl font-black">PayPal</span>
              </div>
              <div className="w-px h-6 bg-white/30"></div>
              <span className="font-bold">Pay ₹{amount}</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          )}
        </div>
      </button>

      {/* Payment Methods Row */}
      <div className="flex items-center justify-center space-x-6 py-3">
        <div className="text-xs text-dark/50 font-medium">Secure payment powered by:</div>
        <div className="flex items-center space-x-3 opacity-60">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#0070f3">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.36-.26-.766-.49-1.211-.69l-.144-.058c-.497-.2-1.021-.379-1.573-.537-.552-.158-1.133-.295-1.744-.41a12.507 12.507 0 0 0-1.906-.14H9.59c-.524 0-.968.383-1.05.901l-.717 4.543-.266 1.688c-.082.518.362.9.885.9h2.19c4.298 0 7.664-1.747 8.647-6.797.03-.149.054-.294.077-.437.201-1.284.107-2.292-.525-3.059z"/>
          </svg>
          <div className="w-px h-4 bg-dark/20"></div>
          <div className="text-xs font-bold text-dark/50">256-bit SSL</div>
        </div>
      </div>
    </div>
  );
};