"use client";
import { PembayaranDetailProvider } from "@/context/mutasi/user";
import { TableProvider } from "@/context/table.context";
import { use } from "react";
export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ pembayaran_id: string; mutasi_id: string }>;
}) {
  const { pembayaran_id, mutasi_id } = use(params);
  return (
    <PembayaranDetailProvider Pembayaran_id={pembayaran_id} Mutasi_id={mutasi_id}>
      <TableProvider>{children}</TableProvider>
    </PembayaranDetailProvider>
  );
}
