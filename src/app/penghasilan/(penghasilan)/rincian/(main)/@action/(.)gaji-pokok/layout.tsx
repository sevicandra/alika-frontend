"use client";
import PopUp from "@/component/Molecules/PopUp";
import { useTahun } from "@/context/penghasilan";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { tahun } = useTahun();
  return (
    <PopUp title={`Gaji Pokok Tahun ${tahun}`} className="w-6xl mt-0">
      {children}
    </PopUp>
  );
}
