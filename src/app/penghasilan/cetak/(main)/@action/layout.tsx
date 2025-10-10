"use client";
import { PopUpProvider } from "@/context/popup.context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PopUpProvider>{children}</PopUpProvider>;
}
