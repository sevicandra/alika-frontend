"use client";
import { useEffect, useState, useContext, createContext } from "react";
import { NotificationContext } from "./notifikasi";

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
  const { addNotification } = useContext(NotificationContext);
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);
  useEffect(() => {
    if (subscription) {
      const checkSubscriptionStatus = async () => {
        try {
          const response = await fetch("/api/Notifikasi/Subscription", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-Token": await fetch("/api/auth/csrf").then(
                async (res) => {
                  const data = await res.json();
                  return data.token;
                }
              ),
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
              return;
            }
            await subscribeToPush();
            throw new Error(data.message);
          }
          console.log("User is subscribed.");
        } catch (error) {
          console.error(error);
        }
      };
      checkSubscriptionStatus();
    }
  }, [subscription]);
  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }
  async function subscribeToPush() {
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
          "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
            const data = await res.json();
            return data.token;
          }),
        },
        body: JSON.stringify(sub),
      });
      setSubscription(sub);
    } catch (error: any) {
      addNotification({
        title: "Push Notification Registration",
        variant: "error",
        message: error.message,
      });
    }
  }
  async function unsubscribeFromPush() {
    if (subscription) {
      try {
        await subscription?.unsubscribe();
        const unsubscribe = await fetch("/api/Notifikasi/Subscription", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
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
        addNotification({
          title: "Push Notification Unsubscribe",
          message: (error as Error).message,
        });
      }
    }
  }
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
  const value = {
    isSupported,
    subscribeToPush,
    unsubscribeFromPush,
    subscription,
  };
  return (
    <WebPushNotificationContext.Provider value={value}>
      {children}
    </WebPushNotificationContext.Provider>
  );
}
