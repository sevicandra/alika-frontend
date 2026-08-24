"use client";
import PopUp from "@/component/Organisms/PopUp";
import { useTahun } from "@/context/penghasilan";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { tahun } = useTahun();
  return (
    <PopUp title={`Uang Makan Tahun ${tahun}`} className="mt-0 w-6xl">
      <div className="grid h-full max-h-full gap-2 overflow-hidden p-2">
        <div className="relative grid grid-rows-[auto_1fr_auto] gap-2 overflow-hidden rounded-box bg-base-200">
          <div className="flex w-full justify-end px-4"></div>
          <div className="overflow-auto">
            <Suspense>{children}</Suspense>
          </div>
          <div></div>
        </div>
      </div>
    </PopUp>
  );
}
