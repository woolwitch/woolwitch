/**
 * Stripe Configuration
 * 
 * Configures Stripe for both local development and production environments.
 * Handles environment-specific configuration and error handling.
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

// Stripe configuration
export interface StripeConfig {
  publishableKey: string;
  isConfigured: boolean;
}

// Cache the Stripe promise to avoid recreating it
let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get Stripe configuration from environment variables
 */
export function getStripeConfig(): StripeConfig {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  return {
    publishableKey: publishableKey || '',
    isConfigured: Boolean(publishableKey)
  };
}

/**
 * Check if Stripe is properly configured
 */
export function isStripeConfigured(): boolean {
  const config = getStripeConfig();
  return config.isConfigured;
}

/**
 * Get the Stripe instance (cached)
 */
export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const config = getStripeConfig();
    
    if (!config.isConfigured) {
      console.warn('Stripe is not configured. Please check your environment variables.');
      return Promise.resolve(null);
    }
    
    stripePromise = loadStripe(config.publishableKey);
  }
  
  return stripePromise;
}

/**
 * Test keys for local development
 * These are Stripe's official test keys that can be used safely
 */
export const STRIPE_TEST_KEYS = {
  publishableKey: 'pk_test_51HdSGkFaK8mZQOyOaZGHxQKUUHCdKP1s3BFB6qDKQjUhSfFHJz6L4U4QJuFgpO1YrqMZJ9S9mLG3a7qJ8mN5K2Hy00vRH4g8hQ'
};

/**
 * Get test configuration for local development
 */
export function getTestStripeConfig(): StripeConfig {
  return {
    publishableKey: STRIPE_TEST_KEYS.publishableKey,
    isConfigured: true
  };
}

/**
 * Determine if we're in development mode
 */
export function isDevelopmentMode(): boolean {
  return import.meta.env.DEV || import.meta.env.NODE_ENV === 'development';
}

/**
 * Get the appropriate Stripe configuration based on environment
 */
export function getEnvironmentStripeConfig(): StripeConfig {
  if (isDevelopmentMode()) {
    // In development, prefer test keys if no env vars are set
    const prodConfig = getStripeConfig();
    return prodConfig.isConfigured ? prodConfig : getTestStripeConfig();
  }
  
  return getStripeConfig();
}