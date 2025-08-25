'use client';

import React, { useEffect } from 'react';

interface PayPalButtonProps {
  amount: number;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const PayPalButton: React.FC<PayPalButtonProps> = ({ 
  amount, 
  onSuccess, 
  onError 
}) => {
  useEffect(() => {
    // Load PayPal SDK with new configuration
    const script = document.createElement('script');
    script.src = 'https://sandbox.paypal.com/sdk/js?client-id=BAAOHCbulRUVmHMknC1a_4b61NPbneAo719zsa5bMQkGI519Awb0CSNi0fQuHEokz7ZQckSm-erYGZshOY&components=hosted-buttons&enable-funding=venmo&currency=USD';
    script.crossOrigin = 'anonymous';
    script.async = true;
    
    script.onload = () => {
      // Initialize PayPal button after script loads
      if (window.paypal) {
        window.paypal.HostedButtons({
          hostedButtonId: "9CYK4LW23ZFCJ"
        }).render("#paypal-container-9CYK4LW23ZFCJ");
      }
    };
    
    document.head.appendChild(script);
    
    return () => {
      // Cleanup script when component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-full">
      <div id="paypal-container-9CYK4LW23ZFCJ" className="w-full"></div>
    </div>
  );
};

// Extend Window interface to include PayPal
declare global {
  interface Window {
    paypal: any;
  }
}