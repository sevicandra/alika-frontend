"use client";
import { useState } from "react";
import PopUp from "@/component/Molecules/PopUp";
export default function Layout({
  UangMuka,
  Lunas,
}: {
  UangMuka: React.ReactNode;
  Lunas: React.ReactNode;
}) {
  const [children, setChildren] = useState<"Uang_Muka" | "Lunas">("Uang_Muka");
  return (
    <PopUp title="Buat Termin" className="w-lg">
      <div className="flex flex-col px-2 py-4">
        <div className="flex justify-stretch">
          <button
            className={`btn grow btn-outline btn-xs btn-info ${children === "Uang_Muka" ? "btn-active" : ""}`}
            onClick={() => setChildren("Uang_Muka")}
          >
            Uang Muka
          </button>
          <button
            className={`btn grow btn-outline btn-xs btn-info ${children === "Lunas" ? "btn-active" : ""}`}
            onClick={() => setChildren("Lunas")}
          >
            Lunas
          </button>
        </div>
        <div>{children === "Uang_Muka" ? UangMuka : Lunas}</div>
      </div>
    </PopUp>
  );
}
