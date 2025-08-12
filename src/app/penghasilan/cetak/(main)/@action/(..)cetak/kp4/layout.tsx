"use client";
import PopUp from "@/component/Molecules/PopUp";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PopUp title="KP4" className="mt-0 w-6xl">
      {children}
    </PopUp>
  );
}
