"use client";
import PopUp from "@/component/Organisms/PopUp";
import { useTahun } from "@/context/penghasilan";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { tahun } = useTahun();
  return (
    <PopUp title={`Gaji Pokok Tahun ${tahun}`} className="mt-0 w-6xl">
      {children}
    </PopUp>
  );
}
