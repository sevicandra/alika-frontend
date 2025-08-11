"use client";
import PopUp from "@/component/Molecules/PopUp";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PopUp title="User Role" className="w-lg">
      {children}
    </PopUp>
  );
}
