"use client";
import PaginatorProvider from "@/context/paginator";
import { Suspense } from "react";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <PaginatorProvider>{children}</PaginatorProvider>;
}
