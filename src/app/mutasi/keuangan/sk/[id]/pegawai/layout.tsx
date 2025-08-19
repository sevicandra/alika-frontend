import { PaginatorProvider } from "@/context/paginator";
import { PegawaiProvider } from "@/context/mutasi/keu";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PegawaiProvider>
      <PaginatorProvider>{children}</PaginatorProvider>
    </PegawaiProvider>
  );
}
