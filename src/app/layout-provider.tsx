"use client";
import { SessionProvider } from "@/context/session";
import { ThemesProvider } from "@/context/themes";
import { NotificationProvider } from "@/context/notifikasi";
import WebPushNotificationProvider from "@/context/webPushNotification";
import { useCheckTokenAndLogout } from "@/hooks/useCheckTokenAndLogout";

export function LayoutProviders({ children }: { children: React.ReactNode }) {
  useCheckTokenAndLogout({
    idleTimeout: 45 * 60 * 1000,
    debug: process.env.NODE_ENV === "development",
  });
  return (
    <SessionProvider>
      <ThemesProvider>
        <NotificationProvider>
          <WebPushNotificationProvider>{children}</WebPushNotificationProvider>
        </NotificationProvider>
      </ThemesProvider>
    </SessionProvider>
  );
}
