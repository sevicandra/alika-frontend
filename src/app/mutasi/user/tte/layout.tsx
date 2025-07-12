"use client";
import { TteProvider } from "@/context/mutasi/user";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <TteProvider>{children}</TteProvider>;
}
