/**
 * Application constants for the Woolwitch application
 * Centralizes magic numbers and strings for maintainability
 */

/**
 * Cache configuration constants
 */
export const CACHE = {
  /** Default cache TTL: 30 minutes */
  DEFAULT_TTL: 30 * 60 * 1000,
  /** Product list cache TTL: 15 minutes */
  LIST_TTL: 15 * 60 * 1000,
  /** Category cache TTL: 1 hour */
  CATEGORY_TTL: 60 * 60 * 1000,
  /** Stale grace period: 5 minutes */
  STALE_GRACE_PERIOD: 5 * 60 * 1000,
  /** Short cache TTL: 5 minutes */
  SHORT_TTL: 5 * 60 * 1000,
} as const;

/**
 * Local storage configuration
 */
export const STORAGE = {
  /** Key for cart data in localStorage */
  CART_KEY: 'woolwitch-cart',
  /** Prefix for cache entries */
  CACHE_PREFIX: 'woolwitch_cache_',
  /** Cache version for invalidation */
  CACHE_VERSION: '1.0',
  /** Maximum image upload size: 5MB */
  MAX_IMAGE_SIZE: 5 * 1024 * 1024,
} as const;

/**
 * Validation constants
 */
export const VALIDATION = {
  /** Allowed image MIME types for upload */
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const,
  /** Allowed image types as accept string for file inputs */
  ALLOWED_IMAGE_ACCEPT: 'image/jpeg,image/jpg,image/png,image/webp,image/gif',
  /** Minimum password length */
  MIN_PASSWORD_LENGTH: 6,
  /** UK postcode regex pattern */
  UK_POSTCODE_REGEX: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
} as const;

/**
 * Delivery configuration
 */
export const DELIVERY = {
  /** Free delivery threshold in pounds */
  FREE_DELIVERY_THRESHOLD: 50,
  /** Standard delivery charge in pounds */
  STANDARD_CHARGE: 3.99,
} as const;

/**
 * UI configuration
 */
export const UI = {
  /** Number of products per page */
  PRODUCTS_PER_PAGE: 12,
  /** Debounce delay for search in milliseconds */
  SEARCH_DEBOUNCE_MS: 300,
} as const;
