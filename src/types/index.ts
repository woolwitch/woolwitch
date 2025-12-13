/**
 * Central type exports for the Woolwitch application
 * Import types from this file for convenience
 */

// Navigation types
export * from './navigation';

// Database types (includes CartItem)
export * from './database';

// Note: cart.ts CartItem is superseded by database.ts CartItem
// Do not re-export from './cart' to avoid duplicate exports

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
