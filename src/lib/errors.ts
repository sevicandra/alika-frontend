/**
 * Error handling utilities for Alika Frontend
 * Provides standardized error definitions and utilities
 */

export enum ErrorCode {
  // Authentication & Authorization
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  SESSION_EXPIRED = "SESSION_EXPIRED",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",

  // CSRF
  CSRF_INVALID = "CSRF_INVALID",
  CSRF_MISSING = "CSRF_MISSING",

  // Validation
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_INPUT = "INVALID_INPUT",

  // Not Found
  NOT_FOUND = "NOT_FOUND",
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",

  // Server Errors
  INTERNAL_ERROR = "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  DATABASE_ERROR = "DATABASE_ERROR",

  // Network
  NETWORK_ERROR = "NETWORK_ERROR",
  TIMEOUT = "TIMEOUT",

  // Generic
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export type ErrorDetails = {
  field?: string;
  value?: any;
  validation?: string;
  resource?: string;
  id?: string | number;
  [key: string]: any;
};

export type ErrorResponse = {
  status: number;
  code: ErrorCode | string;
  message: string;
  timestamp: string;
  details?: ErrorDetails;
  requestId?: string;
};

/**
 * Custom Error class untuk aplikasi
 * Setiap error di aplikasi harus menggunakan class ini
 */
export class AppError extends Error {
  public readonly code: ErrorCode | string;
  public readonly statusCode: number;
  public readonly details?: ErrorDetails;
  public readonly timestamp: string;

  constructor(
    code: ErrorCode | string,
    message: string,
    statusCode: number = 500,
    details?: ErrorDetails
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Convert any error to standardized ErrorResponse
 */
export function createErrorResponse(
  error: unknown,
  defaultStatus: number = 500,
  requestId?: string
): ErrorResponse {
  if (error instanceof AppError) {
    return {
      status: error.statusCode,
      code: error.code,
      message: error.message,
      timestamp: error.timestamp,
      ...(error.details && { details: error.details }),
      ...(requestId && { requestId }),
    };
  }

  if (error instanceof TypeError) {
    // Network error
    return {
      status: 503,
      code: ErrorCode.NETWORK_ERROR,
      message: "Network connection error. Please check your internet connection.",
      timestamp: new Date().toISOString(),
      ...(requestId && { requestId }),
    };
  }

  if (error instanceof SyntaxError) {
    // JSON parse error
    return {
      status: 400,
      code: ErrorCode.INVALID_INPUT,
      message: "Invalid response format from server.",
      timestamp: new Date().toISOString(),
      ...(requestId && { requestId }),
    };
  }

  if (error instanceof Error) {
    return {
      status: defaultStatus,
      code: ErrorCode.INTERNAL_ERROR,
      message: error.message || "An unexpected error occurred",
      timestamp: new Date().toISOString(),
      ...(requestId && { requestId }),
    };
  }

  return {
    status: defaultStatus,
    code: ErrorCode.UNKNOWN_ERROR,
    message: "An unexpected error occurred. Please try again later.",
    timestamp: new Date().toISOString(),
    ...(requestId && { requestId }),
  };
}

/**
 * Get user-friendly error message
 * Gunakan ini untuk menampilkan ke user
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof AppError) {
    const messages: Record<ErrorCode | string, string> = {
      [ErrorCode.UNAUTHORIZED]: "Your session has expired. Please login again.",
      [ErrorCode.FORBIDDEN]: "You don't have permission to perform this action.",
      [ErrorCode.SESSION_EXPIRED]: "Your session has expired. Please login again.",
      [ErrorCode.INVALID_CREDENTIALS]: "Invalid username or password.",
      [ErrorCode.CSRF_INVALID]: "Security verification failed. Please refresh the page.",
      [ErrorCode.CSRF_MISSING]: "Security token is missing. Please refresh the page.",
      [ErrorCode.VALIDATION_ERROR]: error.message || "Please check your input.",
      [ErrorCode.NOT_FOUND]: "The resource you're looking for doesn't exist.",
      [ErrorCode.NETWORK_ERROR]: "Network connection error. Please check your internet.",
      [ErrorCode.TIMEOUT]: "Request took too long. Please try again.",
      [ErrorCode.SERVICE_UNAVAILABLE]: "Service is temporarily unavailable. Please try again later.",
      [ErrorCode.INTERNAL_ERROR]: "Something went wrong on our end. Please try again.",
    };

    return messages[error.code] || error.message;
  }

  if (error instanceof TypeError && error.message.includes("fetch")) {
    return "Network connection error. Please check your internet connection.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
}

/**
 * Check if error is retryable
 */
export function isRetryableError(
  error: unknown,
  statusCode?: number
): boolean {
  const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
  const nonRetryableErrorCodes = [
    ErrorCode.UNAUTHORIZED,
    ErrorCode.FORBIDDEN,
    ErrorCode.CSRF_INVALID,
    ErrorCode.VALIDATION_ERROR,
    ErrorCode.NOT_FOUND,
  ];

  if (error instanceof AppError) {
    return !nonRetryableErrorCodes.includes(error.code as ErrorCode);
  }

  if (statusCode) {
    return retryableStatusCodes.includes(statusCode);
  }

  if (error instanceof TypeError) {
    return error.message.includes("fetch") || error.message.includes("network");
  }

  return false;
}
