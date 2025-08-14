"use server";
import type { Metadata } from "next";
import { Abel } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/context/session";
import Header from "@/component/Organisms/Header";
import NotificationProvider from "@/context/notifikasi";
import { ThemesProvider } from "@/context/themes";
import Notification from "@/component/Organisms/Notification";
import Themes from "@/component/Organisms/Themes";
import Splash from "@/component/Molecules/Splash";
import WebPushNotificationProvider from "@/context/webPushNotification";
import PushNotificationSub from "@/component/Organisms/PushNotificationSub";
const abel = Abel({
  weight: "400",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: "Alika",
      template: "%s | Alika",
    },
    icons:{
      icon: "/favicon.png",
      shortcut: "/favicon.png",
      apple: "/apple-touch-icon.png",
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <ThemesProvider>
          <NotificationProvider>
            <body
              className={`bg-base-100 text-base-content relative grid h-svh max-h-svh grid-rows-[auto_1fr] overflow-hidden ${abel.className} antialiased`}
            >
              <WebPushNotificationProvider>
                <Splash />
                <PushNotificationSub />
                <Header />
                {children}
                <Notification />
                <Themes />
              </WebPushNotificationProvider>
            </body>
          </NotificationProvider>
        </ThemesProvider>
      </SessionProvider>
    </html>
  );
}
