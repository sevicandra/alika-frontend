import { SessionProvider } from "@/context/session";
import { ThemesProvider } from "@/context/themes";
import { NotificationProvider } from "@/context/notifikasi";
import WebPushNotificationProvider from "@/context/webPushNotification";

export function LayoutProviders({ children }: { children: React.ReactNode }) {
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
