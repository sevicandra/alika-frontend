"use client";
import PopUp from "@/component/Molecules/PopUp";
import { CetakProvider } from "@/context/penghasilan/Cetak.context";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PopUp title="Daftar Gaji" className="mt-0 w-6xl">
      <CetakProvider>{children}</CetakProvider>
    </PopUp>
  );
}
