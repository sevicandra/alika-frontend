import { SanggahProvider } from "@/context/mutasi/sdm";
import PaginatorProvider from "@/context/paginator";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SanggahProvider>
      <PaginatorProvider>{children}</PaginatorProvider>
    </SanggahProvider>
  );
}
