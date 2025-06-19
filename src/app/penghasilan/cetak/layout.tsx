import PaginatorProvider from "@/context/paginator";
import CetakProvider from "@/context/penghasilan/cetak";
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
