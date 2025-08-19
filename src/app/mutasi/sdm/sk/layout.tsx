import { SkProvider } from "@/context/mutasi/sdm";
import {PaginatorProvider} from "@/context/paginator";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SkProvider>
      <PaginatorProvider>{children}</PaginatorProvider>
    </SkProvider>
  );
}
