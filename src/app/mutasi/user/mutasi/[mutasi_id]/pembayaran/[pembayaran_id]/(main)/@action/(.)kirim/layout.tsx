"use client";
import PopUp from "@/component/Molecules/PopUp";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PopUp className="max-w-md" title="Tanda Tangan Elektronik">
      {children}
    </PopUp>
  );
}
