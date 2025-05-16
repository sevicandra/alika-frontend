import PaginatorProvider from "@/lib/context/paginator";
import CetakProvider from "@/lib/context/penghasilan/cetak";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CetakProvider>
      <PaginatorProvider>{children}</PaginatorProvider>
    </CetakProvider>
  );
}
