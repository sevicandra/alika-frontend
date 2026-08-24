"use client";
import PopUp from "@/component/Organisms/PopUp";
import { CetakProvider } from "@/context/penghasilan/Cetak.context";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PopUp title="PPh Form 1721 - VII" className="mt-0 w-6xl">
      <CetakProvider>{children}</CetakProvider>
    </PopUp>
  );
}
