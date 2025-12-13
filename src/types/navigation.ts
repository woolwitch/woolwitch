/**
 * Navigation type definitions for the Woolwitch application
 * Centralized page type definitions to avoid duplication
 */

/**
 * All possible page types in the application
 */
export type PageType =
  | 'shop'
  | 'cart'
  | 'checkout'
  | 'admin'
  | 'about'
  | 'contact'
  | 'privacy-policy'
  | 'terms-of-service'
  | 'orders';

/**
 * Page types used in cart navigation flow
 */
export type CartPageType = 'shop' | 'cart' | 'checkout';

/**
 * Page types accessible from the footer
 */
export type FooterPageType = 'privacy-policy' | 'terms-of-service' | 'about' | 'contact';

/**
 * Page types used in policy pages navigation
 */
export type PolicyPageType =
  | 'shop'
  | 'cart'
  | 'checkout'
  | 'admin'
  | 'about'
  | 'contact'
  | 'privacy-policy'
  | 'terms-of-service';
