"use client";
import PopUp from "@/component/Organisms/PopUp";
import { PaginatorProvider } from "@/context/paginator";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PopUp title="FAQ" className="max-h-full w-2xl">
      <PaginatorProvider>{children}</PaginatorProvider>
    </PopUp>
  );
}
