/**
 * Error Handling Utilities
 * Provides consistent error handling across the application
 */

import { PostgrestError } from '@supabase/supabase-js';

/**
 * Handles database/API errors consistently
 * Logs the error and throws it with a standardized format
 */
export function handleApiError(error: PostgrestError | Error | null, context: string): never {
  if (error) {
    console.error(`Error ${context}:`, error);
    throw error;
  }
  // This should never be reached, but TypeScript needs the never return
  throw new Error(`Unknown error ${context}`);
}

/**
 * Wraps an error with additional context if needed
 */
export function wrapError(error: unknown, message: string): Error {
  if (error instanceof Error) {
    return new Error(`${message}: ${error.message}`);
  }
  return new Error(message);
}
