import PaginatorProvider from "@/context/paginator";
import { MutasiProvider } from "@/context/mutasi/user";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PaginatorProvider>
      <MutasiProvider>{children}</MutasiProvider>
    </PaginatorProvider>
  );
}
