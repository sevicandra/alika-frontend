import { SanggahDetailProvider } from "@/context/mutasi/sdm";
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <SanggahDetailProvider id={id}>
      {children}
    </SanggahDetailProvider>
  );
}
