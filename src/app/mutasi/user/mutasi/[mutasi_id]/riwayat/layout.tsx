"use server";
import { MutasiDetailProvider } from "@/context/mutasi/user";
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ mutasi_id: string }>;
}) {
  const { mutasi_id } = await params;
  return (
    <MutasiDetailProvider mutasi_id={mutasi_id}>
      {children}
    </MutasiDetailProvider>
  );
}
