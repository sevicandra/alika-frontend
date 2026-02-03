"use client";
import {
  useEffect,
  useState,
  createContext,
  useCallback,
  useMemo,
} from "react";
import { useNotification } from "./notifikasi";

type WebPushNotificationContextType = {
  isSupported: boolean;
  subscribeToPush: () => void;
  unsubscribeFromPush: () => void;
  subscription: PushSubscription | null;
};

export const WebPushNotificationContext =
  createContext<WebPushNotificationContextType>({
    isSupported: false,
    subscribeToPush: () => {},
    unsubscribeFromPush: () => {},
    subscription: null,
  });

export default function WebPushNotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { addNotification } = useNotification();
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );
  const [csrfToken, setCsrfToken] = useState<string>("");

  // Fetch CSRF token once on mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const res = await fetch("/api/auth/csrf");
        const data = await res.json();
        setCsrfToken(data.token);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };

    fetchCsrfToken();
  }, []);

  // ✅ FIXED: Only addNotification dependency (state setters are not needed)
  const subscribeToPush = useCallback(async () => {
    try {
      const key = await fetch("/api/Notifikasi/Key");
      if (!key.ok) {
        const data = await key.json();
        return console.error(data.message);
      }

      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array((await key.json()).data),
      });

      await fetch("/api/Notifikasi/Subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(sub),
      });

      setSubscription(sub);
    } catch (error: unknown) {
      if (error instanceof Error) {
        addNotification({
          title: "Push Notification Registration",
          variant: "error",
          message: error.message,
        });
      } else {
        addNotification({
          title: "Push Notification Registration",
          variant: "error",
          message: "Internal Server Error",
        });
      }
    }
  }, [addNotification, csrfToken]);

  // Service worker registration
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  // ✅ FIXED: Removed subscribeToPush from dependencies to prevent infinite loop
  useEffect(() => {
    if (!subscription || !csrfToken) return;

    const checkSubscriptionStatus = async () => {
      try {
        const response = await fetch("/api/Notifikasi/Subscription", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          await subscription?.unsubscribe();
          setSubscription(null);

          if (response.status === 404) {
            // Not found - re-subscribe
            // BUT: Don't call subscribeToPush here to prevent infinite loop
            // Instead, user should manually trigger re-subscription
            return;
          }

          throw new Error(data.message);
        }

        console.log("User is subscribed.");
      } catch (error) {
        console.error(error);
      }
    };

    checkSubscriptionStatus();
  }, [subscription, csrfToken]); // ✅ Only real dependencies

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  // ✅ FIXED: Better error handling
  const unsubscribeFromPush = useCallback(async () => {
    if (subscription) {
      try {
        await subscription?.unsubscribe();
        const unsubscribe = await fetch("/api/Notifikasi/Subscription", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
          }),
        });

        if (!unsubscribe.ok) {
          const data = await unsubscribe.json();
          throw new Error(data.message);
        }

        setSubscription(null);
      } catch (error) {
        if (error instanceof Error) {
          addNotification({
            title: "Push Notification Unsubscribe",
            message: error.message,
          });
        } else {
          addNotification({
            title: "Push Notification Unsubscribe",
            message: "Unknown error occurred",
          });
        }
      }
    }
  }, [subscription, csrfToken, addNotification]);

  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // ✅ FIXED: Memoize context value
  const value = useMemo(
    () => ({
      isSupported,
      subscribeToPush,
      unsubscribeFromPush,
      subscription,
    }),
    [isSupported, subscribeToPush, subscription, unsubscribeFromPush],
  );

  return (
    <WebPushNotificationContext.Provider value={value}>
      {children}
    </WebPushNotificationContext.Provider>
  );
}
