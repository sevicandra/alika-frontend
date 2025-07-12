import { PermohonanPembayaranProvider } from "@/context/mutasi/sdm";
import PaginatorProvider from "@/context/paginator";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PermohonanPembayaranProvider>
      <PaginatorProvider>{children}</PaginatorProvider>
    </PermohonanPembayaranProvider>
  );
}
