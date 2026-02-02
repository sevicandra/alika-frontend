"use client";
import { TerminDetailProvider } from "@/context/mutasi/keu";
import { TableProvider } from "@/context/table.context";
import { use } from "react";
export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ pegawai_id: string; termin_id: string; id: string }>;
}) {
  const { id, pegawai_id, termin_id } = use(params);
  return (
    <TerminDetailProvider
      Sk_id={id}
      Pegawai_id={pegawai_id}
      Termin_id={termin_id}
    >
      <TableProvider>{children}</TableProvider>
    </TerminDetailProvider>
  );
}
