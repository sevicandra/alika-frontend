/**
 * Fetch wrapper with automatic retry logic
 * Retries transient errors (network, 5xx, etc.) with exponential backoff
 * Does not retry auth errors (4xx)
 */

import { isRetryableError } from "./errors";

export interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  onRetry?: (attempt: number, error: unknown) => void;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function calculateBackoffDelay(
  config: RetryConfig,
  attempt: number
): number {
  const exponentialDelay =
    config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt);
  const cappedDelay = Math.min(exponentialDelay, config.maxDelayMs);

  // Add jitter: ±10% randomization
  const jitter = cappedDelay * (0.9 + Math.random() * 0.2);

  return Math.round(jitter);
}

/**
 * Fetch with automatic retry for transient errors
 *
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @param config - Retry configuration
 * @returns Promise<Response>
 *
 * @example
 * ```typescript
 * const response = await fetchWithRetry("/api/data", {
 *   method: "GET",
 *   headers: { "Content-Type": "application/json" }
 * });
 * ```
 */
export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  config: Partial<RetryConfig> = {}
): Promise<Response> {
  const finalConfig: RetryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: unknown;
  let lastResponse: Response | undefined;

  for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Success
      if (response.ok) {
        return response;
      }

      // Not ok, but check if retryable
      lastResponse = response;
      if (
        !isRetryableError(null, response.status) ||
        attempt === finalConfig.maxRetries
      ) {
        return response;
      }

      // Retryable, log and continue
      if (finalConfig.onRetry) {
        finalConfig.onRetry(attempt + 1, response);
      }
    } catch (error) {
      lastError = error;

      // Check if retryable
      if (
        !isRetryableError(error) ||
        attempt === finalConfig.maxRetries
      ) {
        throw error;
      }

      // Log retry attempt
      if (finalConfig.onRetry) {
        finalConfig.onRetry(attempt + 1, error);
      }
    }

    // Wait before retry
    if (attempt < finalConfig.maxRetries) {
      const delay = calculateBackoffDelay(finalConfig, attempt);
      await sleep(delay);
    }
  }

  // Return last response or throw last error
  if (lastResponse) {
    return lastResponse;
  }

  if (lastError) {
    throw lastError;
  }

  throw new Error(`Request failed after ${finalConfig.maxRetries} retries`);
}
