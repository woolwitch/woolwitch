/**
 * Payment Method Selector Component
 * 
 * Allows users to choose between card payment and PayPal
 * for the checkout process.
 */

import React from 'react';
// CreditCard icon not needed since card payment is hidden
// import { CreditCard } from 'lucide-react';

export type PaymentMethod = 'card' | 'paypal';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  disabled?: boolean;
  className?: string;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-serif font-semibold text-rose-900">
        Payment Method
      </h3>
      
      <div className="space-y-3">
        {/* Card Payment Option - Hidden for now */}
        {/* TODO: Re-enable when Stripe is ready to be used
        <label 
          className={`
            flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all
            ${selectedMethod === 'card' 
              ? 'border-rose-300 bg-rose-50' 
              : 'border-gray-200 hover:border-gray-300 bg-white'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={selectedMethod === 'card'}
            onChange={() => onMethodChange('card')}
            disabled={disabled}
            className="w-4 h-4 text-rose-600 border-gray-300 focus:ring-rose-500"
          />
          
          <div className="flex items-center space-x-3 flex-1">
            <div className="flex-shrink-0">
              <CreditCard className="w-6 h-6 text-gray-600" />
            </div>
            
            <div className="flex-1">
              <div className="font-medium text-gray-900">Credit/Debit Card</div>
              <div className="text-sm text-gray-500">
                Pay securely with your card
              </div>
            </div>
            
            <div className="flex space-x-1">
              <div className="w-8 h-5 bg-gray-100 rounded border text-xs flex items-center justify-center text-gray-600">
                VISA
              </div>
              <div className="w-8 h-5 bg-gray-100 rounded border text-xs flex items-center justify-center text-gray-600">
                MC
              </div>
            </div>
          </div>
        </label>
        */}

        {/* PayPal Payment Option */}
        <label 
          className={`
            flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all
            ${selectedMethod === 'paypal' 
              ? 'border-rose-300 bg-rose-50' 
              : 'border-gray-200 hover:border-gray-300 bg-white'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="paypal"
            checked={selectedMethod === 'paypal'}
            onChange={() => onMethodChange('paypal')}
            disabled={disabled}
            className="w-4 h-4 text-rose-600 border-gray-300 focus:ring-rose-500"
          />
          
          <div className="flex items-center space-x-3 flex-1">
            <div className="flex-shrink-0">
              {/* PayPal logo */}
              <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">PP</span>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="font-medium text-gray-900">PayPal</div>
              <div className="text-sm text-gray-500">
                Pay with your PayPal account or card
              </div>
            </div>
            
            <div className="text-blue-600 font-semibold text-lg">
              PayPal
            </div>
          </div>
        </label>
      </div>

      {/* Payment Method Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          <p className="font-medium mb-1">PayPal Secure Payment</p>
          <p>You'll be redirected to PayPal to complete your payment securely. No need to enter card details.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;