import { TableProvider } from "@/context/table.context";
import { PaginatorProvider } from "@/context/paginator";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <TableProvider>
      <PaginatorProvider>{children}</PaginatorProvider>
    </TableProvider>
  );
}
