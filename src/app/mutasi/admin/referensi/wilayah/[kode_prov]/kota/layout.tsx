import { PaginatorProvider } from "@/context/paginator";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <PaginatorProvider>{children}</PaginatorProvider>;
}
