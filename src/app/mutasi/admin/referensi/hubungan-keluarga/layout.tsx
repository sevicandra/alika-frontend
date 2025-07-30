import PaginatorProvider from "@/context/paginator";
import { TableProvider } from "@/context/table.context";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PaginatorProvider>
      <TableProvider>{children}</TableProvider>
    </PaginatorProvider>
  );
}
