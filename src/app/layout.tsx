"use server";
import type { Metadata } from "next";
import { Abel } from "next/font/google";
import "./globals.css";
import Header from "@/components/organisms/header.ormanism";
import Notification from "@/component/Organisms/Notification";
import Themes from "@/component/Organisms/Themes";
import Splash from "@/component/Molecules/Splash";
import WebPushNotificationProvider from "@/context/webPushNotification";
import PushNotificationSub from "@/component/Organisms/PushNotificationSub";
import { LayoutProviders } from "@/app/layout-provider";

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
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`relative grid h-svh max-h-svh grid-rows-[auto_1fr] overflow-hidden bg-base-100 text-base-content ${abel.className} antialiased`}
      >
        <LayoutProviders>
          <WebPushNotificationProvider>
            <Splash />
            <PushNotificationSub />
            <Header />
            {children}
            <Notification />
            <Themes />
          </WebPushNotificationProvider>
        </LayoutProviders>
      </body>
    </html>
  );
}
