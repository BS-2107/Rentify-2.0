'use client';

import React, { useEffect, useRef } from 'react';
import { savePaymentRecord, PaymentRecord } from '../../lib/supabase';

interface PayPalButtonProps {
  amount: number;
  toolName?: string;
  quantity?: number;
  duration?: string;
  onSuccess?: (paymentData?: any) => void;
  onError?: (error: any) => void;
}

export const PayPalButtonSimple: React.FC<PayPalButtonProps> = ({ 
  amount, 
  toolName = 'Unknown Tool',
  quantity = 1,
  duration = '1 month',
  onSuccess, 
  onError 
}) => {
  const paypalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clean up any existing PayPal buttons
    if (paypalRef.current) {
      paypalRef.current.innerHTML = '';
    }

    // Create script element for PayPal SDK
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=BAAOHCbulRUVmHMknC1a_4b61NPbneAo719zsa5bMQkGI519Awb0CSNi0fQuHEokz7ZQckSm-erYGZshOY&currency=USD`;
    script.async = true;

    script.onload = () => {
      if (window.paypal && paypalRef.current) {
        window.paypal.Buttons({
          style: {
            color: 'blue',
            shape: 'rect',
            label: 'paypal'
          },
          createOrder: function(data: any, actions: any) {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: amount.toString()
                },
                description: `${toolName} - ${duration} (${quantity}x)`
              }]
            });
          },
          onApprove: function(data: any, actions: any) {
            return actions.order.capture().then(async function(details: any) {
              console.log('Payment completed:', details);
              
              // Save to Supabase
              try {
                const paymentData: Omit<PaymentRecord, 'id' | 'created_at' | 'updated_at'> = {
                  payment_id: details.id,
                  payer_id: details.payer?.payer_id || '',
                  amount: parseFloat(amount.toString()),
                  currency: 'USD',
                  status: details.status,
                  tool_name: toolName,
                  quantity: quantity,
                  duration: duration,
                  customer_email: details.payer?.email_address || '',
                  customer_name: details.payer?.name ? 
                    `${details.payer.name.given_name || ''} ${details.payer.name.surname || ''}`.trim() : '',
                  payment_method: 'PayPal'
                };

                await savePaymentRecord(paymentData);
                console.log('Payment saved to Supabase');
              } catch (error) {
                console.error('Failed to save to Supabase:', error);
              }

              if (onSuccess) {
                onSuccess(details);
              }
            });
          },
          onError: function(err: any) {
            console.error('PayPal error:', err);
            if (onError) {
              onError(err);
            }
          }
        }).render(paypalRef.current);
      }
    };

    script.onerror = () => {
      console.error('Failed to load PayPal SDK');
      if (onError) {
        onError(new Error('Failed to load PayPal SDK'));
      }
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [amount, toolName, quantity, duration]);

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

      {/* PayPal Button Container */}
      <div className="modern-card p-2 bg-gradient-to-br from-gray-50/95 to-blue-50/30 border border-blue-200/30">
        <div ref={paypalRef} className="w-full"></div>
      </div>

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

// Extend Window interface
declare global {
  interface Window {
    paypal: any;
  }
}
