"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface UseCheckTokenAndLogoutOptions {
  /**
   * Idle time sebelum trigger logout (milliseconds)
   * Default: 1 jam (60 * 60 * 1000)
   */
  idleTimeout?: number;

  /**
   * Debug mode untuk console logging
   * Default: false
   */
  debug?: boolean;
}

/**
 * Hook untuk detect idle user dan auto-logout
 *
 * Fitur:
 * - Track user activity dengan minimal performance impact
 * - Jika idle > idleTimeout → logout otomatis
 * - TIDAK ada auto-refresh token
 * - Optimized untuk prevent forced reflow
 *
 * Performance Optimization:
 * - useCallback untuk prevent unnecessary re-render
 * - requestAnimationFrame untuk smooth updates
 * - AbortController untuk timeout management
 * - Passive event listeners untuk prevent layout thrashing
 */
export function useCheckTokenAndLogout({
  idleTimeout = 60 * 60 * 1000, // 1 hour default
  debug = false,
}: UseCheckTokenAndLogoutOptions = {}) {
  const router = useRouter();
  const lastActivityRef = useRef<number>(Date.now());
  const idleTimeoutRef = useRef<NodeJS.Timeout>(null);
  const isLoggingOutRef = useRef<boolean>(false);

  /**
   * Reset idle timer saat ada activity
   * Menggunakan useCallback untuk prevent recreation setiap render
   */
  const resetIdleTimer = useCallback(() => {
    lastActivityRef.current = Date.now();

    // Batch console.log untuk avoid multiple DOM queries
    if (debug) {
      console.log(
        "[TokenCheck] Activity detected at:",
        new Date().toLocaleTimeString(),
      );
    }

    // Clear existing timeout
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }

    // Set timeout baru untuk logout jika idle
    idleTimeoutRef.current = setTimeout(() => {
      handleIdleTimeout();
    }, idleTimeout);
  }, [idleTimeout, debug]);

  /**
   * Handle idle timeout dan trigger logout
   * Menggunakan requestAnimationFrame untuk smooth redirect
   * Menggunakan AbortController untuk timeout management
   */
  const handleIdleTimeout = useCallback(async () => {
    if (isLoggingOutRef.current) return;

    isLoggingOutRef.current = true;

    try {
      if (debug) {
        console.log("[TokenCheck] Idle timeout reached, logging out...");
      }

      // Setup abort controller untuk prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      // Call logout endpoint

      const csrf_token = await fetch("/api/auth/csrf").then((res) =>
        res.json(),
      );

      // Call logout endpoint
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrf_token.token,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        if (debug) {
          console.log("[TokenCheck] Logout successful, redirecting...");
        }

        // Use requestAnimationFrame untuk smooth redirect
        // Ini prevent forced reflow saat redirect
        requestAnimationFrame(() => {
          router.push("/api/auth/signin");
        });
      } else {
        // Logout gagal, redirect anyway
        requestAnimationFrame(() => {
          router.push("/api/auth/signin");
        });
      }
    } catch (error) {
      console.error("[TokenCheck] Logout failed:", error);

      // Redirect ke login anyway
      // Menggunakan requestAnimationFrame untuk avoid forced reflow
      requestAnimationFrame(() => {
        router.push("/api/auth/signin");
      });
    } finally {
      isLoggingOutRef.current = false;
    }
  }, [debug, router]);

  /**
   * Setup event listeners dan initial timeout
   */
  useEffect(() => {
    if (debug) {
      console.log("[TokenCheck] Hook initialized with:", {
        idleTimeout: `${idleTimeout / 1000 / 60 / 60} hours`,
      });
    }

    // Set initial idle timeout
    idleTimeoutRef.current = setTimeout(() => {
      handleIdleTimeout();
    }, idleTimeout);

    // Track events dengan passive listener
    // Passive: true = prevent blocking scroll performance
    // Capture: true = catch events di capture phase
    const activityEvents = [
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    activityEvents.forEach((event) => {
      document.addEventListener(event, resetIdleTimer, {
        capture: true,
        passive: true, // ← CRITICAL: prevent forced reflow
      });
    });

    /**
     * Cleanup function
     * Remove all listeners dan clear timeouts
     */
    return () => {
      activityEvents.forEach((event) => {
        document.removeEventListener(event, resetIdleTimer, true);
      });

      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, [idleTimeout, debug, resetIdleTimer, handleIdleTimeout]);
}
