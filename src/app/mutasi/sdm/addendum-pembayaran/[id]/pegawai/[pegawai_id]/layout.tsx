"use server";
import { PegawaiDetailProvider } from "@/context/mutasi/sdm";
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string; pegawai_id: string }>;
}) {
  const { id, pegawai_id } = await params;
  return (
    <PegawaiDetailProvider id={id} pegawai_id={pegawai_id}>
      {children}
    </PegawaiDetailProvider>
  );
}
