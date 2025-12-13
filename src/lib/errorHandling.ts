/**
 * Centralized error handling utilities for the Woolwitch application
 * Provides consistent error patterns and logging
 */

/**
 * Custom application error with error code and recoverability flag
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly recoverable: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Error codes for different failure scenarios
 */
export const ErrorCodes = {
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',

  // Auth errors
  AUTH_FAILED: 'AUTH_FAILED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',

  // Data errors
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',

  // Payment errors
  PAYMENT_FAILED: 'PAYMENT_FAILED',

  // Generic
  UNKNOWN: 'UNKNOWN',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/**
 * Centralized error handler that logs errors consistently
 * @param error - The error to handle
 * @param context - A string describing where the error occurred
 */
export function handleError(error: unknown, context: string): void {
  const message = error instanceof Error ? error.message : 'Unknown error';
  const code = error instanceof AppError ? error.code : ErrorCodes.UNKNOWN;

  // Log in a consistent format
  console.error(`[${context}] ${code}: ${message}`);

  // Could integrate with error tracking service (Sentry, etc.)
  // if (import.meta.env.PROD) {
  //   trackError(error, context);
  // }
}

/**
 * Type guard to check if an error is an AppError
 * @param error - The error to check
 * @returns True if the error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Safely extract error message from unknown error type
 * @param error - The error to extract the message from
 * @returns The error message string
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}
