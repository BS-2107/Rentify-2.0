'use client';

import React, { useState } from 'react';
import { Header } from '../../../components/layout/Header';
import { Button } from '../../../components/ui/Button';
import { PayPalButton } from '../../../components/ui/PayPalButton';
import { useCart } from '../../../lib/CartContext';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  const applyPromoCode = () => {
    const validCodes = {
      'SAVE10': 10,
      'FIRST20': 20,
      'STUDENT15': 15
    };

    if (validCodes[promoCode as keyof typeof validCodes]) {
      setPromoDiscount(validCodes[promoCode as keyof typeof validCodes]);
      alert(`Promo code applied! ${validCodes[promoCode as keyof typeof validCodes]}% discount`);
    } else {
      alert('Invalid promo code');
    }
  };

  const calculateItemTotal = (item: typeof cartItems[0]) => {
    const basePrice = item.price * item.durationHours * item.quantity;
    const discountAmount = (basePrice * item.discount) / 100;
    return basePrice - discountAmount;
  };

  // Use the dynamic cart total from context
  const subtotal = getCartTotal();
  const promoDiscountAmount = (subtotal * promoDiscount) / 100;
  const tax = (subtotal - promoDiscountAmount) * 0.18; // 18% GST
  const total = subtotal - promoDiscountAmount + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="modern-card p-12 text-center fade-in">
                <div className="text-8xl mb-6 floating-animation">🛒</div>
                <h1 className="text-4xl font-bold text-gray-100 mb-4">Your Cart is Empty</h1>
                <p className="text-gray-300 mb-8 text-lg">
                  Looks like you haven't added any tools to your cart yet. Browse-ify our collection of premium software!
                </p>
                <a href="/browse">
                  <button className="btn-primary px-8 py-4 text-lg font-bold">
                    Browse-ify Tools
                  </button>
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">

            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-100 mb-2">Shopping Cart</h1>
              <p className="text-gray-300">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="modern-card p-6 slide-in-up">
                      <div className="flex items-center space-x-6">

                        {/* Tool Logo */}
                        <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                          <img
                            src={item.logo}
                            alt={item.name}
                            className="w-12 h-12 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = document.createElement('div');
                              fallback.className = 'text-2xl';
                              fallback.textContent = '🎨';
                              e.currentTarget.parentNode!.appendChild(fallback);
                            }}
                          />
                        </div>

                        {/* Tool Info */}
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold text-gray-100 mb-1">{item.name}</h3>
                          <div className="flex items-center space-x-4 mb-2">
                            <span className="text-sm bg-gray-600 px-3 py-1 rounded-full text-gray-200">
                              {item.category}
                            </span>
                            <span className="text-sm text-gray-300">
                              Duration: {item.duration}
                            </span>
                            {item.discount > 0 && (
                              <span className="text-sm bg-green-600 text-green-100 px-2 py-1 rounded-full">
                                {item.discount}% OFF
                              </span>
                            )}
                          </div>
                          <div className="text-lg font-bold text-accent">
                            ₹{item.price}/hour × {item.durationHours} hours = ₹{calculateItemTotal(item)}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-600 text-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-500 transition-colors"
                          >
                            -
                          </button>
                          <span className="text-lg font-semibold text-gray-100 w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-600 text-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-500 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2"
                          title="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <div className="mt-6">
                  <a href="/browse">
                    <Button variant="ghost" className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Continue Shopping
                    </Button>
                  </a>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl sticky top-24 border border-gray-700">
                  <h2 className="text-2xl font-bold text-gray-100 mb-6">Order Summary</h2>

                  {/* Promo Code */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      Promo Code
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-accent text-gray-100 placeholder-gray-400"
                      />
                      <Button variant="secondary" size="sm" onClick={applyPromoCode}>
                        Apply
                      </Button>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      Try: SAVE10, FIRST20, STUDENT15
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Subtotal</span>
                      <span className="text-gray-100">₹{subtotal.toFixed(2)}</span>
                    </div>

                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>Promo Discount ({promoDiscount}%)</span>
                        <span>-₹{promoDiscountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-300">GST (18%)</span>
                      <span className="text-gray-100">₹{tax.toFixed(2)}</span>
                    </div>

                    <hr className="border-gray-600" />

                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-100">Total</span>
                      <span className="text-accent">₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout Options */}
                  <div className="space-y-4 mb-4">
                    {/* PayPal Button */}
                    <div className="bg-primary/10 rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-dark mb-3 text-center">
                        Pay with PayPal
                      </h3>
                      <PayPalButton
                        amount={total}
                        toolName={cartItems.map(item => item.name).join(', ')}
                        quantity={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                        duration={cartItems.map(item => item.duration).join(', ')}
                        onSuccess={(paymentData) => {
                          alert(`Payment successful! Payment ID: ${paymentData?.id}. Your software access will be activated shortly.`);
                          clearCart(); // Clear cart after successful payment
                        }}
                        onError={(error) => {
                          console.error('PayPal payment error:', error);
                          let errorMessage = 'Payment failed. Please try again.';
                          
                          if (error instanceof Error) {
                            errorMessage = `Payment failed: ${error.message}`;
                          } else if (typeof error === 'string') {
                            errorMessage = `Payment failed: ${error}`;
                          }
                          
                          alert(errorMessage);
                        }}
                      />
                    </div>

                    {/* Alternative Checkout */}
                    <div className="text-center">
                      <span className="text-sm text-dark/60">or</span>
                    </div>

                    <Button
                      variant="secondary"
                      className="w-full py-4 text-lg font-bold"
                      onClick={() => {
                        alert(`Proceeding to alternative checkout for ₹${total.toFixed(2)}`);
                      }}
                    >
                      💳 Other Payment Methods
                    </Button>
                  </div>

                  {/* Security & Guarantees */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-gray-300">
                      <span className="mr-2">🔒</span>
                      <span>Secure payment processing</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <span className="mr-2">⚡</span>
                      <span>Instant access after payment</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <span className="mr-2">💰</span>
                      <span>Money-back guarantee</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <span className="mr-2">🎧</span>
                      <span>24/7 customer support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}