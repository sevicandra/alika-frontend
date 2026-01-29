"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/component/Molecules/Breadcrumb";
import { usePaginator } from "@/context/paginator";
import Paginator from "@/component/Organisms/Paginator";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean).slice(2);
  const { totalPage } = usePaginator();
  return (
    <div className="grid h-full max-h-full grid-rows-[auto_auto_1fr_auto] gap-2 overflow-hidden">
      <div className="mx-4 mt-4 overflow-x-auto pr-4">
        <Breadcrumb
          data={pathSegments.map((segment, index) => ({
            name: segment.replace(/-/g, " ").toUpperCase(),
            href: `/mutasi/keuangan/${pathSegments.slice(0, index + 1).join("/")}`,
          }))}
          renderRow={(row, index) => (
            <li key={index}>
              <Link href={row.href}>{row.name}</Link>
            </li>
          )}
        />
      </div>
      <div className="max-w-full overflow-x-auto px-4"></div>
      <>{children}</>
      <div className="mx-4 mb-4 flex justify-between">
        {totalPage && <Paginator />}
      </div>
    </div>
  );
}
