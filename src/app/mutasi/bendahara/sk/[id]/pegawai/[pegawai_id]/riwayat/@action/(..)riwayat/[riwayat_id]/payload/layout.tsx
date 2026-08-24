"use client";
import PopUp from "@/component/Organisms/PopUp";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PopUp title="" className="w-6xl">
      {children}
    </PopUp>
  );
}
