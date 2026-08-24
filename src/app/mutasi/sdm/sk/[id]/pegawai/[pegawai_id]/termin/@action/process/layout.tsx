"use client";
import { useState } from "react";
import PopUp from "@/component/Organisms/PopUp";
export default function Layout({
  UangMuka,
  Lunas,
}: {
  UangMuka: React.ReactNode;
  Lunas: React.ReactNode;
}) {
  const [paraller, setParallel] = useState<"Uang_Muka" | "Lunas">("Uang_Muka");
  return (
    <PopUp title="Buat Termin" className="w-lg">
      <div className="flex flex-col px-2 py-4">
        <div className="flex justify-stretch">
          <button
            className={`btn grow btn-outline btn-xs btn-info ${paraller === "Uang_Muka" ? "btn-active" : ""}`}
            onClick={() => setParallel("Uang_Muka")}
          >
            Uang Muka
          </button>
          <button
            className={`btn grow btn-outline btn-xs btn-info ${paraller === "Lunas" ? "btn-active" : ""}`}
            onClick={() => setParallel("Lunas")}
          >
            Lunas
          </button>
        </div>
        <div>{paraller === "Uang_Muka" ? UangMuka : Lunas}</div>
      </div>
    </PopUp>
  );
}
