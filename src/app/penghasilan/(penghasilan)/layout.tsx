"use client";
import { TahunProvider } from "@/context/penghasilan";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TahunProvider>{children}</TahunProvider>;
}
