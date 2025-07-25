"use client";
import { use } from "react";
import { SkDetailProvider } from "@/context/mutasi/keu";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <SkDetailProvider id={id}>{children}</SkDetailProvider>;
}
