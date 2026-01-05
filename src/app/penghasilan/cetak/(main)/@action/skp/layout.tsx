"use client";
import PopUp from "@/component/Molecules/PopUp";
import { CetakProvider } from "@/context/penghasilan/Cetak.context";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PopUp title="Surat Keterangan Penghasilan" className="w-6xl mt-0">
      <CetakProvider>{children}</CetakProvider>
    </PopUp>
  );
}
