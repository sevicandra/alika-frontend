"use server";
import { SanggahProvider } from "@/context/mutasi/user";
import { PaginatorProvider } from "@/context/paginator";
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ mutasi_id: string }>;
}) {
  const { mutasi_id } = await params;
  return (
    <SanggahProvider mutasi_id={mutasi_id}>
      <PaginatorProvider>{children}</PaginatorProvider>
    </SanggahProvider>
  );
}
