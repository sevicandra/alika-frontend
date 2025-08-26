"use client";
import PopUp from "@/component/Molecules/PopUp";
import { PaginatorProvider } from "@/context/paginator";
import { TableProvider } from "@/context/table.context";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PopUp title="FAQ" className="w-2xl max-h-full">
      <PaginatorProvider>
        <TableProvider>{children}</TableProvider>
      </PaginatorProvider>
    </PopUp>
  );
}
